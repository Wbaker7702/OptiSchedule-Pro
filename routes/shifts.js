const express = require("express");
const { z } = require("zod");
const loadRuleEngine = require("../rules");
const router = express.Router();

// GET test
router.get("/test", (req, res) => {
  res.json({ message: "Shift GET test working" });
});

// POST root
router.post("/", (req, res) => {
  res.json({ message: "Shift POST working", body: req.body });
});

const validateShiftSchema = z.object({
  state: z.string().trim().length(2),
  employee: z
    .object({
      isMinor: z.boolean().optional(),
      birthDate: z.string().optional(),
    })
    .passthrough(),
  shift: z.object({
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
  }),
});

router.post("/validate", (req, res) => {
  const parsed = validateShiftSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid shift validation payload",
      details: parsed.error.issues,
    });
  }

  const { state, employee, shift } = parsed.data;
  const engine = loadRuleEngine(state);
  const result = engine(employee, shift);

  return res.json({
    approved: Boolean(result?.approved ?? result?.valid),
    result,
  });
});

module.exports = router;
