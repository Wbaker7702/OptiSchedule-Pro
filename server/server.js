import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

/* -----------------------
   In-memory metrics store
------------------------ */

let metrics = {
  totalShifts: 0,
  missedShifts: 0,
  complianceViolations: 0,
  riskScore: 100
};

let clients = [];

/* -----------------------
   Calculate Risk Score
------------------------ */

function recalculateRisk() {
  const missPenalty = metrics.missedShifts * 5;
  const compliancePenalty = metrics.complianceViolations * 10;
  const score = 100 - (missPenalty + compliancePenalty);
  metrics.riskScore = Math.max(score, 0);
}

/* -----------------------
   SSE Endpoint
------------------------ */

app.get("/api/metrics/stream", (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive"
  });

  res.flushHeaders();

  clients.push(res);

  req.on("close", () => {
    clients = clients.filter(client => client !== res);
  });
});

/* -----------------------
   Emit updates
------------------------ */

function broadcastMetrics() {
  const data = `data: ${JSON.stringify(metrics)}\n\n`;
  clients.forEach(client => client.write(data));
}

/* -----------------------
   Ingest metric events
------------------------ */

app.post("/api/metrics/event", (req, res) => {
  const { type } = req.body;

  if (type === "shift_completed") {
    metrics.totalShifts++;
  }

  if (type === "shift_missed") {
    metrics.missedShifts++;
  }

  if (type === "compliance_violation") {
    metrics.complianceViolations++;
  }

  recalculateRisk();
  broadcastMetrics();

  res.json({ success: true, metrics });
});

/* -----------------------
   Health
------------------------ */

app.get("/api/health", (req, res) => {
  res.json({ status: "OptiSchedule backend running" });
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
