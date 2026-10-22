import type { PlayingCard } from "../types";
import type { Language } from "../../../app/settingsStore";
import { getCopy, suitLabels } from "../../../app/i18n";

const SUIT_SYMBOLS = { hearts: "♥", diamonds: "♦", clubs: "♣", spades: "♠" } as const;
export function CardVisual({ card, revealed = true, compact = false, animate = false, language = "en" }: { card: PlayingCard | null; revealed?: boolean; compact?: boolean; animate?: boolean; language?: Language }) {
  const red = card?.suit === "hearts" || card?.suit === "diamonds";
  return (
    <div className={`playing-card-wrap ${compact ? "playing-card-wrap--compact" : ""} ${animate ? "is-dealing" : ""}`} role="img" aria-label={card && revealed ? getCopy(language).rules.cardLabel(card.rank, suitLabels[language][card.suit]) : getCopy(language).cards.faceDown}>
      <div className={`playing-card-inner ${revealed ? "is-revealed" : ""}`}>
        <div className="playing-card card-back" aria-hidden={revealed}><div className="card-back-pattern"><span>AH</span></div></div>
        <div className={`playing-card card-face ${red ? "is-red" : ""}`} aria-hidden={!revealed}>
          {card && <><div className="face-corner face-corner--top"><b>{card.rank}</b><span>{SUIT_SYMBOLS[card.suit]}</span></div><div className="face-center">{SUIT_SYMBOLS[card.suit]}</div><div className="face-corner face-corner--bottom"><b>{card.rank}</b><span>{SUIT_SYMBOLS[card.suit]}</span></div></>}
        </div>
      </div>
    </div>
  );
}

export const suitSymbol = (suit: PlayingCard["suit"]) => SUIT_SYMBOLS[suit];
