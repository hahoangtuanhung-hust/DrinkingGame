import type { PlayingCard } from "../types";
import type { Language } from "../../../app/settingsStore";
import { getCopy, suitLabels } from "../../../app/i18n";
import { isRedSuit, SuitIcon } from "./card-art/SuitIcon";
import { PipGrid } from "./card-art/PipGrid";
import { CourtCardArt } from "./card-art/CourtCardArt";

const SUIT_SYMBOLS = { hearts: "♥", diamonds: "♦", clubs: "♣", spades: "♠" } as const;

export interface CardVisualProps {
  card: PlayingCard | null;
  revealed?: boolean;
  compact?: boolean;
  animate?: boolean;
  language?: Language;
}

export function CardVisual({
  card,
  revealed = true,
  compact = false,
  animate = false,
  language = "en",
}: CardVisualProps) {
  const red = card ? isRedSuit(card.suit) : false;
  const isCourt = card ? card.rank === "J" || card.rank === "Q" || card.rank === "K" : false;

  return (
    <div
      className={`playing-card-wrap ${compact ? "playing-card-wrap--compact" : ""} ${animate ? "is-dealing" : ""}`}
      role="img"
      aria-label={
        card && revealed
          ? getCopy(language).rules.cardLabel(card.rank, suitLabels[language][card.suit])
          : getCopy(language).cards.faceDown
      }
    >
      <div className={`playing-card-inner ${revealed ? "is-revealed" : ""}`}>
        {/* Card Back */}
        <div className="playing-card card-back" aria-hidden={revealed}>
          <div className="card-back-pattern">
            <span>AH</span>
          </div>
        </div>

        {/* Card Face */}
        <div className={`playing-card card-face ${red ? "is-red" : ""}`} aria-hidden={!revealed}>
          {card && (
            <>
              {/* Outer classic playing card hairline frame */}
              <div className="card-inner-frame" aria-hidden="true" />

              {/* Corner Indices: Top-Left */}
              <div className={`face-corner face-corner--top ${card.rank === "10" ? "face-corner--ten" : ""}`}>
                <b className="corner-rank">{card.rank}</b>
                <span className="corner-suit-wrap">
                  <SuitIcon suit={card.suit} size="0.82em" />
                </span>
              </div>

              {/* Card Centerpiece: Court art for J, Q, K; Pip layout for A..10 */}
              {isCourt ? (
                <div className="face-court-wrapper">
                  <CourtCardArt rank={card.rank as "J" | "Q" | "K"} suit={card.suit} />
                </div>
              ) : (
                <PipGrid rank={card.rank} suit={card.suit} />
              )}

              {/* Corner Indices: Bottom-Right (180° Inverted) */}
              <div className={`face-corner face-corner--bottom ${card.rank === "10" ? "face-corner--ten" : ""}`}>
                <b className="corner-rank">{card.rank}</b>
                <span className="corner-suit-wrap">
                  <SuitIcon suit={card.suit} size="0.82em" />
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export const suitSymbol = (suit: PlayingCard["suit"]) => SUIT_SYMBOLS[suit];
