import { CircleHelp, Home, Settings, Volume2, VolumeX } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSettingsStore } from "../../app/settingsStore";

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { soundEnabled, setSetting, setSettingsOpen, setHelpOpen } = useSettingsStore();
  const atHome = location.pathname === "/";
  const title = location.pathname.startsWith("/dice") ? "Dice Shaker" : location.pathname.startsWith("/cards/rules") ? "Rule Studio" : location.pathname.startsWith("/cards") ? "Card Table" : "After Hours";
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand" aria-label="After Hours home">
          <span className="brand-mark"><span>•</span><span>•</span></span>
          <span className="brand-type"><strong>AFTER HOURS</strong><small>TABLE GAMES</small></span>
        </Link>
        {!atHome && <div className="route-title" aria-live="polite"><span className="route-dot" />{title}</div>}
        <nav className="top-actions" aria-label="Utility navigation">
          {!atHome && <Link className="icon-button desktop-home" to="/" aria-label="Back to home"><Home size={18} /></Link>}
          <button className="icon-button" onClick={() => setSetting("soundEnabled", !soundEnabled)} aria-label={soundEnabled ? "Mute sound" : "Enable sound"}>
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button className="icon-button" onClick={() => setHelpOpen(true)} aria-label="Open help"><CircleHelp size={18} /></button>
          <button className="icon-button" onClick={() => setSettingsOpen(true)} aria-label="Open settings"><Settings size={18} /></button>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <p>Play at your own pace. Water, soda, and mocktails are always valid.</p>
        <span>21+ where required · Never drink and drive</span>
      </footer>
    </div>
  );
}
