import { Info, Smartphone, Sparkles, Volume2 } from "lucide-react";
import { Modal } from "../components/ui/Modal";
import { Toggle } from "../components/ui/Toggle";
import { useSettingsStore, type GraphicsQuality } from "./settingsStore";

export function GlobalModals() {
  const settings = useSettingsStore();
  const vi = settings.language === "vi";
  return (
    <>
      <Modal open={settings.settingsOpen} onClose={() => settings.setSettingsOpen(false)} title={vi ? "Điều chỉnh trải nghiệm" : "Set the mood"} eyebrow={vi ? "Cài đặt trò chơi" : "Game settings"} closeLabel={vi ? "Đóng hộp thoại" : "Close dialog"}>
        <div className="settings-list">
          <Toggle checked={settings.theme === "light"} onChange={(value) => settings.setSetting("theme", value ? "light" : "dark")} label={vi ? "Giao diện sáng" : "Light theme"} description={vi ? "Chuyển giữa không gian sáng và tối" : "Switch between daylight and after-hours styling"} />
          <Toggle checked={settings.soundEnabled} onChange={(value) => settings.setSetting("soundEnabled", value)} label={vi ? "Hiệu ứng âm thanh" : "Sound effects"} description={vi ? "Âm thanh bàn chơi được tổng hợp nhẹ nhàng" : "Soft, synthesized tabletop audio"} />
          {settings.soundEnabled && <label className="range-row"><span><strong>{vi ? "Âm lượng" : "Volume"}</strong><small>{Math.round(settings.volume * 100)}%</small></span><input aria-label={vi ? "Âm lượng" : "Volume"} type="range" min="0" max="1" step="0.05" value={settings.volume} onChange={(e) => settings.setSetting("volume", Number(e.target.value))} /></label>}
          <Toggle checked={settings.vibrationEnabled} onChange={(value) => settings.setSetting("vibrationEnabled", value)} label={vi ? "Rung phản hồi" : "Haptics"} description={vi ? "Rung ngắn sau thao tác chủ động" : "Short vibration after intentional actions"} />
          <Toggle checked={settings.flashEnabled} onChange={(value) => settings.setSetting("flashEnabled", value)} label={vi ? "Nháy sáng" : "Light pulse"} description={vi ? "Ánh sáng ngắn trong cảnh khi lắc" : "A brief in-scene glow while shaking"} />
          <Toggle checked={settings.reducedMotion} onChange={(value) => settings.setSetting("reducedMotion", value)} label={vi ? "Giảm chuyển động" : "Reduced motion"} description={vi ? "Chuyển cảnh đơn giản và không rung cảnh" : "Simpler transitions and no scene shake"} />
          <label className="select-row"><span><strong>{vi ? "Chất lượng đồ họa" : "Graphics quality"}</strong><small>{vi ? "Điều chỉnh chi tiết 3D và mật độ điểm ảnh" : "Adjusts 3D detail and pixel density"}</small></span><select aria-label={vi ? "Chất lượng đồ họa" : "Graphics quality"} value={settings.graphicsQuality} onChange={(e) => settings.setSetting("graphicsQuality", e.target.value as GraphicsQuality)}><option value="auto">{vi ? "Tự động" : "Auto"}</option><option value="low">{vi ? "Thấp" : "Low"}</option><option value="medium">{vi ? "Trung bình" : "Medium"}</option><option value="high">{vi ? "Cao" : "High"}</option></select></label>
        </div>
      </Modal>
      <Modal open={settings.helpOpen} onClose={() => settings.setHelpOpen(false)} title={vi ? "Cách chơi" : "How to play"} eyebrow={vi ? "Hai trò chơi, một bàn" : "Two games, one table"} closeLabel={vi ? "Đóng hộp thoại" : "Close dialog"}>
        <div className="help-grid">
          <article><span className="help-icon"><Smartphone size={20} /></span><div><h3>{vi ? "Dùng cảm ứng hoặc chuột" : "Use touch or mouse"}</h3><p>{vi ? "Kéo nắp lên để xem xúc xắc. Vuốt bộ bài hoặc dùng nút thao tác chính." : "Drag the dice lid upward to peek. Swipe the card deck or use the primary buttons."}</p></div></article>
          <article><span className="help-icon"><Sparkles size={20} /></span><div><h3>{vi ? "Kết quả được giữ nguyên" : "Results stay put"}</h3><p>{vi ? "Xúc xắc không đổi khi bạn xem, và mỗi lá chỉ được rút khỏi bộ bài một lần." : "Dice never change while you inspect them, and each card can only leave the deck once."}</p></div></article>
          <article><span className="help-icon"><Volume2 size={20} /></span><div><h3>{vi ? "Có chế độ yên tĩnh" : "Quiet is supported"}</h3><p>{vi ? "Bạn có thể tắt tiếng, rung, giảm chuyển động hoặc hạ chất lượng 3D bất cứ lúc nào." : "Mute, disable haptics, reduce motion, or lower 3D quality at any time."}</p></div></article>
          <article><span className="help-icon"><Info size={20} /></span><div><h3>{vi ? "Luôn ưu tiên thoải mái" : "Keep it comfortable"}</h3><p>{vi ? "Mọi thử thách đều tùy chọn. Có thể dùng đồ uống không cồn hoặc bỏ lượt." : "Every prompt is optional. Substitute any non-alcoholic drink or simply pass."}</p></div></article>
        </div>
      </Modal>
    </>
  );
}
