const path = require("path");

function loadRuleEngine(state) {
  try {
    if (!state) {
      throw new Error("Store state is required for compliance engine");
    }

    // Dynamically load rule file based on state (MI.js, FL.js, etc.)
    const rulePath = path.join(__dirname, `${state}.js`);
    return require(rulePath);

  } catch (error) {
    console.error(`No compliance engine found for state: ${state}`);
    
    // Fallback: always valid if no engine exists
    return () => ({ valid: true });
  }
}

module.exports = loadRuleEngine;
