import { ArrowLeft, Check, RotateCcw, Search } from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "../../components/ui/Modal";
import { categoryLabels, getCopy, suitLabels } from "../i18n";
import { useSettingsStore } from "../settingsStore";
import { createDeck } from "../../features/cards/engine/deckEngine";
import { CardVisual, suitSymbol } from "../../features/cards/components/CardVisual";
import { useCardStore } from "../../features/cards/store/cardStore";
import { localizeRule, makeDefaultExactRules } from "../../features/cards/rules/rules";
import { SUITS, type CardRule, type Suit } from "../../features/cards/types";

const cards = createDeck();
const defaultRules = makeDefaultExactRules(cards);

export default function RulesPage() {
  const { exactRules, updateRule, resetRules } = useCardStore();
  const language = useSettingsStore((state) => state.language);
  const t = getCopy(language).rules;
  const [selectedId, setSelectedId] = useState(cards[0].id);
  const [search, setSearch] = useState("");
  const [suitFilter, setSuitFilter] = useState<"all" | Suit>(() => typeof matchMedia === "function" && matchMedia("(max-width: 720px)").matches ? "hearts" : "all");
  const [saved, setSaved] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const selected = cards.find((card) => card.id === selectedId)!;
  const sourceRule = exactRules[selectedId];
  const initialRule = localizeRule(selected, sourceRule, language);
  const [draft, setDraft] = useState<Pick<CardRule, "title" | "description" | "category">>({ title: initialRule.title, description: initialRule.description, category: initialRule.category });
  useEffect(() => { const card = cards.find((item) => item.id === selectedId)!; const rule = localizeRule(card, exactRules[selectedId], language); setDraft({ title: rule.title, description: rule.description, category: rule.category }); setSaved(false); }, [selectedId, language, exactRules]);
  const deferredSearch = useDeferredValue(search);
  const filtered = useMemo(() => cards.filter((card) => {
    const matchesSuit = suitFilter === "all" || card.suit === suitFilter;
    const localizedRule = localizeRule(card, exactRules[card.id], language);
    const matchesSearch = `${card.rank} ${card.suit} ${suitLabels[language][card.suit]} ${localizedRule.title}`.toLowerCase().includes(deferredSearch.toLowerCase());
    return matchesSuit && matchesSearch;
  }), [deferredSearch, exactRules, language, suitFilter]);
  const save = () => { if (updateRule(selectedId, draft)) { setSaved(true); window.setTimeout(() => setSaved(false), 1400); } };
  return (
    <div className="rules-page page-wrap">
      <header className="page-heading"><div><Link to="/cards" className="back-link"><ArrowLeft size={16} /> {t.back}</Link><p className="eyebrow">{t.eyebrow}</p><h1>{t.title}</h1><p>{t.subtitle}</p></div><button className="ghost-button" onClick={() => setResetOpen(true)}><RotateCcw size={17} /> {t.restore}</button></header>
      <div className="rules-layout">
        <aside className="rules-browser"><label className="search-field"><Search size={17} /><input value={search} onChange={(e) => { setSearch(e.target.value); if (e.target.value) setSuitFilter("all"); }} placeholder={t.searchPlaceholder} aria-label={t.searchLabel} /></label><div className="rule-suit-filter" role="group" aria-label={t.filterLabel}><button aria-pressed={suitFilter === "all"} className={suitFilter === "all" ? "is-active" : ""} onClick={() => setSuitFilter("all")}>{t.all}</button>{SUITS.map((suit) => <button key={suit} aria-label={t.showSuit(suitLabels[language][suit])} aria-pressed={suitFilter === suit} className={`${suitFilter === suit ? "is-active" : ""} ${suit === "hearts" || suit === "diamonds" ? "is-red" : ""}`} onClick={() => setSuitFilter(suit)}><span>{suitSymbol(suit)}</span><small>{suitLabels[language][suit]}</small></button>)}</div><div className="rule-grid-meta"><span>{filtered.length} {t.cards}</span><span>{suitFilter === "all" ? t.fullDeck : suitLabels[language][suitFilter]}</span></div><div className="rule-card-grid">{filtered.map((card) => { const red = card.suit === "hearts" || card.suit === "diamonds"; return <button key={card.id} onClick={() => setSelectedId(card.id)} className={`${selectedId === card.id ? "is-selected" : ""} ${red ? "is-red" : ""}`} aria-label={t.cardLabel(card.rank, suitLabels[language][card.suit])}><b>{card.rank}</b><span>{suitSymbol(card.suit)}</span></button>; })}</div></aside>
        <section className="rule-editor"><div className="editor-card-id"><CardVisual card={selected} compact language={language} /><div><small>{t.editing}</small><strong>{t.cardLabel(selected.rank, suitLabels[language][selected.suit])}</strong></div></div>
          <label><span>{t.ruleTitle}</span><input value={draft.title} maxLength={60} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></label>
          <label><span>{t.instructions}</span><textarea value={draft.description} maxLength={240} rows={5} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /><small>{draft.description.length} / 240</small></label>
          <label><span>{t.category}</span><select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as CardRule["category"] })}>{(Object.keys(categoryLabels[language]) as CardRule["category"][]).map((category) => <option key={category} value={category}>{categoryLabels[language][category]}</option>)}</select></label>
          <button className="primary-button" onClick={save} disabled={!draft.title.trim() || !draft.description.trim()}>{saved ? <><Check size={18} /> {t.saved}</> : t.save}</button>
          <p className="editor-note">{t.note}</p>
        </section>
      </div>
      <Modal open={resetOpen} onClose={() => setResetOpen(false)} title={t.restoreTitle} eyebrow={t.eyebrow} closeLabel={language === "vi" ? "Đóng hộp thoại" : "Close dialog"}><p className="modal-lead">{t.restoreBody}</p><div className="modal-actions"><button className="ghost-button" onClick={() => setResetOpen(false)}>{t.cancel}</button><button className="danger-button" onClick={() => { resetRules(); const rule = localizeRule(selected, defaultRules[selectedId], language); setDraft({ title: rule.title, description: rule.description, category: rule.category }); setSaved(false); setResetOpen(false); }}>{t.restore}</button></div></Modal>
    </div>
  );
}
