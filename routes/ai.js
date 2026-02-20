const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many AI requests. Please try again later." },
});

router.use(aiLimiter);

router.post("/generate", async (req, res) => {
  try {
    const prompt = String(req.body.prompt || "").trim();
    if (!prompt) {
      return res.status(400).json({ error: "prompt is required" });
    }
    if (prompt.length > 2000) {
      return res
        .status(400)
        .json({ error: "prompt must be 2000 characters or fewer" });
router.post("/generate", async (req, res) => {
  try {
    const prompt = String(req.body?.prompt || "").trim();
    if (!prompt) {
      return res.status(400).json({ error: "prompt required" });
    }

    if (prompt.length > 4000) {
      return res.status(400).json({ error: "prompt too long (max 4000 chars)" });
    }

    const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return res
        .status(503)
        .json({ error: "AI provider is not configured for this environment" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(
        apiKey
      )}`,
      return res.status(503).json({ error: "AI service not configured" });
    }

    const model = process.env.GENAI_MODEL || "gemini-2.5-flash";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        model
      )}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini request failed with status ${response.status}`);
    }

    const result = await response.json();
    const text = (result?.candidates || [])
      .flatMap((candidate) => candidate?.content?.parts || [])
      .map((part) => part?.text || "")
      .join("\n")
      .trim();

    if (!text) {
      return res.status(502).json({
        error: "AI provider returned an empty response",
      });
      return res.status(502).json({ error: "AI provider request failed" });
    }

    const data = await response.json();
    const text = (data?.candidates?.[0]?.content?.parts || [])
      .map((part) => part?.text || "")
      .join("")
      .trim();

    if (!text) {
      return res.status(502).json({ error: "AI provider returned empty response" });
    }

    return res.json({
      text,
      model: "gemini-2.0-flash",
    });
  } catch (err) {
    console.error("AI generation error:", err?.message || err);
      model,
    });
  } catch (err) {
    console.error("AI generation failed:", err?.message || err);
    return res.status(500).json({ error: "AI generation failed" });
  }
});

module.exports = router;
