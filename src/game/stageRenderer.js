// Pixel-art stage renderer. Each stage gets its own detailed scenery.
const W = 800;
const GROUND_Y = 380;

function rect(ctx, x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }

function contactShadow(ctx, x, baseY, w, intensity = 0.4) {
  const g = ctx.createRadialGradient(x + w / 2, baseY, 1, x + w / 2, baseY, w);
  g.addColorStop(0, `rgba(0,0,0,${intensity})`);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(x + w / 2, baseY, w, 4, 0, 0, Math.PI * 2);
  ctx.fill();
}

function bricks(ctx, x, y, w, h, base, shade, mortar) {
  rect(ctx, x, y, w, h, base);
  ctx.fillStyle = shade;
  for (let r = 0; r < Math.floor(h / 12); r++) {
    const off = r % 2 === 0 ? 0 : 16;
    for (let c = 0; c < Math.floor(w / 32) + 1; c++) {
      ctx.fillRect(x + c * 32 + off - 16, y + r * 12 + 11, 30, 1);
      ctx.fillRect(x + c * 32 + off, y + r * 12, 1, 11);
    }
  }
  ctx.fillStyle = mortar;
  for (let r = 0; r < Math.floor(h / 12); r++) ctx.fillRect(x, y + r * 12, w, 1);
}

function windows(ctx, x, y, w, h, lit, cols, rows) {
  const cw = (w - (cols + 1) * 4) / cols;
  const rh = (h - (rows + 1) * 4) / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const wx = x + 4 + c * (cw + 4);
      const wy = y + 4 + r * (rh + 4);
      const on = ((c * 7 + r * 13) % 5) !== 0;
      rect(ctx, wx, wy, cw, rh, "#1a1410");
      rect(ctx, wx + 1, wy + 1, cw - 2, rh - 2, on ? lit : "#2a2520");
    }
  }
}

function drawCar(ctx, x, base, color) {
  const w = 92;
  contactShadow(ctx, x - 6, base, w + 12, 0.4);
  rect(ctx, x, base - 22, w, 22, color);
  rect(ctx, x, base - 22, w, 4, "rgba(0,0,0,0.4)");
  rect(ctx, x + 14, base - 36, w - 28, 16, color);
  rect(ctx, x + 14, base - 36, w - 28, 3, "rgba(0,0,0,0.5)");
  const ww = (w - 36) / 2 - 1;
  rect(ctx, x + 18, base - 33, ww, 11, "#1a2a3a");
  rect(ctx, x + 19 + ww, base - 33, ww, 11, "#1a2a3a");
  rect(ctx, x + 18 + ww, base - 33, 2, 11, color);
  rect(ctx, x + 6, base - 4, 16, 8, "#14140f");
  rect(ctx, x + w - 22, base - 4, 16, 8, "#14140f");
  rect(ctx, x + 7, base - 10, 4, 4, "#3a3a30");
  rect(ctx, x + w - 23, base - 10, 4, 4, "#3a3a30");
  rect(ctx, x + w - 5, base - 16, 4, 5, "#fff3a0");
  rect(ctx, x + 1, base - 16, 3, 5, "#c8302a");
}

function drawTruck(ctx, x, base, cabColor) {
  const w = 132;
  contactShadow(ctx, x - 8, base, w + 16, 0.42);
  rect(ctx, x, base - 34, 42, 34, cabColor);
  rect(ctx, x, base - 34, 42, 4, "rgba(0,0,0,0.5)");
  rect(ctx, x + 4, base - 30, 34, 18, "#1a2a3a");
  rect(ctx, x + 4, base - 30, 34, 3, "rgba(255,255,255,0.15)");
  rect(ctx, x + 42, base - 46, w - 42, 46, "#c8c0b0");
  rect(ctx, x + 42, base - 46, w - 42, 4, "rgba(0,0,0,0.5)");
  for (let i = 1; i < 4; i++) rect(ctx, x + 42 + Math.floor(i * (w - 42) / 4), base - 46, 2, 46, "#9a9280");
  rect(ctx, x + 8, base - 6, 16, 8, "#14140f");
  rect(ctx, x + w - 50, base - 6, 16, 8, "#14140f");
  rect(ctx, x + w - 26, base - 6, 16, 8, "#14140f");
  rect(ctx, x, base - 14, 4, 5, "#fff3a0");
}

function drawDumpster(ctx, x, base, color) {
  contactShadow(ctx, x - 6, base, 68, 0.42);
  rect(ctx, x, base - 30, 56, 30, color);
  rect(ctx, x, base - 30, 56, 4, "rgba(0,0,0,0.4)");
  rect(ctx, x, base - 34, 56, 5, "#3a3a30");
  rect(ctx, x + 6, base - 26, 44, 4, "rgba(0,0,0,0.3)");
  rect(ctx, x + 6, base - 18, 44, 4, "rgba(0,0,0,0.3)");
  rect(ctx, x + 6, base - 10, 44, 4, "rgba(0,0,0,0.3)");
  rect(ctx, x + 8, base - 4, 6, 4, "#1a1a1a");
  rect(ctx, x + 42, base - 4, 6, 4, "#1a1a1a");
}

function drawBarrel(ctx, x, base, color) {
  contactShadow(ctx, x - 4, base, 26, 0.4);
  rect(ctx, x, base - 26, 18, 26, color);
  rect(ctx, x, base - 26, 18, 3, "rgba(0,0,0,0.4)");
  rect(ctx, x, base - 3, 18, 3, "rgba(0,0,0,0.4)");
  rect(ctx, x, base - 18, 18, 2, "rgba(0,0,0,0.3)");
  rect(ctx, x, base - 10, 18, 2, "rgba(0,0,0,0.3)");
  rect(ctx, x + 14, base - 26, 4, 26, "rgba(0,0,0,0.25)");
}

