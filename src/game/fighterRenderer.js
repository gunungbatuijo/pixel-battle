// Pixel-art fighter renderer: human proportions, eased multi-phase animation.
const BUILD = {
  heavy: { w: 1.28, h: 1.06, bob: 0.6, step: 0.9 },
  slim: { w: 0.84, h: 0.98, bob: 1.3, step: 1.25 },
  normal: { w: 1, h: 1, bob: 1, step: 1 }
};

function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function ss(a, b, x) { const t = clamp((x - a) / (b - a), !!0, !!1); return t * t * (3 - 2 * t); }

function px(ctx, x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
function ob(ctx, x, y, w, h, fill, line = "#0c0a08") { px(ctx, x - 1, y - 1, w + 2, h + 2, line); px(ctx, x, y, w, h, fill); }

export function drawFighter(ctx, f) {
  const p = f.palette;
  const fx = f.facing;
  const x = Math.round(f.x);
  const y = Math.round(f.y);
  const b = BUILD[f.build] || BUILD.normal;
  const t = f.animFrame;

  if (f.state === "ko") { if (f.ragdoll) { drawRagdoll(ctx, f); return; } drawKO(ctx, f, x, y, b); return; }
  if (f.state === "win") { drawWin(ctx, f, b); return; }

  const onGround = f.onGround;
  const isAtk = f.state === "attack";
  const phase = f.attackPhase | 0;

  const breath = Math.sin(t * 0.12);
  let bob = 0, legA = 0, legB = 0, armA = 0, armB = 0, torsoLean = 0, headTilt = 0, kneeBend = 0;

  if (f.state === "walk") {
    const cyc = t * 0.45 * b.step; const s = Math.sin(cyc);
    legA = s * 10 * b.w; legB = -s * 10 * b.w; armA = -s * 6 * b.w; armB = s * 6 * b.w;
    bob = -Math.abs(s) * 2.6; kneeBend = Math.max(0, Math.sin(cyc + Math.PI / 2)) * 7; torsoLean = 4; headTilt = 1;
  } else if (f.state === "idle") {
    const sway = Math.sin(t * 0.08); bob = breath * 2 * b.bob + sway * 0.6; armA = Math.sin(t * 0.1 + 1) * 1.4; armB = -armA; torsoLean = sway * 1.2; headTilt = sway * 0.8;
  } else if (f.state === "crouch" || f.crouching) {
    kneeBend = 16; bob = 3;
  } else if (f.state === "jump" || !onGround) {
    const rising = f.vy < 0; kneeBend = rising ? 9 : 5; armA = -11; armB = -9; bob = -2;
  } else if (f.state === "hit") {
    torsoLean = -7; headTilt = -3; bob = Math.sin(t * 0.6) * 1;
  } else if (f.state === "block") {
    bob = Math.sin(t * 0.25) * 0.6; armA = 4;
  } else if (f.state === "dash") {
    torsoLean = 7; armA = -4; armB = -11;
  }

  if (!isAtk) torsoLean += clamp((f.vx || 0) * 0.6, -6, 6);

  let armExt = 0, armBack = 0, atkLean = 0, strike = false;
  if (isAtk) {
    const light = f.attackType === "light";
    const fullExt = (light ? 24 : 36) * b.w;
    const total = { light: 18, skill1: 26, skill2: 36, skill3: 44 }[f.attackType] || 30;
    const elapsed = total - f.attackTimer;
    const pr = clamp(elapsed / total, 0, 1);
    const windup = ss(0, 0.35, pr) * (1 - ss(0.3, 0.5, pr));
    const reach = ss(0.32, 0.5, pr) * (1 - ss(0.6, 1, pr) * 0.55);
    armBack = fullExt * 0.55 * windup; armExt = fullExt * reach;
    atkLean = -5 * windup + 6 * reach; strike = reach > 0.55; headTilt = -2 * windup + 3 * reach;
  }

  ctx.save();
  ctx.translate(x, y);

  if (f.state === "dash" || strike) {
    ctx.save(); ctx.globalAlpha = 0.22; ctx.scale(fx, 1); ctx.translate(f.state === "dash" ? -8 : -5, 0);
    drawSilhouette(ctx, f, b, torsoLean + atkLean, bob, armExt, armBack, armA, armB, legA, legB, kneeBend);
    ctx.restore();
  }

  const groundOff = 380 - y;
  const hFactor = clamp(groundOff / 160, 0, 1);
  const shScale = onGround ? 1 : 1 - hFactor * 0.5;
  const shA = Math.max(0, onGround ? 0.42 : 0.22 - hFactor * 0.12);
  const shW = 26 * b.w * shScale;
  const shY = 2 + groundOff;
  const cgrad = ctx.createRadialGradient(-8, shY, 2, -10, shY, shW * 1.7);
  cgrad.addColorStop(0, `rgba(0,0,0,${shA * 0.6})`);
  cgrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = cgrad;
  ctx.beginPath(); ctx.ellipse(-10, shY, shW * 1.5, 4.5 * shScale, 0, 0, Math.PI * 2); ctx.fill();
  const sgrad = ctx.createRadialGradient(0, shY, 2, 0, shY, shW);
  sgrad.addColorStop(0, `rgba(0,0,0,${shA})`);
  sgrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = sgrad;
  ctx.beginPath(); ctx.ellipse(0, shY, shW, 5 * shScale, 0, 0, Math.PI * 2); ctx.fill();

  ctx.scale(fx, 1);

  const sW = b.w, sH = b.h;
  const hipY = (-40 + kneeBend * 0.3) * sH;
  const kneeY = (-22 + kneeBend * 0.5) * sH;
  const ankleY = -5 * sH;
  const waistY = (-42 + kneeBend * 0.3) * sH + bob;
  const shoulderY = (-64 + kneeBend * 0.3) * sH + bob;
  const headBottom = (-72 + kneeBend * 0.3) * sH + bob;
  const headTop = (-84 + kneeBend * 0.3) * sH + bob;
  const shoulderW = 22 * sW; const waistW = 20 * sW;
  const thighW = 9 * sW; const shinW = 8 * sW; const bootW = 12 * sW;
  const headW = 18 * sW; const headH = 18 * sH;
  const leanX = torsoLean + atkLean;

  drawLeg(ctx, -thighW / 2 - 1, legA, thighW, shinW, bootW, hipY, kneeY, ankleY, p);
  drawLeg(ctx, thighW / 2 - shinW + 1, legB, thighW, shinW, bootW, hipY, kneeY, ankleY, p);

  const backShX = leanX - shoulderW / 2 + 2 * sW + armB;
  drawArm(ctx, backShX, shoulderY + 2 * sH, armB, 0, p, b, false, false);

  drawTorso(ctx, leanX, shoulderY, shoulderW, waistY, waistW, p);

  const frShX = leanX + shoulderW / 2 - 4 * sW + (armExt - armBack) * 0.15 + armA;
  drawArm(ctx, frShX, shoulderY + 2 * sH, armA, armExt - armBack, p, b, true, strike);

  const hx = leanX - headW / 2 + headTilt;
  px(ctx, leanX - 3 * sW, shoulderY - 3 * sH, 6 * sW, 5 * sH, p.skinShade);
  ob(ctx, hx, headTop, headW, headH, p.skin, "#0c0a08");
  px(ctx, hx, headTop + headH - 5 * sH, headW, 5 * sH, p.skinShade);
  px(ctx, hx + headW - 4 * sW, headTop + 2 * sH, 4 * sW, headH - 4 * sH, p.skinShade);
  px(ctx, hx + 2 * sW, headTop + 3 * sH, 2 * sW, 3 * sH, "rgba(255,255,255,0.12)");
  px(ctx, hx - 2 * sW, headTop - 3 * sH, headW + 4 * sW, 8 * sH, p.hair);
  px(ctx, hx - 3 * sW, headTop + 1 * sH, 4 * sW, 10 * sH, p.hair);
  px(ctx, hx + headW - 2 * sW, headTop + 2 * sH, 4 * sW, 6 * sH, p.hairShade || p.hair);

  drawFeatureHead(ctx, f, hx, headTop, headW, headH, false);

  if (f.state === "hit") {
    px(ctx, hx + headW - 9 * sW, headTop + 7 * sH, 6 * sW, 2 * sH, "#1a1a1a");
    px(ctx, hx + headW - 4 * sW, headTop + 5 * sH, 2 * sW, 2 * sH, "#ffffff");
  } else if (strike) {
    px(ctx, hx + headW - 9 * sW, headTop + 6 * sH, 5 * sW, 4 * sH, "#1a1a1a");
    px(ctx, hx + headW - 4 * sW, headTop + 7 * sH, 2 * sW, 2 * sH, "#e8e8e8");
  } else {
    px(ctx, hx + headW - 8 * sW, headTop + 7 * sH, 4 * sW, 3 * sH, "#1a1a1a");
    px(ctx, hx + headW - 3 * sW, headTop + 6 * sH, 2 * sW, 2 * sH, "#e8e8e8");
  }

  if (strike) {
    for (let i = 0; i < 3; i++) px(ctx, frShX + (armExt - armBack) + 8 * sW + i * 6 * sW, shoulderY + 4 * sH + i * 4 * sH, 8 * sW, 2 * sH, "rgba(240,230,200,0.4)");
    if (f.attackType !== "light") px(ctx, frShX + (armExt - armBack) + 4 * sW, shoulderY + 2 * sH, 12 * sW, 12 * sW, p.accent + "aa");
  }

  if (f.state === "hit") { px(ctx, hx + headW + 2 * sW, headTop - 2 * sH, 2 * sW, 4 * sH, "#a8c8e8"); px(ctx, hx + headW + 4 * sW, headTop + 1 * sH, 2 * sW, 3 * sH, "#a8c8e8"); }

  ctx.restore();
}

function drawTorso(ctx, cx, shoulderY, shoulderW, waistY, waistW, p) {
  ctx.fillStyle = "#0c0a08";
  ctx.beginPath();
  ctx.moveTo(cx - shoulderW / 2 - 1, shoulderY - 1); ctx.lineTo(cx + shoulderW / 2 + 1, shoulderY - 1); ctx.lineTo(cx + waistW / 2 + 1, waistY + 1); ctx.lineTo(cx - waistW / 2 - 1, waistY + 1);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = p.shirt;
  ctx.beginPath();
  ctx.moveTo(cx - shoulderW / 2, shoulderY); ctx.lineTo(cx + shoulderW / 2, shoulderY); ctx.lineTo(cx + waistW / 2, waistY); ctx.lineTo(cx - waistW / 2, waistY);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = p.shirtShade;
  ctx.beginPath(); ctx.moveTo(cx - shoulderW / 2, shoulderY); ctx.lineTo(cx + shoulderW / 2, shoulderY); ctx.lineTo(cx + shoulderW / 2 - 2, shoulderY + 4); ctx.lineTo(cx - shoulderW / 2 + 2, shoulderY + 4); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx + shoulderW / 2, shoulderY); ctx.lineTo(cx + waistW / 2, waistY); ctx.lineTo(cx + waistW / 2 - 2, waistY); ctx.lineTo(cx + shoulderW / 2 - 3, shoulderY + 3); ctx.closePath(); ctx.fill();
  ctx.fillStyle = p.shirt; ctx.fillRect(cx - shoulderW / 2 + 3, shoulderY + 5, 3, Math.max(2, waistY - shoulderY - 10));
  ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.fillRect(cx - shoulderW / 2, shoulderY + 2, 2, Math.max(2, waistY - shoulderY - 6));
  ctx.fillStyle = p.accent; ctx.fillRect(cx - waistW / 2 - 1, waistY - 3, waistW + 2, 4);
  ctx.fillStyle = p.pantsShade; ctx.fillRect(cx - waistW / 2 - 1, waistY, waistW + 2, 2);
}

