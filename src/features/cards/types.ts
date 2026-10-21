export const SUITS = ["hearts", "diamonds", "clubs", "spades"] as const;
export const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"] as const;

export type Suit = (typeof SUITS)[number];
export type Rank = (typeof RANKS)[number];

export interface PlayingCard {
  id: string;
  suit: Suit;
  rank: Rank;
  ruleId: string;
}

export interface CardRule {
  id: string;
  title: string;
  description: string;
  category: "social" | "story" | "challenge" | "choice" | "wild";
}

export interface DrawnCard {
  card: PlayingCard;
  rule: CardRule;
  order: number;
  drawnAt: number;
}
