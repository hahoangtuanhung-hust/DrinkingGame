import { describe, expect, it } from "vitest";
import { canTransition, rollDice, summarizeDice } from "../features/dice/engine/diceEngine";
import { DICE_SHAKE_TOTAL_MS, getDiceShakeTimeline } from "../features/dice/motion";
import { DICE_COLOR_OPTIONS, DICE_PIP_COLORS, DICE_SET_PALETTES, getDicePipColor } from "../features/dice/appearance";

describe("dice engine", () => {
  it("uses red pips for one and four, and blue for every other value", () => {
    expect([1, 4].map((value) => getDicePipColor(value as 1 | 4))).toEqual([DICE_PIP_COLORS.red, DICE_PIP_COLORS.red]);
    expect([2, 3, 5, 6].map((value) => getDicePipColor(value as 2 | 3 | 5 | 6))).toEqual(Array(4).fill(DICE_PIP_COLORS.blue));
  });
  it("provides six distinct color palettes for the complete dice set", () => {
    expect(DICE_COLOR_OPTIONS).toEqual(["green", "blue", "red", "yellow", "pink", "purple"]);
    expect(new Set(DICE_COLOR_OPTIONS.map((color) => DICE_SET_PALETTES[color].body)).size).toBe(6);
  });
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