function drawLeg(ctx, hipX, swing, thighW, shinW, bootW, hipY, kneeY, ankleY, p) {
  const kneeX = hipX + swing * 0.35; const footX = hipX + swing;
  ob(ctx, hipX, hipY, thighW, kneeY - hipY, p.pants, "#0c0a08"); px(ctx, hipX, hipY, thighW, 3, p.pantsShade);
  ob(ctx, kneeX, kneeY, shinW, ankleY - kneeY, p.pantsShade, "#0c0a08"); px(ctx, kneeX - 1, kneeY - 1, shinW + 2, 2, p.pants);
  px(ctx, kneeX, kneeY + 2, 1, ankleY - kneeY - 5, "rgba(255,255,255,0.14)");
  ob(ctx, footX - 1, ankleY - 1, bootW, 7, p.boots, "#0c0a08"); px(ctx, footX, ankleY, bootW - 2, 2, "#1a0a00");
}

function drawArm(ctx, shoulderX, shoulderY, swing, ext, p, b, front, strike) {
  const sW = b.w, sH = b.h;
  const upperW = 7 * sW, foreW = 6 * sW, segLen = 9 * sH;
  const sx = shoulderX + swing * 0.3;
  ob(ctx, sx, shoulderY, upperW, segLen, p.skin, "#0c0a08"); px(ctx, sx, shoulderY, upperW, 3, p.skinShade);
  const fx = shoulderX + ext;
  ob(ctx, fx, shoulderY + segLen, foreW, segLen, p.skinShade, "#0c0a08"); px(ctx, sx - 1, shoulderY + segLen - 2, upperW + 2, 2, p.skinShade);
  if (front && (strike || ext > 1)) { ob(ctx, fx - 1, shoulderY + segLen * 2 - 2, foreW + 3, foreW + 3, p.skinShade, "#0c0a08"); px(ctx, fx, shoulderY + segLen * 2, foreW + 1, 2, "#5a3a2a"); }
  else { ob(ctx, fx, shoulderY + segLen * 2 - 1, foreW + 1, foreW + 1, p.skinShade, "#0c0a08"); }
}

