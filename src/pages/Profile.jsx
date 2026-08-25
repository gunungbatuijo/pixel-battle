import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PixelButton from "@/components/PixelButton";
import { CHARACTERS } from "@/data/characters";

const RANKS = [
  { name: "Bronze", color: "#c8784a", min: 0 },
  { name: "Silver", color: "#c8c8c8", min: 3 },
  { name: "Gold", color: "#f0c040", min: 8 },
  { name: "Platinum", color: "#5ad8c0", min: 15 },
  { name: "Diamond", color: "#60a8f0", min: 25 },
  { name: "Master", color: "#d060f0", min: 40 }
];

export default function Profile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(() => localStorage.getItem("pb_username") || "GUEST_FIGHTER");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(username);
  const [mainIdx, setMainIdx] = useState(() => parseInt(localStorage.getItem("pb_main") || "0", 10));
  const wins = parseInt(localStorage.getItem("pb_wins") || "0", 10);
  const losses = parseInt(localStorage.getItem("pb_losses") || "0", 10);
  const total = wins + losses;
  const winrate = total > 0 ? Math.round((wins / total) * 100) : 0;
  const rank = [...RANKS].reverse().find((r) => wins >= r.min) || RANKS[0];
  const saveName = () => { const v = draft.trim().toUpperCase().slice(0, 14) || "GUEST_FIGHTER"; setUsername(v); localStorage.setItem("pb_username", v); setEditing(false); };
  const saveMain = (i) => { setMainIdx(i); localStorage.setItem("pb_main", i); };
  return (
    <div className="min-h-screen bg-[#1a1f2e] text-[#e8d8b0] overflow-y-auto">
      <div className="absolute inset-0 bg-gradient-to-b from-[#2a2530] to-[#0f1018]" />
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-center text-xl text-[#f0c060] mb-6" style={{ fontFamily: "'Press Start 2P', monospace" }}>PROFILE</h2>
        <div className="bg-[#2a2520] border-2 border-[#4a4540] p-5 mb-6 flex flex-col items-center">
          <div className="w-20 h-20 bg-[#1a1410] border-2 border-[#f0c060] flex items-center justify-center mb-3"><span className="text-2xl text-[#f0c060]" style={{ fontFamily: "'Press Start 2P', monospace" }}>{username.slice(0, 2)}</span></div>
          {editing ? (<div className="flex gap-2"><input value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={14} className="bg-[#1a1410] text-[#e8d8b0] border-2 border-[#6a5a3a] px-2 py-1 text-xs" style={{ fontFamily: "'Press Start 2P', monospace" }} /><PixelButton variant="primary" className="text-xs px-3 py-1" onClick={saveName}>OK</PixelButton></div>) : (<button onClick={() => { setDraft(username); setEditing(true); }} className="text-sm text-[#e8d8b0] hover:text-[#f0c060]" style={{ fontFamily: "'Press Start 2P', monospace" }}>{username} ✎</button>)}
          <div className="mt-3 px-4 py-1 border-2" style={{ borderColor: rank.color }}><span className="text-xs" style={{ fontFamily: "'Press Start 2P', monospace", color: rank.color }}>{rank.name}</span></div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-6"><StatBox label="WINS" value={wins} color="#5ac860" /><StatBox label="LOSSES" value={losses} color="#d8442a" /><StatBox label="WIN%" value={`${winrate}`} color="#f0c060" /></div>
        <div className="mb-6">
          <p className="text-[10px] text-[#9a8a70] mb-3 tracking-widest" style={{ fontFamily: "'Press Start 2P', monospace" }}>MAIN FIGHTER</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CHARACTERS.map((c, i) => (<button key={c.id} onClick={() => saveMain(i)} className={`p-2 border-2 text-center transition-all ${mainIdx === i ? "border-[#f0c060] bg-[#3a3530]" : "border-[#4a4540] bg-[#2a2520] hover:bg-[#3a3530]"}`}><div className="text-[9px] text-[#e8d8b0]" style={{ fontFamily: "'Press Start 2P', monospace" }}>{c.name.split(" ")[0]}</div></button>))}
          </div>
        </div>
        <div className="mb-6">
          <p className="text-[10px] text-[#9a8a70] mb-3 tracking-widest" style={{ fontFamily: "'Press Start 2P', monospace" }}>RANK LADDER</p>
          <div className="space-y-1">
            {RANKS.map((r) => (<div key={r.name} className="flex items-center gap-3 bg-[#2a2520] border-2 border-[#4a4540] px-3 py-2"><span className="text-[10px] w-20" style={{ fontFamily: "'Press Start 2P', monospace", color: r.color }}>{r.name}</span><span className="text-[8px] text-[#8a7a5a]" style={{ fontFamily: "'Press Start 2P', monospace" }}>{r.min}+ wins</span>{rank.name === r.name && <span className="ml-auto text-[8px] text-[#f0c060]" style={{ fontFamily: "'Press Start 2P', monospace" }}>YOU</span>}</div>))}
          </div>
        </div>
        <div className="flex justify-center"><PixelButton variant="ghost" onClick={() => navigate("/menu")}>Back</PixelButton></div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color }) {
  return (<div className="bg-[#2a2520] border-2 border-[#4a4540] p-3 text-center"><div className="text-lg" style={{ fontFamily: "'Press Start 2P', monospace", color }}>{value}</div><div className="text-[8px] text-[#9a8a70] mt-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>{label}</div></div>);
}
