import { CircleHelp, Home, Moon, Settings, Sun, Volume2, VolumeX } from "lucide-react";
import { useEffect, useLayoutEffect, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { getCopy } from "../../app/i18n";
import { useSettingsStore } from "../../app/settingsStore";

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { soundEnabled, language, theme, setSetting, setSettingsOpen, setHelpOpen } = useSettingsStore();
  const atHome = location.pathname === "/";
  const atDice = location.pathname.startsWith("/dice");
  const vi = language === "vi";
  const t = getCopy(language);
  const title = atDice ? t.shell.dice : location.pathname.startsWith("/cards/rules") ? t.shell.rules : location.pathname.startsWith("/cards") ? t.shell.cards : "After Hours";

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = atHome ? "After Hours" : `${title} · After Hours`;
  }, [atHome, language, title]);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "light" ? "#f5efe6" : "#100e0d");
  }, [theme]);

  return (
    <div className="app-shell">
      <header className={`topbar ${atHome ? "" : "topbar--game"}`}>
        <Link to="/" className="brand" aria-label={vi ? "Trang chủ After Hours" : "After Hours home"}>
          <span className="brand-mark"><span>•</span><span>•</span></span>
          <span className="brand-type"><strong>AFTER HOURS</strong><small>{t.shell.tableGames}</small></span>
        </Link>
        {!atHome && <div className="route-title" aria-live="polite"><span className="route-dot" />{title}</div>}
        <nav className="top-actions" aria-label={vi ? "Tiện ích" : "Utility navigation"}>
          {!atHome && <Link className="icon-button desktop-home" to="/" aria-label={vi ? "Về trang chủ" : "Back to home"}><Home size={18} /></Link>}
          <button className="language-switch" onClick={() => setSetting("language", language === "en" ? "vi" : "en")} aria-label={vi ? "Switch to English" : "Chuyển sang tiếng Việt"}>
            <span className={language === "en" ? "is-active" : ""}>EN</span><i aria-hidden="true">/</i><span className={language === "vi" ? "is-active" : ""}>VI</span>
          </button>
          <button className="icon-button theme-toggle" onClick={() => setSetting("theme", theme === "dark" ? "light" : "dark")} aria-label={theme === "dark" ? (vi ? "Chuyển sang giao diện sáng" : "Switch to light theme") : (vi ? "Chuyển sang giao diện tối" : "Switch to dark theme")}>
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
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
