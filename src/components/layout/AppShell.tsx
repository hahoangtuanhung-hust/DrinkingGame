import { CircleHelp, Home, Settings, Volume2, VolumeX } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSettingsStore } from "../../app/settingsStore";

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { soundEnabled, language, setSetting, setSettingsOpen, setHelpOpen } = useSettingsStore();
  const atHome = location.pathname === "/";
  const atDice = location.pathname.startsWith("/dice");
  const locale = atDice ? language : "en";
  const vi = locale === "vi";
  const title = atDice ? (vi ? "Bộ lắc xúc xắc" : "Dice Shaker") : location.pathname.startsWith("/cards/rules") ? "Rule Studio" : location.pathname.startsWith("/cards") ? "Card Table" : "After Hours";

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <div className="app-shell">
      <header className={`topbar ${atHome ? "" : "topbar--game"}`}>
        <Link to="/" className="brand" aria-label={vi ? "Trang chủ After Hours" : "After Hours home"}>
          <span className="brand-mark"><span>•</span><span>•</span></span>
          <span className="brand-type"><strong>AFTER HOURS</strong><small>TABLE GAMES</small></span>
        </Link>
        {!atHome && <div className="route-title" aria-live="polite"><span className="route-dot" />{title}</div>}
        <nav className="top-actions" aria-label={vi ? "Tiện ích" : "Utility navigation"}>
          {!atHome && <Link className="icon-button desktop-home" to="/" aria-label={vi ? "Về trang chủ" : "Back to home"}><Home size={18} /></Link>}
          {atDice && <button className="language-switch" onClick={() => setSetting("language", language === "en" ? "vi" : "en")} aria-label={vi ? "Switch to English" : "Chuyển sang tiếng Việt"}>
            <span className={language === "en" ? "is-active" : ""}>EN</span><i aria-hidden="true">/</i><span className={language === "vi" ? "is-active" : ""}>VI</span>
          </button>}
          <button className="icon-button" onClick={() => setSetting("soundEnabled", !soundEnabled)} aria-label={soundEnabled ? (vi ? "Tắt âm thanh" : "Mute sound") : (vi ? "Bật âm thanh" : "Enable sound")}>
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button className="icon-button" onClick={() => setHelpOpen(true)} aria-label={vi ? "Mở hướng dẫn" : "Open help"}><CircleHelp size={18} /></button>
          <button className="icon-button" onClick={() => setSettingsOpen(true)} aria-label={vi ? "Mở cài đặt" : "Open settings"}><Settings size={18} /></button>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <p>{vi ? "Chơi theo nhịp của bạn. Nước lọc, nước ngọt và mocktail luôn được chấp nhận." : "Play at your own pace. Water, soda, and mocktails are always valid."}</p>
        <span>{vi ? "Tuân thủ độ tuổi quy định · Đã uống rượu bia, không lái xe" : "21+ where required · Never drink and drive"}</span>
      </footer>
    </div>
  );
}
