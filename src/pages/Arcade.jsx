import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PixelButton from "@/components/PixelButton";
import Embers from "@/components/Embers";
import FullscreenButton from "@/components/FullscreenButton";
import { CHARACTERS } from "@/data/characters";
import { Swords, Cpu, Target, Medal, Settings as SettingsIcon, Flame } from "lucide-react";

const CLIP = "polygon(0 12px,12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)";
const CLIP_SM = "polygon(0 8px,8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%)";

export default function Arcade() {
  const navigate = useNavigate();
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => f + 1), 120);
    return () => clearInterval(id);
  }, []);

  const idleBob = Math.sin(frame * 0.2) * 3;
  const buildings = useMemo(
    () => Array.from({ length: 16 }, (_, i) => ({
      h: 36 + Math.round(Math.abs(Math.sin(i * 1.7 + 0.4)) * 96),
      w: 26 + (i % 3) * 12,
      win: (i * 7) % 5 < 2
    })),
    []
  );

  const play = (mode) => {
    localStorage.setItem("pb_mode", mode);
    navigate("/select");
  };

  const modes = [
    { label: "VS BOT", desc: "Fight the CPU", mode: "bot", icon: Cpu },
    { label: "GAUNTLET", desc: "Survival climb", mode: "continues", icon: Medal },
    { label: "TRAINING", desc: "Practice freely", mode: "train", icon: Target }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#08060c] text-[#e8d8b0]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1428] via-[#0c0916] to-[#050309]" />
      {/* moon glow */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[6%] w-[460px] h-[460px] rounded-full" style={{ background: "radial-gradient(circle, rgba(220,200,150,0.22), rgba(180,140,80,0.07) 45%, transparent 70%)" }} />
      <div className="absolute left-1/2 -translate-x-1/2 top-[11%] w-16 h-16 rounded-full bg-[#ece0b8]" style={{ boxShadow: "0 0 60px 22px rgba(232,216,160,0.22)" }} />
      {/* skyline */}
      <div className="absolute bottom-[20%] left-0 right-0 flex items-end justify-center gap-[2px] opacity-70">
        {buildings.map((b, i) => (
          <div key={i} className="relative bg-[#0a0712] border-t-2 border-[#161024]" style={{ height: b.h, width: b.w }}>
            {b.win && <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[3px] h-[3px] bg-[#c8a040]" style={{ boxShadow: "0 0 4px #c8a040" }} />}
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-gradient-to-b from-[#2a2018] to-[#100a06] border-t-4 border-[#3a2a1a]" style={{ boxShadow: "inset 0 6px 18px rgba(0,0,0,0.6)" }} />
      <Embers count={28} />
      <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 220px 60px rgba(0,0,0,0.85)" }} />
      <div className="absolute inset-0 pointer-events-none opacity-[0.07]" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 3px)" }} />

      <style>{`@keyframes flicker{0%,100%{opacity:1}50%{opacity:0.85}} @keyframes pulseGlow{0%,100%{filter:drop-shadow(0 0 6px rgba(240,192,96,0.6))}50%{filter:drop-shadow(0 0 14px rgba(240,192,96,0.9))}}`}</style>

      <div className="absolute top-4 right-4 z-20"><FullscreenButton /></div>

      <div className="relative z-10 flex flex-col items-center min-h-screen px-4 py-10">
        {/* title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Flame className="w-5 h-5 text-[#c8542a]" style={{ filter: "drop-shadow(0 0 6px rgba(200,80,40,0.8))" }} />
            <p className="text-[10px] text-[#8a7a5a] tracking-[0.4em]" style={{ fontFamily: "'Press Start 2P', monospace" }}>ARCADE FIGHTER</p>
            <Flame className="w-5 h-5 text-[#c8542a]" style={{ filter: "drop-shadow(0 0 6px rgba(200,80,40,0.8))" }} />
          </div>
          <h1 className="text-3xl sm:text-5xl text-[#f0c060] tracking-widest" style={{ fontFamily: "'Press Start 2P', monospace", textShadow: "4px 4px 0 #6a1a08, 8px 8px 0 rgba(0,0,0,0.6)", animation: "flicker 3s infinite" }}>PIXEL BATTLE</h1>
          <div className="mx-auto mt-3 h-[2px] w-56 bg-gradient-to-r from-transparent via-[#8a1a1a] to-transparent" />
          <p className="text-[9px] text-[#9a8a70] mt-4 tracking-widest" style={{ fontFamily: "'Press Start 2P', monospace" }}>INSERT COIN — PRESS PLAY</p>
        </div>

        {/* idle fighter pedestal */}
        <div className="mb-8 flex justify-center" style={{ height: 120 }}>
          <IdleFighter char={CHARACTERS[0]} bob={idleBob} />
        </div>

        {/* big play */}
        <button
          onClick={() => play("bot")}
          className="flex items-center justify-center gap-2 px-8 py-4 text-sm uppercase tracking-widest transition-all active:translate-y-0.5 mb-6"
          style={{ fontFamily: "'Press Start 2P', monospace", clipPath: CLIP, background: "linear-gradient(180deg,#c82828,#5a0a0a)", color: "#ffe8c0", border: "2px solid #e8a040", textShadow: "0 0 10px rgba(255,80,40,0.9)", animation: "pulseGlow 2s infinite" }}
        >
          <Swords className="w-4 h-4" /> Play
        </button>

        {/* mode tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg mb-6">
          {modes.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.label}
                onClick={() => play(m.mode)}
                className="group relative text-left transition-all hover:-translate-y-0.5"
                style={{ clipPath: CLIP_SM, background: "linear-gradient(180deg,#2a2520,#16110d)", border: "2px solid #3a2f24" }}
              >
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#5a2010] group-hover:bg-[#c8542a] transition-colors" />
                <div className="flex items-center gap-3 px-4 py-4">
                  {Icon && <Icon className="w-5 h-5 text-[#8a7a4a] group-hover:text-[#f0c060] transition-colors flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-[#e8d8b0] group-hover:text-[#f0c060] transition-colors" style={{ fontFamily: "'Press Start 2P', monospace" }}>{m.label}</div>
                    <div className="text-[8px] text-[#6a5a3a] mt-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>{m.desc}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <PixelButton variant="ghost" icon={SettingsIcon} onClick={() => navigate("/settings")}>Settings</PixelButton>

        <p className="mt-10 text-[8px] text-[#4a3f2f] tracking-widest" style={{ fontFamily: "'Press Start 2P', monospace" }}>© PIXEL BATTLE ARCADE</p>
      </div>
    </div>
  );
}

function IdleFighter({ char, bob }) {
  const p = char.palette;
  return (
    <div className="relative" style={{ width: 96, height: 120, transform: `translateY(${bob}px)` }}>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-3 bg-black/50 rounded-full blur-[1px]" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#3a2a1a]" />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center" style={{ fontFamily: "monospace" }}>
        <div className="w-6 h-5" style={{ background: p.hair }} />
        <div className="w-6 h-5 -mt-1" style={{ background: p.skin }}>
          <div className="w-1.5 h-1 ml-auto mr-1 mt-1.5" style={{ background: "#1a1a1a" }} />
        </div>
        <div className="w-8 h-7 -mt-0.5" style={{ background: p.shirt }}>
          <div className="w-8 h-1" style={{ background: p.accent }} />
        </div>
        <div className="flex gap-1 -mt-0.5">
          <div className="w-2.5 h-5" style={{ background: p.pants }} />
          <div className="w-2.5 h-5" style={{ background: p.pants }} />
        </div>
        <div className="flex gap-1">
          <div className="w-2.5 h-1.5" style={{ background: p.boots }} />
          <div className="w-2.5 h-1.5" style={{ background: p.boots }} />
        </div>
      </div>
    </div>
  );
}