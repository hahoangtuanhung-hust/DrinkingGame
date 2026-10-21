import { fisherYates, type RandomInt } from "../../../lib/random";
import { RANKS, SUITS, type PlayingCard } from "../types";

export const createDeck = (): PlayingCard[] =>
  SUITS.flatMap((suit) =>
    RANKS.map((rank) => ({
      id: `${rank}-${suit}`,
      suit,
      rank,
      ruleId: `exact-${rank}-${suit}`,
    })),
  );

export const createShuffledDeck = (randomInt?: RandomInt) => fisherYates(createDeck(), randomInt);

export const isValidDeck = (cards: readonly PlayingCard[]) =>
  cards.length === 52 && new Set(cards.map((card) => card.id)).size === 52;
