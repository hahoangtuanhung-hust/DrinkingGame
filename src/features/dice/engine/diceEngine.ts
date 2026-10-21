import { secureRandomInt, type RandomInt } from "../../../lib/random";
import type { DicePhase, DiceSummary, DieValue } from "../types";

export const VALID_TRANSITIONS: Record<DicePhase, readonly DicePhase[]> = {
  INITIAL: ["READY", "ERROR"],
  READY: ["SHAKING", "PEEKING", "OPEN", "ERROR"],
  SHAKING: ["SETTLING", "ERROR"],
  SETTLING: ["CLOSED_RESULT", "ERROR"],
  CLOSED_RESULT: ["SHAKING", "PEEKING", "OPEN", "ERROR"],
  PEEKING: ["CLOSED_RESULT", "READY", "OPEN", "ERROR"],
  OPEN: ["CLOSED_RESULT", "READY", "SHAKING", "ERROR"],
  ERROR: ["READY"],
};

export const canTransition = (from: DicePhase, to: DicePhase) => VALID_TRANSITIONS[from].includes(to);

export const rollDice = (randomInt: RandomInt = secureRandomInt): DieValue[] =>
  Array.from({ length: 5 }, () => (randomInt(6) + 1) as DieValue);

export const summarizeDice = (values: readonly DieValue[]): DiceSummary => {
  const groups = values.reduce<Record<number, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
  const matches = Math.max(...Object.values(groups));
  const labels: Record<number, string> = { 1: "No matches", 2: "A pair", 3: "Three of a kind", 4: "Four of a kind", 5: "Five of a kind!" };
  return { total: values.reduce((sum, value) => sum + value, 0), matches, label: labels[matches], groups };
};
