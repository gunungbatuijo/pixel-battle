import React from "react";

export default function StaticFighter({ palette: p, facing = 1, size = 1 }) {
  if (!p) return null;
  const s = size;
  return (
    <div className="relative" style={{ width: 64 * s, height: 96 * s, transform: `scaleX(${facing})` }}>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-black/50 rounded-full" style={{ transform: `translateX(-50%) scaleX(${facing})` }} />
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex flex-col items-center" style={{ fontFamily: "monospace" }}>
        <div className="w-7 h-4" style={{ background: p.hair, boxShadow: `0 -2px 0 ${p.hairShade || p.hair}` }} />
        <div className="w-7 h-5 -mt-1 relative" style={{ background: p.skin }}>
          <div className="absolute right-1 top-1.5 w-1.5 h-1.5" style={{ background: "#1a1a1a" }} />
          <div className="absolute left-0 top-0 w-7 h-1" style={{ background: p.hair }} />
        </div>
        <div className="w-9 h-8 -mt-0.5 relative" style={{ background: p.shirt }}>
          <div className="absolute top-0 left-0 w-9 h-1.5" style={{ background: p.shirtShade }} />
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-6 h-1" style={{ background: p.accent }} />
        </div>
        <div className="flex -mt-7 w-12 justify-between">
          <div className="w-2 h-7" style={{ background: p.skin }} />
          <div className="w-2 h-7" style={{ background: p.skinShade }} />
        </div>
        <div className="flex gap-1 -mt-1">
          <div className="w-3 h-6" style={{ background: p.pants }} />
          <div className="w-3 h-6" style={{ background: p.pantsShade }} />
        </div>
        <div className="flex gap-1">
          <div className="w-3 h-2" style={{ background: p.boots }} />
          <div className="w-3 h-2" style={{ background: p.boots }} />
        </div>
      </div>
    </div>
  );
}
