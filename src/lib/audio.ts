type SoundName = "tap" | "draw" | "flip" | "shake" | "settle" | "open" | "close";

class SoundEngine {
  private context: AudioContext | null = null;

  private playDiceShake(context: AudioContext, now: number, volume: number, requestedDuration = 2) {
    const duration = Math.max(0.18, requestedDuration);
    const master = context.createGain();
    const compressor = context.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-18, now);
    compressor.knee.setValueAtTime(14, now);
    compressor.ratio.setValueAtTime(5, now);
    compressor.attack.setValueAtTime(0.003, now);
    compressor.release.setValueAtTime(0.12, now);
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume * 0.62), now + 0.018);
    master.gain.setValueAtTime(Math.max(0.0001, volume * 0.58), now + Math.max(0.06, duration - 0.28));
    master.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    master.connect(compressor).connect(context.destination);

    // A quiet, pulsing scrape gives the cup some physical body between impacts.
    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      const seconds = i / context.sampleRate;
      const edgeFade = Math.min(1, seconds / 0.025, (duration - seconds) / 0.08);
      const movement = Math.pow(Math.abs(Math.sin(seconds * Math.PI * 13.6)), 5);
      data[i] = (Math.random() * 2 - 1) * (0.035 + movement * 0.2) * Math.max(0, edgeFade);
    }
    const scrape = context.createBufferSource();
    const scrapeBand = context.createBiquadFilter();
    const scrapeCeiling = context.createBiquadFilter();
    scrapeBand.type = "bandpass";
    scrapeBand.frequency.setValueAtTime(980, now);
    scrapeBand.Q.setValueAtTime(0.72, now);
    scrapeCeiling.type = "lowpass";
    scrapeCeiling.frequency.setValueAtTime(3600, now);
    scrape.buffer = buffer;
    scrape.connect(scrapeBand).connect(scrapeCeiling).connect(master);
    scrape.start(now);
    scrape.stop(now + duration);

    // Alternating, slightly irregular impacts mimic five dice striking opposite cup walls.
    const impactCount = Math.max(2, Math.floor((duration - 0.035) / 0.082));
    const impacts = Array.from({ length: impactCount }, (_, index) => 0.025 + index * 0.082);
    impacts.forEach((offset, index) => {
      const hitAt = now + offset + (Math.random() - 0.5) * 0.014;
      const side = index % 2 === 0 ? -0.62 : 0.62;
      const panner = context.createStereoPanner();
      panner.pan.setValueAtTime(side, hitAt);
      panner.connect(master);

      const dieImpact = context.createOscillator();
      const dieGain = context.createGain();
      const startFrequency = 1050 + Math.random() * 420;
      dieImpact.type = index % 3 === 0 ? "square" : "triangle";
      dieImpact.frequency.setValueAtTime(startFrequency, hitAt);
      dieImpact.frequency.exponentialRampToValueAtTime(260 + Math.random() * 120, hitAt + 0.045);
      dieGain.gain.setValueAtTime(0.0001, hitAt);
      dieGain.gain.exponentialRampToValueAtTime(0.22 + Math.random() * 0.08, hitAt + 0.002);
      dieGain.gain.exponentialRampToValueAtTime(0.0001, hitAt + 0.052);
      dieImpact.connect(dieGain).connect(panner);
      dieImpact.start(hitAt);
      dieImpact.stop(hitAt + 0.055);

      const cupImpact = context.createOscillator();
      const cupGain = context.createGain();
      cupImpact.type = "sine";
      cupImpact.frequency.setValueAtTime(145 + Math.random() * 34, hitAt);
      cupImpact.frequency.exponentialRampToValueAtTime(72, hitAt + 0.075);
      cupGain.gain.setValueAtTime(0.0001, hitAt);
      cupGain.gain.exponentialRampToValueAtTime(0.13, hitAt + 0.004);
      cupGain.gain.exponentialRampToValueAtTime(0.0001, hitAt + 0.085);
      cupImpact.connect(cupGain).connect(panner);
      cupImpact.start(hitAt);
      cupImpact.stop(hitAt + 0.09);
    });
  }

  private ensureContext() {
    const AudioContextClass = window.AudioContext ??
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    this.context ??= new AudioContextClass();
    if (this.context.state === "suspended") void this.context.resume();
    return this.context;
  }

  play(name: SoundName, volume: number, shakeDuration?: number) {
    if (volume <= 0) return;
    const context = this.ensureContext();
    if (!context) return;
    const now = context.currentTime;

    if (name === "shake") {
      this.playDiceShake(context, now, volume, shakeDuration);
      return;
    }

    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume * 0.13), now + 0.012);
    const durations: Record<Exclude<SoundName, "shake">, number> = {
      tap: 0.08, draw: 0.18, flip: 0.12, settle: 0.22, open: 0.28, close: 0.2,
    };
    const duration = durations[name];
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    gain.connect(context.destination);

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
