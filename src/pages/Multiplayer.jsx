import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PixelButton from "@/components/PixelButton";
import FighterPortrait from "@/components/FighterPortrait";
import { CHARACTERS } from "@/data/characters";
import { STAGES } from "@/data/stages";
import { createRoom, findPublicRoom, findRoomByCode, joinRoom, subscribeRoom } from "@/game/netcode";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Multiplayer() {
  const navigate = useNavigate();
  const [p1, setP1] = useState(() => { const id = localStorage.getItem("pb_p1") || "ryo"; const i = CHARACTERS.findIndex((c) => c.id === id); return i < 0 ? 0 : i; });
  const [stage, setStage] = useState(() => localStorage.getItem("pb_stage") || "alley");
  const [view, setView] = useState("home");
  const [joinCode, setJoinCode] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [msg, setMsg] = useState("");
  const subRef = useRef(null);
  const myChar = CHARACTERS[p1].id;
  const myElo = parseInt(localStorage.getItem("pb_elo") || "1000", 10);
  useEffect(() => () => { if (subRef.current) subRef.current(); }, []);

  const beginAs = (role, roomId, hostChar, guestChar, stageId) => {
    localStorage.setItem("pb_p1", role === "host" ? hostChar : guestChar);
    localStorage.setItem("pb_stage", stageId);
    localStorage.setItem("pb_mp", JSON.stringify({ role, roomId, hostChar, guestChar, stageId }));
    if (subRef.current) { subRef.current(); subRef.current = null; }
    navigate("/game");
  };

  const waitAsHost = (room) => {
    setRoomCode(room.code); setView("waiting");
    subRef.current = subscribeRoom(room.id, (r) => {
      if (r.status === "playing" && r.guest_char) beginAs("host", room.id, room.host_char, r.guest_char, r.stage_id);
      else if (r.status === "ended") { setView("error"); setMsg("Opponent left"); }
    });
  };

  const publicMatch = async () => {
    setView("searching"); setMsg("Finding opponent...");
    try {
      const room = await findPublicRoom(myElo);
      if (room) { await joinRoom(room.id, myChar); beginAs("guest", room.id, room.host_char, myChar, room.stage_id); }
      else { const r = await createRoom({ mode: "public", stageId: stage, hostChar: myChar, hostElo: myElo }); waitAsHost(r); }
    } catch (e) { setView("error"); setMsg("Failed: " + (e?.message || e)); }
  };

  const createCustom = async () => { setView("searching"); setMsg("Creating room..."); try { const r = await createRoom({ mode: "custom", stageId: stage, hostChar: myChar, hostElo: myElo }); waitAsHost(r); } catch (e) { setView("error"); setMsg("Failed: " + (e?.message || e)); } };
  const joinCustom = async () => { if (!joinCode.trim()) return; setView("joining"); setMsg("Joining..."); try { const room = await findRoomByCode(joinCode.trim().toUpperCase()); if (!room) { setView("error"); setMsg("No room with that code"); return; } await joinRoom(room.id, myChar); beginAs("guest", room.id, room.host_char, myChar, room.stage_id); } catch (e) { setView("error"); setMsg("Failed: " + (e?.message || e)); } };
  const cancel = () => { if (subRef.current) { subRef.current(); subRef.current = null; } setView("home"); setMsg(""); };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#1a1f2e] text-[#e8d8b0]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#2a2540] via-[#1a1f2e] to-[#0f1018]" />
      <div className="relative z-10 flex flex-col items-center min-h-screen px-4 py-10">
        <button onClick={() => navigate("/menu")} className="self-start text-[10px] text-[#8a7a5a] hover:text-[#f0c060] mb-6" style={{ fontFamily: "'Press Start 2P', monospace" }}>◀ BACK</button>
        <h2 className="text-lg sm:text-2xl text-[#f0c060] mb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>ONLINE MATCH</h2>
        <p className="text-[9px] text-[#8a7a5a] mb-8 tracking-widest" style={{ fontFamily: "'Press Start 2P', monospace" }}>{(localStorage.getItem("pb_mode") || "").toUpperCase() === "RANKED" ? "RANKED · ELO ON THE LINE" : (localStorage.getItem("pb_mode") || "").toUpperCase() === "CONTINUES" ? "CONTINUES · CLIMB THE RANKS" : "FIGHT PLAYERS WORLDWIDE"}</p>
        {view === "home" && (
          <div className="w-full max-w-2xl flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row gap-6 items-center justify-center bg-[#2a2520] border-2 border-[#4a4540] p-4">
              <div className="flex items-center gap-3">
                <button onClick={() => setP1((p) => (p + CHARACTERS.length - 1) % CHARACTERS.length)} className="text-[#c8a040] hover:text-[#e8c878]"><ChevronLeft className="w-6 h-6" /></button>
                <div className="flex flex-col items-center"><FighterPortrait character={CHARACTERS[p1]} facing={1} height={120} /><span className="text-[9px] text-[#e8d8b0] mt-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>{CHARACTERS[p1].name.split(" ")[0]}</span></div>
                <button onClick={() => setP1((p) => (p + 1) % CHARACTERS.length)} className="text-[#c8a040] hover:text-[#e8c878]"><ChevronRight className="w-6 h-6" /></button>
              </div>
              <div className="flex flex-col gap-2"><span className="text-[8px] text-[#8a7a5a]" style={{ fontFamily: "'Press Start 2P', monospace" }}>STAGE</span><select value={stage} onChange={(e) => setStage(e.target.value)} className="bg-[#1a1410] border-2 border-[#4a4540] text-[#e8d8b0] text-[9px] px-2 py-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>{STAGES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={publicMatch} className="text-left bg-[#2a2520] border-2 border-[#4a4540] border-b-4 hover:border-[#f0c060] hover:bg-[#3a3530] transition-all px-5 py-5"><div className="text-sm text-[#f0c060]" style={{ fontFamily: "'Press Start 2P', monospace" }}>PUBLIC</div><div className="text-[9px] text-[#8a7a5a] mt-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>Find a random opponent</div></button>
              <div className="bg-[#2a2520] border-2 border-[#4a4540] px-5 py-5"><div className="text-sm text-[#f0c060] mb-3" style={{ fontFamily: "'Press Start 2P', monospace" }}>CUSTOM</div><PixelButton variant="primary" className="w-full mb-2 text-[9px]" onClick={createCustom}>Create Room</PixelButton><div className="flex gap-2"><input value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 4))} placeholder="CODE" className="flex-1 bg-[#1a1410] border-2 border-[#4a4540] text-[#e8d8b0] text-[9px] px-2 py-2 text-center" style={{ fontFamily: "'Press Start 2P', monospace" }} /><PixelButton variant="ghost" className="text-[9px]" onClick={joinCustom}>Join</PixelButton></div></div>
            </div>
          </div>
        )}
        {(view === "searching" || view === "joining") && (<div className="flex flex-col items-center gap-6"><div className="w-8 h-8 border-4 border-[#3a3530] border-t-[#f0c060] rounded-full animate-spin" /><p className="text-[10px] text-[#e8d8b0]" style={{ fontFamily: "'Press Start 2P', monospace" }}>{msg}</p><PixelButton variant="ghost" onClick={cancel}>Cancel</PixelButton></div>)}
        {view === "waiting" && (<div className="flex flex-col items-center gap-6"><p className="text-[10px] text-[#8a7a5a]" style={{ fontFamily: "'Press Start 2P', monospace" }}>ROOM CODE</p><div className="text-4xl text-[#f0c060] tracking-widest" style={{ fontFamily: "'Press Start 2P', monospace", textShadow: "3px 3px 0 #6a3a1a" }}>{roomCode}</div><p className="text-[9px] text-[#8a7a5a]" style={{ fontFamily: "'Press Start 2P', monospace" }}>WAITING FOR OPPONENT...</p><div className="w-8 h-8 border-4 border-[#3a3530] border-t-[#f0c060] rounded-full animate-spin" /><PixelButton variant="ghost" onClick={cancel}>Cancel</PixelButton></div>)}
        {view === "error" && (<div className="flex flex-col items-center gap-6"><p className="text-[10px] text-[#d8442a]" style={{ fontFamily: "'Press Start 2P', monospace" }}>{msg}</p><PixelButton variant="primary" onClick={cancel}>Back</PixelButton></div>)}
      </div>
    </div>
  );
}
