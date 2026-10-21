import { useRef, useState, type PointerEvent } from "react";

export function DeckStack({ remaining, disabled, onDraw }: { remaining: number; disabled: boolean; onDraw: () => void }) {
  const origin = useRef<number | null>(null);
  const [offset, setOffset] = useState(0);
  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (disabled) return;
    origin.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (origin.current === null) return;
    setOffset(Math.max(-95, Math.min(95, event.clientX - origin.current)));
  };
  const onPointerUp = () => {
    if (Math.abs(offset) > 56) onDraw();
    origin.current = null;
    setOffset(0);
  };
  return (
    <button className="deck-stack" disabled={disabled} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} aria-label={`${remaining} cards remaining. Swipe or activate to draw.`}>
      <span className="deck-layer deck-layer--three" /><span className="deck-layer deck-layer--two" /><span className="deck-layer deck-layer--one" />
      <span className="deck-top" style={{ transform: `translateX(${offset}px) rotate(${offset * 0.05}deg)` }}><span className="card-back-pattern"><span>AH</span></span></span>
      <span className="deck-count"><strong>{remaining}</strong><small>cards left</small></span>
    </button>
  );
}
