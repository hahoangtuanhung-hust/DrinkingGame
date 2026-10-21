import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { z } from "zod";
import { safeLocalStorage } from "../../../lib/storage";
import { createDeck, createShuffledDeck, isValidDeck } from "../engine/deckEngine";
import { makeDefaultExactRules, resolveRule } from "../rules/rules";
import type { CardRule, DrawnCard, PlayingCard } from "../types";

const CardRuleSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(60),
  description: z.string().min(1).max(240),
  category: z.enum(["social", "story", "challenge", "choice", "wild"]),
});
const CardSchema = z.object({ id: z.string(), suit: z.enum(["hearts", "diamonds", "clubs", "spades"]), rank: z.enum(["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]), ruleId: z.string() });
const PersistedSchema = z.object({
  deck: z.array(CardSchema).length(52),
  pointer: z.number().int().min(0).max(52),
  history: z.array(z.object({ card: CardSchema, rule: CardRuleSchema, order: z.number().int().positive(), drawnAt: z.number() })).max(52),
  current: CardSchema.nullable(),
  exactRules: z.record(z.string(), CardRuleSchema),
});

interface CardState {
  deck: PlayingCard[];
  pointer: number;
  history: DrawnCard[];
  current: PlayingCard | null;
  exactRules: Record<string, CardRule>;
  isDrawing: boolean;
  draw: () => PlayingCard | null;
  finishAnimation: () => void;
  resetDeck: () => void;
  updateRule: (cardId: string, update: Pick<CardRule, "title" | "description" | "category">) => boolean;
  resetRules: () => void;
}

const baseDeck = createDeck();
const initialRules = makeDefaultExactRules(baseDeck);

export const useCardStore = create<CardState>()(
  persist(
    (set, get) => ({
      deck: createShuffledDeck(),
      pointer: 0,
      history: [],
      current: null,
      exactRules: initialRules,
      isDrawing: false,
      draw: () => {
        const state = get();
        if (state.isDrawing || state.pointer >= state.deck.length) return null;
        const card = state.deck[state.pointer];
        const rule = { ...resolveRule(card, state.exactRules) };
        set({
          pointer: state.pointer + 1,
          current: card,
          isDrawing: true,
          history: [...state.history, { card, rule, order: state.pointer + 1, drawnAt: Date.now() }],
        });
        return card;
      },
      finishAnimation: () => set({ isDrawing: false }),
      resetDeck: () => set({ deck: createShuffledDeck(), pointer: 0, history: [], current: null, isDrawing: false }),
      updateRule: (cardId, update) => {
        const parsed = CardRuleSchema.safeParse({ id: `exact-${cardId}`, ...update });
        if (!parsed.success || !get().exactRules[cardId]) return false;
        set((state) => ({ exactRules: { ...state.exactRules, [cardId]: parsed.data } }));
        return true;
      },
      resetRules: () => set({ exactRules: makeDefaultExactRules(baseDeck) }),
    }),
    {
      name: "after-hours-card-game",
      version: 2,
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: ({ isDrawing: _a, draw: _b, finishAnimation: _c, resetDeck: _d, updateRule: _e, resetRules: _f, ...state }) => state,
      merge: (persisted, current) => {
        const parsed = PersistedSchema.safeParse(persisted);
        if (!parsed.success || !isValidDeck(parsed.data.deck)) return current;
        const drawnIds = parsed.data.deck.slice(0, parsed.data.pointer).map((card) => card.id);
        const historyIds = parsed.data.history.map((entry) => entry.card.id);
        if (drawnIds.length !== historyIds.length || drawnIds.some((id, index) => id !== historyIds[index])) return current;
        return { ...current, ...parsed.data, isDrawing: false };
      },
    },
  ),
);
