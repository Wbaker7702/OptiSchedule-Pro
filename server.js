require("dotenv").config();

const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const aiRouter = require("./routes/ai");

const app = express();
app.disable("x-powered-by");

const trustProxy = Number.parseInt(process.env.TRUST_PROXY || "1", 10);
app.set("trust proxy", Number.isNaN(trustProxy) ? 1 : trustProxy);

const NODE_ENV = process.env.NODE_ENV || "development";
const IS_PROD = NODE_ENV === "production";

const configuredJwtSecret = process.env.JWT_SECRET;
if (IS_PROD && (!configuredJwtSecret || configuredJwtSecret.length < 32)) {
  throw new Error("JWT_SECRET must be set to at least 32 characters in production.");
}
const JWT_SECRET =
  configuredJwtSecret && configuredJwtSecret.length >= 32
    ? configuredJwtSecret
    : crypto.randomBytes(48).toString("hex");

if (!configuredJwtSecret || configuredJwtSecret.length < 32) {
  console.warn(
    "Using ephemeral JWT secret for this process. Set JWT_SECRET (>=32 chars) for stable sessions."
  );
}

const COOKIE_NAME = "opti_session";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: "strict",
  maxAge: 8 * 60 * 60 * 1000,
  path: "/",
};

const DEMO_USERNAME = (process.env.DEMO_USERNAME || "").trim();
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || "";
const DEMO_PASSWORD_HASH = process.env.DEMO_PASSWORD_HASH || "";
const HAS_SECURE_LOGIN_CONFIG = Boolean(DEMO_USERNAME) && Boolean(DEMO_PASSWORD || DEMO_PASSWORD_HASH);

if (IS_PROD && !HAS_SECURE_LOGIN_CONFIG) {
  console.warn(
    "Login credentials are not configured. Set DEMO_USERNAME and DEMO_PASSWORD or DEMO_PASSWORD_HASH."
  );
}

const simulationState = {
  mode: "NORMAL",
  updatedAt: new Date().toISOString(),
};

// Body parsing
app.use(express.urlencoded({ extended: false, limit: "10kb" }));
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        connectSrc: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        imgSrc: ["'self'", "data:"],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
    crossOriginOpenerPolicy: { policy: "same-origin" },
    referrerPolicy: { policy: "no-referrer" },
  })
);

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 12,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many login attempts. Try again in a few minutes.",
});

// ---------- helpers ----------
function signSession(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });
}

function setSessionCookie(res, token) {
  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
}

function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);
}

function requireAuth(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.redirect("/");

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    res.setHeader("Cache-Control", "no-store");
    return next();
  } catch (error) {
    clearSessionCookie(res);
    return res.redirect("/");
  }
}

function requireSameOrigin(req, res, next) {
  const origin = req.get("origin");
  if (!origin) return next();

  const host = req.get("host");
  if (!host) {
    return res.status(403).send("Request blocked.");
  }

  const expectedOrigin = `${req.protocol}://${host}`;
  if (origin !== expectedOrigin) {
    return res.status(403).send("Cross-site request blocked.");
  }

  return next();
}

