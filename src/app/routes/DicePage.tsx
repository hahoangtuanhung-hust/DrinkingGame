import { Dices, Eye } from "lucide-react";
import { lazy, Suspense, useCallback, useEffect, useRef, type PointerEvent } from "react";
import { useSettingsStore } from "../settingsStore";
import { soundEngine } from "../../lib/audio";
import { deviceEffects } from "../../lib/deviceEffects";
import { useDiceStore } from "../../features/dice/store/diceStore";
import { getDiceShakeTimeline } from "../../features/dice/motion";

const DiceScene = lazy(() => import("../../features/dice/scene/DiceScene").then((module) => ({ default: module.DiceScene })));

export default function DicePage() {
  const dice = useDiceStore();
  const settings = useSettingsStore();
  const timers = useRef<number[]>([]);
  const gesture = useRef({ active: false, peeking: false, startX: 0, startY: 0, lastX: 0, lastDirection: 0, reversals: 0, travel: 0 });
  const busy = dice.phase === "SHAKING" || dice.phase === "SETTLING";
  const shouldOpen = dice.phase === "CLOSED_RESULT";
  const vi = settings.language === "vi";
  const actionLabel = busy ? (vi ? "Đang lắc…" : "Shaking…") : shouldOpen ? (vi ? "Mở" : "Open") : (vi ? "Lắc" : "Shake");
  const statusLabel = busy ? actionLabel : shouldOpen ? (vi ? "Đã lắc xong, sẵn sàng mở nắp" : "Shake complete, ready to open") : dice.phase === "OPEN" ? (vi ? "Nắp đã mở" : "Cup open") : (vi ? "Sẵn sàng lắc" : "Ready to shake");

  useEffect(() => { dice.initialize(); }, [dice.initialize]);
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const shake = useCallback(() => {
    if (!dice.shake()) return;
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    const timeline = getDiceShakeTimeline(settings.reducedMotion);
    if (settings.soundEnabled) void soundEngine.play("shake", settings.volume, (timeline.activeMs + timeline.settleMs) / 1_000);
    if (settings.vibrationEnabled) deviceEffects.vibrate([24, 18, 28, 18, 24]);
    if (settings.torchEnabled) void deviceEffects.pulseTorch(timeline.activeMs + timeline.settleMs);
    timers.current.push(window.setTimeout(() => {
      dice.settle();
      if (settings.soundEnabled) void soundEngine.play("settle", settings.volume);
      timers.current.push(window.setTimeout(() => dice.concealResult(), timeline.settleMs));
    }, timeline.activeMs));
  }, [dice, settings.soundEnabled, settings.volume, settings.vibrationEnabled, settings.torchEnabled, settings.reducedMotion]);

  const open = () => { dice.open(); if (settings.soundEnabled) void soundEngine.play("open", settings.volume); };
  const primaryAction = shouldOpen ? open : shake;

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (busy) return;
    gesture.current = { active: true, peeking: false, startX: event.clientX, startY: event.clientY, lastX: event.clientX, lastDirection: 0, reversals: 0, travel: 0 };
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
    if (vertical > 4 && vertical > horizontal * 0.55) {
      current.peeking = true;
      dice.setPeek(vertical / 190);
    }
  };
  const onPointerUp = () => {
    const current = gesture.current;
    if (!current.active) return;
    current.active = false;
    if (current.peeking) dice.releasePeek();
    else if (current.travel > 175 && current.reversals >= 2 && dice.phase !== "OPEN") shake();
    else dice.releasePeek();
  };

  return (
    <div className="dice-page page-wrap">
      <h1 className="sr-only">{vi ? "Bộ lắc năm viên xúc xắc 3D" : "Five-dice 3D shaker"}</h1>
      <p className="sr-only" role="status" aria-live="polite">{statusLabel}</p>
      <section className="dice-layout">
        <div className={`dice-stage ${busy ? "is-shaking" : ""} ${busy && settings.flashEnabled && !settings.reducedMotion ? "is-light-pulsing" : ""}`} data-dice-color={settings.diceColor} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
          <Suspense fallback={<div className="scene-loader"><span /><p>{vi ? "Đang dựng bàn…" : "Lighting the table…"}</p></div>}><DiceScene values={dice.values} phase={dice.phase} peekAmount={dice.peekAmount} quality={settings.graphicsQuality} flashEnabled={settings.flashEnabled} reducedMotion={settings.reducedMotion} language={settings.language} diceColor={settings.diceColor} theme={settings.theme} /></Suspense>
        </div>
        <div className="dice-primary-control">
          <button className={`primary-button dice-primary-button ${shouldOpen ? "is-open" : ""}`} disabled={busy} onClick={primaryAction} aria-live="polite">
            {shouldOpen ? <Eye size={21} aria-hidden="true" /> : <Dices size={21} aria-hidden="true" />}
            {actionLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
