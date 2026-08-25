import React, { useEffect, useRef } from "react";
import { drawFighter } from "@/game/fighterRenderer";

export default function FighterPortrait({ character, facing = 1, height = 160 }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); ctx.imageSmoothingEnabled = false;
    const c = character; let raf; let t = 0;
    const fighter = { palette: c.palette, build: c.build, feature: c.feature, state: "idle", animFrame: 0, facing, onGround: true, vy: 0, attackTimer: 0, attackPhase: 0, attackType: null, crouching: false, x: canvas.width / 2, y: canvas.height - 10 };
    const loop = () => {
      t += 1; fighter.animFrame = t * 0.1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const g = ctx.createRadialGradient(canvas.width / 2, canvas.height - 6, 2, canvas.width / 2, canvas.height - 6, 60);
      g.addColorStop(0, "rgba(200,40,40,0.25)"); g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#2a1a16"; ctx.fillRect(0, canvas.height - 6, canvas.width, 2);
      drawFighter(ctx, fighter);
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [character, facing]);
  return (<canvas ref={ref} width={130} height={height} style={{ imageRendering: "pixelated", width: "100%", maxWidth: 130, height: "auto" }} />);
}
