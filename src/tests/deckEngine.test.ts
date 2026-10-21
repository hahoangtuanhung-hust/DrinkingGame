import { describe, expect, it } from "vitest";
import { createDeck, createShuffledDeck, isValidDeck } from "../features/cards/engine/deckEngine";

describe("deck engine", () => {
  it("creates exactly 52 unique standard cards", () => {
    const deck = createDeck();
    expect(deck).toHaveLength(52);
    expect(new Set(deck.map((card) => card.id)).size).toBe(52);
    expect(isValidDeck(deck)).toBe(true);
  });

  it("uses the injected random integer once per Fisher-Yates step", () => {
    let calls = 0;
    const deck = createShuffledDeck((max) => { calls += 1; return max - 1; });
    expect(calls).toBe(51);
    expect(deck.map((card) => card.id)).toEqual(createDeck().map((card) => card.id));
  });

  it("preserves all cards through a deterministic shuffle", () => {
    let seed = 17;
    const deck = createShuffledDeck((max) => { seed = (seed * 48271) % 2147483647; return seed % max; });
    expect(isValidDeck(deck)).toBe(true);
    expect(new Set(deck.map((card) => card.id))).toEqual(new Set(createDeck().map((card) => card.id)));
  });
});