function safeEqual(a, b) {
  const aBuffer = Buffer.from(String(a));
  const bBuffer = Buffer.from(String(b));

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

async function isAuthorizedLogin(username, password) {
  if (!username || !password) {
    return false;
  }

  if (!HAS_SECURE_LOGIN_CONFIG) {
    return !IS_PROD;
  }

  if (!safeEqual(username.trim().toLowerCase(), DEMO_USERNAME.toLowerCase())) {
    return false;
  }

  if (DEMO_PASSWORD_HASH) {
    return bcrypt.compare(password, DEMO_PASSWORD_HASH);
  }

  return safeEqual(password, DEMO_PASSWORD);
}

function setSimulationMode(mode) {
  simulationState.mode = mode;
  simulationState.updatedAt = new Date().toISOString();
}

function formatTimestamp(isoValue) {
  const parsed = new Date(isoValue);
  if (Number.isNaN(parsed.getTime())) {
    return "Unknown";
  }
  return parsed.toLocaleString("en-US", { hour12: false });
}

function respondSimulationResult(req, res, payload, notice) {
  const acceptHeader = req.get("accept") || "";
  const wantsJson =
    acceptHeader.includes("application/json") ||
    req.get("x-requested-with") === "XMLHttpRequest";

  if (wantsJson) {
    return res.json(payload);
  }

  return res.redirect(`/dashboard?notice=${encodeURIComponent(notice)}`);
}

// ---------- health ----------
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/ai", requireAuth, requireSameOrigin, aiRouter);

// ---------- UI: Login ----------
app.get("/", (req, res) => {
  // If already logged in, go to dashboard
  const token = req.cookies[COOKIE_NAME];
  if (token) {
    try {
      jwt.verify(token, JWT_SECRET);
      return res.redirect("/dashboard");
    } catch (_) {
      // ignore
    }
  }

  res.status(200).send(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>OptiSchedule Pro — Secure Access</title>
<style>
  :root{
    --bg0:#061a40;
    --bg1:#0b3d91;
    --ink:#0f172a;
    --muted:#64748b;
    --line:#e2e8f0;
    --card:#ffffff;
    --accent:#0b3d91;
    --accent2:#22c55e;
    --danger:#ef4444;
  }
  *{box-sizing:border-box}
  body{
    margin:0;
    min-height:100vh;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Apple Color Emoji","Segoe UI Emoji";
    color:#fff;
    overflow:hidden;
    background:
      radial-gradient(1200px 600px at 12% 18%, rgba(34,197,94,.20), transparent 55%),
      radial-gradient(900px 500px at 80% 30%, rgba(59,130,246,.25), transparent 55%),
      radial-gradient(800px 500px at 50% 100%, rgba(14,165,233,.18), transparent 60%),
      linear-gradient(135deg, var(--bg0), var(--bg1));
  }
  .grid{
    min-height:100vh;
    display:grid;
    grid-template-columns: 1.25fr 520px;
  }
  .left{
    padding:72px 72px 72px 72px;
    display:flex;
    flex-direction:column;
    justify-content:center;
    gap:18px;
  }
  .brand{
    display:flex;align-items:center;gap:14px;
    letter-spacing:.2px;
  }
  .mark{
    width:44px;height:44px;border-radius:12px;
    background:linear-gradient(145deg, rgba(255,255,255,.18), rgba(255,255,255,.06));
    border:1px solid rgba(255,255,255,.18);
    display:flex;align-items:center;justify-content:center;
    box-shadow: 0 20px 60px rgba(0,0,0,.25);
  }
  .mark svg{opacity:.95}
  .title{
    font-size:46px; line-height:1.05; margin:6px 0 0 0; font-weight:800;
  }
  .subtitle{
    font-size:18px; line-height:1.6; max-width:640px;
    color: rgba(255,255,255,.86);
  }
  .pillrow{display:flex; gap:10px; flex-wrap:wrap; margin-top:10px;}
  .pill{
    font-size:12px;
    padding:8px 10px;
    border-radius:999px;
    border:1px solid rgba(255,255,255,.18);
    background:rgba(255,255,255,.06);
    color:rgba(255,255,255,.88);
    backdrop-filter: blur(10px);
  }
  .footnote{
    margin-top:28px;
    font-size:12px;
    color:rgba(255,255,255,.70);
  }

  .right{
    background:rgba(255,255,255,.04);
    border-left:1px solid rgba(255,255,255,.10);
    backdrop-filter: blur(14px);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:28px;
  }
  .card{
    width:100%;
    max-width:420px;
    background: rgba(255,255,255,.96);
    color: var(--ink);
    border-radius: 18px;
    border: 1px solid rgba(15,23,42,.08);
    box-shadow: 0 30px 90px rgba(0,0,0,.35);
    padding: 28px;
    position:relative;
    overflow:hidden;
  }
  .card:before{
    content:"";
    position:absolute; inset:-120px -120px auto auto;
    width:240px; height:240px; border-radius:999px;
    background: radial-gradient(circle, rgba(11,61,145,.25), transparent 60%);
    filter: blur(2px);
  }
  .card h2{
    margin:0 0 6px 0;
    font-size:20px;
    font-weight:800;
    letter-spacing:.2px;
  }
  .card p{
    margin:0 0 18px 0;
    color: var(--muted);
    font-size:13px;
    line-height:1.5;
  }
  label{display:block; font-size:12px; color:#334155; margin:10px 0 6px;}
  input{
    width:100%;
    padding:12px 12px;
    border-radius:10px;
    border:1px solid var(--line);
    outline:none;
    font-size:14px;
    background:#fff;
  }
  input:focus{
    border-color: rgba(11,61,145,.55);
    box-shadow: 0 0 0 4px rgba(11,61,145,.12);
  }
  .row{
    display:flex; gap:10px; align-items:center; justify-content:space-between;
    margin-top:12px;
  }
  .btn{
    width:100%;
    padding:12px 14px;
    border-radius:12px;
    border:none;
    cursor:pointer;
    font-weight:800;
    letter-spacing:.2px;
    background: linear-gradient(135deg, #0b3d91, #0ea5e9);
    color:#fff;
    box-shadow: 0 16px 40px rgba(11,61,145,.30);
  }
  .btn:hover{filter:brightness(1.02)}
  .meta{
    margin-top:14px;
    display:flex;
    justify-content:space-between;
    gap:10px;
    font-size:11px;
    color:#64748b;
  }
  .badge{
    display:inline-flex;align-items:center;gap:8px;
    font-size:11px;
    padding:8px 10px;
    border-radius:999px;
    border:1px solid rgba(34,197,94,.25);
    background: rgba(34,197,94,.10);
    color:#166534;
    font-weight:700;
  }
  .badge i{
    width:8px;height:8px;border-radius:999px;background: var(--accent2);
    box-shadow: 0 0 0 4px rgba(34,197,94,.16);
  }

  /* subtle background motion */
  .glow{
    position:absolute; inset:auto auto -180px -180px;
    width:420px; height:420px; border-radius:999px;
    background: radial-gradient(circle, rgba(255,255,255,.10), transparent 55%);
    filter: blur(2px);
    animation: floaty 10s ease-in-out infinite;
    pointer-events:none;
  }
  @keyframes floaty{
    0%{transform:translate(0,0)}
    50%{transform:translate(40px,-20px)}
    100%{transform:translate(0,0)}
  }

  @media (max-width: 980px){
    .grid{grid-template-columns: 1fr;}
    .left{padding:46px 22px}
    .right{border-left:none; border-top:1px solid rgba(255,255,255,.10)}
    body{overflow:auto}
  }
</style>
</head>
<body>
  <div class="glow"></div>
  <div class="grid">
    <section class="left">
      <div class="brand">
        <div class="mark" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2l8 4v6c0 5-3.5 9.2-8 10-4.5-.8-8-5-8-10V6l8-4z" stroke="white" stroke-width="1.6"/>
            <path d="M8.7 12.2l2.1 2.2 4.6-4.8" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div style="opacity:.92;font-weight:800;">Operational Trust Access</div>
      </div>

      <div class="title">OptiSchedule Pro</div>
      <div class="subtitle">
        Secure workforce compliance & shift intelligence platform designed to increase operational trust,
        labor precision, and real-time accountability at enterprise scale.
      </div>

      <div class="pillrow">
        <div class="pill">Real-time trust metrics</div>
        <div class="pill">Protected AI decisioning</div>
        <div class="pill">Audit-grade infrastructure</div>
        <div class="pill">Pilot: Store #2080</div>
      </div>

      <div class="footnote">
        Access is monitored and logged. Demo mode uses parallel execution — no disruption to existing workforce systems.
      </div>
    </section>

    <aside class="right">
      <div class="card">
        <h2>Secure Access</h2>
        <p>Authorized workforce leadership only. Sessions are encrypted and audit-logged.</p>

        <div class="badge"><i></i> Infrastructure: Hardened • TLS • JWT</div>

        <form method="POST" action="/login">
          <label>Username</label>
          <input name="username" autocomplete="username" required />

          <label>Password</label>
          <input type="password" name="password" autocomplete="current-password" required />

          <div class="row">
            <button class="btn" type="submit">Initialize Secure Session</button>
          </div>
        </form>

        <div class="meta">
          <span>Parallel Pilot • 30 days</span>
          <span>Store #2080 • Battle Creek, MI</span>
        </div>
      </div>
    </aside>
  </div>
</body>
</html>`);
});

// ---------- auth ----------
app.post("/login", loginLimiter, async (req, res) => {
  const username = String(req.body?.username || "").trim();
  const password = String(req.body?.password || "");

  if (!username || username.length > 64 || !password || password.length > 256) {
    return res.redirect("/");
  }

  const authorized = await isAuthorizedLogin(username, password);
  if (!authorized) {
    return res.redirect("/");
  }

  const token = signSession({ userId: 1, role: "manager", name: username });
  setSessionCookie(res, token);
  return res.redirect("/dashboard");
});

app.post("/logout", requireSameOrigin, (req, res) => {
  clearSessionCookie(res);
  res.redirect("/");
});

// ---------- dashboard ----------
app.get("/dashboard", requireAuth, (req, res) => {
  const user = req.user || { name: "Manager" };
  const notice = typeof req.query.notice === "string" ? req.query.notice.slice(0, 140) : "";
  const currentMode = simulationState.mode === "BLACK_FRIDAY" ? "Black Friday Surge" : "Normal Operations";
  const modeClass = simulationState.mode === "BLACK_FRIDAY" ? "toneDanger" : "toneOk";
  const noticeMarkup = notice
    ? `<div class="notice" role="status" aria-live="polite">${escapeHtml(notice)}</div>`
    : "";

  res.send(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>OptiSchedule Pro — Dashboard</title>
<style>
  body{margin:0;background:#0b1220;color:#e5e7eb;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial}
  .wrap{max-width:1120px;margin:0 auto;padding:28px}
  .top{display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap}
  .h1{font-size:22px;font-weight:900}
  .sub{color:#94a3b8;font-size:13px;margin-top:4px}
  .notice{
    margin-top:12px;
    background:rgba(34,197,94,.12);
    border:1px solid rgba(34,197,94,.30);
    color:#86efac;
    border-radius:10px;
    padding:10px 12px;
    font-size:13px;
  }
  .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:18px}
  .card{background:#0f172a;border:1px solid rgba(148,163,184,.18);border-radius:14px;padding:14px}
  .k{color:#94a3b8;font-size:12px}
  .v{font-size:22px;font-weight:900;margin-top:6px}
  .panel{margin-top:14px;display:grid;grid-template-columns:1.2fr .8fr;gap:12px}
  .btn{
    padding:10px 12px;border-radius:10px;border:1px solid rgba(148,163,184,.25);
    background:#111c33;color:#e5e7eb;cursor:pointer;font-weight:800
  }
  .btnPrimary{background:linear-gradient(135deg,#c62828,#ef4444);border:none}
  .row{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px}
  .row form{margin:0}
  .tag{font-size:11px;color:#93c5fd;border:1px solid rgba(147,197,253,.25);padding:6px 10px;border-radius:999px;background:rgba(59,130,246,.10)}
  .logout{background:transparent;border:1px solid rgba(148,163,184,.25);padding:10px 12px;border-radius:10px;color:#e5e7eb;cursor:pointer;font-weight:800}
  .statusLine{margin-top:10px;display:flex;align-items:center;gap:10px;font-size:13px;color:#cbd5e1}
  .dot{width:10px;height:10px;border-radius:999px;display:inline-block}
  .toneOk{background:#22c55e;box-shadow:0 0 0 4px rgba(34,197,94,.16)}
  .toneDanger{background:#ef4444;box-shadow:0 0 0 4px rgba(239,68,68,.16)}
  .muted{margin-top:8px;color:#94a3b8;font-size:12px}
  .inlineLink{display:inline-block;margin-top:10px;color:#93c5fd;text-decoration:none;font-size:12px}
  .inlineLink:hover{text-decoration:underline}
  @media(max-width:980px){.grid{grid-template-columns:repeat(2,1fr)}.panel{grid-template-columns:1fr}}
</style>
</head>
<body>
  <div class="wrap">
    <div class="top">
      <div>
        <div class="h1">Dashboard — Store #2080</div>
        <div class="sub">Welcome, ${escapeHtml(user.name || "Manager")} • Enterprise demo mode</div>
        ${noticeMarkup}
      </div>
      <form method="POST" action="/logout">
        <button class="logout" type="submit">Log out</button>
      </form>
    </div>

    <div class="grid">
      <div class="card"><div class="k">Total Shifts</div><div class="v">1,204</div></div>
      <div class="card"><div class="k">Compliance Flags</div><div class="v">0</div></div>
      <div class="card"><div class="k">Trust Score</div><div class="v">98</div></div>
      <div class="card"><div class="k">Missed Shifts</div><div class="v">2</div></div>
    </div>

    <div class="panel">
      <div class="card">
        <div class="k">Simulation Controls</div>
        <div class="row">
          <span class="tag">Parallel Run</span>
          <span class="tag">Audit Logs Enabled</span>
          <span class="tag">JWT Protected</span>
        </div>
        <div class="statusLine">
          <span class="dot ${modeClass}" aria-hidden="true"></span>
          <span>Current mode: <strong>${escapeHtml(currentMode)}</strong></span>
        </div>
        <div class="muted">Last update: ${escapeHtml(formatTimestamp(simulationState.updatedAt))}</div>
        <a class="inlineLink" href="/api/sim/status">View simulation status (JSON)</a>
        <div class="row" style="margin-top:14px;">
          <form method="POST" action="/api/sim/black-friday">
            <button class="btn btnPrimary" type="submit">Activate Black Friday Mode</button>
          </form>
          <form method="POST" action="/api/sim/reset">
            <button class="btn" type="submit">Reset Simulation</button>
          </form>
        </div>
      </div>

      <div class="card">
        <div class="k">Executive Notes</div>
        <div style="margin-top:10px;color:#cbd5e1;font-size:13px;line-height:1.5">
          This pilot runs in parallel with existing systems (no disruption). Events are logged for accountability and continuous improvement.
          Controls now provide persistent mode status to reduce operator uncertainty after action changes.
        </div>
      </div>
    </div>
  </div>
</body>
</html>`);
});

// ---------- demo API routes (JWT protected) ----------
app.get("/api/sim/status", requireAuth, (req, res) => {
  res.json({
    ok: true,
    mode: simulationState.mode,
    updatedAt: simulationState.updatedAt,
  });
});

app.post("/api/sim/black-friday", requireAuth, requireSameOrigin, (req, res) => {
  setSimulationMode("BLACK_FRIDAY");
  return respondSimulationResult(
    req,
    res,
    { ok: true, mode: "BLACK_FRIDAY", updatedAt: simulationState.updatedAt },
    "Black Friday mode activated."
  );
});

app.post("/api/sim/reset", requireAuth, requireSameOrigin, (req, res) => {
  setSimulationMode("NORMAL");
  return respondSimulationResult(
    req,
    res,
    { ok: true, mode: "NORMAL", updatedAt: simulationState.updatedAt },
    "Simulation reset to normal mode."
  );
});

// ---- tiny escape helper for HTML injection safety ----
function escapeHtml(str) {
  return String(str || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`OptiSchedule Enterprise running on ${PORT}`));