function drawForklift(ctx, x, base, color) {
  contactShadow(ctx, x - 5, base, 50, 0.42);
  rect(ctx, x, base - 30, 40, 30, color);
  rect(ctx, x, base - 30, 40, 4, "rgba(0,0,0,0.4)");
  rect(ctx, x + 4, base - 26, 24, 16, "#1a2a3a");
  rect(ctx, x + 30, base - 44, 4, 44, "#3a3a30");
  rect(ctx, x + 22, base - 44, 14, 4, "#3a3a30");
  rect(ctx, x + 6, base - 6, 14, 6, "#14140f");
  rect(ctx, x + 26, base - 6, 10, 6, "#14140f");
}

function sky(ctx, stage, h = GROUND_Y) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, stage.sky[0]);
  g.addColorStop(1, stage.sky[1]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, h);
}

function drawLightShafts(ctx, stage) {
  const shaftStages = ["warehouse", "factory", "temple", "canyon", "rooftop", "forest", "station", "dojo", "subway", "harbor", "bridge", "market", "cemetery"];
  if (!shaftStages.includes(stage.id)) return;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = stage.window;
  for (let i = 0; i < 5; i++) {
    const x = 90 + i * 160;
    ctx.beginPath();
    ctx.moveTo(x - 12, 0); ctx.lineTo(x + 12, 0); ctx.lineTo(x + 64, GROUND_Y); ctx.lineTo(x + 30, GROUND_Y);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

function drawAtmosphere(ctx, stage) {
  ctx.save();
  ctx.globalAlpha = 0.1; ctx.fillStyle = stage.window; ctx.fillRect(0, GROUND_Y - 54, W, 54); ctx.globalAlpha = 1;
  drawLightShafts(ctx, stage);
  const vg = ctx.createRadialGradient(W / 2, 190, 170, W / 2, 210, 540);
  vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(0.7, "rgba(0,0,0,0.18)"); vg.addColorStop(1, "rgba(0,0,0,0.62)");
  ctx.fillStyle = vg; ctx.fillRect(0, 0, W, 450);
  const bg = ctx.createLinearGradient(0, 0, 0, 120);
  bg.addColorStop(0, "rgba(255,240,200,0.06)"); bg.addColorStop(1, "rgba(255,240,200,0)");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, 120);
  ctx.restore();
}

const STAGE_BG = {
  alley: alleyBg, rooftop: rooftopBg, dojo: dojoBg, subway: subwayBg,
  warehouse: warehouseBg, temple: templeBg, street: streetBg, harbor: harborBg,
  station: stationBg, forest: forestBg, canyon: canyonBg, mountain: mountainBg,
  sewer: sewerBg, beach: beachBg, factory: factoryBg,
  bridge: bridgeBg, market: marketBg, cemetery: cemeteryBg,
  docks: harborBg, prison: subwayBg, shrine: templeBg
};

export function drawStageBackground(ctx, stage) {
  sky(ctx, stage);
  (STAGE_BG[stage.id] || alleyBg)(ctx, stage);
  drawAtmosphere(ctx, stage);
}

export function drawStageForeground(ctx, stage) {
  const id = stage.id;
  ctx.save();
  ctx.globalAlpha = 0.85;
  if (["subway", "warehouse", "factory", "sewer", "dojo", "tower"].includes(id)) {
    for (let i = 0; i < 4; i++) { const x = 120 + i * 180; rect(ctx, x, 0, 2, 24, "#0a0a0a"); rect(ctx, x - 6, 24, 14, 10, "#2a2a2a"); ctx.globalAlpha = 0.22; rect(ctx, x - 8, 30, 18, 44, stage.window); ctx.globalAlpha = 0.85; }
  } else if (["street", "alley", "market", "bridge", "station", "rooftop", "festival"].includes(id)) {
    ctx.strokeStyle = "#0a0a0a"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, 30); ctx.quadraticCurveTo(W / 2, 52, W, 30); ctx.stroke();
    for (let i = 0; i < 6; i++) { const x = (i + 0.5) * (W / 6); const y = 30 + Math.sin((x / W) * Math.PI) * 22; rect(ctx, x - 1, y, 2, 6, "#1a1a1a"); rect(ctx, x - 2, y + 6, 4, 4, ["#f0d060", "#e8408a", "#5ac860", "#40b0e8"][i % 4]); }
  } else {
    ctx.strokeStyle = "#1a1a10"; ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) { const x = 80 + i * 160; ctx.beginPath(); ctx.moveTo(x, 0); ctx.quadraticCurveTo(x + 10, 22, x - 4, 44); ctx.stroke(); }
  }
  ctx.globalAlpha = 0.55;
  if (["alley", "warehouse", "factory", "sewer"].includes(id)) { rect(ctx, 0, GROUND_Y - 28, 20, 28, "#1a1610"); rect(ctx, W - 20, GROUND_Y - 22, 20, 22, "#1a1610"); }
  else if (["forest", "temple", "canyon", "cemetery", "mountain", "volcano", "colosseum", "swamp"].includes(id)) {
    ctx.fillStyle = "#0a1a0a";
    ctx.beginPath(); ctx.moveTo(0, GROUND_Y + 2); ctx.lineTo(0, GROUND_Y - 24); ctx.lineTo(16, GROUND_Y - 8); ctx.lineTo(30, GROUND_Y - 22); ctx.lineTo(42, GROUND_Y + 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(W, GROUND_Y + 2); ctx.lineTo(W, GROUND_Y - 20); ctx.lineTo(W - 20, GROUND_Y - 6); ctx.lineTo(W - 36, GROUND_Y - 26); ctx.lineTo(W - 50, GROUND_Y + 2); ctx.fill();
  } else { rect(ctx, 0, GROUND_Y - 14, 16, 14, "#0a0a0a"); rect(ctx, W - 16, GROUND_Y - 14, 16, 14, "#0a0a0a"); }
  ctx.restore();
}

