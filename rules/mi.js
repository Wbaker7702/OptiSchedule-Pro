function applyMichiganRules(employee, startTime, endTime) {
  let violations = [];

  const shiftLengthHours =
    (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60);

  // General safety cap
  if (shiftLengthHours > 12) {
    violations.push("Shift exceeds 12-hour Michigan limit");
  }

  if (employee.isMinor) {

    if (shiftLengthHours > 8) {
      violations.push("Minor cannot work more than 8 hours (MI rule)");
    }

    const endHour = new Date(endTime).getUTCHours();

    if (endHour >= 22) {
      violations.push("Minor cannot work past 10 PM (MI rule)");
    }
  }

  return violations;
}

module.exports = applyMichiganRules;
