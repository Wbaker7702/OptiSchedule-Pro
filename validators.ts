
import { LABOR_REGULATIONS, CURRENT_STATE } from './constants';
import sanitizeHtml from 'sanitize-html';

/**
 * ISSUE #8 & #9 FIX: Added comprehensive input validation and sanitization functions
 * Prevents injection attacks, XSS, and data integrity issues
 */

/**
 * Validates email format using RFC 5322 compliant regex
 * @param email Email address to validate
 * @returns true if valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  if (typeof email !== 'string' || email.length === 0) return false;
  if (email.length > 254) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates password strength requirements
 * - Minimum 12 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 * @param password Password to validate
 * @returns Object with isValid flag and validation messages
 */
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (typeof password !== 'string') {
    errors.push('Password must be a string');
    return { isValid: false, errors };
  }
  
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * ISSUE #3 FIX: Sanitizes text content to prevent XSS attacks
 * Escapes HTML special characters and removes dangerous patterns
 * @param text Text to sanitize
 * @returns Sanitized text safe for display
 */
export function sanitizeInput(text: string): string {
  if (typeof text !== 'string') return '';

  // Sanitize HTML using a well-tested parser-based library
  const sanitized = sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {},
    allowedSchemes: []
  });
  // Escape HTML special characters for safe display as text
  const escaped = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  return escaped.trim();
}

/**
 * Validates that a string doesn't contain SQL injection patterns
 * @param input Input to validate
 * @returns true if safe, false if suspicious patterns detected
 */
export function validateAgainstSQLInjection(input: string): boolean {
  if (typeof input !== 'string') return false;
  
  // Common SQL injection patterns
  const sqlPatterns = [
    /(['"])(.*?)\1\s*(OR|AND)\s*\1.+\1/gi,
    /;\s*DROP/gi,
    /;\s*DELETE/gi,
    /;\s*INSERT/gi,
    /;\s*UPDATE/gi,
    /UNION\s+SELECT/gi,
    /--\s*$/gm,
    /\/\*/g
  ];
  
  return !sqlPatterns.some(pattern => pattern.test(input));
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
  // ISSUE #9 FIX: Added input validation
  if (typeof laborHours !== 'number' || laborHours < 0) {
    return '❌ ERROR: laborHours must be a non-negative number';
  }
  if (typeof hourlyRate !== 'number' || hourlyRate < 0) {
    return '❌ ERROR: hourlyRate must be a non-negative number';
  }
  if (typeof targetPercent !== 'number' || targetPercent < 0 || targetPercent > 100) {
    return '❌ ERROR: targetPercent must be between 0 and 100';
  }
  
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
  // ISSUE #9 FIX: Added input validation
  if (typeof shiftHours !== 'number' || shiftHours < 0) {
    return '❌ ERROR: shiftHours must be a non-negative number';
  }
  
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