export function drawStageGround(ctx, stage) {
  const H = 450 - GROUND_Y;
  ctx.fillStyle = stage.ground; ctx.fillRect(0, GROUND_Y, W, H);
  const dg = ctx.createLinearGradient(0, GROUND_Y, 0, 450);
  dg.addColorStop(0, "rgba(0,0,0,0)"); dg.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = dg; ctx.fillRect(0, GROUND_Y, W, H);
  rect(ctx, 0, GROUND_Y, W, 3, stage.groundLine);
  ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.fillRect(0, GROUND_Y, W, 1);
  ctx.fillStyle = "rgba(0,0,0,0.4)"; ctx.fillRect(0, GROUND_Y + 3, W, 1);
  if (stage.id === "canyon" || stage.id === "beach") { for (let x = 0; x < W; x += 18) rect(ctx, x, GROUND_Y + 8 + (x % 24), 14, 2, stage.groundLine); }
  else if (stage.id === "mountain") { for (let x = 0; x < W; x += 24) { rect(ctx, x, GROUND_Y + 12, 16, 2, "#b8bcc4"); rect(ctx, x + 8, GROUND_Y + 30, 12, 2, "#c8ccd4"); } }
  else if (stage.id === "sewer") { for (let x = 0; x < W; x += 40) rect(ctx, x, GROUND_Y + 6, 40, 1, "#4a5a4a"); rect(ctx, 0, GROUND_Y + 20, W, 2, "#1a2a1a"); }
  else { ctx.fillStyle = stage.accent; for (let x = 0; x < W; x += 40) { rect(ctx, x, GROUND_Y + 12, 20, 2, stage.accent); rect(ctx, x + 10, GROUND_Y + 28, 16, 2, stage.accent); } }
  ctx.fillStyle = "rgba(0,0,0,0.35)"; for (let i = 0; i < 34; i++) { const x = (i * 53 + 17) % W; const y = GROUND_Y + 8 + ((i * 31) % 52); ctx.fillRect(x, y, 2, 1); }
  ctx.strokeStyle = "rgba(0,0,0,0.32)"; ctx.lineWidth = 1;
  for (let i = 0; i < 7; i++) { const cx = (i * 119 + 30) % W; const cy = GROUND_Y + 16 + ((i * 23) % 48); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + 12, cy + 2); ctx.lineTo(cx + 19, cy - 3); ctx.lineTo(cx + 24, cy + 1); ctx.stroke(); }
  ctx.fillStyle = "rgba(0,0,0,0.28)"; for (let i = 0; i < 26; i++) { const px = (i * 67 + 11) % W, py = GROUND_Y + 10 + ((i * 29) % 56); ctx.fillRect(px, py, 2, 1); ctx.fillRect(px + 1, py + 1, 1, 1); }
  ctx.fillStyle = "rgba(255,255,255,0.05)"; for (let i = 0; i < 18; i++) { const px = (i * 83 + 7) % W, py = GROUND_Y + 12 + ((i * 37) % 50); ctx.fillRect(px, py, 1, 1); }
  if (["alley", "street", "subway", "sewer", "beach", "market", "bridge"].includes(stage.id)) {
    ctx.save(); ctx.fillStyle = "rgba(180,200,220,0.05)"; ctx.fillRect(0, GROUND_Y + 3, W, 16);
    ctx.globalAlpha = 0.06; ctx.fillStyle = stage.window;
    for (let i = 0; i < 7; i++) { ctx.fillRect((i * 120 + 30) % W, GROUND_Y + 6, 70, 2); ctx.fillRect((i * 120 + 70) % W, GROUND_Y + 14, 50, 1); }
    ctx.restore();
  }
  const fg = ctx.createLinearGradient(0, 432, 0, 450);
  fg.addColorStop(0, "rgba(0,0,0,0)"); fg.addColorStop(1, "rgba(0,0,0,0.5)");
  ctx.fillStyle = fg; ctx.fillRect(0, 432, W, 18);
}

function alleyBg(ctx, s) {
  bricks(ctx, 0, 0, 260, GROUND_Y, s.building, s.buildingShade, "#1a1410");
  bricks(ctx, W - 260, 0, 260, GROUND_Y, s.building, s.buildingShade, "#1a1410");
  ctx.fillStyle = s.buildingShade;
  for (let i = 0; i < 5; i++) { rect(ctx, 270, 60 + i * 60, 4, 50); rect(ctx, 270, 108 + i * 60, 30, 4); }
  windows(ctx, 20, 40, 100, 60, s.window, 2, 2);
  windows(ctx, 160, 120, 80, 50, s.window, 2, 2);
  windows(ctx, W - 180, 60, 100, 60, s.window, 2, 2);
  windows(ctx, W - 120, 180, 80, 50, s.window, 2, 2);
  rect(ctx, 300, GROUND_Y - 28, 22, 28, "#3a3530"); rect(ctx, 300, GROUND_Y - 28, 22, 4, "#5a5550");
  rect(ctx, 330, GROUND_Y - 22, 18, 22, "#2a2520");
  ctx.fillStyle = "rgba(180,200,220,0.12)"; ctx.fillRect(360, GROUND_Y + 6, 80, 6); ctx.fillRect(520, GROUND_Y + 14, 60, 4);
  drawDumpster(ctx, 430, GROUND_Y, "#2a5a3a");
  drawBarrel(ctx, 520, GROUND_Y, "#8a4a2a");
  drawBarrel(ctx, 542, GROUND_Y, "#3a5a6a");
}

