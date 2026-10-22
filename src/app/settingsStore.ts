import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { z } from "zod";
import { safeLocalStorage } from "../lib/storage";

export type GraphicsQuality = "auto" | "low" | "medium" | "high";
export type Language = "en" | "vi";
export type Theme = "dark" | "light";

const SettingsSchema = z.object({
  soundEnabled: z.boolean(),
  volume: z.number().min(0).max(1),
  vibrationEnabled: z.boolean(),
  flashEnabled: z.boolean(),
  reducedMotion: z.boolean(),
  graphicsQuality: z.enum(["auto", "low", "medium", "high"]),
  language: z.enum(["en", "vi"]).default("en"),
  theme: z.enum(["dark", "light"]).default("dark"),
});

type SettingsState = z.infer<typeof SettingsSchema> & {
  settingsOpen: boolean;
  helpOpen: boolean;
  setSetting: <K extends keyof z.infer<typeof SettingsSchema>>(key: K, value: z.infer<typeof SettingsSchema>[K]) => void;
  setSettingsOpen: (open: boolean) => void;
  setHelpOpen: (open: boolean) => void;
};

const defaults = {
  soundEnabled: true,
  volume: 0.55,
  vibrationEnabled: true,
  flashEnabled: true,
  reducedMotion: typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches,
  graphicsQuality: "auto" as GraphicsQuality,
  language: "en" as Language,
  theme: "dark" as Theme,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaults,
      settingsOpen: false,
      helpOpen: false,
      setSetting: (key, value) => set({ [key]: value }),
      setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
      setHelpOpen: (helpOpen) => set({ helpOpen }),
    }),
    {
      name: "after-hours-settings",
      version: 1,
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: ({ settingsOpen: _a, helpOpen: _b, setSetting: _c, setSettingsOpen: _d, setHelpOpen: _e, ...state }) => state,
      merge: (persisted, current) => {
        const parsed = SettingsSchema.safeParse(persisted);
        return { ...current, ...(parsed.success ? parsed.data : defaults) };
      },
    },
  ),
);
