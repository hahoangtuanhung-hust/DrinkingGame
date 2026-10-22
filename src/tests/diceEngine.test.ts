import { describe, expect, it } from "vitest";
import { canTransition, rollDice, summarizeDice } from "../features/dice/engine/diceEngine";
import { DICE_SHAKE_TOTAL_MS, getDiceShakeTimeline } from "../features/dice/motion";

describe("dice engine", () => {
  it("uses a two-second physical shake timeline", () => {
    const timeline = getDiceShakeTimeline(false);
    expect(timeline.activeMs + timeline.settleMs).toBe(DICE_SHAKE_TOTAL_MS);
    expect(DICE_SHAKE_TOTAL_MS).toBe(2_000);
    const reducedTimeline = getDiceShakeTimeline(true);
    expect(reducedTimeline.activeMs + reducedTimeline.settleMs).toBeLessThan(500);
  });
  it("rolls exactly five valid values with a deterministic hook", () => {
    const sequence = [0, 1, 2, 3, 5];
    const result = rollDice(() => sequence.shift() ?? 0);
    expect(result).toEqual([1, 2, 3, 4, 6]);
  });
  it("summarizes matches and totals", () => {
    expect(summarizeDice([4, 4, 4, 2, 1])).toMatchObject({ total: 15, matches: 3, label: "Three of a kind" });
  });
  it("rejects race-prone transitions", () => {
    expect(canTransition("SHAKING", "OPEN")).toBe(false);
    expect(canTransition("SHAKING", "SHAKING")).toBe(false);
    expect(canTransition("SETTLING", "CLOSED_RESULT")).toBe(true);
  });
});
