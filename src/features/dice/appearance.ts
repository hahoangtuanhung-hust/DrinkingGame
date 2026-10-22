import type { DieValue } from "./types";

export const DICE_PIP_COLORS = {
  red: "#c5283f",
  blue: "#2448a8",
} as const;

export const getDicePipColor = (value: DieValue) =>
  value === 1 || value === 4 ? DICE_PIP_COLORS.red : DICE_PIP_COLORS.blue;