function drawSilhouette(ctx, f, b, lean, bob, armExt, armBack, armA, armB, legA, legB, kneeBend) {
  const p = f.palette; const sW = b.w, sH = b.h;
  const shoulderY = (-64 + kneeBend * 0.3) * sH + bob; const waistY = (-42 + kneeBend * 0.3) * sH + bob;
  const headTop = (-88 + kneeBend * 0.3) * sH + bob;
  const shoulderW = 22 * sW, waistW = 20 * sW, headW = 18 * sW, headH = 18 * sH;
  ctx.fillStyle = p.shirt; ctx.globalAlpha = 0.25;
  ctx.beginPath(); ctx.moveTo(lean - shoulderW / 2, shoulderY); ctx.lineTo(lean + shoulderW / 2, shoulderY); ctx.lineTo(lean + waistW / 2, waistY); ctx.lineTo(lean - waistW / 2, waistY); ctx.closePath(); ctx.fill();
  px(ctx, lean - shoulderW / 2 + 2 * sW + armB, shoulderY + 2 * sH, 6 * sW, 18 * sH);
  px(ctx, lean + shoulderW / 2 - 4 * sW + armExt - armBack, shoulderY + 2 * sH, 6 * sW, 18 * sH);
  px(ctx, lean - headW / 2, headTop, headW, headH);
}

