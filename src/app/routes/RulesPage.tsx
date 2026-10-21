import { ArrowLeft, Check, RotateCcw, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "../../components/ui/Modal";
import { createDeck } from "../../features/cards/engine/deckEngine";
import { suitSymbol } from "../../features/cards/components/CardVisual";
import { useCardStore } from "../../features/cards/store/cardStore";
import type { CardRule } from "../../features/cards/types";

const cards = createDeck();

export default function RulesPage() {
  const { exactRules, updateRule, resetRules } = useCardStore();
  const [selectedId, setSelectedId] = useState(cards[0].id);
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const selected = cards.find((card) => card.id === selectedId)!;
  const sourceRule = exactRules[selectedId];
  const [draft, setDraft] = useState<Pick<CardRule, "title" | "description" | "category">>({ title: sourceRule.title, description: sourceRule.description, category: sourceRule.category });
  useEffect(() => { const rule = exactRules[selectedId]; setDraft({ title: rule.title, description: rule.description, category: rule.category }); setSaved(false); }, [selectedId, exactRules]);
  const filtered = useMemo(() => cards.filter((card) => `${card.rank} ${card.suit} ${exactRules[card.id].title}`.toLowerCase().includes(search.toLowerCase())), [search, exactRules]);
  const save = () => { if (updateRule(selectedId, draft)) { setSaved(true); window.setTimeout(() => setSaved(false), 1400); } };
  return (
    <div className="rules-page page-wrap">
      <header className="page-heading"><div><Link to="/cards" className="back-link"><ArrowLeft size={16} /> Back to the table</Link><p className="eyebrow">Rule studio</p><h1>Make it yours.</h1><p>Edit any card. Changes are saved on this device.</p></div><button className="ghost-button" onClick={() => setResetOpen(true)}><RotateCcw size={17} /> Restore defaults</button></header>
      <div className="rules-layout">
        <aside className="rules-browser"><label className="search-field"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Find a card or rule" aria-label="Search rules" /></label><div className="rule-card-grid">{filtered.map((card) => { const red = card.suit === "hearts" || card.suit === "diamonds"; return <button key={card.id} onClick={() => setSelectedId(card.id)} className={`${selectedId === card.id ? "is-selected" : ""} ${red ? "is-red" : ""}`} aria-label={`${card.rank} of ${card.suit}`}><b>{card.rank}</b><span>{suitSymbol(card.suit)}</span></button>; })}</div></aside>
        <section className="rule-editor"><div className="editor-card-id"><span className={selected.suit === "hearts" || selected.suit === "diamonds" ? "is-red" : ""}>{selected.rank} {suitSymbol(selected.suit)}</span><div><small>Editing exact-card rule</small><strong>{selected.rank} of {selected.suit}</strong></div></div>
          <label><span>Rule title</span><input value={draft.title} maxLength={60} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></label>
          <label><span>Instructions</span><textarea value={draft.description} maxLength={240} rows={5} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /><small>{draft.description.length} / 240</small></label>
          <label><span>Category</span><select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as CardRule["category"] })}><option value="social">Social</option><option value="story">Story</option><option value="challenge">Challenge</option><option value="choice">Choice</option><option value="wild">Wild</option></select></label>
          <button className="primary-button" onClick={save} disabled={!draft.title.trim() || !draft.description.trim()}>{saved ? <><Check size={18} /> Saved</> : "Save this rule"}</button>
          <p className="editor-note">Rules are plain text only and validated before saving. Past draws retain the rule shown at the time.</p>
        </section>
      </div>
      <Modal open={resetOpen} onClose={() => setResetOpen(false)} title="Restore every rule?" eyebrow="Rule studio"><p className="modal-lead">All 52 custom rules will return to the friendly house defaults. Past draw history will not change.</p><div className="modal-actions"><button className="ghost-button" onClick={() => setResetOpen(false)}>Cancel</button><button className="danger-button" onClick={() => { resetRules(); setResetOpen(false); }}>Restore defaults</button></div></Modal>
    </div>
  );
}
