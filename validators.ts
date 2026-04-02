
import { LABOR_REGULATIONS, CURRENT_STATE } from './constants';

/**
 * Utility to validate that all provided values are finite, non-NaN numbers and optionally non-negative.
 */
function isValidNumericInput(values: any[], allowNegative = false): boolean {
  return values.every(val => 
    typeof val === 'number' && 
    !isNaN(val) && 
    isFinite(val) && 
    (allowNegative || val >= 0)
  );
}

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
  if (!isValidNumericInput([laborHours, hourlyRate, projectedSales, targetPercent])) {
    return '🚨 INVALID INPUT: All budget parameters must be valid non-negative numbers.';
  }

  if (projectedSales === 0) {
    return '🟠 PENDING: Projected Sales cannot be zero.';
  }

  const totalLaborCost = laborHours * hourlyRate;
  const laborRatio = (totalLaborCost / projectedSales) * 100;

  return laborRatio > targetPercent
    ? `🚨 BUDGET ALERT: Labor is at ${laborRatio.toFixed(1)}%. Your cap is ${targetPercent}%.`
    : `✅ BUDGET OK: Labor is at ${laborRatio.toFixed(1)}%.`;
}

/**
 * Checks for fatigue risk based on recommended and legal shift limits.
 * @param shiftHours The length of the shift to check.
 * @returns A status string indicating if the shift is compliant or a fatigue risk.
 */
export function checkFatigue(shiftHours: number): string {
  if (!isValidNumericInput([shiftHours])) {
    return '🚨 INVALID INPUT: Shift hours must be a valid non-negative number.';
  }

  const FATIGUE_THRESHOLD = 14;
  const stateMax = LABOR_REGULATIONS[CURRENT_STATE]?.maxShiftAdult || 12;

  if (shiftHours > FATIGUE_THRESHOLD) {
    return `🚨 FATIGUE RISK: ${shiftHours}h shift exceeds the ${FATIGUE_THRESHOLD}h recommended maximum.`;
  }
  
  if (shiftHours > stateMax) {
      return `🟠 COMPLIANCE ALERT: ${shiftHours}h shift exceeds the ${stateMax}h state maximum for adults.`;
  }

  return `✅ COMPLIANT: ${shiftHours}h shift is within all safety and legal thresholds.`;
}
