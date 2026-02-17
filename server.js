// ============================
// Core Imports
// ============================
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// ============================
// Load Environment (Correct Way)
// ============================
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`
});

// Validate Environment
const env = require("./config/env");

// ============================
// Initialize App
// ============================
const app = express();

// ============================
// Security Middleware
// ============================
app.use(helmet());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
}));

app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true
}));

app.use(express.json());

// ============================
// Routes
// ============================
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Example Protected Route Placeholder
app.get("/api/protected", (req, res) => {
  res.json({ message: "Protected route working." });
});

// ============================
// Start Server
// ============================
const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
});

