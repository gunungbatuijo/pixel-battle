import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PixelButton from "@/components/PixelButton";
import { loadKeybinds, saveKeybinds, DEFAULT_KEYS, KEY_LABELS, codeToLabel } from "@/game/keybinds";

export default function Settings() {
  const navigate = useNavigate();
  const [keys, setKeys] = useState(loadKeybinds());
  const [rebinding, setRebinding] = useState(null);
  const [volume, setVolume] = useState(() => parseInt(localStorage.getItem("pb_volume") || "70", 10));
  const [pixelFilter, setPixelFilter] = useState(() => localStorage.getItem("pb_pixel") !== "off");
  const [fpsCap, setFpsCap] = useState(() => localStorage.getItem("pb_fps") || "60");
  const rebind = (action) => { setRebinding(action); const handler = (e) => { e.preventDefault(); const next = { ...keys, [action]: e.code }; setKeys(next); saveKeybinds(next); setRebinding(null); window.removeEventListener("keydown", handler); }; window.addEventListener("keydown", handler); };
  const reset = () => { setKeys(DEFAULT_KEYS); saveKeybinds(DEFAULT_KEYS); };
  const saveVolume = (v) => { setVolume(v); localStorage.setItem("pb_volume", v); };
  const savePixel = (v) => { setPixelFilter(v); localStorage.setItem("pb_pixel", v ? "on" : "off"); };
  const saveFps = (v) => { setFpsCap(v); localStorage.setItem("pb_fps", v); };
  return (
    <div className="min-h-screen bg-[#1a1f2e] text-[#e8d8b0] overflow-y-auto">
      <div className="absolute inset-0 bg-gradient-to-b from-[#2a2530] to-[#0f1018]" />
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-center text-xl text-[#f0c060] mb-6" style={{ fontFamily: "'Press Start 2P', monospace" }}>SETTINGS</h2>
        <section className="mb-8">
          <h3 className="text-sm text-[#e8d8b0] mb-4" style={{ fontFamily: "'Press Start 2P', monospace" }}>KEYBINDS</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(KEY_LABELS).map(([action, label]) => (
              <div key={action} className="flex items-center justify-between bg-[#2a2520] border-2 border-[#4a4540] px-3 py-2">
                <span className="text-[10px] text-[#9a8a70]" style={{ fontFamily: "'Press Start 2P', monospace" }}>{label}</span>
                <button onClick={() => rebind(action)} className={`px-3 py-1 text-[10px] border-2 ${rebinding === action ? "border-[#f0c060] text-[#f0c060] animate-pulse" : "border-[#6a5a3a] text-[#e8d8b0] hover:border-[#f0c060]"}`} style={{ fontFamily: "'Press Start 2P', monospace" }}>{rebinding === action ? "PRESS..." : codeToLabel(keys[action])}</button>
              </div>
            ))}
          </div>
          <button onClick={reset} className="mt-3 text-[9px] text-[#8a7a5a] hover:text-[#f0c060]" style={{ fontFamily: "'Press Start 2P', monospace" }}>RESET TO DEFAULT</button>
        </section>
        <section className="mb-8">
          <h3 className="text-sm text-[#e8d8b0] mb-4" style={{ fontFamily: "'Press Start 2P', monospace" }}>AUDIO</h3>
          <div className="bg-[#2a2520] border-2 border-[#4a4540] px-4 py-3"><div className="flex items-center gap-3"><span className="text-[10px] text-[#9a8a70]" style={{ fontFamily: "'Press Start 2P', monospace" }}>VOL</span><input type="range" min="0" max="100" value={volume} onChange={(e) => saveVolume(e.target.value)} className="flex-1 accent-[#f0c060]" /><span className="text-[10px] text-[#e8d8b0] w-8" style={{ fontFamily: "'Press Start 2P', monospace" }}>{volume}</span></div></div>
        </section>
        <section className="mb-8">
          <h3 className="text-sm text-[#e8d8b0] mb-4" style={{ fontFamily: "'Press Start 2P', monospace" }}>VIDEO</h3>
          <div className="space-y-2">
            <ToggleRow label="PIXEL FILTER" value={pixelFilter} onChange={savePixel} />
            <div className="bg-[#2a2520] border-2 border-[#4a4540] px-4 py-3 flex items-center gap-3"><span className="text-[10px] text-[#9a8a70]" style={{ fontFamily: "'Press Start 2P', monospace" }}>FPS CAP</span><select value={fpsCap} onChange={(e) => saveFps(e.target.value)} className="bg-[#1a1410] text-[#e8d8b0] border-2 border-[#6a5a3a] px-2 py-1 text-[10px]" style={{ fontFamily: "'Press Start 2P', monospace" }}><option value="30">30</option><option value="60">60</option><option value="120">120</option></select></div>
          </div>
        </section>
        <div className="flex justify-center"><PixelButton variant="ghost" onClick={() => navigate("/menu")}>Back</PixelButton></div>
      </div>
    </div>
  );
}

function ToggleRow({ label, value, onChange }) {
  return (
    <div className="bg-[#2a2520] border-2 border-[#4a4540] px-4 py-3 flex items-center justify-between">
      <span className="text-[10px] text-[#9a8a70]" style={{ fontFamily: "'Press Start 2P', monospace" }}>{label}</span>
      <button onClick={() => onChange(!value)} className={`px-3 py-1 text-[10px] border-2 ${value ? "border-[#5ac860] text-[#5ac860]" : "border-[#6a5a3a] text-[#8a7a5a]"}`} style={{ fontFamily: "'Press Start 2P', monospace" }}>{value ? "ON" : "OFF"}</button>
    </div>
  );
}
