// Retro arcade sound effects synthesized via Web Audio API.
let ctx = null;
let masterGain = null;

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = getVolume();
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  masterGain.gain.value = getVolume();
  return ctx;
}

export function getVolume() {
  return parseInt(localStorage.getItem("pb_volume") || "70", 10) / 100;
}

export function setVolumeNode() {
  if (masterGain) masterGain.gain.value = getVolume();
}

function noiseBuffer(c, dur) {
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

function tone(c, freq, dur, type = "sine", vol = 0.4, slideTo = null, delay = 0) {
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function noise(c, dur, vol = 0.3, filterFreq = 1000, delay = 0) {
  const t0 = c.currentTime + delay;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, dur);
  const filt = c.createBiquadFilter();
  filt.type = "lowpass";
  filt.frequency.value = filterFreq;
  const g = c.createGain();
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  src.connect(filt);
  filt.connect(g);
  g.connect(masterGain);
  src.start(t0);
  src.stop(t0 + dur + 0.02);
}

export const sfx = {
  hit() {
    const c = getCtx(); if (!c) return;
    noise(c, 0.12, 0.4, 900);
    tone(c, 90, 0.15, "sawtooth", 0.3, 40);
  },
  skill() {
    const c = getCtx(); if (!c) return;
    tone(c, 300, 0.18, "sawtooth", 0.25, 600);
    noise(c, 0.15, 0.3, 1500, 0.02);
    tone(c, 80, 0.25, "square", 0.3, 50, 0.05);
  },
  block() {
    const c = getCtx(); if (!c) return;
    tone(c, 800, 0.06, "square", 0.2, 1200);
    noise(c, 0.05, 0.15, 3000);
  },
  ko() {
    const c = getCtx(); if (!c) return;
    tone(c, 400, 0.5, "sawtooth", 0.35, 80);
    noise(c, 0.3, 0.3, 600, 0.1);
    tone(c, 60, 0.6, "sine", 0.3, 30, 0.2);
  },
  jump() {
    const c = getCtx(); if (!c) return;
    tone(c, 220, 0.12, "square", 0.18, 440);
  },
  dash() {
    const c = getCtx(); if (!c) return;
    noise(c, 0.14, 0.25, 2500);
  },
  round() {
    const c = getCtx(); if (!c) return;
    tone(c, 523, 0.12, "square", 0.25);
    tone(c, 659, 0.12, "square", 0.25, null, 0.12);
    tone(c, 784, 0.2, "square", 0.3, null, 0.24);
  },
  fight() {
    const c = getCtx(); if (!c) return;
    tone(c, 784, 0.12, "square", 0.3);
    tone(c, 1047, 0.3, "square", 0.35, null, 0.1);
  },
  win() {
    const c = getCtx(); if (!c) return;
    [523, 659, 784, 1047].forEach((f, i) => tone(c, f, 0.18, "square", 0.3, null, i * 0.12));
  },
  lose() {
    const c = getCtx(); if (!c) return;
    [440, 392, 330, 262].forEach((f, i) => tone(c, f, 0.2, "sawtooth", 0.3, null, i * 0.14));
  }
};
