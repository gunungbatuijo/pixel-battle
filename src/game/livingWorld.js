// Animated pixel-art crowds + background creatures, themed per stage.
const CANVAS_W = 800;
const GROUND_Y = 380;

const CROWD_COLS = ["#2a2422", "#3a2a2a", "#2a2a3a", "#3a3a2a", "#2a3a3a", "#3a2a3a", "#2a2418", "#322a30", "#4a2a1a", "#2a3a4a", "#3a2434", "#2a342a"];
const SKINS = ["#d8a878", "#c89060", "#e0b890", "#a87850", "#b89070", "#9a6848", "#d8b898", "#b08058"];
const HAIR_COLS = ["#1a1208", "#2a1a0a", "#3a2a14", "#5a3a1a", "#7a5a2a", "#1a1a1a", "#4a3020", "#8a6a3a", "#5a2010", "#2a2a2a"];

function darken(hex, f = 0.7) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgb(${Math.round(((n >> 16) & 255) * f)},${Math.round(((n >> 8) & 255) * f)},${Math.round((n & 255) * f)})`;
}
function rect(ctx, x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
const FLAG_COLS = ["#c8302a", "#2a6a8a", "#5a8a3a", "#e8a040", "#8a4a8a", "#d8d0c0"];
const BUTTERFLY_COLS = ["#e8a0e8", "#f0d060", "#5ac8e8", "#f08060", "#a0e8a0", "#e860a0"];
const DEBRIS_COLS = ["#c8302a", "#e8a040", "#d8d0c0", "#5a8a3a", "#8a4a8a"];

export class LivingWorld {
  constructor(stage) {
    this.stage = stage;
    this.crowd = []; this.back = []; this.air = []; this.ground = []; this.water = []; this.debris = [];
    this.excited = 0;
    this._build();
  }

  _build() {
    const id = this.stage.id;
    const dense = ["street", "alley", "market", "bridge", "station", "subway"];
    const sparse = ["rooftop", "harbor", "beach", "dojo", "temple", "forest", "canyon", "oasis", "snowvillage", "cemetery", "construction", "warehouse", "sewer", "factory", "volcano", "colosseum", "tower", "swamp", "festival"];
    const count = dense.includes(id) ? 22 : sparse.includes(id) ? 9 : 0;
    for (let i = 0; i < count; i++) {
      const side = i % 2;
      const elevated = Math.random() < 0.22;
      const x = side === 0 ? 6 + Math.random() * 108 : CANVAS_W - 114 + Math.random() * 108;
      this.crowd.push({ x, baseY: GROUND_Y - 2 - (elevated ? 14 : 0), side, phase: Math.random() * 6.28, spd: 0.04 + Math.random() * 0.06, col: CROWD_COLS[i % CROWD_COLS.length], skin: SKINS[i % SKINS.length], hair: HAIR_COLS[i % HAIR_COLS.length], h: 24 + Math.random() * 8, hat: Math.random() < 0.28, arm: 0, jump: 0, duck: 0, flag: Math.random() < 0.16 ? FLAG_COLS[i % FLAG_COLS.length] : null, elevated });
    }
    const backCount = dense.includes(id) ? 16 : sparse.includes(id) ? 7 : 0;
    for (let i = 0; i < backCount; i++) {
      const side = i % 2;
      const x = side === 0 ? 2 + Math.random() * 112 : CANVAS_W - 114 + Math.random() * 112;
      this.back.push({ x, baseY: GROUND_Y - 18, phase: Math.random() * 6.28, spd: 0.03 + Math.random() * 0.04, col: CROWD_COLS[(i + 3) % CROWD_COLS.length], skin: SKINS[(i + 2) % SKINS.length], hair: HAIR_COLS[(i + 5) % HAIR_COLS.length], arm: 0, h: 16 + Math.random() * 4 });
    }
    if (["harbor", "beach", "oasis"].includes(id)) this._addAir("gull", 6);
    if (["cemetery", "factory", "sewer", "temple"].includes(id)) this._addAir("bat", 6);
    if (["cemetery", "factory", "warehouse"].includes(id)) this._addAir("crow", 4);
    if (["street", "market", "station", "subway", "bridge", "rooftop"].includes(id)) this._addAir("pigeon", 5);
    if (["forest", "oasis", "temple", "beach"].includes(id)) this._addAir("butterfly", 6);
    if (["volcano", "swamp", "tower"].includes(id)) this._addAir("bat", 5);
    if (["festival", "colosseum"].includes(id)) this._addAir("pigeon", 4);
    if (["festival", "swamp"].includes(id)) this._addAir("butterfly", 5);
    if (["street", "market", "alley", "station"].includes(id)) this._addDog();
    if (["alley", "rooftop", "warehouse", "market", "harbor"].includes(id)) this._addCat();
    if (["sewer", "factory", "warehouse", "construction", "alley", "subway", "swamp"].includes(id)) { this._addRat(); this._addRat(); }
    if (["harbor", "beach", "oasis"].includes(id)) {
      for (let i = 0; i < 3; i++) this.water.push({ x: 120 + Math.random() * (CANVAS_W - 240), y: GROUND_Y - 2, t: Math.random() * 240, phase: Math.random() * 6.28 });
    }
  }

  _addAir(type, n) {
    for (let i = 0; i < n; i++) {
      const baseY = type === "butterfly" ? 70 + Math.random() * 180 : 30 + Math.random() * 140;
      const sp = type === "butterfly" ? 0.4 + Math.random() * 0.4 : 0.6 + Math.random() * 0.9;
      this.air.push({ type, x: Math.random() * CANVAS_W, y: baseY, baseY, vx: (Math.random() < 0.5 ? -1 : 1) * sp, phase: Math.random() * 6.28, dir: 1, col: type === "butterfly" ? BUTTERFLY_COLS[i % BUTTERFLY_COLS.length] : null });
    }
  }
  _addDog() { this.ground.push({ kind: "dog", x: 120 + Math.random() * 220, y: GROUND_Y - 2, vx: (Math.random() < 0.5 ? -0.5 : 0.6), phase: 0, dir: 1, pause: 0 }); }
  _addCat() { this.ground.push({ kind: "cat", x: 560 + Math.random() * 150, y: GROUND_Y - 2, vx: 0, phase: 0, dir: -1, sit: Math.random() < 0.5 }); }
  _addRat() { this.ground.push({ kind: "rat", x: 80 + Math.random() * 320, y: GROUND_Y - 2, vx: (Math.random() < 0.5 ? -1 : 1), phase: 0, dir: 1, pause: 0 }); }

  update(dt, excited, fighters) {
    this.excited = Math.max(0, excited);
    const fx = fighters && fighters.length ? fighters.map((f) => f.x) : [];
    for (const c of this.back) { c.phase += c.spd * dt; const target = this.excited > 0 ? 1 : 0; c.arm += (target - c.arm) * Math.min(1, 0.07 * dt); }
    for (const c of this.crowd) {
      c.phase += c.spd * dt;
      const target = this.excited > 0 ? 1 : 0;
      c.arm += (target - c.arm) * Math.min(1, 0.08 * dt);
      if (this.excited > 0 && Math.random() < 0.03 * dt) c.jump = 1;
      c.jump = Math.max(0, c.jump - 0.05 * dt);
      let near = 0;
      for (const x of fx) { const d = Math.abs(x - c.x); if (d < 70) near = Math.max(near, (1 - d / 70)); }
      c.duck += (near - c.duck) * Math.min(1, 0.15 * dt);
      if (this.excited > 0 && Math.random() < 0.04 * dt) {
        const dir = c.side === 0 ? 1 : -1;
        this.debris.push({ x: c.x, y: c.baseY - c.h, vx: dir * (1 + Math.random() * 2.5), vy: -3 - Math.random() * 2, life: 50, max: 50, size: 2 + Math.random() * 2, col: DEBRIS_COLS[Math.floor(Math.random() * DEBRIS_COLS.length)] });
      }
    }
    for (const a of this.air) {
      a.phase += dt * 0.3; a.x += a.vx * dt;
      if (a.type === "butterfly") a.y = a.baseY + Math.sin(a.phase * 1.5) * 10; else a.y += Math.sin(a.phase) * 0.5;
      if (a.x < -20) a.x = CANVAS_W + 10;
      if (a.x > CANVAS_W + 20) a.x = -10;
      a.dir = a.vx > 0 ? 1 : -1;
    }
    for (const g of this.ground) {
      g.phase += dt * 0.25;
      if (g.pause > 0) { g.pause -= dt; continue; }
      g.x += g.vx * dt;
      if (g.x < 30 || g.x > CANVAS_W - 30) { g.vx *= -1; g.dir = g.vx > 0 ? 1 : -1; g.pause = 30; }
    }
    for (const f of this.water) { f.t += dt; f.phase += dt * 0.1; }
    for (const d of this.debris) { d.x += d.vx * dt; d.y += d.vy * dt; d.vy += 0.3 * dt; d.life -= dt; if (d.y > GROUND_Y) { d.y = GROUND_Y; d.vy *= -0.3; d.vx *= 0.6; } }
    this.debris = this.debris.filter((d) => d.life > 0);
  }

  drawBack(ctx) {
    for (const f of this.water) this._drawFish(ctx, f);
    ctx.globalAlpha = 0.45;
    for (const c of this.back) this._drawCrowd(ctx, c, true);
    ctx.globalAlpha = 1;
    for (const d of this.debris) { ctx.globalAlpha = Math.max(0, d.life / d.max); ctx.fillStyle = d.col; ctx.fillRect(Math.round(d.x), Math.round(d.y), d.size, d.size); }
    ctx.globalAlpha = 1;
    for (const c of this.crowd) this._drawCrowd(ctx, c, false);
    for (const g of this.ground) { if (g.kind === "dog") this._drawDog(ctx, g); else if (g.kind === "cat") this._drawCat(ctx, g); else if (g.kind === "rat") this._drawRat(ctx, g); }
    for (const a of this.air) { if (a.type === "butterfly") this._drawButterfly(ctx, a); else if (a.type === "bat") this._drawBat(ctx, a); else this._drawBird(ctx, a); }
  }

  _drawCrowd(ctx, c, back) {
    const bob = Math.sin(c.phase) * (back ? 0.9 : 1.5);
    const jumpOff = (c.jump || 0) * 7;
    const duckOff = (c.duck || 0) * 9;
    const y = c.baseY + bob - jumpOff + duckOff;
    const h = c.h - duckOff * 0.5;
    const x = Math.round(c.x);
    const shirt = c.col;
    const shirtShade = darken(shirt, 0.62);
    const pants = darken(shirt, 0.45);
    const skin = c.skin;
    const skinShade = darken(skin, 0.72);
    const hair = c.hair || "#2a1a0a";
    const bw = back ? 3 : 4;
    if (!back) { ctx.globalAlpha = 0.3; ctx.fillStyle = "#000"; ctx.beginPath(); ctx.ellipse(x, c.baseY + 1, 7, 2.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; }
    if (!back && c.elevated) { rect(ctx, x - 5, c.baseY, 10, 14, "#5a3a1a"); rect(ctx, x - 5, c.baseY, 10, 2, "#3a2410"); }
    const legH = Math.round(h * 0.42);
    rect(ctx, x - 4, y - legH, 3, legH, pants);
    rect(ctx, x + 1, y - legH, 3, legH, pants);
    rect(ctx, x - 5, y - 2, 4, 2, "#1a1008");
    rect(ctx, x + 1, y - 2, 4, 2, "#1a1008");
    const torsoH = Math.round(h * 0.55);
    const torsoY = Math.round(y - h);
    rect(ctx, x - bw, torsoY, bw * 2, torsoH, shirt);
    rect(ctx, x + bw - 3, torsoY, 3, torsoH, shirtShade);
    ctx.fillStyle = "rgba(255,255,255,0.14)"; ctx.fillRect(x - bw + 1, torsoY, 2, torsoH);
    const up = c.arm;
    ctx.fillStyle = skin;
    if (up > 0.1) { const raise = up * 10; ctx.fillRect(x - bw - 2, torsoY - raise, 2, 8 + raise); ctx.fillRect(x + bw, torsoY - raise, 2, 8 + raise); ctx.fillRect(x - bw - 2, torsoY - raise - 1, 2, 2); ctx.fillRect(x + bw, torsoY - raise - 1, 2, 2); }
    else { ctx.fillRect(x - bw - 2, torsoY + 2, 2, 9); ctx.fillRect(x + bw, torsoY + 2, 2, 9); }
    const headH = back ? 5 : 7;
    const headY = torsoY - headH;
    rect(ctx, x - 3, headY, 6, headH, skin);
    rect(ctx, x - 3, headY + headH - 2, 6, 2, skinShade);
    rect(ctx, x - 3, headY - 2, 6, 3, hair);
    rect(ctx, x - 3, headY, 2, 3, hair);
    if (c.hat) { rect(ctx, x - 4, headY - 3, 8, 3, "#1a1a1a"); rect(ctx, x - 5, headY - 1, 10, 1, "#1a1a1a"); }
    if (!back && c.flag) { rect(ctx, x + 3, headY - 12, 1, 14, "#3a2a1a"); const wave = Math.sin(c.phase * 3) * 2; rect(ctx, x + 4, headY - 12 + wave, 8, 6, c.flag); }
  }

  _drawBird(ctx, a) {
    const flap = Math.sin(a.phase * 2) * 3;
    ctx.fillStyle = a.type === "gull" ? "#d8d8d0" : a.type === "crow" ? "#1a1a1a" : "#8a8a80";
    ctx.save(); ctx.translate(Math.round(a.x), Math.round(a.y)); ctx.scale(a.dir, 1);
    ctx.fillRect(-3, -1, 6, 3);
    ctx.beginPath(); ctx.moveTo(-3, 0); ctx.lineTo(-9, -3 - flap); ctx.lineTo(-3, 1); ctx.moveTo(3, 0); ctx.lineTo(9, -3 - flap); ctx.lineTo(3, 1); ctx.fill();
    ctx.restore();
  }
  _drawBat(ctx, a) {
    const flap = Math.sin(a.phase * 3) * 3;
    ctx.fillStyle = "#1a0a1a";
    ctx.save(); ctx.translate(Math.round(a.x), Math.round(a.y)); ctx.scale(a.dir, 1);
    ctx.fillRect(-2, -1, 4, 3);
    ctx.beginPath(); ctx.moveTo(-2, 0); ctx.lineTo(-9, -2 - flap); ctx.lineTo(-5, 2); ctx.lineTo(-2, 1); ctx.moveTo(2, 0); ctx.lineTo(9, -2 - flap); ctx.lineTo(5, 2); ctx.lineTo(2, 1); ctx.fill();
    ctx.restore();
  }
  _drawButterfly(ctx, a) {
    const flap = Math.abs(Math.sin(a.phase * 4));
    const w = 4 + flap * 3;
    ctx.save(); ctx.translate(Math.round(a.x), Math.round(a.y)); ctx.scale(a.dir, 1);
    ctx.fillStyle = a.col; ctx.fillRect(-w - 1, -1, w, 3); ctx.fillRect(1, -1, w, 3);
    ctx.fillStyle = "#1a1a1a"; ctx.fillRect(-1, -1, 2, 3);
    ctx.restore();
  }
  _drawDog(ctx, a) {
    const x = Math.round(a.x), y = Math.round(a.y);
    const step = Math.sin(a.phase * 4) * 1;
    ctx.fillStyle = "#5a3a1a"; ctx.fillRect(x - 8, y - 10, 16, 8); ctx.fillRect(x + (a.dir > 0 ? 6 : -12), y - 8, 6, 6);
    ctx.fillRect(x - 7, y - 2 + step, 2, 4); ctx.fillRect(x + 5, y - 2 - step, 2, 4);
    ctx.fillStyle = "#1a1a1a"; ctx.fillRect(x + (a.dir > 0 ? 9 : -9), y - 2, 2, 2);
  }
  _drawCat(ctx, a) {
    const x = Math.round(a.x), y = Math.round(a.y);
    ctx.fillStyle = "#2a2a2a";
    if (a.sit) { ctx.fillRect(x - 5, y - 9, 10, 9); ctx.fillRect(x - 3, y - 14, 6, 6); ctx.fillRect(x - 3, y - 16, 2, 2); ctx.fillRect(x + 1, y - 16, 2, 2); ctx.fillRect(x + 4, y - 12, 2, 6); }
    else { ctx.fillRect(x - 6, y - 6, 12, 5); ctx.fillRect(x - 4, y - 10, 5, 5); ctx.fillRect(x - 7, y - 2, 2, 3); ctx.fillRect(x + 5, y - 2, 2, 3); }
  }
  _drawRat(ctx, a) {
    const x = Math.round(a.x), y = Math.round(a.y);
    ctx.fillStyle = "#3a2a2a"; ctx.fillRect(x - 4, y - 4, 8, 4); ctx.fillRect(x + (a.dir > 0 ? 3 : -7), y - 4, 4, 3); ctx.fillRect(x + (a.dir > 0 ? -4 : 0), y - 3, 4, 1);
  }
  _drawFish(ctx, f) {
    const cyc = (f.t % 240) / 240;
    if (cyc > 0.85) {
      const j = (cyc - 0.85) / 0.15;
      const arc = Math.sin(j * Math.PI);
      const y = f.y - arc * 22;
      ctx.fillStyle = "#5a8aa0"; ctx.fillRect(Math.round(f.x - 5), Math.round(y), 10, 4);
      ctx.fillStyle = "#3a6a8a"; ctx.fillRect(Math.round(f.x - 5), Math.round(y), 10, 1); ctx.fillRect(Math.round(f.x + 4), Math.round(y + 1), 3, 2);
      if (j < 0.12 || j > 0.88) { ctx.fillStyle = "rgba(200,220,230,0.5)"; ctx.fillRect(Math.round(f.x - 6), Math.round(f.y - 1), 12, 2); }
    } else {
      ctx.fillStyle = "rgba(90,138,160,0.4)"; ctx.fillRect(Math.round(f.x - 3), Math.round(f.y - 1), 6, 1);
    }
  }
}
