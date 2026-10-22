import { ArrowRight, BookOpenText, Heart, History, PencilLine, RotateCcw, Shuffle, Sparkles, Star, Zap } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSettingsStore } from "../settingsStore";
import { categoryLabels, getCopy } from "../i18n";
import { Modal } from "../../components/ui/Modal";
import { soundEngine } from "../../lib/audio";
import { CardVisual, suitSymbol } from "../../features/cards/components/CardVisual";
import { DeckStack } from "../../features/cards/components/DeckStack";
import { useCardStore } from "../../features/cards/store/cardStore";
import { localizeRule } from "../../features/cards/rules/rules";
import type { DrawnCard } from "../../features/cards/types";

export default function CardsPage() {
  const store = useCardStore();
  const { soundEnabled, volume, reducedMotion, vibrationEnabled, language } = useSettingsStore();
  const t = getCopy(language).cards;
  const [resetOpen, setResetOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [inspected, setInspected] = useState<DrawnCard | null>(null);
  const revealZone = useRef<HTMLDivElement>(null);
  const scrollTimer = useRef<number | null>(null);
  const currentEntry = inspected ?? store.history.at(-1) ?? null;
  const currentRule = currentEntry ? localizeRule(currentEntry.card, currentEntry.rule, language) : null;
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
  })[currentRule?.category ?? "choice"], [currentRule]);

  const inspectHistoryEntry = (entry: DrawnCard) => {
    setInspected(entry);
    setHistoryOpen(false);
    window.setTimeout(
      () => revealZone.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" }),
      reducedMotion ? 0 : 120,
    );
  };

  return (
    <div className="cards-page page-wrap">
      <h1 className="sr-only">{t.title}</h1>
      <section className="card-table-layout">
        <div className="deck-zone">
          <div className="zone-label"><span>{t.drawPile}</span><span>{t.swipe}</span></div>
          <DeckStack remaining={remaining} disabled={store.isDrawing || remaining === 0} onDraw={draw} language={language} />
          <button className="primary-button draw-button" onClick={draw} disabled={store.isDrawing || remaining === 0}>{remaining === 0 ? t.completed : store.isDrawing ? t.revealing : t.draw}<ArrowRight size={19} /></button>
        </div>

        <div ref={revealZone} className="reveal-zone" aria-live="polite">
          <div className="zone-label"><span>{inspected ? t.drawNumber(inspected.order) : t.current}</span>{inspected && <button onClick={() => setInspected(null)}>{t.backLatest}</button>}</div>
          {currentEntry && currentRule ? (
            <div className="current-card-layout">
              <AnimatePresence mode="wait"><motion.div key={currentEntry.card.id} initial={reducedMotion ? false : { opacity: 0, x: -36, rotate: -4 }} animate={{ opacity: 1, x: 0, rotate: 0 }} exit={{ opacity: 0 }}><CardVisual card={currentEntry.card} revealed animate={store.isDrawing && !inspected} language={language} /></motion.div></AnimatePresence>
              <motion.article className={`rule-panel rule-panel--${currentRule.category}`} key={`${currentEntry.card.id}-rule`} initial={reducedMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reducedMotion ? 0 : 0.36 }}>
                <div className="rule-category"><span>{ruleIcon}</span>{categoryLabels[language][currentRule.category]}</div><h2>{currentRule.title}</h2><p>{currentRule.description}</p><div className="rule-pass-note"><Sparkles size={15} /> {t.passNote}</div>
              </motion.article>
            </div>
          ) : <div className="empty-reveal"><div className="empty-card-mark">?</div><h2>{t.firstTitle}</h2><p>{t.firstBody}</p></div>}
        </div>
      </section>

      <button className="cards-history-button" onClick={() => setHistoryOpen(true)} aria-haspopup="dialog">
        <span className="cards-history-icon"><History size={20} aria-hidden="true" /></span>
        <span className="cards-history-copy"><strong>{t.history}</strong><small>{t.historyTitle(store.history.length)}</small></span>
        <span className="cards-history-count" aria-label={`${store.history.length} / 52`}>{store.history.length}<small>/52</small></span>
      </button>

      <div className="cards-footer-actions" aria-label={language === "vi" ? "Tùy chọn bàn bài" : "Card table options"}>
        <Link to="/cards/rules" className="secondary-button"><PencilLine size={17} aria-hidden="true" /> {t.editRules}</Link>
        <button className="ghost-button" onClick={() => store.pointer > 0 ? setResetOpen(true) : store.resetDeck()}><RotateCcw size={17} aria-hidden="true" /> {t.reset}</button>
      </div>

      <Modal open={historyOpen} onClose={() => setHistoryOpen(false)} title={t.historyTitle(store.history.length)} eyebrow={t.history} closeLabel={language === "vi" ? "Đóng lịch sử" : "Close history"}>
        <div className="history-modal-tally"><History size={15} aria-hidden="true" /><span>{store.history.length} / 52</span></div>
        {store.history.length > 0 ? <div className="history-modal-list">{[...store.history].reverse().map((entry) => <button key={entry.card.id} className={`history-card ${currentEntry?.card.id === entry.card.id ? "is-active" : ""}`} onClick={() => inspectHistoryEntry(entry)}><span className={entry.card.suit === "hearts" || entry.card.suit === "diamonds" ? "is-red" : ""}>{entry.card.rank} {suitSymbol(entry.card.suit)}</span><small>#{entry.order} · {localizeRule(entry.card, entry.rule, language).title}</small></button>)}</div> : <div className="history-empty">{t.historyEmpty}</div>}
      </Modal>

      <Modal open={resetOpen} onClose={() => setResetOpen(false)} title={t.resetTitle} eyebrow={t.resetEyebrow} closeLabel={language === "vi" ? "Đóng hộp thoại" : "Close dialog"}><p className="modal-lead">{t.resetBody(store.history.length)}</p><div className="modal-actions"><button className="ghost-button" onClick={() => setResetOpen(false)}>{t.keepPlaying}</button><button className="danger-button" onClick={() => { store.resetDeck(); setInspected(null); setResetOpen(false); }}>{t.shuffleReset}</button></div></Modal>
    </div>
  );
}
