export type EventType =
  | "SHIFT_COMPLETED"
  | "SHIFT_MISSED"
  | "COMPLIANCE_VIOLATION";

export interface MetricsState {
  totalShifts: number;
  missedShifts: number;
  complianceViolations: number;
  trustScore: number;
}

const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

export const initialState: MetricsState = {
  totalShifts: 0,
  missedShifts: 0,
  complianceViolations: 0,
  trustScore: 100,
};

export function applyEvent(
  state: MetricsState,
  event: EventType
): MetricsState {
  const newState = { ...state };

  switch (event) {
    case "SHIFT_COMPLETED":
      newState.totalShifts += 1;
      newState.trustScore += 1;
      break;

    case "SHIFT_MISSED":
      newState.totalShifts += 1;
      newState.missedShifts += 1;
      newState.trustScore -= 10;
      break;

    case "COMPLIANCE_VIOLATION":
      newState.complianceViolations += 1;
      newState.trustScore -= 15;
      break;
  }

  newState.trustScore = clamp(newState.trustScore, 0, 100);
  return newState;
}