function drawRagdoll(ctx, f) {
  const p = f.palette; const r = f.ragdoll; if (!r) return;
  const [head, chest, hip, lhand, rhand, lfoot, rfoot] = r.pts;
  ctx.fillStyle = "rgba(80,8,8,0.5)"; ctx.beginPath(); ctx.ellipse(hip.x, 380, 24, 6, 0, 0, Math.PI * 2); ctx.fill();
  limb(ctx, hip, lfoot, 9, p.pants, p.pantsShade); limb(ctx, hip, rfoot, 9, p.pants, p.pantsShade);
  ob(ctx, lfoot.x - 6, lfoot.y - 4, 12, 6, p.boots, "#0c0a08"); ob(ctx, rfoot.x - 6, rfoot.y - 4, 12, 6, p.boots, "#0c0a08");
  limb(ctx, chest, lhand, 7, p.skin, p.skinShade); limb(ctx, chest, rhand, 7, p.skinShade, p.skin);
  const tdx = hip.x - chest.x, tdy = hip.y - chest.y; const lang = Math.atan2(tdy, tdx);
  ctx.save(); ctx.translate((chest.x + hip.x) / 2, (chest.y + hip.y) / 2); ctx.rotate(lang - Math.PI / 2);
  ob(ctx, -11, -14, 22, 28, p.shirt, "#0c0a08"); px(ctx, -11, -14, 22, 5, p.shirtShade); px(ctx, -11, 10, 22, 3, p.accent); ctx.restore();
  const hdx = head.x - chest.x, hdy = head.y - chest.y; const hang = Math.atan2(hdy, hdx);
  ctx.save(); ctx.translate(head.x, head.y); ctx.rotate(hang + Math.PI / 2);
  ob(ctx, -9, -9, 18, 18, p.skin, "#0c0a08"); px(ctx, -9, -9, 18, 6, p.hair); px(ctx, -9, 5, 18, 4, p.skinShade); px(ctx, -4, -1, 2, 2, "#0a0a0a"); px(ctx, 2, -1, 2, 2, "#0a0a0a"); ctx.restore();
}

