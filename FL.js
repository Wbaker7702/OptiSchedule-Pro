module.exports = function applyFloridaRules(employeeOrPayload, maybeShift) {
  const employee = maybeShift ? employeeOrPayload : employeeOrPayload?.employee;
  const shift = maybeShift || employeeOrPayload?.shift;

  if (!employee || !shift) {
    return {
      approved: false,
      valid: false,
      reason: "Invalid compliance payload",
      violations: ["Invalid compliance payload"],
    };
  }

  if (employee.isMinor) {
    const start = new Date(shift.startTime);
    const end = new Date(shift.endTime);
    const totalHours = (end - start) / (1000 * 60 * 60);
    const endHour = end.getHours();
    const violations = [];

    // Florida demo rule: minor cannot work past 11PM
    if (endHour >= 23) {
      violations.push("FL minor labor violation - cannot work past 11PM");
    }

    // Florida demo rule: stricter school-night limit (6 hours)
    if (totalHours > 6) {
      violations.push(
        "FL minor labor violation - exceeds 6 hour school-night limit"
      );
    }

    if (violations.length > 0) {
      return {
        approved: false,
        valid: false,
        reason: violations[0],
        violations,
      };
    }
  }

  return { approved: true, valid: true, violations: [] };
};
