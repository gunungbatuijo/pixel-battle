// Per-character intro sequences played during the pre-fight "intro" round state.
const GROUND_Y = 380;

function px(ctx, x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
function ob(ctx, x, y, w, h, fill, line = "#0c0a08") { px(ctx, x - 1, y - 1, w + 2, h + 2, line); px(ctx, x, y, w, h, fill); }

const BUILD = { heavy: { w: 1.28, h: 1.06 }, slim: { w: 0.84, h: 0.98 }, normal: { w: 1, h: 1 } };

function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

function drawStance(ctx, p, b, d) {
  const sW = b.w, sH = b.h;
  const cr = d.crouch || 0;
  const bob = (d.bob || 0) + Math.sin((d.t || 0) * 0.12) * 1.5;
  const lean = d.lean || 0;
  const hipY = (-40 + cr * 14) * sH + bob;
  const kneeY = (-22 + cr * 8) * sH;
  const ankleY = -5 * sH;
  const waistY = (-42 + cr * 14) * sH + bob;
  const shoulderY = (-64 + cr * 14) * sH + bob;
  const headTop = (-84 + cr * 14) * sH + bob;
  const shW = 22 * sW, waW = 20 * sW, headW = 18 * sW, headH = 18 * sH;
  const legA = d.legA || 0, legB = d.legB || 0;
  const thighW = 9 * sW, shinW = 8 * sW, bootW = 12 * sW;

  drawLeg(ctx, -thighW / 2 - 1, legA, thighW, shinW, bootW, hipY, kneeY, ankleY, p);
  drawLeg(ctx, thighW / 2 - shinW + 1, legB, thighW, shinW, bootW, hipY, kneeY, ankleY, p);

  const armBUp = d.armBUp || 0;
  const armB = d.armB || 0;
  drawArm(ctx, lean - shW / 2 + 2 * sW + armB, shoulderY + 2 * sH, armBUp, armB, p, b, false);

  drawTorso(ctx, lean, shoulderY, shW, waistY, waW, p);

  const armFUp = d.armFUp || 0;
  const armF = d.armF || 0;
  drawArm(ctx, lean + shW / 2 - 4 * sW + armF, shoulderY + 2 * sH, armFUp, armF, p, b, true, d.armFist);

  const hx = lean - headW / 2 + (d.headTilt || 0);
  px(ctx, lean - 3 * sW, shoulderY - 3 * sH, 6 * sW, 5 * sH, p.skinShade);
  ob(ctx, hx, headTop, headW, headH, p.skin, "#0c0a08");
  px(ctx, hx, headTop + headH - 5 * sH, headW, 5 * sH, p.skinShade);
  px(ctx, hx + headW - 4 * sW, headTop + 2 * sH, 4 * sW, headH - 4 * sH, p.skinShade);
  px(ctx, hx - 2 * sW, headTop - 3 * sH, headW + 4 * sW, 8 * sH, p.hair);
  px(ctx, hx - 3 * sW, headTop + 1 * sH, 4 * sW, 10 * sH, p.hair);
  drawFeature(ctx, f_feat(d.feature), hx, headTop, headW, headH, p);
  px(ctx, hx + headW - 8 * sW, headTop + 7 * sH, 4 * sW, 3 * sH, "#1a1a1a");
}

let f_feat = (v) => v;
function setFeature(name) { f_feat = () => name; }

function drawLeg(ctx, hipX, swing, thighW, shinW, bootW, hipY, kneeY, ankleY, p) {
  const kneeX = hipX + swing * 0.35;
  const footX = hipX + swing;
  ob(ctx, hipX, hipY, thighW, kneeY - hipY, p.pants, "#0c0a08");
  px(ctx, hipX, hipY, thighW, 3, p.pantsShade);
  ob(ctx, kneeX, kneeY, shinW, ankleY - kneeY, p.pantsShade, "#0c0a08");
  ob(ctx, footX - 1, ankleY - 1, bootW, 7, p.boots, "#0c0a08");
}

function drawArm(ctx, shoulderX, shoulderY, up, ext, p, b, front, fist) {
  const sW = b.w, sH = b.h;
  const upperW = 7 * sW, foreW = 6 * sW, segLen = 9 * sH;
  const sx = shoulderX + ext * 0.15;
  ob(ctx, sx, shoulderY, upperW, segLen, p.skin, "#0c0a08");
  const fx = shoulderX + ext;
  const fy = shoulderY + segLen - up;
  ob(ctx, fx, fy, foreW, segLen, p.skinShade, "#0c0a08");
  if (front && (fist || ext > 1)) {
    ob(ctx, fx - 1, fy + segLen - 2, foreW + 3, foreW + 3, p.skinShade, "#0c0a08");
  } else {
    ob(ctx, fx, fy + segLen - 1, foreW + 1, foreW + 1, p.skinShade, "#0c0a08");
  }
}

function drawTorso(ctx, cx, shoulderY, shoulderW, waistY, waistW, p) {
  ctx.fillStyle = "#0c0a08";
  ctx.beginPath();
  ctx.moveTo(cx - shoulderW / 2 - 1, shoulderY - 1);
  ctx.lineTo(cx + shoulderW / 2 + 1, shoulderY - 1);
  ctx.lineTo(cx + waistW / 2 + 1, waistY + 1);
  ctx.lineTo(cx - waistW / 2 - 1, waistY + 1);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = p.shirt;
  ctx.beginPath();
  ctx.moveTo(cx - shoulderW / 2, shoulderY);
  ctx.lineTo(cx + shoulderW / 2, shoulderY);
  ctx.lineTo(cx + waistW / 2, waistY);
  ctx.lineTo(cx - waistW / 2, waistY);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = p.shirtShade;
  ctx.fillRect(cx - shoulderW / 2 + 3, shoulderY + 5, 3, Math.max(2, waistY - shoulderY - 10));
  ctx.fillStyle = p.accent;
  ctx.fillRect(cx - waistW / 2 - 1, waistY - 3, waistW + 2, 4);
}

function drawFeature(ctx, name, hx, hy, headW, headH, p) {
  switch (name) {
    case "headband": px(ctx, hx - 3, hy + 3, headW + 6, 5, p.accent); px(ctx, hx + headW, hy + 2, 7, 6, p.accent); break;
    case "beard": px(ctx, hx, hy + headH - 9, headW, 9, "#3a2a1a"); break;
    case "mask": px(ctx, hx - 1, hy + headH - 13, headW + 2, 13, p.shirt); break;
    case "cap": px(ctx, hx - 5, hy - 5, headW + 10, 7, p.shirtShade); px(ctx, hx + headW - 3, hy - 1, 12, 5, p.shirtShade); break;
    case "visor": px(ctx, hx - 1, hy + 5, headW + 2, 5, "#1a2a3a"); break;
    case "hood": px(ctx, hx - 5, hy - 4, headW + 10, 8, p.shirt); px(ctx, hx - 6, hy + 2, 4, 10, p.shirt); break;
    case "topknot": px(ctx, hx + headW / 2 - 2, hy - 4, 4, 5, p.hair); break;
    default: break;
  }
}

function ryoIntro(t) {
  setFeature("headband");
  const ph = clamp(t / 90, 0, 1);
  const charge = ease(ph);
  return {
    feature: "headband", lean: -2, crouch: 0.15 + charge * 0.15,
    armF: 6, armFUp: 0, armB: 4, legA: 4, legB: -4, headTilt: -1, armFist: true,
    fx: (ctx, p, b, tt) => {
      const a = charge * (0.4 + Math.sin(tt * 0.3) * 0.15);
      ctx.globalAlpha = a;
      const g = ctx.createRadialGradient(0, -40, 4, 0, -40, 60);
      g.addColorStop(0, p.accent); g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, -40, 60, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
      for (let i = 0; i < 5; i++) { const y = -10 - ((tt * 1.5 + i * 14) % 70); ctx.globalAlpha = charge * 0.7; px(ctx, (i - 2) * 6, y, 2, 2, p.accent); }
      ctx.globalAlpha = 1;
      ctx.fillStyle = p.accent;
      for (let i = 0; i < 3; i++) px(ctx, 10 + i * 3, -70 + Math.sin(tt * 0.2 + i) * 2, 8, 2, p.accent);
    }
  };
}

function brutusIntro(t) {
  setFeature("beard");
  const slam = t > 50 && t < 70;
  const ph = clamp(t / 50, 0, 1);
  return {
    feature: "beard", lean: slam ? 8 : 0, crouch: slam ? 0.6 : 0.2 + ease(ph) * 0.2,
    armF: slam ? 20 : 14, armB: slam ? 20 : 14, armFUp: slam ? 0 : -8, armBUp: slam ? 0 : -8,
    legA: 6, legB: -6, headTilt: slam ? 3 : 0, armFist: true,
    fx: (ctx, p, b, tt) => {
      if (slam) {
        ctx.globalAlpha = 0.5; ctx.strokeStyle = "#d8a040"; ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(0, 2, 20 + i * 14, 5 + i * 3, 0, 0, Math.PI * 2); ctx.stroke(); }
        ctx.globalAlpha = 1; ctx.fillStyle = "#1a1410";
        for (let i = 0; i < 5; i++) px(ctx, (i - 2) * 10, 0, 2, 3, "#1a1410");
      } else {
        if (Math.floor(tt * 0.2) % 3 === 0) { ctx.globalAlpha = 0.8; px(ctx, 16, -40, 2, 2, "#ffe8a0"); ctx.globalAlpha = 1; }
      }
    }
  };
}