function limb(ctx, a, b, w, c, c2) {
  const dx = b.x - a.x, dy = b.y - a.y; const len = Math.max(1, Math.hypot(dx, dy)); const ang = Math.atan2(dy, dx);
  ctx.save(); ctx.translate(a.x, a.y); ctx.rotate(ang); ob(ctx, 0, -w / 2, len, w, c, "#0c0a08"); px(ctx, 0, -w / 2, len, 2, c2); ctx.restore();
}

function drawFeatureHead(ctx, f, hx, hy, headW, headH, ko) {
  const p = f.palette;
  switch (f.feature) {
    case "headband": px(ctx, hx - 3, hy + 3, headW + 6, 5, p.accent); px(ctx, hx - 3, hy + 3, headW + 6, 1, "#1a1a1a"); px(ctx, hx + headW, hy + 2, 7, 6, p.accent); px(ctx, hx + headW + 5, hy + 8, 5, 4, p.accent); px(ctx, hx + headW + 9, hy + 12, 3, 3, p.accent); break;
    case "beard": px(ctx, hx, hy + headH - 9, headW, 9, "#3a2a1a"); px(ctx, hx + 2, hy + headH - 5, headW - 4, 5, "#2a1a0a"); px(ctx, hx + headW / 2 - 1, hy + headH - 3, 2, 4, "#1a0a00"); break;
    case "mask": px(ctx, hx - 1, hy + headH - 13, headW + 2, 13, p.shirt); px(ctx, hx - 1, hy + headH - 13, headW + 2, 2, p.shirtShade); px(ctx, hx + 2, hy + 7, headW - 6, 4, "#0a0a0a"); break;
    case "cap": px(ctx, hx - 5, hy - 5, headW + 10, 7, p.shirtShade); px(ctx, hx - 5, hy - 5, headW + 10, 2, "#1a1a1a"); px(ctx, hx + headW - 3, hy - 1, 12, 5, p.shirtShade); px(ctx, hx + headW - 3, hy + 3, 12, 1, "#1a1a1a"); break;
    case "topknot": px(ctx, hx + headW / 2 - 2, hy - 4, 4, 5, p.hair); px(ctx, hx + headW / 2 - 3, hy - 6, 6, 3, p.hair); px(ctx, hx + headW / 2 - 1, hy + 1, 2, 3, p.hairShade || p.hair); break;
    case "visor": px(ctx, hx - 1, hy + 5, headW + 2, 5, "#1a2a3a"); px(ctx, hx - 1, hy + 5, headW + 2, 1, "#5ad8e8"); px(ctx, hx + 2, hy + 6, 4, 2, "#9af8ff"); break;
    case "hood": px(ctx, hx - 5, hy - 4, headW + 10, 8, p.shirt); px(ctx, hx - 5, hy - 4, headW + 10, 2, p.shirtShade); px(ctx, hx - 6, hy + 2, 4, 10, p.shirt); px(ctx, hx + headW + 2, hy + 2, 4, 10, p.shirt); break;
    default: break;
  }
}

