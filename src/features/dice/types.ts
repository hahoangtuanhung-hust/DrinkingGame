export type DicePhase = "INITIAL" | "READY" | "SHAKING" | "SETTLING" | "CLOSED_RESULT" | "PEEKING" | "OPEN" | "ERROR";
export type DieValue = 1 | 2 | 3 | 4 | 5 | 6;

export interface DiceSummary {
  total: number;
  matches: number;
  label: string;
  groups: Record<number, number>;
}
