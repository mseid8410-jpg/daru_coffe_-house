/**
 * Procedural Web Audio API sound generator for Daru Coffee House 3D Ceremony.
 * Zero external audio files (100% offline, zero 404 dependencies).
 */

class CeremonyAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private pourGain: GainNode | null = null;
  private crackleInterval: number | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopPourSound();
      this.stopRoastCrackle();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Procedural liquid pouring sound (water stream into porcelain sini cup)
   */
  public startPourSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || this.pourGain) return;

    // Buffer of white noise filtered through resonant bandpass to simulate bubbling stream
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Filter 1: Low-pass body
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    // Subtle LFO to simulate stream fluctuation
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(4, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(150, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    this.pourGain = this.ctx.createGain();
    this.pourGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.pourGain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.3);

    noise.connect(filter);
    filter.connect(this.pourGain);
    this.pourGain.connect(this.ctx.destination);
    noise.start();
  }

  public stopPourSound() {
    if (this.pourGain && this.ctx) {
      try {
        this.pourGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
        const gainToClean = this.pourGain;
        setTimeout(() => {
          gainToClean.disconnect();
        }, 250);
      } catch {
        // ignore
      }
      this.pourGain = null;
    }
  }

  /**
   * Procedural roasting bean crackle
   */
  public startRoastCrackle() {
    if (this.isMuted || this.crackleInterval !== null) return;
    this.initCtx();

    this.crackleInterval = window.setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      if (Math.random() > 0.4) {
        this.playPop();
      }
    }, 180);
  }

  public stopRoastCrackle() {
    if (this.crackleInterval !== null) {
      clearInterval(this.crackleInterval);
      this.crackleInterval = null;
    }
  }

  private playPop() {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const freq = 350 + Math.random() * 600;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  /**
   * Harmonious brass ceremonial chime for round transitions
   */
  public playChime(pitch: number = 523.25) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 1.2);
  }
}

export const ceremonyAudio = new CeremonyAudioEngine();
