// Tiny procedural audio engine — no external assets.
export class AudioEngine {
  constructor() {
    this.ctx = null
    this.master = null
    this.muted = false
    this.crowdGain = null
    this.crowdTarget = 0.12
    this.started = false
  }

  init() {
    if (this.ctx) return
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    this.ctx = new AC()
    this.master = this.ctx.createGain()
    this.master.gain.value = this.muted ? 0 : 0.85
    this.master.connect(this.ctx.destination)
    this.buildCrowd()
    this.started = true
  }

  resume() {
    if (!this.ctx) this.init()
    if (this.ctx?.state === 'suspended') this.ctx.resume()
  }

  setMuted(m) {
    this.muted = m
    if (this.master) this.master.gain.setTargetAtTime(m ? 0 : 0.85, this.ctx.currentTime, 0.05)
  }

  buildCrowd() {
    const ctx = this.ctx
    const len = ctx.sampleRate * 3
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let last = 0
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1
      last = (last + 0.02 * white) / 1.02
      data[i] = last * 3.2
    }
    const src = ctx.createBufferSource()
    src.buffer = buffer
    src.loop = true
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 900
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 620
    bp.Q.value = 0.4
    const g = ctx.createGain()
    g.gain.value = 0.1
    src.connect(lp).connect(bp).connect(g).connect(this.master)
    src.start()
    this.crowdGain = g
    this.crowdBuf = buffer
    this.crowdSrc = src
  }

  crowd(level, time = 0.6) {
    if (!this.crowdGain) return
    this.crowdGain.gain.setTargetAtTime(level, this.ctx.currentTime, time)
  }

  noiseBurst({ dur = 0.18, freq = 900, q = 0.8, gain = 0.4, type = 'bandpass', slide = 0 } = {}) {
    if (!this.ctx) return
    const ctx = this.ctx
    const t = ctx.currentTime
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur))
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len)
    const src = ctx.createBufferSource()
    src.buffer = buf
    const f = ctx.createBiquadFilter()
    f.type = type
    f.frequency.setValueAtTime(freq, t)
    if (slide) f.frequency.exponentialRampToValueAtTime(Math.max(60, freq + slide), t + dur)
    f.Q.value = q
    const g = ctx.createGain()
    g.gain.setValueAtTime(gain, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + dur)
    src.connect(f).connect(g).connect(this.master)
    src.start(t)
  }

  tone({ freq = 220, dur = 0.2, gain = 0.25, type = 'sine', slide = 0, delay = 0 } = {}) {
    if (!this.ctx) return
    const ctx = this.ctx
    const t = ctx.currentTime + delay
    const o = ctx.createOscillator()
    o.type = type
    o.frequency.setValueAtTime(freq, t)
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), t + dur)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(gain, t + 0.012)
    g.gain.exponentialRampToValueAtTime(0.001, t + dur)
    o.connect(g).connect(this.master)
    o.start(t)
    o.stop(t + dur + 0.05)
  }

  whoosh(power = 1) {
    this.noiseBurst({ dur: 0.13 + 0.05 * power, freq: 700 + 500 * power, q: 1.2, gain: 0.16 + 0.1 * power, slide: -400 })
  }

  impact(power = 1, blocked = false) {
    if (blocked) {
      this.tone({ freq: 160, dur: 0.09, gain: 0.2, type: 'square', slide: -60 })
      this.noiseBurst({ dur: 0.06, freq: 1800, q: 0.7, gain: 0.12 })
      return
    }
    this.tone({ freq: 110 - 20 * power, dur: 0.16 + 0.08 * power, gain: 0.34, type: 'sine', slide: -70 })
    this.noiseBurst({ dur: 0.11, freq: 420, q: 0.6, gain: 0.24 + 0.14 * power, slide: -260 })
    if (power > 0.8) this.tone({ freq: 70, dur: 0.3, gain: 0.28, type: 'triangle', slide: -30 })
  }

  bell(times = 1) {
    for (let i = 0; i < times; i++) {
      const d = i * 0.42
      this.tone({ freq: 1180, dur: 0.5, gain: 0.16, type: 'sine', delay: d })
      this.tone({ freq: 1770, dur: 0.35, gain: 0.09, type: 'sine', delay: d })
      this.tone({ freq: 2360, dur: 0.22, gain: 0.05, type: 'sine', delay: d })
    }
  }

  cheer(intensity = 1) {
    this.noiseBurst({ dur: 0.5 + intensity * 0.9, freq: 900, q: 0.35, gain: 0.12 + 0.16 * intensity, type: 'bandpass', slide: 700 })
    this.noiseBurst({ dur: 0.35, freq: 2400, q: 0.5, gain: 0.05 + 0.08 * intensity })
  }

  boo() {
    this.tone({ freq: 120, dur: 0.7, gain: 0.07, type: 'sawtooth', slide: -40 })
    this.noiseBurst({ dur: 0.7, freq: 300, q: 0.4, gain: 0.08, slide: -120 })
  }

  ui() {
    this.tone({ freq: 520, dur: 0.05, gain: 0.08, type: 'triangle', slide: 120 })
  }

  select() {
    this.tone({ freq: 330, dur: 0.09, gain: 0.1, type: 'triangle', slide: 160 })
    this.tone({ freq: 660, dur: 0.1, gain: 0.06, type: 'sine', slide: 200, delay: 0.04 })
  }

  heartbeat() {
    this.tone({ freq: 62, dur: 0.16, gain: 0.3, type: 'sine', slide: -18 })
    this.tone({ freq: 55, dur: 0.2, gain: 0.22, type: 'sine', slide: -14, delay: 0.19 })
  }

  slowmo() {
    this.tone({ freq: 400, dur: 1.1, gain: 0.08, type: 'sawtooth', slide: -330 })
  }
}

export const audio = new AudioEngine()
