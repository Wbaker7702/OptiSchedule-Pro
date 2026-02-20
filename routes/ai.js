const express = require("express");
const router = express.Router();

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
      model,
    });
  } catch (err) {
    console.error("AI generation failed:", err?.message || err);
    return res.status(500).json({ error: "AI generation failed" });
  }
});

module.exports = router;
