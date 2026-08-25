import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PixelButton from "@/components/PixelButton";
import FighterPortrait from "@/components/FighterPortrait";
import StaticFighter from "@/components/StaticFighter";
import Embers from "@/components/Embers";
import { CHARACTERS } from "@/data/characters";
import { STAGES } from "@/data/stages";
import { Swords, Skull, Dices, ChevronLeft } from "lucide-react";

const DIFFICULTIES = ["easy", "normal", "hard", "extreme"];
const CLIP = "polygon(0 12px,12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)";
const CLIP_SM = "polygon(0 8px,8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%)";

const moveKindLabel = (kind) => ({ projectile: "SHOT", grab: "GRAB", launcher: "LAUNCH", dashstrike: "DASH", aoe: "AOE" }[kind] || "—");
const MYSTERY_PALETTE = { skin: "#2a2a2a", skinShade: "#1a1a1a", hair: "#1a1a1a", shirt: "#2a2a2a", shirtShade: "#1a1a1a", pants: "#222222", pantsShade: "#181818", accent: "#3a3a3a", boots: "#1a1a1a" };

export default function CharacterSelect() {
  const navigate = useNavigate();
  const mode = localStorage.getItem("pb_mode") || "bot";
  const hiddenEnemy = mode !== "mp" && mode !== "train";
  const [p1, setP1] = useState(() => { const id = localStorage.getItem("pb_p1") || "ryo"; const i = CHARACTERS.findIndex((c) => c.id === id); return i < 0 ? 0 : i; });
  const [p2, setP2] = useState(1);
  const [stage, setStage] = useState(() => { const id = localStorage.getItem("pb_stage") || "alley"; const i = STAGES.findIndex((s) => s.id === id); return i < 0 ? 0 : i; });
  const [diff, setDiff] = useState(1);
  const [active, setActive] = useState(0);

  const rollCpu = () => { let r; do { r = Math.floor(Math.random() * CHARACTERS.length); } while (r === p1); setP2(r); };
  useEffect(() => { if (mode !== "mp") rollCpu(); /* eslint-disable-next-line */ }, [p1, mode]);

  const pick = (i) => { if (mode === "mp") { if (active === 0) setP1(i); else setP2(i); } else { setP1(i); } };
  const start = () => { localStorage.setItem("pb_p1", CHARACTERS[p1].id); localStorage.setItem("pb_p2", CHARACTERS[p2].id); localStorage.setItem("pb_stage", STAGES[stage].id); localStorage.setItem("pb_diff", DIFFICULTIES[diff]); navigate("/game"); };

  return (
    <div className="relative min-h-screen bg-[#080506] text-[#e8d8b0] overflow-y-auto">
      <div className="fixed inset-0 bg-gradient-to-b from-[#1a0608] via-[#0c0608] to-[#050304]" />
      <div className="fixed inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(160,24,24,0.35), transparent 55%)" }} />
      <div className="fixed inset-0"><Embers count={32} /></div>
      <div className="fixed inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 220px 60px rgba(0,0,0,0.9)" }} />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <button onClick={() => navigate("/menu")} className="absolute left-4 top-8 text-[10px] text-[#8a7a5a] hover:text-[#f0c060] flex items-center gap-1" style={{ fontFamily: "'Press Start 2P', monospace" }}><ChevronLeft className="w-4 h-4" /> BACK</button>
          <Skull className="mx-auto mb-3 text-[#8a1a1a] w-7 h-7" style={{ filter: "drop-shadow(0 0 6px rgba(200,40,40,0.8))" }} />
          <h2 className="text-2xl sm:text-4xl text-[#e8c878] tracking-widest" style={{ fontFamily: "'Press Start 2P', monospace", textShadow: "3px 3px 0 #5a0808, 6px 6px 0 rgba(0,0,0,0.6)" }}>SELECT YOUR FIGHTER</h2>
          <div className="mx-auto mt-3 h-[2px] w-48 bg-gradient-to-r from-transparent via-[#8a1a1a] to-transparent" />
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <PreviewPanel label="PLAYER 1" accent="#c8a040" idx={p1} facing={1} />
          <PreviewPanel label={mode === "mp" ? "PLAYER 2" : "CPU"} accent="#c82828" idx={p2} facing={-1} auto={mode !== "mp"} hidden={hiddenEnemy} onRoll={rollCpu} />
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center">
            <div className="relative w-16 h-16 flex items-center justify-center rotate-45 bg-gradient-to-br from-[#8a1a1a] to-[#3a0606] border-2 border-[#c8a040]" style={{ clipPath: "polygon(50% 0,100% 50%,50% 100%,0 50%)" }}><span className="-rotate-45 text-[#e8c878] text-lg" style={{ fontFamily: "'Press Start 2P', monospace" }}>VS</span></div>
          </div>
        </div>
        {mode === "mp" && (
          <div className="flex justify-center gap-3 mb-4">
            {[{ k: "P1", v: 0 }, { k: "P2", v: 1 }].map((t) => (
              <button key={t.v} onClick={() => setActive(t.v)} className="px-5 py-2 text-[10px] tracking-widest transition-all" style={{ fontFamily: "'Press Start 2P', monospace", clipPath: CLIP_SM, background: active === t.v ? "linear-gradient(180deg,#a82828,#5a0c0c)" : "linear-gradient(180deg,#1a0d10,#0a0608)", color: active === t.v ? "#ffe8b0" : "#7a5a40", border: active === t.v ? "1px solid #e8a040" : "1px solid #3a2020" }}>PICK {t.k}</button>
            ))}
          </div>
        )}
        <div className="mb-8">
          <SectionTitle>FIGHTER ROSTER</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {CHARACTERS.map((c, i) => {
              const isP1 = i === p1; const isP2 = i === p2; const focused = mode === "mp" ? (active === 0 ? isP1 : isP2) : isP1;
              return (
                <button key={c.id} onClick={() => pick(i)} className="relative group text-left transition-all hover:-translate-y-1" style={{ clipPath: CLIP_SM, background: focused ? "linear-gradient(180deg,#3a1414,#120606)" : "linear-gradient(180deg,#15090c,#080506)", border: focused ? "1px solid #e8a040" : "1px solid #2a1818", boxShadow: focused ? "0 0 14px rgba(232,160,64,0.35)" : "none" }}>
                  <div className="relative h-28 flex items-end justify-center overflow-hidden" style={{ background: `radial-gradient(circle at 50% 70%, ${c.palette.shirt}22, transparent 70%)` }}>
                    <div className="opacity-90 group-hover:opacity-100 transition-opacity"><StaticFighter palette={c.palette} facing={1} size={1.15} /></div>
                    <span className="absolute top-1 left-1 px-1 py-0.5 text-[6px] text-[#c8a040] bg-black/60" style={{ fontFamily: "'Press Start 2P', monospace" }}>{c.style}</span>
                    {isP1 && <span className="absolute top-1 right-1 px-1 py-0.5 text-[6px] text-[#0a0608] bg-[#c8a040]" style={{ fontFamily: "'Press Start 2P', monospace" }}>P1</span>}
                    {isP2 && !hiddenEnemy && <span className="absolute top-1 right-1 px-1 py-0.5 text-[6px] text-[#ffe8c0] bg-[#c82828]" style={{ fontFamily: "'Press Start 2P', monospace" }}>{mode === "mp" ? "P2" : "CPU"}</span>}
                  </div>
                  <div className="px-2 py-1.5 text-center"><div className="text-[8px] text-[#e8c878] truncate" style={{ fontFamily: "'Press Start 2P', monospace" }}>{c.name.split(" ")[0]}</div></div>
                </button>
              );
            })}
          </div>
        </div>
        {mode !== "mp" && (
          <div className="mb-8">
            <SectionTitle>CPU DIFFICULTY</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTIES.map((d, i) => (
                <button key={d} onClick={() => setDiff(i)} className="px-4 py-2 text-xs uppercase tracking-wider transition-all" style={{ fontFamily: "'Press Start 2P', monospace", clipPath: CLIP_SM, background: diff === i ? "linear-gradient(180deg,#a82828,#5a0c0c)" : "linear-gradient(180deg,#1a0d10,#0a0608)", color: diff === i ? "#ffe8b0" : "#7a5a40", border: diff === i ? "1px solid #e8a040" : "1px solid #3a2020", textShadow: diff === i ? "0 0 8px rgba(255,120,40,0.8)" : "none" }}>{d}</button>
              ))}
            </div>
          </div>
        )}
        <div className="mb-10">
          <SectionTitle>SELECT ARENA</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {STAGES.map((s, i) => (
              <button key={s.id} onClick={() => setStage(i)} className="relative group text-left transition-all" style={{ clipPath: CLIP_SM, background: stage === i ? "linear-gradient(180deg,#3a1414,#120606)" : "linear-gradient(180deg,#15090c,#080506)", border: stage === i ? "1px solid #e8a040" : "1px solid #2a1818" }}>
                <div className="relative h-14 overflow-hidden" style={{ background: `linear-gradient(to bottom, ${s.sky[0]}, ${s.sky[1]})` }}>
                  <div className="absolute bottom-0 left-0 right-0 h-1/2" style={{ background: s.building, opacity: 0.8 }} />
                  <div className="absolute bottom-0 left-0 right-0 h-2" style={{ background: s.ground }} />
                  {stage === i && <div className="absolute inset-0 ring-1 ring-inset ring-[#e8a040]/60" />}
                </div>
                <div className="px-2 py-1.5 text-[8px] text-[#e8d8b0] truncate" style={{ fontFamily: "'Press Start 2P', monospace" }}>{s.name}</div>
                {stage === i && <div className="absolute top-1 right-1 w-2 h-2 bg-[#e8a040]" style={{ boxShadow: "0 0 6px #e8a040" }} />}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-4 pb-4">
          <PixelButton variant="ghost" onClick={() => navigate("/menu")}>Back</PixelButton>
          <button onClick={start} className="flex items-center gap-2 px-8 py-3 text-sm uppercase tracking-widest transition-all active:translate-y-0.5" style={{ fontFamily: "'Press Start 2P', monospace", clipPath: CLIP, background: "linear-gradient(180deg,#c82828,#5a0a0a)", color: "#ffe8c0", border: "2px solid #e8a040", textShadow: "0 0 10px rgba(255,80,40,0.9)" }}><Swords className="w-4 h-4" /> FIGHT</button>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <Swords className="w-3.5 h-3.5 text-[#8a1a1a]" />
      <p className="text-[10px] text-[#c8a040] tracking-widest" style={{ fontFamily: "'Press Start 2P', monospace" }}>{children}</p>
      <div className="flex-1 h-px bg-gradient-to-r from-[#5a2020] to-transparent" />
    </div>
  );
}

function PreviewPanel({ label, idx, accent, facing, auto, hidden, onRoll }) {
  const c = CHARACTERS[idx];
  if (hidden) {
    return (
      <div className="relative" style={{ clipPath: CLIP, background: `linear-gradient(180deg, ${accent}33, transparent 60%)` }}>
        <div className="p-4 border-2" style={{ borderColor: `${accent}88`, clipPath: CLIP, background: "linear-gradient(180deg,#14090c,#0a0608)" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] tracking-widest" style={{ fontFamily: "'Press Start 2P', monospace", color: accent }}>{label}</span>
            <span className="text-[8px] text-[#6a4a30] uppercase tracking-widest" style={{ fontFamily: "'Press Start 2P', monospace" }}>???</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative"><div className="absolute inset-0 blur-xl opacity-40" style={{ background: "radial-gradient(circle at 50% 60%, #3a3a3a, transparent 70%)" }} /><div className="relative opacity-50"><StaticFighter palette={MYSTERY_PALETTE} facing={facing} size={1} /></div></div>
            <div className="mt-2 text-base text-[#5a4a3a] text-center" style={{ fontFamily: "'Press Start 2P', monospace", textShadow: "2px 2px 0 #1a0606" }}>???</div>
            <div className="text-[8px] text-[#6a4a30] mt-1 uppercase tracking-widest text-center" style={{ fontFamily: "'Press Start 2P', monospace" }}>UNKNOWN FIGHTER</div>
          </div>
          <p className="text-[8px] text-[#6a5a3a] mt-3 leading-relaxed text-center" style={{ fontFamily: "'Press Start 2P', monospace" }}>Your opponent remains a mystery until the fight begins.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="relative" style={{ clipPath: CLIP, background: `linear-gradient(180deg, ${accent}33, transparent 60%)` }}>
      <div className="p-4 border-2" style={{ borderColor: `${accent}88`, clipPath: CLIP, background: "linear-gradient(180deg,#14090c,#0a0608)" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] tracking-widest" style={{ fontFamily: "'Press Start 2P', monospace", color: accent }}>{label}</span>
          {auto && (<button onClick={onRoll} className="text-[#c8a040] hover:text-[#e8c878] transition-colors flex items-center gap-1" title="Re-roll CPU fighter" style={{ filter: "drop-shadow(0 0 4px rgba(200,160,64,0.5))" }}><Dices className="w-4 h-4" /><span className="text-[7px] text-[#e8a040] tracking-widest animate-pulse" style={{ fontFamily: "'Press Start 2P', monospace" }}>REROLL</span></button>)}
          <span className="text-[8px] text-[#6a4a30] uppercase tracking-widest" style={{ fontFamily: "'Press Start 2P', monospace" }}>{c.style}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="relative"><div className="absolute inset-0 blur-xl opacity-50" style={{ background: `radial-gradient(circle at 50% 60%, ${c.palette.shirt}, transparent 70%)` }} /><div className="relative"><FighterPortrait character={c} facing={facing} /></div></div>
          <div className="mt-2 text-base text-[#e8c878] text-center" style={{ fontFamily: "'Press Start 2P', monospace", textShadow: "2px 2px 0 #3a0606" }}>{c.name}</div>
          <div className="text-[8px] text-[#8a6a40] mt-1 uppercase tracking-widest text-center" style={{ fontFamily: "'Press Start 2P', monospace" }}>{c.title}</div>
        </div>
        <p className="text-[8px] text-[#8a7a5a] mt-3 leading-relaxed text-center" style={{ fontFamily: "'Press Start 2P', monospace" }}>{c.description}</p>
        <div className="mt-3 space-y-1.5">
          <StatBar label="HP" value={c.stats.hp} max={135} />
          <StatBar label="SPD" value={c.stats.speed} max={4.2} />
          <StatBar label="PWR" value={c.stats.power} max={17} />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {["skill1", "skill2", "skill3"].map((k) => (
            <div key={k} className="text-center px-1 py-1.5 bg-[#0a0405] border border-[#3a1818]" style={{ clipPath: CLIP_SM }}>
              <div className="text-[6px] text-[#8a6a40]" style={{ fontFamily: "'Press Start 2P', monospace" }}>{k.toUpperCase()}</div>
              <div className="text-[7px] text-[#e8d8b0] mt-1 truncate" style={{ fontFamily: "'Press Start 2P', monospace" }}>{c.moves[k]?.name.split(" ")[0]}</div>
              <div className="text-[5px] text-[#5a9af8] mt-0.5" style={{ fontFamily: "'Press Start 2P', monospace" }}>{moveKindLabel(c.moves[k]?.kind)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatBar({ label, value, max }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="flex items-center gap-2">
      <span className="text-[7px] text-[#8a6a40] w-7" style={{ fontFamily: "'Press Start 2P', monospace" }}>{label}</span>
      <div className="flex-1 h-2.5 bg-[#0a0405] border border-[#3a1818]" style={{ boxShadow: "inset 0 1px 2px rgba(0,0,0,0.8)" }}>
        <div className="h-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg,#8a1a1a,#e8a040)", boxShadow: "0 0 6px rgba(232,160,64,0.6)" }} />
      </div>
    </div>
  );
}
