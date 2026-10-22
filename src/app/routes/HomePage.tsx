import { ArrowUpRight, Dices, Layers3 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getCopy } from "../i18n";
import { useSettingsStore } from "../settingsStore";

function DicePreview() {
  return <div className="home-dice-preview" aria-hidden="true"><div className="preview-glow" /><div className="mini-cup"><span /></div><div className="mini-die die-a">••<br />••</div><div className="mini-die die-b">•<br />•</div><div className="table-line" /></div>;
}

function CardPreview() {
  return <div className="home-card-preview" aria-hidden="true"><div className="card-shadow-stack" /><div className="preview-card preview-card--back"><span>AH</span></div><div className="preview-card preview-card--face"><span className="card-corner">A<br />♥</span><b>♥</b></div></div>;
}

export default function HomePage() {
  const t = getCopy(useSettingsStore((state) => state.language)).home;
  return (
    <div className="home-page">
      <section className="hero-copy">
        <motion.p className="eyebrow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>{t.eyebrow}</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>{t.titleLead} <em>{t.titleAccent}</em><br />{t.titleEnd}</motion.h1>
        <motion.p className="hero-intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}>{t.intro}</motion.p>
      </section>
      <section className="game-grid" aria-label={t.choose}>
        <motion.article className="game-card game-card--dice" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <div className="game-card-number">01</div><DicePreview />
          <div className="game-card-copy"><div className="game-kicker"><Dices size={17} /> {t.diceKicker}</div><h2>{t.diceTitle}</h2><p>{t.diceDescription}</p><Link to="/dice" className="primary-link">{t.diceAction} <ArrowUpRight size={18} /></Link></div>
        </motion.article>
        <motion.article className="game-card game-card--cards" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="game-card-number">02</div><CardPreview />
          <div className="game-card-copy"><div className="game-kicker"><Layers3 size={17} /> {t.cardsKicker}</div><h2>{t.cardsTitle}</h2><p>{t.cardsDescription}</p><Link to="/cards" className="primary-link">{t.cardsAction} <ArrowUpRight size={18} /></Link></div>
        </motion.article>
      </section>
      <div className="home-note"><span className="pulse-dot" /> {t.saved}</div>
    </div>
  );
}
