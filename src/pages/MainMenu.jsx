import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wifi, Cpu, Trophy, Medal, Target, User, Settings, LogOut, ChevronRight, Flame, Skull, GitBranch } from "lucide-react";
import Embers from "@/components/Embers";
import FullscreenButton from "@/components/FullscreenButton";
import { CHARACTERS } from "@/data/characters";

export default function MainMenu() {
  const navigate = useNavigate();
  const [username] = useState(() => localStorage.getItem("pb_username") || "GUEST_FIGHTER");
  const [frame, setFrame] = useState(0);
  const [pickMode, setPickMode] = useState(null);

  useEffect(() => { const id = setInterval(() => setFrame((f) => f + 1), 120); return () => clearInterval(id); }, []);

  const idleBob = Math.sin(frame * 0.2) * 3;
  const buildings = useMemo(() => Array.from({ length: 16 }, (_, i) => ({ h: 36 + Math.round(Math.abs(Math.sin(i * 1.7 + 0.4)) * 96), w: 26 + (i % 3) * 12, win: (i * 7) % 5 < 2 })), []);

  const menu = [
    { label: "Online Match", desc: "Public or custom rooms", to: "/multiplayer", icon: Wifi },
    { label: "Vs Bot", desc: "Fight the CPU", to: "/select", mode: "bot", icon: Cpu },
    { label: "Ranked Match", desc: "Survival gauntlet", to: "/select", mode: "ranked", icon: Trophy },
    { label: "Continues Match", desc: "Image-rank gauntlet", to: "/select", mode: "continues", icon: Medal },
    { label: "Training", desc: "Practice freely", to: "/select", mode: "train", icon: Target },
    { label: "Commit Tracker", desc: "Combat mechanic commits", to: "/commits", icon: GitBranch },
    { label: "Profile", desc: "Your stats & rank", to: "/profile", icon: User },
    { label: "Settings", desc: "Controls & audio", to: "/settings", icon: Settings },
    { label: "Exit", desc: "Back to title", to: "/", icon: LogOut }
  ];

  const go = (m) => {
    if (m.mode === "ranked" || m.mode === "continues") { setPickMode(m); return; }
    if (m.to === "/multiplayer") localStorage.setItem("pb_mode", "online");
    else if (m.mode) localStorage.setItem("pb_mode", m.mode);
    navigate(m.to);
  };

  const pickOpponent = (who) => { if (!pickMode) return; localStorage.setItem("pb_mode", pickMode.mode); setPickMode(null); navigate(who === "player" ? "/multiplayer" : "/select"); };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#08060c] text-[#e8d8b0]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1428] via-[#0c0916] to-[#050309]" />
      <div className="absolute left-1/2 -translate-x-1/2 top-[6%] w-[460px] h-[460px] rounded-full" style={{ background: "radial-gradient(circle, rgba(220,200,150,0.22), rgba(180,140,80,0.07) 45%, transparent 70%)" }} />
      <div className="absolute left-1/2 -translate-x-1/2 top-[11%] w-16 h-16 rounded-full bg-[#ece0b8]" style={{ boxShadow: "0 0 60px 22px rgba(232,216,160,0.22)" }} />
      <div className="absolute bottom-[20%] left-0 right-0 flex items-end justify-center gap-[2px] opacity-70">
        {buildings.map((b, i) => (<div key={i} className="relative bg-[#0a0712] border-t-2 border-[#161024]" style={{ height: b.h, width: b.w }}>{b.win && <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[3px] h-[3px] bg-[#c8a040]" style={{ boxShadow: "0 0 4px #c8a040" }} />}</div>))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-gradient-to-b from-[#2a2018] to-[#100a06] border-t-4 border-[#3a2a1a]" style={{ boxShadow: "inset 0 6px 18px rgba(0,0,0,0.6)" }}>
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent 0 22px, rgba(0,0,0,0.4) 22px 24px), repeating-linear-gradient(0deg, transparent 0 14px, rgba(0,0,0,0.3) 14px 15px)" }} />
      </div>
      <Embers count={28} />
      <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 220px 60px rgba(0,0,0,0.85)" }} />
      <div className="absolute inset-0 pointer-events-none opacity-[0.07]" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 3px)" }} />
      <div className="absolute top-4 right-4 z-20"><FullscreenButton /></div>
      <div className="relative z-10 flex flex-col items-center min-h-screen px-4 py-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Flame className="w-5 h-5 text-[#c8542a]" style={{ filter: "drop-shadow(0 0 6px rgba(200,80,40,0.8))" }} />
            <p className="text-[10px] text-[#8a7a5a] tracking-[0.4em]" style={{ fontFamily: "'Press Start 2P', monospace" }}>ARCADE FIGHTER</p>
            <Flame className="w-5 h-5 text-[#c8542a]" style={{ filter: "drop-shadow(0 0 6px rgba(200,80,40,0.8))" }} />
          </div>
          <h1 className="text-3xl sm:text-5xl text-[#f0c060] tracking-widest" style={{ fontFamily: "'Press Start 2P', monospace", textShadow: "4px 4px 0 #6a1a08, 8px 8px 0 rgba(0,0,0,0.6)" }}>PIXEL BATTLE</h1>
          <div className="mx-auto mt-3 h-[2px] w-56 bg-gradient-to-r from-transparent via-[#8a1a1a] to-transparent" />
          <p className="text-[10px] text-[#e8d8b0] mt-4 tracking-widest" style={{ fontFamily: "'Press Start 2P', monospace" }}>WELCOME, <span className="text-[#c8a040]">{username}</span></p>
        </div>
        <div className="mb-8 flex justify-center" style={{ height: 120 }}><IdleFighter char={CHARACTERS[0]} bob={idleBob} /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
          {menu.map((m) => {
            const Icon = m.icon;
            return (
              <button key={m.label} onClick={() => go(m)} className="group relative text-left transition-all hover:-translate-y-0.5" style={{ clipPath: "polygon(0 8px,8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%)", background: "linear-gradient(180deg,#2a2520,#16110d)", border: "2px solid #3a2f24" }}>
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#5a2010] group-hover:bg-[#c8542a] transition-colors" />
                <div className="flex items-center gap-3 px-5 py-4">
                  {Icon && <Icon className="w-5 h-5 text-[#8a7a4a] group-hover:text-[#f0c060] transition-colors flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-[#e8d8b0] group-hover:text-[#f0c060] transition-colors" style={{ fontFamily: "'Press Start 2P', monospace" }}>{m.label}</div>
                    <div className="text-[9px] text-[#6a5a3a] mt-1.5" style={{ fontFamily: "'Press Start 2P', monospace" }}>{m.desc}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#4a3f2f] group-hover:text-[#c8a040] group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
                <span className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" style={{ boxShadow: "inset 0 0 20px rgba(232,160,64,0.15)" }} />
              </button>
            );
          })}
        </div>
        <p className="mt-10 text-[8px] text-[#4a3f2f] tracking-widest" style={{ fontFamily: "'Press Start 2P', monospace" }}>© PIXEL BATTLE ARCADE</p>
      </div>
      {pickMode && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="relative bg-[#1a1310] border-2 border-[#f0c060] p-7 max-w-sm w-full text-center" style={{ clipPath: "polygon(0 12px,12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)", boxShadow: "0 0 40px rgba(232,160,64,0.25)" }}>
            <Skull className="mx-auto mb-3 w-7 h-7 text-[#8a1a1a]" style={{ filter: "drop-shadow(0 0 6px rgba(200,40,40,0.8))" }} />
            <h3 className="text-[#f0c060] text-sm mb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>{pickMode.label.toUpperCase()}</h3>
            <p className="text-[9px] text-[#8a7a5a] mb-6" style={{ fontFamily: "'Press Start 2P', monospace" }}>CHOOSE OPPONENT</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => pickOpponent("player")} className="px-5 py-4 text-[11px] text-[#fff0d0] border-2 border-[#e8a040] border-b-4 active:translate-y-0.5 transition-all" style={{ fontFamily: "'Press Start 2P', monospace", background: "linear-gradient(180deg,#c8542a,#7a2410)", clipPath: "polygon(0 8px,8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%)" }}>VS PLAYER</button>
              <button onClick={() => pickOpponent("bot")} className="px-5 py-4 text-[11px] text-[#e8d8b0] border-2 border-[#4a4540] border-b-4 active:translate-y-0.5 transition-all" style={{ fontFamily: "'Press Start 2P', monospace", background: "linear-gradient(180deg,#2a2520,#15110d)", clipPath: "polygon(0 8px,8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%)" }}>VS BOT</button>
              <button onClick={() => setPickMode(null)} className="text-[9px] text-[#8a7a5a] hover:text-[#f0c060] mt-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function IdleFighter({ char, bob }) {
  const p = char.palette;
  return (
    <div className="relative" style={{ width: 96, height: 120, transform: "translateY(" + bob + "px)" }}>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-3 bg-black/50 rounded-full blur-[1px]" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#3a2a1a]" />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center" style={{ fontFamily: "monospace" }}>
        <div className="w-6 h-5" style={{ background: p.hair }} />
        <div className="w-6 h-5 -mt-1" style={{ background: p.skin }}><div className="w-1.5 h-1 ml-auto mr-1 mt-1.5" style={{ background: "#1a1a1a" }} /></div>
        <div className="w-8 h-7 -mt-0.5" style={{ background: p.shirt }}><div className="w-8 h-1" style={{ background: p.accent }} /></div>
        <div className="flex gap-1 -mt-0.5"><div className="w-2.5 h-5" style={{ background: p.pants }} /><div className="w-2.5 h-5" style={{ background: p.pants }} /></div>
        <div className="flex gap-1"><div className="w-2.5 h-1.5" style={{ background: p.boots }} /><div className="w-2.5 h-1.5" style={{ background: p.boots }} /></div>
      </div>
    </div>
  );
}
