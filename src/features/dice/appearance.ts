import type { DiceColor } from "../../app/settingsStore";
import type { DieValue } from "./types";

export const DICE_PIP_COLORS = {
  red: "#c5283f",
  blue: "#2448a8",
} as const;

export const getDicePipColor = (value: DieValue) =>
  value === 1 || value === 4 ? DICE_PIP_COLORS.red : DICE_PIP_COLORS.blue;

export const DICE_COLOR_OPTIONS: DiceColor[] = ["green", "blue", "red", "yellow", "pink", "purple"];

export const DICE_SET_PALETTES: Record<DiceColor, {
  swatch: string;
  body: string;
  upper: string;
  top: string;
  tray: string;
  trayInner: string;
  emissive: string;
  accent: string;
}> = {
  green: { swatch: "#2f8f68", body: "#185b43", upper: "#207054", top: "#124936", tray: "#103d2e", trayInner: "#183e32", emissive: "#061b14", accent: "#55c293" },
  blue: { swatch: "#356fc4", body: "#1b477f", upper: "#245a9d", top: "#153866", tray: "#112f57", trayInner: "#182f4e", emissive: "#07162d", accent: "#69a0ee" },
  red: { swatch: "#b44155", body: "#7e293b", upper: "#96364b", top: "#641d2e", tray: "#481723", trayInner: "#442029", emissive: "#26080f", accent: "#e36b7e" },
  yellow: { swatch: "#c58b2e", body: "#936218", upper: "#ad7722", top: "#71480e", tray: "#513409", trayInner: "#4b3a20", emissive: "#2b1904", accent: "#efbd55" },
  pink: { swatch: "#c45d91", body: "#8a3e67", upper: "#a44f7c", top: "#692b4d", tray: "#4d1e38", trayInner: "#492636", emissive: "#2b0b1c", accent: "#e987b7" },
  purple: { swatch: "#8057b5", body: "#59377d", upper: "#6c4695", top: "#432761", tray: "#301b47", trayInner: "#352742", emissive: "#180a25", accent: "#b08ae3" },
};
