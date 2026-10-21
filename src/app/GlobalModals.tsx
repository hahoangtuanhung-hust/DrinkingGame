import { Info, Smartphone, Sparkles, Volume2 } from "lucide-react";
import { Modal } from "../components/ui/Modal";
import { Toggle } from "../components/ui/Toggle";
import { useSettingsStore, type GraphicsQuality } from "./settingsStore";

export function GlobalModals() {
  const settings = useSettingsStore();
  return (
    <>
      <Modal open={settings.settingsOpen} onClose={() => settings.setSettingsOpen(false)} title="Set the mood" eyebrow="Game settings">
        <div className="settings-list">
          <Toggle checked={settings.soundEnabled} onChange={(value) => settings.setSetting("soundEnabled", value)} label="Sound effects" description="Soft, synthesized tabletop audio" />
          {settings.soundEnabled && <label className="range-row"><span><strong>Volume</strong><small>{Math.round(settings.volume * 100)}%</small></span><input type="range" min="0" max="1" step="0.05" value={settings.volume} onChange={(e) => settings.setSetting("volume", Number(e.target.value))} /></label>}
          <Toggle checked={settings.vibrationEnabled} onChange={(value) => settings.setSetting("vibrationEnabled", value)} label="Haptics" description="Short vibration after intentional actions" />
          <Toggle checked={settings.flashEnabled} onChange={(value) => settings.setSetting("flashEnabled", value)} label="Light pulse" description="A brief in-scene glow while shaking" />
          <Toggle checked={settings.reducedMotion} onChange={(value) => settings.setSetting("reducedMotion", value)} label="Reduced motion" description="Simpler transitions and no scene shake" />
          <label className="select-row"><span><strong>Graphics quality</strong><small>Adjusts 3D detail and pixel density</small></span><select value={settings.graphicsQuality} onChange={(e) => settings.setSetting("graphicsQuality", e.target.value as GraphicsQuality)}><option value="auto">Auto</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
        </div>
      </Modal>
      <Modal open={settings.helpOpen} onClose={() => settings.setHelpOpen(false)} title="How to play" eyebrow="Two games, one table">
        <div className="help-grid">
          <article><span className="help-icon"><Smartphone size={20} /></span><div><h3>Use touch or mouse</h3><p>Drag the dice lid upward to peek. Swipe the card deck or use the primary buttons.</p></div></article>
          <article><span className="help-icon"><Sparkles size={20} /></span><div><h3>Results stay put</h3><p>Dice never change while you inspect them, and each card can only leave the deck once.</p></div></article>
          <article><span className="help-icon"><Volume2 size={20} /></span><div><h3>Quiet is supported</h3><p>Mute, disable haptics, reduce motion, or lower 3D quality at any time.</p></div></article>
          <article><span className="help-icon"><Info size={20} /></span><div><h3>Keep it comfortable</h3><p>Every prompt is optional. Substitute any non-alcoholic drink or simply pass.</p></div></article>
        </div>
      </Modal>
    </>
  );
}