function rooftopBg(ctx, s) {
  ctx.fillStyle = "rgba(255,200,120,0.5)"; ctx.beginPath(); ctx.arc(620, 120, 50, 0, Math.PI * 2); ctx.fill();
  rect(ctx, 600, 100, 40, 40, "rgba(255,220,150,0.6)");
  const cols = [60, 110, 80, 130, 90, 150, 70, 120, 100, 140, 80];
  let x = 0;
  cols.forEach((h) => { rect(ctx, x, GROUND_Y - h, 80, h, "#3a2a3a"); rect(ctx, x + 4, GROUND_Y - h, 72, h - 4, s.building); x += 76; });
  rect(ctx, 80, GROUND_Y - 90, 40, 30, "#5a4a3a"); rect(ctx, 70, GROUND_Y - 100, 60, 12, "#4a3a2a");
  rect(ctx, 70, GROUND_Y - 100, 60, 4, "#3a2a1a");
  rect(ctx, 680, GROUND_Y - 40, 50, 40, "#4a5a5a"); rect(ctx, 560, GROUND_Y - 30, 40, 30, "#4a5a5a");
}

function dojoBg(ctx, s) {
  rect(ctx, 0, 0, W, GROUND_Y, s.buildingShade);
  for (let y = 0; y < GROUND_Y; y += 20) rect(ctx, 0, y, W, 2, s.building);
  for (let i = 0; i < 4; i++) {
    const x = 60 + i * 180;
    rect(ctx, x, 60, 120, 260, "#3a2a1a"); rect(ctx, x + 6, 66, 108, 248, "#f0e8d0");
    ctx.fillStyle = "#d8c8a0"; ctx.fillRect(x + 6, 140, 108, 2); ctx.fillRect(x + 6, 220, 108, 2); ctx.fillRect(x + 60, 66, 2, 248);
  }
  for (let i = 0; i < 3; i++) { const x = 140 + i * 260; rect(ctx, x, 20, 2, 30, "#1a0a0a"); rect(ctx, x - 10, 50, 24, 24, "#c8302a"); rect(ctx, x - 10, 50, 24, 4, "#8a1810"); rect(ctx, x - 8, 54, 20, 16, "rgba(255,180,80,0.5)"); }
  rect(ctx, 360, 30, 80, 70, "#8a1810"); rect(ctx, 360, 30, 80, 4, "#5a0808");
}

function subwayBg(ctx, s) {
  rect(ctx, 0, 0, W, GROUND_Y, s.buildingShade);
  ctx.fillStyle = s.building;
  for (let y = 20; y < GROUND_Y; y += 24) for (let x = 0; x < W; x += 30) ctx.fillRect(x, y, 28, 22);
  ctx.fillStyle = "#1a1a24";
  for (let y = 20; y < GROUND_Y; y += 24) for (let x = 0; x < W; x += 30) { ctx.fillRect(x + 28, y, 2, 22); ctx.fillRect(x, y + 22, 28, 2); }
  for (let i = 0; i < 4; i++) { rect(ctx, 60 + i * 200, 80, 30, GROUND_Y - 80, "#2a2a34"); rect(ctx, 56, 80, 38, 8, "#3a3a44"); }
  for (let i = 0; i < 5; i++) { rect(ctx, 80 + i * 150, 20, 40, 6, s.window); ctx.fillStyle = "rgba(255,240,180,0.08)"; ctx.fillRect(80 + i * 150, 26, 40, 60); }
  rect(ctx, 0, GROUND_Y - 8, W, 4, "#d8a040");
}

function warehouseBg(ctx, s) {
  rect(ctx, 0, 0, W, GROUND_Y, s.buildingShade);
  for (let x = 0; x < W; x += 16) rect(ctx, x, 0, 8, GROUND_Y, s.building);
  for (let i = 0; i < 4; i++) { rect(ctx, 100 + i * 180, 40, 30, GROUND_Y - 40, s.buildingShade); rect(ctx, 96, 40, 38, 10, "#1a1a1a"); }
  for (let i = 0; i < 5; i++) { rect(ctx, 60 + i * 150, 30, 50, 24, "#1a1410"); rect(ctx, 64, 34, 42, 16, s.window); ctx.globalAlpha = 0.15; rect(ctx, 60 + i * 150, 54, 50, 50, s.window); ctx.globalAlpha = 1; }
  rect(ctx, 300, GROUND_Y - 50, 50, 50, "#6a4a2a"); rect(ctx, 300, GROUND_Y - 50, 50, 4, "#8a6a3a"); rect(ctx, 322, GROUND_Y - 50, 4, 50, "#4a2a18");
  rect(ctx, 460, GROUND_Y - 36, 40, 36, "#5a3a1a");
  rect(ctx, 200, 0, 2, 40, "#4a4a4a");
}

function templeBg(ctx, s) {
  rect(ctx, 0, 240, W, 60, "rgba(120,130,140,0.4)");
  ctx.fillStyle = "rgba(90,100,110,0.5)";
  ctx.beginPath(); ctx.moveTo(0, 280); ctx.lineTo(150, 200); ctx.lineTo(300, 270); ctx.lineTo(450, 190); ctx.lineTo(620, 260); ctx.lineTo(800, 210); ctx.lineTo(800, 300); ctx.lineTo(0, 300); ctx.fill();
  for (let i = 0; i < 5; i++) { const x = 40 + i * 170; rect(ctx, x, 60, 40, GROUND_Y - 60, s.building); rect(ctx, x - 6, 60, 52, 14, s.buildingShade); rect(ctx, x - 6, GROUND_Y - 14, 52, 14, s.buildingShade); ctx.fillStyle = s.buildingShade; ctx.fillRect(x + 18, 80, 2, 60); ctx.fillRect(x + 8, 200, 2, 40); }
  rect(ctx, 0, 50, W, 16, s.buildingShade); rect(ctx, 340, 50, 120, 16, s.buildingShade);
  ctx.fillStyle = "#4a5a2a"; for (let i = 0; i < 8; i++) rect(ctx, 60 + i * 100, 66, 3, 20 + (i % 3) * 14, "#4a5a2a");
}