function drawKO(ctx, f, x, y, b) {
  const p = f.palette; const fx = f.facing; const t = f.koTime || 0;
  ctx.save(); ctx.translate(x, y);
  const pool = Math.min(72, 16 + t * 0.7);
  ctx.fillStyle = "rgba(60,6,6,0.65)"; ctx.beginPath(); ctx.ellipse(0, -1, pool, pool * 0.32, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "rgba(120,14,14,0.5)"; ctx.beginPath(); ctx.ellipse(0, -1, pool * 0.7, pool * 0.22, 0, 0, Math.PI * 2); ctx.fill();
  if (t > 24) { for (let i = 0; i < 5; i++) { const a = i * 1.25 + t * 0.02; const dr = pool * 0.9; ctx.fillStyle = "rgba(90,8,8,0.5)"; ctx.beginPath(); ctx.ellipse(Math.cos(a) * dr, Math.sin(a) * dr * 0.3, 4, 2, 0, 0, Math.PI * 2); ctx.fill(); } }
  ctx.scale(fx, 1);
  drawKOWarrior(ctx, p, b, t);
  if (t > 46) { ctx.fillStyle = "#f0c060"; for (let i = 0; i < 3; i++) { const a = t * 0.09 + i * 2.1; px(ctx, 6 + Math.cos(a) * 16, -34 + Math.sin(a) * 5, 3, 3); } }
  ctx.restore();
}

function drawKOWarrior(ctx, p, b, t) {
  const sW = b.w, sH = b.h;
  if (t < 14) {
    const lean = -t * 0.9; const bw = 26 * b.w;
    ob(ctx, -bw / 2, -16, bw, 16, p.pants, "#0c0a08"); px(ctx, -bw / 2, -16, bw, 3, p.pantsShade);
    ctx.save(); ctx.translate(lean, 0);
    ob(ctx, -bw / 2 - 1, -40, bw + 2, 24, p.shirt, "#0c0a08"); px(ctx, -bw / 2 - 1, -40, bw + 2, 6, p.shirtShade); px(ctx, -bw / 2 + 3, -26, bw - 4, 2, p.accent);
    const hx = -bw / 2 + 1; ob(ctx, hx - 1, -58, 16 * sW, 15 * sH, p.skin, "#0c0a08"); px(ctx, hx - 1, -58, 16 * sW, 6, p.hair); px(ctx, hx - 1, -58 + 12, 16 * sW, 3, p.skinShade);
    ob(ctx, hx + 4, -36, 7 * sW, 10 * sH, p.skinShade, "#0c0a08"); ob(ctx, hx - 12, -44, 6 * sW, 14 * sH, p.skin, "#0c0a08"); px(ctx, hx + 6, -44, 2, 6, "#7a1010");
    ctx.restore();
  } else if (t < 40) {
    const bw = 26 * b.w;
    ob(ctx, -bw / 2, -10, bw, 10, p.pants, "#0c0a08"); ob(ctx, -bw / 2 - 2, -24, bw + 4, 16, p.pantsShade, "#0c0a08");
    ob(ctx, -bw / 2, -44, bw, 22, p.shirt, "#0c0a08"); px(ctx, -bw / 2, -44, bw, 6, p.shirtShade);
    const hx = -bw / 2 + 3; ob(ctx, hx, -56, 15 * sW, 13 * sH, p.skin, "#0c0a08"); px(ctx, hx, -56, 15 * sW, 5, p.hair); px(ctx, hx, -56 + 10, 15 * sW, 3, p.skinShade);
    ob(ctx, hx - 14, -10, 7 * sW, 10 * sH, p.skinShade, "#0c0a08"); px(ctx, hx + 6, -42, 2, 8, "#a81818"); px(ctx, hx + 6, -10, 3, 3, "#5a0808");
  } else {
    const bw = 32 * b.w;
    ob(ctx, -bw / 2, -8, bw, 8, p.pants, "#0c0a08"); ob(ctx, -bw / 2 - 2, -14, 10, 8, p.pantsShade, "#0c0a08"); ob(ctx, bw / 2 - 8, -14, 10, 8, p.pantsShade, "#0c0a08");
    ob(ctx, -bw / 2, -20, bw, 14, p.shirt, "#0c0a08"); px(ctx, -bw / 2, -20, bw, 5, p.shirtShade); px(ctx, -bw / 2 + 3, -14, 6, 2, p.accent);
    ob(ctx, bw / 2 - 4, -20, 14, 6, p.skinShade, "#0c0a08"); ob(ctx, bw / 2 + 8, -22, 6, 6, p.skin, "#0c0a08");
    const hx = bw / 2 - 8; ob(ctx, hx, -24, 15 * sW, 12 * sH, p.skin, "#0c0a08"); px(ctx, hx, -24, 15 * sW, 5, p.hair);
    px(ctx, hx + 3, -19, 2, 2, "#0a0a0a"); px(ctx, hx + 8, -19, 2, 2, "#0a0a0a"); px(ctx, hx, -12, 12, 3, "#5a0808");
    if (Math.floor(t * 0.12) % 5 === 0) px(ctx, hx - 8, -18, 4, 2, p.skinShade);
  }
}

function drawWin(ctx, f, b) {
  const p = f.palette; const t = f.winTime || 0; const sW = b.w, sH = b.h;
  ctx.save();
  const aura = 0.25 + Math.sin(t * 0.15) * 0.12;
  const g = ctx.createRadialGradient(0, -40, 4, 0, -40, 70);
  g.addColorStop(0, p.accent + "66"); g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.globalAlpha = Math.max(0, aura); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, -40, 70, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
  ctx.scale(f.facing, 1);
  const bob = Math.sin(t * 0.2) * 2;
  ob(ctx, -10, -22 + bob, 8, 22, p.pants, "#0c0a08"); ob(ctx, 2, -22 + bob, 8, 22, p.pantsShade, "#0c0a08");
  ob(ctx, -11, -4 + bob, 12, 6, p.boots, "#0c0a08"); ob(ctx, 1, -4 + bob, 12, 6, p.boots, "#0c0a08");
  ob(ctx, -12, -46 + bob, 24, 26, p.shirt, "#0c0a08"); px(ctx, -12, -46 + bob, 24, 6, p.shirtShade); px(ctx, -12, -24 + bob, 24, 3, p.accent);
  const raise = 10 + Math.sin(t * 0.25) * 2;
  ob(ctx, -16, -58 + bob - raise, 7, 22, p.skin, "#0c0a08"); ob(ctx, 9, -58 + bob - raise, 7, 22, p.skinShade, "#0c0a08");
  ob(ctx, -17, -64 + bob - raise, 9, 8, p.skinShade, "#0c0a08"); ob(ctx, 8, -64 + bob - raise, 9, 8, p.skin, "#0c0a08");
  const hx = -9; ob(ctx, hx, -62 + bob, 18 * sW, 18 * sH, p.skin, "#0c0a08"); px(ctx, hx, -62 + bob, 18 * sW, 6, p.hair); px(ctx, hx, -62 + bob + 14, 18 * sW, 4, p.skinShade); px(ctx, hx + 4, -57 + bob, 3, 3, "#0a0a0a");
  if (Math.floor(t * 0.2) % 2 === 0) { px(ctx, -24, -72 + bob - raise, 2, 2, "#ffe8a0"); px(ctx, 18, -70 + bob - raise, 2, 2, "#ffe8a0"); }
  ctx.restore();
}
