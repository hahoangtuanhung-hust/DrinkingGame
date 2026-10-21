import type { StateStorage } from "zustand/middleware";

export const safeLocalStorage: StateStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value);
    } catch {
      // The game remains fully usable if storage is unavailable or full.
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch {
      // No-op: storage is an enhancement, not a requirement.
    }
  },
};