function streetBg(ctx, s) {
  const shops = [{ x: 0, w: 160, sign: "#8a302a" }, { x: 160, w: 140, sign: "#2a5a8a" }, { x: 300, w: 120, sign: "#5a8a3a" }, { x: 500, w: 150, sign: "#8a6a2a" }, { x: 650, w: 150, sign: "#6a2a6a" }];
  shops.forEach((sh) => {
    rect(ctx, sh.x, 120, sh.w, GROUND_Y - 120, s.buildingShade); rect(ctx, sh.x, 120, sh.w, 4, s.building);
    for (let i = 0; i < sh.w; i += 20) { rect(ctx, sh.x + i, 150, 10, 14, sh.sign); rect(ctx, sh.x + i + 10, 150, 10, 14, "#f0e0c0"); }
    rect(ctx, sh.x + sh.w / 2 - 20, GROUND_Y - 70, 40, 70, "#1a1410"); rect(ctx, sh.x + sh.w / 2 - 18, GROUND_Y - 68, 36, 60, s.window);
    ctx.globalAlpha = 0.2; rect(ctx, sh.x + sh.w / 2 - 18, GROUND_Y - 68, 36, 60, "#fff"); ctx.globalAlpha = 1;
  });
  for (let i = 0; i < 6; i++) { rect(ctx, 30 + i * 130, 40, 50, 40, "#1a1410"); rect(ctx, 34, 44, 42, 32, ((i * 3) % 2) ? s.window : "#2a2520"); rect(ctx, 30 + i * 130 + 4, 44, 42, 32, ((i * 3) % 2) ? s.window : "#2a2520"); }
  rect(ctx, 400, 60, 4, 120, "#2a2a2a"); rect(ctx, 388, 56, 28, 8, "#3a3a3a");
  ctx.fillStyle = "rgba(255,220,120,0.15)"; ctx.beginPath(); ctx.arc(402, 70, 50, 0, Math.PI * 2); ctx.fill();
  drawTruck(ctx, 8, GROUND_Y, "#3a5a7a"); drawCar(ctx, 560, GROUND_Y, "#8a302a");
}

function harborBg(ctx, s) {
  rect(ctx, 100, 80, 8, GROUND_Y - 80, "#3a4a4a"); rect(ctx, 60, 90, 200, 8, "#3a4a4a"); rect(ctx, 60, 90, 4, 120, "#3a4a4a");
  for (let i = 0; i < 5; i++) rect(ctx, 70 + i * 30, 98, 2, 20, "#3a4a4a");
  const cols = ["#a8442a", "#2a6a8a", "#5a8a3a", "#8a6a2a", "#6a2a6a"];
  let cx = 240;
  for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) { const col = cols[(r * 5 + c) % cols.length]; rect(ctx, cx + c * 60, GROUND_Y - 60 + r * -60, 56, 56, col); rect(ctx, cx + c * 60, GROUND_Y - 60 + r * -60, 56, 4, "#1a1a1a"); ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.fillRect(cx + c * 60 + 2, GROUND_Y - 60 + r * -60 + 4, 52, 4); }
  rect(ctx, 0, GROUND_Y - 2, W, 8, "#2a3a3a");
  rect(ctx, 560, GROUND_Y - 50, 120, 50, "#3a3a3a"); rect(ctx, 600, GROUND_Y - 80, 40, 30, "#2a2a2a");
  drawTruck(ctx, 20, GROUND_Y, "#4a5a4a");
}

function stationBg(ctx, s) {
  rect(ctx, 0, 0, W, 70, s.buildingShade);
  ctx.fillStyle = s.building; ctx.beginPath(); ctx.moveTo(0, 70); ctx.quadraticCurveTo(W / 2, 0, W, 70); ctx.lineTo(W, 0); ctx.lineTo(0, 0); ctx.fill();
  for (let i = 0; i < 6; i++) rect(ctx, 60 + i * 130, 60, 8, 40, s.buildingShade);
  for (let i = 0; i < 6; i++) { rect(ctx, 40 + i * 130, 110, 90, 80, "#1a1410"); rect(ctx, 44, 114, 82, 72, s.window); ctx.globalAlpha = 0.1; rect(ctx, 40 + i * 130, 110, 90, 80, s.window); ctx.globalAlpha = 1; }
  rect(ctx, 370, 130, 60, 60, "#2a2418"); rect(ctx, 376, 136, 48, 48, "#f0e0b0");
  rect(ctx, 398, 140, 4, 20, "#1a1410"); rect(ctx, 398, 160, 16, 4, "#1a1410");
  for (let i = 0; i < 3; i++) { rect(ctx, 60 + i * 240, GROUND_Y - 28, 80, 6, "#3a2a1a"); rect(ctx, 64, GROUND_Y - 22, 4, 22, "#3a2a1a"); rect(ctx, 132, GROUND_Y - 22, 4, 22, "#3a2a1a"); }
  rect(ctx, 560, GROUND_Y - 90, 220, 90, "#4a3a2a"); rect(ctx, 560, GROUND_Y - 90, 220, 8, "#2a2418");
  for (let i = 0; i < 3; i++) rect(ctx, 580 + i * 60, GROUND_Y - 78, 40, 30, s.window);
  rect(ctx, 580, GROUND_Y - 16, 40, 16, "#1a1410");
  drawCar(ctx, 200, GROUND_Y, "#d8a020");
}

