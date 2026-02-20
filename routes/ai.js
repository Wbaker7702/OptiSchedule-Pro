const express = require("express");
const router = express.Router();

// Example: Google Gemini SDK (adjust to whatever you're using)
const { GoogleGenerativeAI } = require("@google/generative-ai");

router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "prompt required" });

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const text = result?.response?.text?.() ?? "";

    return res.json({ text });
  } catch (err) {
    console.error("AI error:", err);
    return res.status(500).json({ error: "AI generation failed" });
  }
});

module.exports = router;
