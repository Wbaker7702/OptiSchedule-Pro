// rules/MI.js

module.exports = function applyMichiganRules(employee, shift) {

  const violations = [];

  if (!employee || !shift) {
    return {
      approved: false,
      violations: ["Invalid compliance payload"]
    };
  }

  const start = new Date(shift.startTime);
  const end = new Date(shift.endTime);

  const totalHours = (end - start) / (1000 * 60 * 60);

  const endHour = end.getHours();

  // Determine minor status safely
  let isMinor = false;

  if (employee.birthDate) {
    const age =
      (new Date() - new Date(employee.birthDate)) /
      (1000 * 60 * 60 * 24 * 365);
    isMinor = age < 18;
  } else if (employee.isMinor) {
    isMinor = true;
  }

  // 🔒 Michigan Minor Labor Rules (Demo Version)

  if (isMinor) {

    // Cannot work past 10PM
    if (endHour > 22) {
      violations.push("MI minor labor violation – cannot work past 10PM");
    }

    // Cannot work more than 8 hours
    if (totalHours > 8) {
      violations.push("MI minor labor violation – cannot work more than 8 hours in one shift");
    }

    // Cannot work before 6AM
    if (start.getHours() < 6) {
      violations.push("MI minor labor violation – cannot start before 6AM");
    }
  }

  return {
    approved: violations.length === 0,
    violations
  };
};