function forestBg(ctx, s) {
  ctx.fillStyle = "#2a3a2a";
  for (let x = 0; x < W; x += 30) { ctx.beginPath(); ctx.moveTo(x, 300); ctx.lineTo(x + 15, 200 + (x % 40)); ctx.lineTo(x + 30, 300); ctx.fill(); }
  for (const tx of [40, W - 70]) { rect(ctx, tx, 40, 30, GROUND_Y - 40, "#2a2418"); rect(ctx, tx - 20, 20, 70, 50, "#3a4a2a"); rect(ctx, tx - 30, 50, 90, 30, "#2a3a1a"); }
  rect(ctx, 330, 120, 12, GROUND_Y - 120, "#a8302a"); rect(ctx, 458, 120, 12, GROUND_Y - 120, "#a8302a");
  rect(ctx, 312, 110, 176, 16, "#a8302a"); rect(ctx, 320, 96, 160, 12, "#8a1810");
  rect(ctx, 370, 240, 60, 60, "#4a3a2a"); rect(ctx, 360, 232, 80, 10, "#5a4a3a");
  rect(ctx, 372, 270, 16, 30, "#2a2418"); rect(ctx, 412, 270, 16, 30, "#2a2418");
  rect(ctx, 300, 200, 16, 24, "#c8302a"); rect(ctx, 484, 200, 16, 24, "#c8302a");
}

function canyonBg(ctx, s) {
  ctx.fillStyle = "rgba(255,200,100,0.4)"; ctx.beginPath(); ctx.arc(400, 130, 80, 0, Math.PI * 2); ctx.fill();
  const mesas = [{ x: -20, w: 200, h: 180 }, { x: 180, w: 140, h: 120 }, { x: 480, w: 160, h: 160 }, { x: 640, w: 180, h: 200 }];
  mesas.forEach((m) => { rect(ctx, m.x, GROUND_Y - m.h, m.w, m.h, s.building); rect(ctx, m.x, GROUND_Y - m.h, m.w, 12, s.buildingShade); rect(ctx, m.x + m.w - 30, GROUND_Y - m.h + 12, 30, m.h - 12, s.buildingShade); ctx.fillStyle = s.buildingShade; ctx.fillRect(m.x + 40, GROUND_Y - m.h + 30, 3, m.h - 40); });
  ctx.fillStyle = "rgba(168,112,58,0.5)";
  ctx.beginPath(); ctx.moveTo(0, 320); ctx.lineTo(120, 260); ctx.lineTo(260, 320); ctx.lineTo(400, 270); ctx.lineTo(560, 320); ctx.lineTo(680, 250); ctx.lineTo(800, 320); ctx.lineTo(800, GROUND_Y); ctx.lineTo(0, GROUND_Y); ctx.fill();
  rect(ctx, 350, GROUND_Y - 40, 8, 40, "#4a5a2a"); rect(ctx, 358, GROUND_Y - 30, 14, 6, "#4a5a2a"); rect(ctx, 372, GROUND_Y - 30, 4, 20, "#4a5a2a");
  rect(ctx, 540, GROUND_Y - 28, 8, 28, "#4a5a2a");
}

function mountainBg(ctx, s) {
  const peaks = [{ x: 0, w: 200, h: 240 }, { x: 160, w: 220, h: 280 }, { x: 360, w: 200, h: 220 }, { x: 520, w: 240, h: 300 }, { x: 700, w: 160, h: 200 }];
  peaks.forEach((p) => {
    ctx.fillStyle = "#5a6a7a"; ctx.beginPath(); ctx.moveTo(p.x, GROUND_Y); ctx.lineTo(p.x + p.w / 2, GROUND_Y - p.h); ctx.lineTo(p.x + p.w, GROUND_Y); ctx.fill();
    ctx.fillStyle = "#e8ecf4"; ctx.beginPath(); ctx.moveTo(p.x + p.w / 2 - 30, GROUND_Y - p.h + 30); ctx.lineTo(p.x + p.w / 2, GROUND_Y - p.h); ctx.lineTo(p.x + p.w / 2 + 30, GROUND_Y - p.h + 30); ctx.lineTo(p.x + p.w / 2 + 14, GROUND_Y - p.h + 44); ctx.lineTo(p.x + p.w / 2, GROUND_Y - p.h + 30); ctx.lineTo(p.x + p.w / 2 - 14, GROUND_Y - p.h + 44); ctx.fill();
  });
  for (let i = 0; i < 8; i++) { const x = 30 + i * 100; rect(ctx, x, GROUND_Y - 50, 6, 50, "#3a2a1a"); ctx.fillStyle = "#2a4a2a"; ctx.beginPath(); ctx.moveTo(x - 16, GROUND_Y - 40); ctx.lineTo(x + 3, GROUND_Y - 90); ctx.lineTo(x + 22, GROUND_Y - 40); ctx.fill(); }
}

function sewerBg(ctx, s) {
  rect(ctx, 0, 0, W, GROUND_Y, "#0a1a0a");
  ctx.fillStyle = s.buildingShade; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(W / 2, -80, W, 0); ctx.lineTo(W, 120); ctx.quadraticCurveTo(W / 2, 60, 0, 120); ctx.fill();
  for (let x = 0; x < W; x += 40) { rect(ctx, x, 0, 36, 120, s.building); ctx.fillStyle = "#1a2a1a"; ctx.fillRect(x + 36, 0, 4, 120); ctx.fillRect(x, 116, 36, 4); }
  rect(ctx, 0, 160, W, 16, "#3a4a4a"); for (let x = 0; x < W; x += 60) rect(ctx, x + 4, 168, 8, 12, "#2a3a2a");
  rect(ctx, 0, 210, W, 12, "#2a3a2a");
  for (let i = 0; i < 6; i++) { rect(ctx, 60 + i * 120, 120, 24, 6, s.window); ctx.globalAlpha = 0.15; rect(ctx, 60 + i * 120, 126, 24, 80, s.window); ctx.globalAlpha = 1; }
  rect(ctx, 0, GROUND_Y - 6, W, 6, "#1a3a2a");
}

