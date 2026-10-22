import type { Rank, Suit } from "../../types";
import { SuitIcon } from "./SuitIcon";
import { AceOfSpadesArt } from "./AceOfSpadesArt";

interface PipSpec {
  x: number; // percentage from left (0..100)
  y: number; // percentage from top (0..100)
  inverted?: boolean;
}

const PIP_LAYOUTS: Record<Rank, PipSpec[]> = {
  A: [{ x: 50, y: 50 }],
  "2": [
    { x: 50, y: 20 },
    { x: 50, y: 80, inverted: true },
  ],
  "3": [
    { x: 50, y: 20 },
    { x: 50, y: 50 },
    { x: 50, y: 80, inverted: true },
  ],
  "4": [
    { x: 28, y: 20 },
    { x: 72, y: 20 },
    { x: 28, y: 80, inverted: true },
    { x: 72, y: 80, inverted: true },
  ],
  "5": [
    { x: 28, y: 20 },
    { x: 72, y: 20 },
    { x: 50, y: 50 },
    { x: 28, y: 80, inverted: true },
    { x: 72, y: 80, inverted: true },
  ],
  "6": [
    { x: 28, y: 20 },
    { x: 72, y: 20 },
    { x: 28, y: 50 },
    { x: 72, y: 50 },
    { x: 28, y: 80, inverted: true },
    { x: 72, y: 80, inverted: true },
  ],
  "7": [
    { x: 28, y: 20 },
    { x: 72, y: 20 },
    { x: 50, y: 35 },
    { x: 28, y: 50 },
    { x: 72, y: 50 },
    { x: 28, y: 80, inverted: true },
    { x: 72, y: 80, inverted: true },
  ],
  "8": [
    { x: 28, y: 20 },
    { x: 72, y: 20 },
    { x: 50, y: 35 },
    { x: 28, y: 50 },
    { x: 72, y: 50 },
    { x: 50, y: 65, inverted: true },
    { x: 28, y: 80, inverted: true },
    { x: 72, y: 80, inverted: true },
  ],
  "9": [
    { x: 28, y: 18 },
    { x: 72, y: 18 },
    { x: 28, y: 39 },
    { x: 72, y: 39 },
    { x: 50, y: 50 },
    { x: 28, y: 61, inverted: true },
    { x: 72, y: 61, inverted: true },
    { x: 28, y: 82, inverted: true },
    { x: 72, y: 82, inverted: true },
  ],
  "10": [
    { x: 28, y: 18 },
    { x: 72, y: 18 },
    { x: 50, y: 29 },
    { x: 28, y: 39 },
    { x: 72, y: 39 },
    { x: 28, y: 61, inverted: true },
    { x: 72, y: 61, inverted: true },
    { x: 50, y: 71, inverted: true },
    { x: 28, y: 82, inverted: true },
    { x: 72, y: 82, inverted: true },
  ],
  J: [],
  Q: [],
  K: [],
};

export function PipGrid({ rank, suit }: { rank: Rank; suit: Suit }) {
  if (rank === "A" && suit === "spades") {
    return (
      <div className="card-ace-spades-container">
        <AceOfSpadesArt />
      </div>
    );
  }

  const pips = PIP_LAYOUTS[rank] ?? [];
  const isAce = rank === "A";

  return (
    <div className={`card-pip-area ${isAce ? "card-pip-area--ace" : ""}`}>
      {pips.map((pip, idx) => (
        <span
          key={idx}
          className={`card-pip ${pip.inverted ? "card-pip--inverted" : ""}`}
          style={{
            left: `${pip.x}%`,
            top: `${pip.y}%`,
            transform: `translate(-50%, -50%) rotate(${pip.inverted ? 180 : 0}deg)`,
          }}
        >
          <SuitIcon
            suit={suit}
            size={isAce ? "clamp(34px, 32%, 76px)" : "clamp(12px, 14%, 34px)"}
          />
        </span>
      ))}
    </div>
  );
}
