import { useCallback, useEffect, useRef, useState } from "react";

type DeviceMotionEventWithPermission = typeof DeviceMotionEvent & { requestPermission?: () => Promise<"granted" | "denied"> };

export function useDeviceShake(onShake: () => void) {
  const [enabled, setEnabled] = useState(false);
  const [supported] = useState(() => typeof DeviceMotionEvent !== "undefined");
  const lastShake = useRef(0);

  const request = useCallback(async () => {
    if (!supported) return false;
    const DeviceMotion = DeviceMotionEvent as DeviceMotionEventWithPermission;
    try {
      if (typeof DeviceMotion.requestPermission === "function") {
        const permission = await DeviceMotion.requestPermission();
        if (permission !== "granted") return false;
      }
      setEnabled(true);
      return true;
    } catch {
      return false;
    }
  }, [supported]);

  useEffect(() => {
    if (!enabled) return;
    const listener = (event: DeviceMotionEvent) => {
      const { x = 0, y = 0, z = 0 } = event.accelerationIncludingGravity ?? {};
      const magnitude = Math.sqrt((x ?? 0) ** 2 + (y ?? 0) ** 2 + (z ?? 0) ** 2);
      const now = Date.now();
      if (magnitude > 22 && now - lastShake.current > 1400) {
        lastShake.current = now;
        onShake();
      }
    };
    window.addEventListener("devicemotion", listener);
    return () => window.removeEventListener("devicemotion", listener);
  }, [enabled, onShake]);

  return { supported, enabled, request };
}
