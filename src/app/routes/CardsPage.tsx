import { ArrowRight, BookOpenText, Heart, History, PencilLine, RotateCcw, Shuffle, Sparkles, Star, Zap } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSettingsStore } from "../settingsStore";
import { Modal } from "../../components/ui/Modal";
import { soundEngine } from "../../lib/audio";
import { CardVisual, suitSymbol } from "../../features/cards/components/CardVisual";
import { DeckStack } from "../../features/cards/components/DeckStack";
import { useCardStore } from "../../features/cards/store/cardStore";
import type { DrawnCard } from "../../features/cards/types";

export default function CardsPage() {
  const store = useCardStore();
  const { soundEnabled, volume, reducedMotion, vibrationEnabled } = useSettingsStore();
  const [resetOpen, setResetOpen] = useState(false);
  const [inspected, setInspected] = useState<DrawnCard | null>(null);
  const revealZone = useRef<HTMLDivElement>(null);
  const scrollTimer = useRef<number | null>(null);
  const currentEntry = inspected ?? store.history.at(-1) ?? null;
  const remaining = store.deck.length - store.pointer;

  useEffect(() => {
    if (!store.isDrawing) return;
    const timer = window.setTimeout(() => store.finishAnimation(), reducedMotion ? 80 : 820);
    return () => window.clearTimeout(timer);
  }, [store.isDrawing, store.finishAnimation, reducedMotion]);
  useEffect(() => () => { if (scrollTimer.current !== null) window.clearTimeout(scrollTimer.current); }, []);

  const draw = useCallback(() => {
    const card = store.draw();
    if (!card) return;
    setInspected(null);
    if (soundEnabled) {
      soundEngine.play("draw", volume);
      window.setTimeout(() => soundEngine.play("flip", volume), reducedMotion ? 20 : 360);
    }
    if (vibrationEnabled && "vibrate" in navigator) navigator.vibrate(24);
    if (matchMedia("(max-width: 720px)").matches) {
      if (scrollTimer.current !== null) window.clearTimeout(scrollTimer.current);
      scrollTimer.current = window.setTimeout(() => revealZone.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" }), reducedMotion ? 30 : 220);
    }
  }, [store, soundEnabled, volume, vibrationEnabled, reducedMotion]);

  const ruleIcon = useMemo(() => ({
    social: <Heart size={14} aria-hidden="true" />,
    story: <BookOpenText size={14} aria-hidden="true" />,
    challenge: <Zap size={14} aria-hidden="true" />,
    choice: <Shuffle size={14} aria-hidden="true" />,
    wild: <Star size={14} aria-hidden="true" />,
  })[currentEntry?.rule.category ?? "choice"], [currentEntry]);

  return (
    <div className="cards-page page-wrap">
      <header className="page-heading cards-heading"><div><p className="eyebrow">The card table</p><h1>Draw your fate.</h1><p>One card, one prompt, no repeats.</p></div><div className="heading-actions"><Link to="/cards/rules" className="secondary-button"><PencilLine size={17} /> Edit rules</Link><button className="ghost-button" onClick={() => store.pointer > 0 ? setResetOpen(true) : store.resetDeck()}><RotateCcw size={17} /> Reset</button></div></header>

      <section className="card-table-layout">
        <div className="deck-zone">
          <div className="zone-label"><span>Draw pile</span><span>Swipe the top card</span></div>
          <DeckStack remaining={remaining} disabled={store.isDrawing || remaining === 0} onDraw={draw} />
          <button className="primary-button draw-button" onClick={draw} disabled={store.isDrawing || remaining === 0}>{remaining === 0 ? "Deck completed" : store.isDrawing ? "Revealing…" : "Draw a card"}<ArrowRight size={19} /></button>
        </div>

        <div ref={revealZone} className="reveal-zone" aria-live="polite">
          <div className="zone-label"><span>{inspected ? `Draw #${inspected.order}` : "Current card"}</span>{inspected && <button onClick={() => setInspected(null)}>Back to latest</button>}</div>
          {currentEntry ? (
            <div className="current-card-layout">
              <AnimatePresence mode="wait"><motion.div key={currentEntry.card.id} initial={reducedMotion ? false : { opacity: 0, x: -36, rotate: -4 }} animate={{ opacity: 1, x: 0, rotate: 0 }} exit={{ opacity: 0 }}><CardVisual card={currentEntry.card} revealed animate={store.isDrawing && !inspected} /></motion.div></AnimatePresence>
              <motion.article className={`rule-panel rule-panel--${currentEntry.rule.category}`} key={`${currentEntry.card.id}-rule`} initial={reducedMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reducedMotion ? 0 : 0.36 }}>
                <div className="rule-category"><span>{ruleIcon}</span>{currentEntry.rule.category}</div><h2>{currentEntry.rule.title}</h2><p>{currentEntry.rule.description}</p><div className="rule-pass-note"><Sparkles size={15} /> Non-alcoholic drinks and passes always count.</div>
              </motion.article>
            </div>
          ) : <div className="empty-reveal"><div className="empty-card-mark">?</div><h2>Your first card is waiting.</h2><p>Draw from the deck to reveal a card and its rule.</p></div>}
        </div>
      </section>

      <section className="history-section"><header><div><p className="eyebrow"><History size={14} /> Draw history</p><h2>{store.history.length ? `${store.history.length} card${store.history.length === 1 ? "" : "s"} on the table` : "Nothing drawn yet"}</h2></div><span className="history-tally">{store.history.length} / 52</span></header>
        {store.history.length > 0 ? <div className="history-strip">{[...store.history].reverse().map((entry) => <button key={entry.card.id} className={`history-card ${currentEntry?.card.id === entry.card.id ? "is-active" : ""}`} onClick={() => setInspected(entry)}><span className={entry.card.suit === "hearts" || entry.card.suit === "diamonds" ? "is-red" : ""}>{entry.card.rank} {suitSymbol(entry.card.suit)}</span><small>#{entry.order} · {entry.rule.title}</small></button>)}</div> : <div className="history-empty">Drawn cards will collect here in order.</div>}
      </section>

      <Modal open={resetOpen} onClose={() => setResetOpen(false)} title="Shuffle a new deck?" eyebrow="Reset card table"><p className="modal-lead">This clears all {store.history.length} drawn cards. Your custom rules stay safely saved.</p><div className="modal-actions"><button className="ghost-button" onClick={() => setResetOpen(false)}>Keep playing</button><button className="danger-button" onClick={() => { store.resetDeck(); setInspected(null); setResetOpen(false); }}>Shuffle & reset</button></div></Modal>
    </div>
  );
}
