export type TorchStatus = "idle" | "requesting" | "ready" | "unsupported" | "denied" | "error";

type TorchCapabilities = MediaTrackCapabilities & { torch?: boolean };

const wait = (duration: number) => new Promise<void>((resolve) => window.setTimeout(resolve, duration));

class DeviceEffects {
  private torchStatus: TorchStatus = this.canRequestCamera() ? "idle" : "unsupported";
  private listeners = new Set<() => void>();
  private pulseRun = 0;

  supportsVibration() {
    return typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
  }

  vibrate(pattern: number | number[]) {
    if (!this.supportsVibration()) return false;
    return navigator.vibrate(pattern);
  }

  getTorchStatus() {
    return this.torchStatus;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  private setTorchStatus(status: TorchStatus) {
    this.torchStatus = status;
    this.listeners.forEach((listener) => listener());
  }

  private canRequestCamera() {
    return typeof navigator !== "undefined" && window.isSecureContext && typeof navigator.mediaDevices?.getUserMedia === "function";
  }

  private async openRearCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 640 },
        height: { ideal: 480 },
        frameRate: { ideal: 15, max: 24 },
      },
    });
    const track = stream.getVideoTracks()[0];
    const capabilities = track?.getCapabilities?.() as TorchCapabilities | undefined;
    return { stream, track, hasTorch: capabilities?.torch === true };
  }

  private stopStream(stream: MediaStream | null) {
    stream?.getTracks().forEach((track) => track.stop());
  }

  private async setTorch(track: MediaStreamTrack, enabled: boolean) {
    await track.applyConstraints({ advanced: [{ torch: enabled }] } as unknown as MediaTrackConstraints);
  }

  private classifyError(error: unknown): TorchStatus {
    if (error instanceof DOMException && (error.name === "NotAllowedError" || error.name === "SecurityError")) return "denied";
    return "error";
  }

  async requestTorch() {
    if (!this.canRequestCamera()) {
      this.setTorchStatus("unsupported");
      return false;
    }

    this.setTorchStatus("requesting");
    let stream: MediaStream | null = null;
    try {
      const camera = await this.openRearCamera();
      stream = camera.stream;
      if (!camera.track || !camera.hasTorch) {
        this.setTorchStatus("unsupported");
        return false;
      }
      await this.setTorch(camera.track, true);
      await wait(120);
      await this.setTorch(camera.track, false);
      this.setTorchStatus("ready");
      return true;
    } catch (error) {
      this.setTorchStatus(this.classifyError(error));
      return false;
    } finally {
      this.stopStream(stream);
    }
  }

  async pulseTorch(duration = 2_000) {
    if (!this.canRequestCamera() || this.torchStatus === "unsupported" || this.torchStatus === "denied") return false;
    const run = ++this.pulseRun;
    let stream: MediaStream | null = null;
    let track: MediaStreamTrack | null = null;
    try {
      const camera = await this.openRearCamera();
      stream = camera.stream;
      track = camera.track;
      if (!track || !camera.hasTorch) {
        this.setTorchStatus("unsupported");
        return false;
      }
      this.setTorchStatus("ready");
      const pulseCount = Math.max(2, Math.min(5, Math.round(duration / 380)));
      for (let index = 0; index < pulseCount && run === this.pulseRun; index += 1) {
        await this.setTorch(track, true);
        await wait(105);
        await this.setTorch(track, false);
        if (index < pulseCount - 1) await wait(170);
      }
      return true;
    } catch (error) {
      this.setTorchStatus(this.classifyError(error));
      return false;
    } finally {
      if (track?.readyState === "live") await this.setTorch(track, false).catch(() => undefined);
      this.stopStream(stream);
    }
  }
}

export const deviceEffects = new DeviceEffects();
