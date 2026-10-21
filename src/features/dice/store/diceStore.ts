import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { z } from "zod";
import { safeLocalStorage } from "../../../lib/storage";
import { canTransition, rollDice } from "../engine/diceEngine";
import type { DicePhase, DieValue } from "../types";

const PersistedSchema = z.object({
  values: z.array(z.number().int().min(1).max(6)).length(5),
  hasResult: z.boolean(),
  shakeCount: z.number().int().nonnegative(),
});

interface DiceState {
  phase: DicePhase;
  values: DieValue[];
  hasResult: boolean;
  peekAmount: number;
  shakeCount: number;
  initialize: () => void;
  shake: () => boolean;
  settle: () => void;
  concealResult: () => void;
  setPeek: (amount: number) => void;
  releasePeek: () => void;
  open: () => void;
  close: () => void;
  recover: () => void;
}

const nextClosedPhase = (hasResult: boolean): DicePhase => (hasResult ? "CLOSED_RESULT" : "READY");

export const useDiceStore = create<DiceState>()(
  persist(
    (set, get) => ({
      phase: "INITIAL",
      values: [1, 2, 3, 4, 5],
      hasResult: false,
      peekAmount: 0,
      shakeCount: 0,
      initialize: () => {
        if (canTransition(get().phase, "READY")) set({ phase: "READY" });
      },
      shake: () => {
        const state = get();
        if (!canTransition(state.phase, "SHAKING")) return false;
        const values = rollDice();
        set({ phase: "SHAKING", values, hasResult: true, peekAmount: 0, shakeCount: state.shakeCount + 1 });
        return true;
      },
      settle: () => {
        if (canTransition(get().phase, "SETTLING")) set({ phase: "SETTLING" });
      },
      concealResult: () => {
        if (canTransition(get().phase, "CLOSED_RESULT")) set({ phase: "CLOSED_RESULT" });
      },
      setPeek: (amount) => {
        const state = get();
        if (state.phase === "SHAKING" || state.phase === "SETTLING") return;
        const peekAmount = Math.max(0, Math.min(1, amount));
        if (peekAmount > 0 && state.phase !== "PEEKING" && canTransition(state.phase, "PEEKING")) {
          set({ phase: "PEEKING", peekAmount });
        } else if (state.phase === "PEEKING") {
          set({ peekAmount });
        }
      },
      releasePeek: () => {
        const state = get();
        if (state.phase !== "PEEKING") return;
        if (state.peekAmount >= 0.56 && canTransition("PEEKING", "OPEN")) set({ phase: "OPEN", peekAmount: 1 });
        else set({ phase: nextClosedPhase(state.hasResult), peekAmount: 0 });
      },
      open: () => {
        const state = get();
        if (canTransition(state.phase, "OPEN")) set({ phase: "OPEN", peekAmount: 1 });
      },
      close: () => {
        const state = get();
        const next = nextClosedPhase(state.hasResult);
        if (canTransition(state.phase, next)) set({ phase: next, peekAmount: 0 });
      },
      recover: () => set({ phase: nextClosedPhase(get().hasResult), peekAmount: 0 }),
    }),
    {
      name: "after-hours-dice-game",
      version: 1,
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: ({ values, hasResult, shakeCount }) => ({ values, hasResult, shakeCount }),
      merge: (persisted, current) => {
        const parsed = PersistedSchema.safeParse(persisted);
        if (!parsed.success) return current;
        return { ...current, ...parsed.data, values: parsed.data.values as DieValue[], phase: parsed.data.hasResult ? "CLOSED_RESULT" : "INITIAL", peekAmount: 0 };
      },
    },
  ),
);
