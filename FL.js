module.exports = function applyFloridaRules({ employee, shift }) {
  if (!employee || !shift) {
    return { valid: false, reason: "Invalid compliance payload" };
  }

  if (employee.isMinor) {
    const endHour = new Date(shift.endTime).getHours();
    const start = new Date(shift.startTime);
    const end = new Date(shift.endTime);
    const totalHours = (end - start) / (1000 * 60 * 60);

    // Florida demo rule: minor cannot work past 11PM
    if (endHour > 23) {
      return {
        valid: false,
        reason: "FL minor labor violation – cannot work past 11PM"
      };
    }

    // Florida demo rule: stricter school-night limit (6 hours)
    if (totalHours > 6) {
      return {
        valid: false,
        reason: "FL minor labor violation – exceeds 6 hour school-night limit"
      };
    }
  }

  return { valid: true };
};
