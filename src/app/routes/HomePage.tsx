import { ArrowUpRight, Dices, Layers3 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function DicePreview() {
  return <div className="home-dice-preview" aria-hidden="true"><div className="preview-glow" /><div className="mini-cup"><span /></div><div className="mini-die die-a">••<br />••</div><div className="mini-die die-b">•<br />•</div><div className="table-line" /></div>;
}

function CardPreview() {
  return <div className="home-card-preview" aria-hidden="true"><div className="card-shadow-stack" /><div className="preview-card preview-card--back"><span>AH</span></div><div className="preview-card preview-card--face"><span className="card-corner">A<br />♥</span><b>♥</b></div></div>;
}

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="hero-copy">
        <motion.p className="eyebrow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>Two games. Zero setup.</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>Bring the <em>table</em><br />to life.</motion.h1>
        <motion.p className="hero-intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}>Tactile party classics built for the screen in your hand. Pick a game and pass it around.</motion.p>
      </section>
      <section className="game-grid" aria-label="Choose a game">
        <motion.article className="game-card game-card--dice" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <div className="game-card-number">01</div><DicePreview />
          <div className="game-card-copy"><div className="game-kicker"><Dices size={17} /> Tactile 3D</div><h2>Dice Shaker</h2><p>Shake five dice, lift the lid to peek, and reveal what’s waiting underneath.</p><Link to="/dice" className="primary-link">Shake the dice <ArrowUpRight size={18} /></Link></div>
        </motion.article>
        <motion.article className="game-card game-card--cards" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="game-card-number">02</div><CardPreview />
          <div className="game-card-copy"><div className="game-kicker"><Layers3 size={17} /> 52 unique cards</div><h2>Card Table</h2><p>Draw, flip, and follow the prompt. Customize every rule to make the deck yours.</p><Link to="/cards" className="primary-link">Deal me in <ArrowUpRight size={18} /></Link></div>
        </motion.article>
      </section>
      <div className="home-note"><span className="pulse-dot" /> Progress saves automatically on this device</div>
    </div>
  );
}
