const express = require("express");
const router = express.Router();

console.log("Shift routes file loaded");

// GET test
router.get("/test", (req, res) => {
  res.json({ message: "Shift GET test working" });
});

// POST root
router.post("/", (req, res) => {
  res.json({ message: "Shift POST working", body: req.body });
});

module.exports = router;
