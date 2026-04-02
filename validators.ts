
import { LABOR_REGULATIONS, CURRENT_STATE } from './constants';

/**
 * The "Money Rule" function to validate labor cost against projected sales.
 * @param laborHours Total labor hours for the period.
 * @param hourlyRate Average hourly rate.
 * @param projectedSales Projected sales for the period.
 * @param targetPercent The manager's target labor percentage.
 * @returns A status string indicating if the budget is okay or in alert.
 */
export function budgetGuardian(
  laborHours: number,
  hourlyRate: number,
  projectedSales: number,
  targetPercent: number
): string {
  // Test Zero-Values: Sanity check to prevent division by zero errors.
  if (projectedSales === 0) {
    return '🟠 PENDING: Projected Sales cannot be zero.';
  }

  const totalLaborCost = laborHours * hourlyRate;
  const laborRatio = (totalLaborCost / projectedSales) * 100;

  if (laborRatio > targetPercent) {
    return `🚨 BUDGET ALERT: Labor is at ${laborRatio.toFixed(1)}%. Your cap is ${targetPercent}%.`;
  }
  return `✅ BUDGET OK: Labor is at ${laborRatio.toFixed(1)}%.`;
}

/**
 * Checks for fatigue risk based on a 14-hour shift limit.
 * @param shiftHours The length of the shift to check.
 * @returns A status string indicating if the shift is compliant or a fatigue risk.
 */
export function checkFatigue(shiftHours: number): string {
  // Using 14 hours as per the user request context, though the state rule is 12.
  // This allows for a specific "fatigue" check beyond the standard legal check.
  const FATIGUE_THRESHOLD = 14;

  if (shiftHours > FATIGUE_THRESHOLD) {
    return `🚨 FATIGUE RISK: ${shiftHours}h shift exceeds the ${FATIGUE_THRESHOLD}h recommended maximum.`;
  }
  
  const stateMax = LABOR_REGULATIONS[CURRENT_STATE]?.maxShiftAdult || 12;
  if (shiftHours > stateMax) {
      return `🟠 COMPLIANCE ALERT: ${shiftHours}h shift exceeds the ${stateMax}h state maximum for adults.`;
  }

  return `✅ COMPLIANT: ${shiftHours}h shift is within all safety and legal thresholds.`;
}