function beachBg(ctx, s) {
  ctx.fillStyle = "rgba(255,180,100,0.5)"; ctx.beginPath(); ctx.arc(400, 150, 60, 0, Math.PI * 2); ctx.fill();
  rect(ctx, 0, 200, W, 120, "#3a7a8a");
  rect(ctx, 380, 200, 40, 120, "rgba(255,200,120,0.4)");
  ctx.fillStyle = "#5a9aaa"; for (let x = 0; x < W; x += 30) { rect(ctx, x, 220 + (x % 20), 20, 3, "#7aaaba"); rect(ctx, x + 10, 250 + (x % 16), 16, 3, "#7aaaba"); }
  for (let i = 0; i < 10; i++) rect(ctx, 20 + i * 80, 280, 8, GROUND_Y - 280, "#5a3a1a");
  rect(ctx, 0, 280, W, 8, "#6a4a2a");
  for (const px of [80, 720]) { rect(ctx, px, 180, 6, 100, "#3a2a1a"); ctx.fillStyle = "#2a5a2a"; ctx.beginPath(); ctx.arc(px + 3, 178, 24, Math.PI, 0); ctx.fill(); }
  drawCar(ctx, 560, GROUND_Y, "#c87a3a");
}

function factoryBg(ctx, s) {
  rect(ctx, 0, 0, W, GROUND_Y, s.buildingShade);
  for (let i = 0; i < 10; i++) { const x = 20 + i * 78; rect(ctx, x, 30, 60, 50, "#1a1a14"); ctx.fillStyle = s.window; ctx.fillRect(x + 2, 32, 20, 20); ctx.fillRect(x + 30, 50, 26, 26); ctx.fillRect(x + 6, 56, 14, 20); }
  rect(ctx, 0, 110, W, 12, "#3a3a2a"); for (let i = 0; i < 4; i++) rect(ctx, 40 + i * 200, 122, 30, 30, "#2a2a1a");
  for (const gx of [150, 650]) { rect(ctx, gx, 160, 80, 80, "#3a3a3a"); ctx.fillStyle = "#2a2a2a"; for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; ctx.fillRect(gx + 40 + Math.cos(a) * 44 - 4, 200 + Math.sin(a) * 44 - 4, 8, 8); } rect(ctx, gx + 30, 190, 20, 20, "#1a1a1a"); }
  rect(ctx, 300, GROUND_Y - 30, 200, 12, "#3a3a3a"); for (let i = 0; i < 5; i++) rect(ctx, 305 + i * 40, GROUND_Y - 28, 8, 8, "#5a5a5a");
  drawForklift(ctx, 560, GROUND_Y, "#6a6a3a");
  drawBarrel(ctx, 60, GROUND_Y, "#8a4a2a"); drawBarrel(ctx, 80, GROUND_Y, "#3a5a6a"); drawBarrel(ctx, 100, GROUND_Y, "#5a3a3a");
}

function bridgeBg(ctx, s) {
  ctx.fillStyle = "rgba(80,40,90,0.4)"; for (let i = 0; i < 8; i++) { const h = 60 + (i * 37) % 80; rect(ctx, i * 100, GROUND_Y - h, 80, h, "#1a0a2a"); rect(ctx, i * 100 + 6, GROUND_Y - h + 10, 6, 6, s.window); }
  rect(ctx, 120, 40, 16, GROUND_Y - 40, "#3a3a4a"); rect(ctx, 664, 40, 16, GROUND_Y - 40, "#3a3a4a");
  ctx.strokeStyle = "#2a2a3a"; ctx.lineWidth = 2;
  for (const tx of [128, 672]) { ctx.beginPath(); for (let x = -200; x <= 200; x += 8) { ctx.lineTo(tx + x, 60 + (1 - (1 - (x * x) / 40000)) * 120); } ctx.stroke(); }
  rect(ctx, 0, GROUND_Y - 16, W, 16, "#1a1a24"); rect(ctx, 0, GROUND_Y - 16, W, 2, "#2a2a34");
  for (let i = 0; i < 14; i++) { rect(ctx, 20 + i * 56, GROUND_Y - 18, 6, 4, i % 2 ? "#e8408a" : "#40b0e8"); ctx.globalAlpha = 0.2; rect(ctx, 18 + i * 56, GROUND_Y - 20, 10, 60, i % 2 ? "#e8408a" : "#40b0e8"); ctx.globalAlpha = 1; }
}

function marketBg(ctx, s) {
  const stalls = [{ x: 0, w: 150, c: "#c8302a" }, { x: 150, w: 130, c: "#2a6a8a" }, { x: 280, w: 120, c: "#5a8a3a" }, { x: 560, w: 140, c: "#8a6a2a" }, { x: 700, w: 100, c: "#6a2a6a" }];
  stalls.forEach((st) => {
    rect(ctx, st.x, 200, st.w, GROUND_Y - 200, s.buildingShade);
    for (let i = 0; i < st.w; i += 18) { rect(ctx, st.x + i, 220, 9, 16, st.c); rect(ctx, st.x + i + 9, 220, 9, 16, "#f0e0c0"); }
    rect(ctx, st.x + 6, GROUND_Y - 30, st.w - 12, 30, "#3a2a1a");
    for (let i = 0; i < 4; i++) rect(ctx, st.x + 12 + i * 22, GROUND_Y - 34, 8, 6, ["#c8442a", "#5a8a3a", "#e8c040", "#8a4a8a"][i % 4]);
    rect(ctx, st.x + st.w / 2 - 6, 180, 12, 14, "#e8a040"); ctx.globalAlpha = 0.25; rect(ctx, st.x + st.w / 2 - 8, 180, 16, 40, "#e8a040"); ctx.globalAlpha = 1;
  });
  ctx.strokeStyle = "#2a2a2a"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, 60); ctx.quadraticCurveTo(W / 2, 110, W, 60); ctx.stroke();
  for (let i = 0; i < 16; i++) { const x = (i + 0.5) * (W / 16); const y = 60 + Math.sin((x / W) * Math.PI) * 50; rect(ctx, x - 2, y, 4, 4, ["#f0d060", "#e8408a", "#40b0e8", "#5ac860"][i % 4]); }
  for (let i = 0; i < 6; i++) { rect(ctx, 40 + i * 130, 40, 40, 40, "#1a1410"); rect(ctx, 44, 44, 32, 32, (i % 2) ? s.window : "#2a2520"); rect(ctx, 40 + i * 130 + 4, 44, 32, 32, (i % 2) ? s.window : "#2a2520"); }
}