function ayumiIntro(t) {
  setFeature("mask");
  const vanished = t > 30 && t < 55;
  const reappear = t >= 55;
  const ph = clamp((reappear ? (t - 55) / 25 : 0), 0, 1);
  return {
    feature: "mask", crouch: reappear ? 0.5 - ease(ph) * 0.3 : 0.2,
    lean: -2, armF: 8, armB: 4, legA: 3, legB: -3, headTilt: -1, armFist: true, bob: vanished ? -40 : 0,
    fx: (ctx, p, b, tt) => {
      ctx.globalAlpha = 0.4; ctx.fillStyle = "#6a5a6a";
      for (let i = 0; i < 5; i++) { const r = 6 + ((tt + i * 8) % 30) * 0.4; ctx.beginPath(); ctx.ellipse((i - 2) * 8, -30 - ((tt + i * 10) % 40), r, r * 0.8, 0, 0, Math.PI * 2); ctx.fill(); }
      ctx.globalAlpha = 1;
      if (vanished) { ctx.globalAlpha = 0.5; px(ctx, -10, -50, 20, 4, p.accent); ctx.globalAlpha = 1; }
      if (reappear) { ctx.globalAlpha = 1 - ease(ph); ctx.fillStyle = p.accent; ctx.beginPath(); ctx.arc(0, -40, 20 * (1 - ease(ph)), 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; }
    }
  };
}

function axelIntro(t) {
  setFeature("cap");
  const spin = (t * 0.4) % (Math.PI * 4);
  const caught = t > 80;
  return {
    feature: "cap", lean: -1, crouch: 0.1, armF: caught ? 16 : 6, armFUp: caught ? -4 : -10,
    armB: 4, legA: 3, legB: -3, armFist: caught,
    fx: (ctx, p, b, tt) => {
      if (!caught) {
        const kx = 6, ky = -54 - Math.abs(Math.sin(spin * 0.5)) * 6;
        ctx.save(); ctx.translate(kx, ky); ctx.rotate(spin);
        px(ctx, -1, -8, 2, 16, "#c8c8c8"); px(ctx, -3, 6, 6, 3, "#4a3a2a");
        ctx.restore();
      } else if (t < 100) { ctx.globalAlpha = 0.8; px(ctx, 14, -50, 3, 3, "#ffe8a0"); ctx.globalAlpha = 1; }
    }
  };
}

const INTROS = { ryo: ryoIntro, brutus: brutusIntro, ayumi: ayumiIntro, axel: axelIntro };

export function drawIntro(ctx, f, t) {
  const b = BUILD[f.build] || BUILD.normal;
  const p = f.palette;
  const def = (INTROS[f.charId] || ryoIntro)(t);
  def.t = t;
  ctx.save();
  ctx.translate(Math.round(f.x), Math.round(f.y));
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath(); ctx.ellipse(0, 2, 28 * b.w, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.save();
  ctx.scale(f.facing, 1);
  drawStance(ctx, p, b, def);
  ctx.restore();
  ctx.save();
  ctx.scale(f.facing, 1);
  if (def.fx) def.fx(ctx, p, b, t);
  ctx.restore();
  ctx.restore();
}
