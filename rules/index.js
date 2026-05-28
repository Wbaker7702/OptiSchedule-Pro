const path = require("path");

const RULE_ENGINES = Object.freeze({
  MI: path.join(__dirname, "MI.js"),
  FL: path.join(__dirname, "..", "FL.js"),
});

function missingEngineResult(stateCode) {
  return {
    approved: false,
    valid: false,
    reason: `No compliance engine configured for state: ${stateCode}`,
    violations: [`No compliance engine configured for state: ${stateCode}`],
  };
}

function loadRuleEngine(state) {
  const stateCode = String(state || "").trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(stateCode)) {
    return () => missingEngineResult("INVALID_STATE");
  }

  const rulePath = RULE_ENGINES[stateCode];
  if (!rulePath) {
    return () => missingEngineResult(stateCode);
  }

  try {
    const ruleEngine = require(rulePath);
    if (typeof ruleEngine !== "function") {
      throw new Error("Compliance engine module must export a function");
    }
    return ruleEngine;
  } catch (error) {
    console.error(
      `Failed to load compliance engine for state ${stateCode}:`,
      error.message
    );
    return () => missingEngineResult(stateCode);
  }
}

module.exports = loadRuleEngine;