function cemeteryBg(ctx, s) {
  ctx.fillStyle = "rgba(200,200,210,0.4)"; ctx.beginPath(); ctx.arc(640, 90, 36, 0, Math.PI * 2); ctx.fill();
  rect(ctx, 80, 180, 10, GROUND_Y - 180, "#2a1a10");
  ctx.strokeStyle = "#2a1a10"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(85, 220); ctx.lineTo(60, 190); ctx.moveTo(85, 200); ctx.lineTo(110, 170); ctx.moveTo(60, 190); ctx.lineTo(45, 165); ctx.stroke();
  const tombs = [160, 240, 360, 470, 560, 680, 740];
  tombs.forEach((tx, i) => { rect(ctx, tx, GROUND_Y - 34, 26, 34, s.building); rect(ctx, tx - 2, GROUND_Y - 38, 30, 6, s.buildingShade); rect(ctx, tx + 4, GROUND_Y - 26, 18, 2, s.buildingShade); rect(ctx, tx + 8, GROUND_Y - 20, 10, 2, s.buildingShade); if (i % 2 === 0) { rect(ctx, tx + 6, GROUND_Y - 48, 14, 14, s.building); rect(ctx, tx + 4, GROUND_Y - 50, 18, 4, s.buildingShade); } });
  ctx.fillStyle = "#1a1a1a"; for (let x = 0; x < W; x += 14) rect(ctx, x, GROUND_Y - 16, 2, 16); rect(ctx, 0, GROUND_Y - 18, W, 2, "#1a1a1a");
}

function swampBg(ctx, s) {
  ctx.fillStyle = "#1a2a1a"; ctx.fillRect(0, GROUND_Y - 40, W, 40);
  ctx.fillStyle = "#2a3a2a"; for (let x = 0; x < W; x += 24) ctx.fillRect(x, GROUND_Y - 40 + ((x * 7) % 6), 16, 2);
  for (const tx of [60, 250, 560, 740]) { ctx.strokeStyle = "#2a1a10"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(tx, GROUND_Y - 40); ctx.quadraticCurveTo(tx + 10, GROUND_Y - 120, tx - 6, GROUND_Y - 180); ctx.stroke(); ctx.strokeStyle = "#3a2a18"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(tx, GROUND_Y - 100); ctx.lineTo(tx - 20, GROUND_Y - 140); ctx.moveTo(tx - 4, GROUND_Y - 130); ctx.lineTo(tx + 18, GROUND_Y - 160); ctx.stroke(); ctx.strokeStyle = "#4a5a2a"; ctx.lineWidth = 2; for (let i = 0; i < 3; i++) { const mx = tx - 12 + i * 12; ctx.beginPath(); ctx.moveTo(mx, GROUND_Y - 120); ctx.quadraticCurveTo(mx + 4, GROUND_Y - 90, mx - 2, GROUND_Y - 60); ctx.stroke(); } }
  ctx.fillStyle = "#2a1a10"; ctx.save(); ctx.translate(380, GROUND_Y - 30); ctx.rotate(-0.1); ctx.fillRect(-40, -6, 80, 12); ctx.restore();
  for (let i = 0; i < 12; i++) { const fx = 40 + i * 64; const fy = 120 + ((i * 53) % 120); ctx.globalAlpha = 0.5; ctx.fillStyle = "#d8f060"; ctx.fillRect(fx, fy, 2, 2); ctx.globalAlpha = 0.2; ctx.fillRect(fx - 1, fy - 1, 4, 4); }
  ctx.globalAlpha = 1;
}

function festivalBg(ctx, s) {
  rect(ctx, 330, 100, 14, GROUND_Y - 100, "#a8302a"); rect(ctx, 456, 100, 14, GROUND_Y - 100, "#a8302a"); rect(ctx, 310, 90, 180, 16, "#a8302a"); rect(ctx, 320, 76, 160, 12, "#8a1810");
  rect(ctx, 360, 250, 80, 60, "#4a3a2a"); rect(ctx, 350, 242, 100, 10, "#5a4a3a");
  for (let row = 0; row < 2; row++) {
    const yy = 110 + row * 40;
    ctx.strokeStyle = "#2a1a1a"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, yy); ctx.quadraticCurveTo(W / 2, yy + 20, W, yy); ctx.stroke();
    for (let i = 0; i < 10; i++) { const x = (i + 0.5) * (W / 10); const y = yy + Math.sin((x / W) * Math.PI) * 20; const lc = ["#e86040", "#f0a040", "#e8408a", "#5ac860"][i % 4]; rect(ctx, x - 1, y, 2, 8, "#1a0a0a"); rect(ctx, x - 6, y + 8, 12, 16, lc); ctx.globalAlpha = 0.3; rect(ctx, x - 8, y + 8, 16, 24, lc); ctx.globalAlpha = 1; }
  }
  for (let i = 0; i < 8; i++) { const x = 60 + i * 90; const y = 40 + ((i * 37) % 60); rect(ctx, x - 4, y, 8, 10, "#f0c060"); rect(ctx, x - 3, y + 1, 6, 6, "#ffe8a0"); ctx.globalAlpha = 0.3; rect(ctx, x - 6, y - 2, 12, 14, "#f0a040"); ctx.globalAlpha = 1; }
  for (let i = 0; i < 6; i++) { const h = 60 + (i * 29) % 50; rect(ctx, i * 140, GROUND_Y - h, 120, h, "#2a1430"); rect(ctx, i * 140 + 6, GROUND_Y - h + 8, 6, 6, s.window); }
}
