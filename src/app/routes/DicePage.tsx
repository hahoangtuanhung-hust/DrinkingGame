import { Activity, Eye, EyeOff, Hand, Smartphone, Sparkles } from "lucide-react";
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, type PointerEvent } from "react";
import { useSettingsStore } from "../settingsStore";
import { soundEngine } from "../../lib/audio";
import { summarizeDice } from "../../features/dice/engine/diceEngine";
import { useDeviceShake } from "../../features/dice/hooks/useDeviceShake";
import { useDiceStore } from "../../features/dice/store/diceStore";

const DiceScene = lazy(() => import("../../features/dice/scene/DiceScene").then((module) => ({ default: module.DiceScene })));

const phaseLabels = {
  INITIAL: "Preparing the cup",
  READY: "Cup ready",
  SHAKING: "Shaking",
  SETTLING: "Dice settling",
  CLOSED_RESULT: "Result concealed",
  PEEKING: "Peeking",
  OPEN: "Cup open",
  ERROR: "Scene paused",
};

export default function DicePage() {
  const dice = useDiceStore();
  const settings = useSettingsStore();
  const timers = useRef<number[]>([]);
  const gesture = useRef({ active: false, startX: 0, startY: 0, lastX: 0, lastDirection: 0, reversals: 0, travel: 0 });
  const busy = dice.phase === "SHAKING" || dice.phase === "SETTLING";
  const summary = useMemo(() => summarizeDice(dice.values), [dice.values]);

  useEffect(() => { dice.initialize(); }, [dice.initialize]);
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const shake = useCallback(() => {
    if (!dice.shake()) return;
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    if (settings.soundEnabled) soundEngine.play("shake", settings.volume);
    if (settings.vibrationEnabled && "vibrate" in navigator) navigator.vibrate([28, 34, 28]);
    const shakeDuration = settings.reducedMotion ? 120 : 920;
    timers.current.push(window.setTimeout(() => {
      dice.settle();
      if (settings.soundEnabled) soundEngine.play("settle", settings.volume);
      timers.current.push(window.setTimeout(() => dice.concealResult(), settings.reducedMotion ? 100 : 420));
    }, shakeDuration));
  }, [dice, settings.soundEnabled, settings.volume, settings.vibrationEnabled, settings.reducedMotion]);

  const deviceShake = useDeviceShake(shake);
  const open = () => { dice.open(); if (settings.soundEnabled) soundEngine.play("open", settings.volume); };
  const close = () => { dice.close(); if (settings.soundEnabled) soundEngine.play("close", settings.volume); };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (busy) return;
    gesture.current = { active: true, startX: event.clientX, startY: event.clientY, lastX: event.clientX, lastDirection: 0, reversals: 0, travel: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = gesture.current;
    if (!current.active || busy) return;
    const step = event.clientX - current.lastX;
    const direction = Math.sign(step);
    if (direction && current.lastDirection && direction !== current.lastDirection && Math.abs(step) > 3) current.reversals += 1;
    if (direction) current.lastDirection = direction;
    current.travel += Math.abs(step);
    current.lastX = event.clientX;
    const vertical = current.startY - event.clientY;
    const horizontal = Math.abs(event.clientX - current.startX);
    if (vertical > 4 && vertical > horizontal * 0.55) dice.setPeek(vertical / 190);
  };
  const onPointerUp = () => {
    const current = gesture.current;
    if (!current.active) return;
    current.active = false;
    if (current.travel > 175 && current.reversals >= 2 && dice.phase !== "OPEN") shake();
    else dice.releasePeek();
  };

  return (
    <div className="dice-page page-wrap">
      <header className="page-heading dice-heading"><div><p className="eyebrow">Five dice. One reveal.</p><h1>Trust the shake.</h1><p>Drag up to peek, or give the cup a deliberate side-to-side shake.</p></div><div className="dice-status"><span className={busy ? "is-live" : ""} /><div><small>Game state</small><strong>{phaseLabels[dice.phase]}</strong></div></div></header>
      <section className="dice-layout">
        <div className={`dice-stage ${busy ? "is-shaking" : ""}`} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
          <Suspense fallback={<div className="scene-loader"><span /><p>Lighting the table…</p></div>}><DiceScene values={dice.values} phase={dice.phase} peekAmount={dice.peekAmount} quality={settings.graphicsQuality} flashEnabled={settings.flashEnabled} reducedMotion={settings.reducedMotion} /></Suspense>
          {!busy && dice.phase !== "OPEN" && <div className="gesture-hint"><Hand size={16} /><span>Drag up to lift · shake side to side</span></div>}
          {busy && <div className="shake-meter" aria-hidden="true"><i /><i /><i /><i /><i /></div>}
        </div>
        <aside className="dice-controls">
          <div className="dice-control-top"><p className="eyebrow">Cup controls</p><div className="phase-mark"><Activity size={16} /> {busy ? "Motion locked" : "Ready for input"}</div></div>
          {dice.phase === "OPEN" ? <div className="dice-result" aria-live="polite"><div className="result-total"><span>Total</span><strong>{summary.total}</strong></div><div className="result-match"><span>{summary.matches >= 3 && <Sparkles size={16} />}{summary.label}</span><small>{dice.values.join(" · ")}</small></div><div className="result-pips">{dice.values.map((value, index) => <span key={index}>{value}</span>)}</div></div> : <div className="concealed-copy"><div className="lid-icon"><EyeOff size={24} /></div><h2>{dice.hasResult ? "The result is under the lid." : "The dice are lined up."}</h2><p>{dice.hasResult ? "Lift carefully for a peek, or open it all the way." : "Shake when everyone is ready."}</p></div>}
          <div className="dice-actions"><button className="primary-button shake-button" disabled={busy} onClick={shake}><span className="shake-button-die">✣</span>{busy ? "Shaking…" : "Shake dice"}</button>{dice.phase === "OPEN" ? <button className="secondary-button" onClick={close}><EyeOff size={18} /> Close the lid</button> : <button className="secondary-button" onClick={open} disabled={busy}><Eye size={18} /> Open cup</button>}</div>
          {deviceShake.supported && <button className={`motion-permission ${deviceShake.enabled ? "is-enabled" : ""}`} onClick={() => void deviceShake.request()} disabled={deviceShake.enabled}><Smartphone size={17} /><span><strong>{deviceShake.enabled ? "Phone shake enabled" : "Enable phone shake"}</strong><small>{deviceShake.enabled ? "A firm physical shake will roll the dice" : "Optional · permission requested on tap"}</small></span></button>}
          <div className="dice-safety-note">Results are generated once per valid shake and stay unchanged until the next one.</div>
        </aside>
      </section>
    </div>
  );
}
