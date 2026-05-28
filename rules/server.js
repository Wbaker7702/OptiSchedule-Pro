require("dotenv").config();
const express = require("express");

const app = express();
const PORT = 4000;

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/shifts", require("./routes/shifts"));

// Health check
app.get("/", (req, res) => {
  res.json({ status: "OptiSchedule API Running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
