// Tiny WebAudio synth SFX
let ac = null;
let master = null;
let enabled = true;

function ensure() {
  if (ac) return ac;
  try {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    master = ac.createGain();
    master.gain.value = 0.32;
    master.connect(ac.destination);
  } catch { ac = null; }
  return ac;
}

export function setAudioEnabled(v) {
  enabled = v;
  if (master) master.gain.value = v ? 0.32 : 0;
}

export function isAudioEnabled() { return enabled; }

export function resumeAudio() {
  const a = ensure();
  if (a && a.state === 'suspended') a.resume();
}

function tone(freq, dur, type = 'sine', vol = 0.5, slide = 0) {
  if (!enabled) return;
  const a = ensure(); if (!a) return;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, a.currentTime);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), a.currentTime + dur);
  g.gain.setValueAtTime(vol, a.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + dur);
  o.connect(g); g.connect(master);
  o.start(); o.stop(a.currentTime + dur + 0.02);
}

function noise(dur, vol = 0.4, filterFreq = 900) {
  if (!enabled) return;
  const a = ensure(); if (!a) return;
  const len = Math.floor(a.sampleRate * dur);
  const buf = a.createBuffer(1, len, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = a.createBufferSource(); src.buffer = buf;
  const f = a.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = filterFreq;
  const g = a.createGain(); g.gain.value = vol;
  src.connect(f); f.connect(g); g.connect(master);
  src.start();
}

export const sfx = {
  click() { tone(520, 0.05, 'square', 0.12); },
  shoot(kind = 'pistol') {
    if (kind === 'shotgun') { noise(0.22, 0.8, 700); tone(90, 0.18, 'sawtooth', 0.5, -40); }
    else if (kind === 'smg') { noise(0.07, 0.4, 1500); tone(220, 0.05, 'square', 0.25, -80); }
    else { noise(0.1, 0.55, 1200); tone(160, 0.09, 'square', 0.3, -70); }
  },
  buy() { tone(660, 0.08, 'sine', 0.3); setTimeout(() => tone(880, 0.12, 'sine', 0.3), 70); },
  error() { tone(180, 0.16, 'square', 0.2, -50); },
  pickup() { tone(700, 0.07, 'triangle', 0.25); setTimeout(() => tone(1050, 0.1, 'triangle', 0.25), 60); },
  chat() { tone(900, 0.045, 'sine', 0.08); },
  notify() { tone(520, 0.09, 'sine', 0.18); setTimeout(() => tone(780, 0.13, 'sine', 0.16), 80); },
  horn() { tone(380, 0.3, 'square', 0.16); tone(480, 0.3, 'square', 0.12); },
  siren() { tone(760, 0.3, 'sine', 0.18, 200); setTimeout(() => tone(960, 0.3, 'sine', 0.18, -200), 300); },
  heal() { tone(520, 0.1, 'sine', 0.2); setTimeout(() => tone(660, 0.1, 'sine', 0.2), 90); setTimeout(() => tone(880, 0.18, 'sine', 0.2), 180); },
  job() { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.16, 'triangle', 0.22), i * 95)); },
  crash() { noise(0.16, 0.5, 500); },
  enterCar() { tone(140, 0.08, 'square', 0.2); setTimeout(() => tone(90, 0.1, 'square', 0.18), 70); },
  levelUp() { [523, 659, 784, 1046, 1318].forEach((f, i) => setTimeout(() => tone(f, 0.2, 'sine', 0.25), i * 100)); },
};
