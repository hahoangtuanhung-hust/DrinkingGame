type SoundName = "tap" | "draw" | "flip" | "shake" | "settle" | "open" | "close";

class SoundEngine {
  private context: AudioContext | null = null;

  private ensureContext() {
    const AudioContextClass = window.AudioContext ??
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    this.context ??= new AudioContextClass();
    if (this.context.state === "suspended") void this.context.resume();
    return this.context;
  }

  play(name: SoundName, volume: number) {
    if (volume <= 0) return;
    const context = this.ensureContext();
    if (!context) return;
    const now = context.currentTime;
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume * 0.13), now + 0.012);
    const durations: Record<SoundName, number> = {
      tap: 0.08, draw: 0.18, flip: 0.12, shake: 0.56, settle: 0.22, open: 0.28, close: 0.2,
    };
    const duration = durations[name];
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    gain.connect(context.destination);

    if (name === "shake") {
      const buffer = context.createBuffer(1, context.sampleRate * duration, context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) {
        data[i] = (Math.random() * 2 - 1) * (Math.sin(i * 0.09) > 0.35 ? 1 : 0.2);
      }
      const noise = context.createBufferSource();
      const filter = context.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 720;
      noise.buffer = buffer;
      noise.connect(filter).connect(gain);
      noise.start(now);
      return;
    }

    const oscillator = context.createOscillator();
    const frequencies: Record<Exclude<SoundName, "shake">, number> = {
      tap: 180, draw: 240, flip: 420, settle: 120, open: 310, close: 170,
    };
    oscillator.type = name === "settle" ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(frequencies[name], now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(60, frequencies[name] * 0.55), now + duration);
    oscillator.connect(gain);
    oscillator.start(now);
    oscillator.stop(now + duration);
  }
}

export const soundEngine = new SoundEngine();
