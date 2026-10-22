import type { Suit } from "../../types";

export const SUIT_COLORS = {
  red: "#c9222b",
  black: "#1a191b",
} as const;

export function isRedSuit(suit: Suit): boolean {
  return suit === "hearts" || suit === "diamonds";
}

export function getSuitColor(suit: Suit): string {
  return isRedSuit(suit) ? SUIT_COLORS.red : SUIT_COLORS.black;
}

interface SuitIconProps {
  suit: Suit;
  size?: number | string;
  className?: string;
  color?: string;
}

export function SuitIcon({ suit, size = 20, className = "", color }: SuitIconProps) {
  const fillColor = color ?? getSuitColor(suit);

  switch (suit) {
    case "hearts":
      return (
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          className={`suit-svg suit-svg--hearts ${className}`}
          aria-hidden="true"
          style={{ display: "inline-block", verticalAlign: "middle", fill: fillColor }}
        >
          <path d="M50 88.5 C20 65 5 48 5 28 C5 12.5 17 4 32.5 4 C41.5 4 47 8.5 50 13.5 C53 8.5 58.5 4 67.5 4 C83 4 95 12.5 95 28 C95 48 80 65 50 88.5 Z" />
        </svg>
      );

    case "diamonds":
      return (
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          className={`suit-svg suit-svg--diamonds ${className}`}
          aria-hidden="true"
          style={{ display: "inline-block", verticalAlign: "middle", fill: fillColor }}
        >
          <path d="M50 4 L88 50 L50 96 L12 50 Z" />
        </svg>
      );

    case "clubs":
      return (
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          className={`suit-svg suit-svg--clubs ${className}`}
          aria-hidden="true"
          style={{ display: "inline-block", verticalAlign: "middle", fill: fillColor }}
        >
          <path d="M50 6 C40.5 6 32.5 14 32.5 24.5 C32.5 30 35.5 35 40 38 C33 36.5 25 38.5 18 44.5 C10 51.5 10 63.5 18 70.5 C26 77.5 37.5 75 44 65.5 C44 73.5 38 84.5 32 95 L68 95 C62 84.5 56 73.5 56 65.5 C62.5 75 74 77.5 82 70.5 C90 63.5 90 51.5 82 44.5 C75 38.5 67 36.5 60 38 C64.5 35 67.5 30 67.5 24.5 C67.5 14 59.5 6 50 6 Z" />
        </svg>
      );

    case "spades":
      return (
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          className={`suit-svg suit-svg--spades ${className}`}
          aria-hidden="true"
          style={{ display: "inline-block", verticalAlign: "middle", fill: fillColor }}
        >
          <path d="M50 5 C46 17 28 37 12 51 C4 58 6 68 16 69 C30 70 42 61 44 55 C44 65 38 81 32 95 L68 95 C62 81 56 65 56 55 C58 61 70 70 84 69 C94 68 96 58 88 51 C72 37 54 17 50 5 Z" />
        </svg>
      );
  }
}
