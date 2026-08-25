import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PixelButton from "@/components/PixelButton";
import FullscreenButton from "@/components/FullscreenButton";
import { getMyProfile, getLeaderboard, rankForElo, nextTier, progressToNext } from "@/lib/ranked";
import { Swords, Trophy, Flame, TrendingUp, Settings as SettingsIcon, User as UserIcon, ChevronRight } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [rain, setRain] = useState([]);
  const [profile, setProfile] = useState(null);
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const drops = Array.from({ length: 50 }, () => ({ left: Math.random() * 100, delay: Math.random() * 2, duration: 0.5 + Math.random() * 0.6 }));
    setRain(drops);
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [p, b] = await Promise.all([getMyProfile(), getLeaderboard(5)]);
        if (!alive) return;
        setProfile(p); setBoard(b);
      } catch (e) {} finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#1a1f2e] text-[#e8d8b0]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#2a2030] via-[#1a1f2e] to-[#0f1018]" />
      <div className="absolute bottom-0 left-0 right-0 h-1/3 flex items-end gap-1 px-2 opacity-50">
        {[40, 70, 50, 90, 60, 80, 45, 75, 55, 65, 50, 85, 60, 70, 45].map((h, i) => (
          <div key={i} className="flex-1 bg-[#2a2520] border-t-2 border-[#3a3530] relative" style={{ height: `${h}%` }}>
            <div className="absolute inset-0 grid grid-cols-2 gap-1 p-1">
              {Array.from({ length: 8 }).map((_, j) => (<div key={j} className="bg-[#d8a850]/60" style={{ opacity: (i + j) % 3 === 0 ? 0.9 : 0.2 }} />))}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 pointer-events-none">
        {rain.map((d, i) => (<div key={i} className="absolute top-0 w-px h-6 bg-[#9ab8d8]/40" style={{ left: `${d.left}%`, animation: `fall ${d.duration}s linear ${d.delay}s infinite` }} />))}
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 200px 40px rgba(0,0,0,0.8)" }} />
      <style>{`@keyframes fall{to{transform:translateY(110vh)}} @keyframes flicker{0%,100%{opacity:1}50%{opacity:0.85}} @keyframes pulseGlow{0%,100%{filter:drop-shadow(0 0 6px rgba(240,192,96,0.6))}50%{filter:drop-shadow(0 0 14px rgba(240,192,96,0.9))}}`}</style>
      <div className="absolute top-4 right-4 z-20"><FullscreenButton /></div>
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10 flex flex-col items-center">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-6xl md:text-7xl leading-tight text-[#f0c060]" style={{ fontFamily: "'Press Start 2P', monospace", textShadow: "4px 4px 0 #6a3a1a, 8px 8px 0 #2a1810", animation: "flicker 3s infinite" }}>PIXEL</h1>
          <h1 className="text-4xl sm:text-6xl md:text-7xl leading-tight text-[#e8d8b0]" style={{ fontFamily: "'Press Start 2P', monospace", textShadow: "4px 4px 0 #4a3a2a, 8px 8px 0 #1a1410" }}>BATTLE</h1>
          <div className="mx-auto mt-4 flex items-center gap-2 justify-center">
            <span className="h-[2px] w-10 bg-[#8a1a1a]" />
            <p className="text-[9px] sm:text-xs text-[#9a8a70] tracking-widest" style={{ fontFamily: "'Press Start 2P', monospace" }}>A RETRO 8-BIT FIGHTING EXPERIENCE</p>
            <span className="h-[2px] w-10 bg-[#8a1a1a]" />
          </div>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <RankCard profile={profile} loading={loading} />
          <Leaderboard board={board} loading={loading} />
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs mb-6">
          <button onClick={() => navigate("/menu")} className="flex items-center justify-center gap-2 px-6 py-4 text-sm uppercase tracking-widest transition-all active:translate-y-0.5" style={{ fontFamily: "'Press Start 2P', monospace", clipPath: "polygon(0 12px,12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)", background: "linear-gradient(180deg,#c82828,#5a0a0a)", color: "#ffe8c0", border: "2px solid #e8a040", textShadow: "0 0 10px rgba(255,80,40,0.9)", animation: "pulseGlow 2s infinite" }}>
            <Swords className="w-4 h-4" /> Play
          </button>
          <div className="flex gap-3">
            <PixelButton variant="ghost" className="flex-1 text-[10px]" onClick={() => navigate("/profile")}><UserIcon className="w-3 h-3 inline mr-1" />Profile</PixelButton>
            <PixelButton variant="ghost" className="flex-1 text-[10px]" onClick={() => navigate("/settings")}><SettingsIcon className="w-3 h-3 inline mr-1" />Settings</PixelButton>
          </div>
        </div>
        <p className="text-[8px] sm:text-[10px] text-[#6a5a3a] tracking-widest" style={{ fontFamily: "'Press Start 2P', monospace" }}>INSERT COIN — PRESS PLAY</p>
      </div>
    </div>
  );
}

function RankCard({ profile, loading }) {
  if (loading || !profile) {
    return (<div className="border-2 border-[#3a2a2a] p-5 bg-black/40" style={{ clipPath: "polygon(0 12px,12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)" }}><div className="h-32 flex items-center justify-center text-[9px] text-[#6a5a3a]" style={{ fontFamily: "'Press Start 2P', monospace" }}>LOADING RANK...</div></div>);
  }
  const rank = rankForElo(profile.elo);
  const nxt = nextTier(profile.elo);
  const prog = progressToNext(profile.elo);
  const total = (profile.wins || 0) + (profile.losses || 0);
  const wr = total > 0 ? Math.round(((profile.wins || 0) / total) * 100) : 0;
  return (
    <div className="relative border-2 p-5 bg-black/50" style={{ clipPath: "polygon(0 12px,12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)", borderColor: `${rank.color}99`, boxShadow: `0 0 18px ${rank.color}33` }}>
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16 flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${rank.color}, #1a0a0a)`, clipPath: "polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)", border: `2px solid ${rank.color}` }}>
          <span className="text-[8px] text-center leading-tight" style={{ fontFamily: "'Press Start 2P', monospace", color: "#0a0608" }}>{rank.name.slice(0, 4).toUpperCase()}</span>
        </div>
        <div className="min-w-0">
          <p className="text-[8px] text-[#8a7a5a] tracking-widest" style={{ fontFamily: "'Press Start 2P', monospace" }}>RANK</p>
          <p className="text-sm truncate" style={{ fontFamily: "'Press Start 2P', monospace", color: rank.color }}>{rank.name.toUpperCase()}</p>
          <p className="text-lg mt-1" style={{ fontFamily: "'Press Start 2P', monospace", color: "#f0e0c0" }}>{profile.elo} <span className="text-[8px] text-[#6a5a3a]">ELO</span></p>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex justify-between text-[7px] text-[#6a5a3a] mb-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>
          <span>{rank.name.toUpperCase()}</span><span>{nxt ? nxt.name.toUpperCase() : "MAX"}</span>
        </div>
        <div className="h-2.5 bg-[#0a0608] border border-[#3a2a2a]" style={{ boxShadow: "inset 0 1px 2px rgba(0,0,0,0.8)" }}>
          <div className="h-full" style={{ width: `${prog * 100}%`, background: `linear-gradient(90deg, ${rank.color}, #f0c060)`, boxShadow: `0 0 6px ${rank.color}99` }} />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <Stat icon={<Trophy className="w-3 h-3" />} label="W" value={profile.wins || 0} color="#5ad860" />
        <Stat icon={<TrendingUp className="w-3 h-3 rotate-180" />} label="L" value={profile.losses || 0} color="#d8442a" />
        <Stat icon={<Flame className="w-3 h-3" />} label="STK" value={profile.streak || 0} color="#f0a040" />
        <Stat label="WR" value={`${wr}%`} color="#5a9af8" />
      </div>
    </div>
  );
}

function Stat({ icon, label, value, color }) {
  return (
    <div className="text-center px-1 py-1.5 bg-[#0a0608] border border-[#3a2a2a]" style={{ clipPath: "polygon(0 6px,6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%)" }}>
      <div className="flex items-center justify-center gap-0.5" style={{ color }}>{icon}<span className="text-[6px] text-[#8a6a40]" style={{ fontFamily: "'Press Start 2P', monospace" }}>{label}</span></div>
      <div className="text-[10px] mt-0.5" style={{ fontFamily: "'Press Start 2P', monospace", color }}>{value}</div>
    </div>
  );
}

function Leaderboard({ board, loading }) {
  return (
    <div className="border-2 border-[#3a2a2a] p-5 bg-black/40" style={{ clipPath: "polygon(0 12px,12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)" }}>
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-3.5 h-3.5 text-[#f0c060]" />
        <p className="text-[9px] text-[#c8a040] tracking-widest" style={{ fontFamily: "'Press Start 2P', monospace" }}>TOP FIGHTERS</p>
        <div className="flex-1 h-px bg-gradient-to-r from-[#5a2020] to-transparent" />
      </div>
      {loading ? (
        <div className="h-32 flex items-center justify-center text-[9px] text-[#6a5a3a]" style={{ fontFamily: "'Press Start 2P', monospace" }}>LOADING...</div>
      ) : board.length === 0 ? (
        <div className="h-32 flex items-center justify-center text-[9px] text-[#6a5a3a] text-center" style={{ fontFamily: "'Press Start 2P', monospace" }}>NO RANKED<br />FIGHTERS YET</div>
      ) : (
        <div className="space-y-1.5">
          {board.map((p, i) => {
            const r = rankForElo(p.elo);
            const medal = ["#f0c060", "#c8c8c8", "#c08050"][i] || "#5a4a30";
            return (
              <div key={p.id} className="flex items-center gap-2 px-2 py-1.5 bg-[#120a0c] border border-[#2a1818]" style={{ clipPath: "polygon(0 6px,6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%)" }}>
                <span className="text-[10px] w-5 text-center" style={{ fontFamily: "'Press Start 2P', monospace", color: medal }}>{i + 1}</span>
                <span className="w-2 h-2 rounded-full" style={{ background: r.color, boxShadow: `0 0 5px ${r.color}` }} />
                <span className="flex-1 text-[8px] truncate" style={{ fontFamily: "'Press Start 2P', monospace", color: "#e8d8b0" }}>{p.name}</span>
                <span className="text-[9px]" style={{ fontFamily: "'Press Start 2P', monospace", color: r.color }}>{p.elo}</span>
                <ChevronRight className="w-3 h-3 text-[#4a3a2a]" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
