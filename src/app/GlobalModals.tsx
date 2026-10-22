import { Check, Info, Smartphone, Sparkles, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Modal } from "../components/ui/Modal";
import { Toggle } from "../components/ui/Toggle";
import { DICE_COLOR_OPTIONS, DICE_SET_PALETTES } from "../features/dice/appearance";
import { soundEngine } from "../lib/audio";
import { deviceEffects, type TorchStatus } from "../lib/deviceEffects";
import { useSettingsStore, type DiceColor, type GraphicsQuality } from "./settingsStore";

const COLOR_LABELS: Record<"en" | "vi", Record<DiceColor, string>> = {
  en: { green: "Green", blue: "Blue", red: "Red", yellow: "Yellow", pink: "Pink", purple: "Purple" },
  vi: { green: "Xanh lá", blue: "Xanh dương", red: "Đỏ", yellow: "Vàng", pink: "Hồng", purple: "Tím" },
};

export function GlobalModals() {
  const settings = useSettingsStore();
  const vi = settings.language === "vi";
  const [torchStatus, setTorchStatus] = useState<TorchStatus>(() => deviceEffects.getTorchStatus());
  const vibrationSupported = deviceEffects.supportsVibration();

  useEffect(() => deviceEffects.subscribe(() => setTorchStatus(deviceEffects.getTorchStatus())), []);

  const setSoundEnabled = (enabled: boolean) => {
    settings.setSetting("soundEnabled", enabled);
    if (enabled) void soundEngine.unlock();
  };

  const setTorchEnabled = async (enabled: boolean) => {
    if (!enabled) {
      settings.setSetting("torchEnabled", false);
      return;
    }
    const ready = await deviceEffects.requestTorch();
    settings.setSetting("torchEnabled", ready);
  };

  const torchDescriptions: Record<TorchStatus, string> = vi ? {
    idle: "Dùng đèn LED camera sau khi lắc; cần cấp quyền camera một lần",
    requesting: "Đang yêu cầu quyền camera…",
    ready: "Đã sẵn sàng; camera chỉ hoạt động trong lúc đèn nháy",
    unsupported: "Thiết bị hoặc trình duyệt này không hỗ trợ điều khiển đèn flash",
    denied: "Quyền camera bị từ chối; hãy bật lại trong Cài đặt Safari",
    error: "Không thể kết nối đèn flash; hãy thử lại",
  } : {
    idle: "Uses the rear camera LED while shaking; camera permission is requested once",
    requesting: "Requesting camera permission…",
    ready: "Ready; the camera is active only while the light pulses",
    unsupported: "This device or browser cannot control the camera flash",
    denied: "Camera access was denied; enable it in Safari Settings",
    error: "Could not connect to the camera flash; try again",
  };
  return (
    <>
      <Modal open={settings.settingsOpen} onClose={() => settings.setSettingsOpen(false)} title={vi ? "Điều chỉnh trải nghiệm" : "Set the mood"} eyebrow={vi ? "Cài đặt trò chơi" : "Game settings"} closeLabel={vi ? "Đóng hộp thoại" : "Close dialog"}>
        <div className="settings-list">
          <Toggle checked={settings.theme === "light"} onChange={(value) => settings.setSetting("theme", value ? "light" : "dark")} label={vi ? "Giao diện sáng" : "Light theme"} description={vi ? "Chuyển giữa không gian sáng và tối" : "Switch between daylight and after-hours styling"} />
          <Toggle checked={settings.soundEnabled} onChange={setSoundEnabled} label={vi ? "Hiệu ứng âm thanh" : "Sound effects"} description={vi ? "Chạm Lắc để mở khóa âm thanh trên iPhone" : "Tap Shake to unlock audio on iPhone"} />
          {settings.soundEnabled && <label className="range-row"><span><strong>{vi ? "Âm lượng" : "Volume"}</strong><small>{Math.round(settings.volume * 100)}%</small></span><input aria-label={vi ? "Âm lượng" : "Volume"} type="range" min="0" max="1" step="0.05" value={settings.volume} onChange={(e) => settings.setSetting("volume", Number(e.target.value))} /></label>}
          <Toggle checked={settings.vibrationEnabled && vibrationSupported} disabled={!vibrationSupported} onChange={(value) => settings.setSetting("vibrationEnabled", value)} label={vi ? "Rung phản hồi" : "Haptics"} description={vibrationSupported ? (vi ? "Rung ngắn sau thao tác chủ động" : "Short vibration after intentional actions") : (vi ? "Safari trên iPhone chưa hỗ trợ rung cho trang web" : "Safari on iPhone does not expose web vibration")} />
          <Toggle checked={settings.flashEnabled} onChange={(value) => settings.setSetting("flashEnabled", value)} label={vi ? "Nháy sáng trên màn hình" : "On-screen light pulse"} description={vi ? "Phản hồi ánh sáng trong cảnh, hoạt động trên mọi thiết bị" : "A visual pulse in the scene that works on every device"} />
          <Toggle checked={settings.torchEnabled} disabled={torchStatus === "requesting" || torchStatus === "unsupported"} onChange={(value) => void setTorchEnabled(value)} label={vi ? "Đèn flash camera" : "Camera flash"} description={torchDescriptions[torchStatus]} />
          <Toggle checked={settings.reducedMotion} onChange={(value) => settings.setSetting("reducedMotion", value)} label={vi ? "Giảm chuyển động" : "Reduced motion"} description={vi ? "Chuyển cảnh đơn giản và không rung cảnh" : "Simpler transitions and no scene shake"} />
          <div className="dice-color-setting"><span><strong>{vi ? "Màu bộ xí ngầu" : "Dice set color"}</strong><small>{vi ? "Đổi màu ống lắc, nắp và khay" : "Colors the cup, lid, and tray"}</small></span><div className="dice-color-options" role="radiogroup" aria-label={vi ? "Chọn màu bộ xí ngầu" : "Choose dice set color"}>{DICE_COLOR_OPTIONS.map((color) => <button key={color} type="button" role="radio" aria-checked={settings.diceColor === color} className={settings.diceColor === color ? "is-selected" : ""} onClick={() => settings.setSetting("diceColor", color)}><i style={{ backgroundColor: DICE_SET_PALETTES[color].swatch }} aria-hidden="true">{settings.diceColor === color && <Check size={14} />}</i><span>{COLOR_LABELS[vi ? "vi" : "en"][color]}</span></button>)}</div></div>
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
