import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FightGame } from "@/game/PixelFighter";
import { loadKeybinds, codeToLabel, KEY_LABELS } from "@/game/keybinds";
import PixelButton from "@/components/PixelButton";
import { Maximize2, Minimize2 } from "lucide-react";
import { Netplay, endRoom } from "@/game/netcode";
import { base44 } from "@/api/base44Client";
import { recordMatchResult, getProfileByUser, rankForElo, botRatingForElo, eloScaleForElo } from "@/lib/ranked";
import { rankImageForWins, rankNameForWins, RANK_IMAGES } from "@/data/rankImages";
import { CHARACTERS } from "@/data/characters";
import { STAGES } from "@/data/stages";
import { Image } from "@/components/ui/image";

const MAX_GAUNTLET = 10;

export default function Game() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const netRef = useRef(null);
  const [ended, setEnded] = useState(false);
  const [result, setResult] = useState(null);
  const [paused, setPaused] = useState(false);
  const [showTutorial, setShowTutorial] = useState(() => !localStorage.getItem("pb_mp") && localStorage.getItem("pb_tutorial_seen") !== "1");
  const [isMp] = useState(() => !!localStorage.getItem("pb_mp"));
  const mode = localStorage.getItem("pb_mode") || "bot";
  const isTraining = mode === "train";
  const isGauntlet = (mode === "ranked" || mode === "continues") && !isMp;
  const isPlayerRanked = isMp && (mode === "ranked" || mode === "continues");
  const isContinues = mode === "continues";
  const [showBoxes, setShowBoxes] = useState(true);
  const keys = useRef(loadKeybinds());
  const wrapRef = useRef(null);
  const [isFs, setIsFs] = useState(false);

  const [gWins, setGWins] = useState(0);
  const [gRound, setGRound] = useState(1);
  const [gOver, setGOver] = useState(false);
  const [gChamp, setGChamp] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [prEloDelta, setPrEloDelta] = useState(null);
  const [prRankName, setPrRankName] = useState("");
  const [prRankImg, setPrRankImg] = useState("");
  const [eloGained, setEloGained] = useState(0);
  const [playerName, setPlayerName] = useState("FIGHTER");
  const winsRef = useRef(0);
  const eloRef = useRef(0);
  const gOverRef = useRef(false);
  const revealTimer = useRef(null);

  useEffect(() => { const onFs = () => setIsFs(!!document.fullscreenElement); document.addEventListener("fullscreenchange", onFs); return () => document.removeEventListener("fullscreenchange", onFs); }, []);

  useEffect(() => {
    const el = wrapRef.current; if (!el) return;
    const onFirstInteract = () => { if (!document.fullscreenElement) el.requestFullscreen?.().catch(() => {}); el.removeEventListener("pointerdown", onFirstInteract); };
    el.addEventListener("pointerdown", onFirstInteract);
    return () => { el.removeEventListener("pointerdown", onFirstInteract); if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {}); };
  }, []);

  const toggleFullscreen = () => { if (!document.fullscreenElement) wrapRef.current?.requestFullscreen?.(); else document.exitFullscreen?.(); };

  const pickEnemy = (p1Id) => { const pool = CHARACTERS.filter((c) => c.id !== p1Id); return pool[Math.floor(Math.random() * pool.length)].id; };
  const pickStage = () => STAGES[Math.floor(Math.random() * STAGES.length)].id;

  const advanceRound = (p1Id, delay = 1800) => {
    if (revealTimer.current) clearTimeout(revealTimer.current);
    revealTimer.current = setTimeout(() => { revealTimer.current = null; setCleared(false); setEnded(false); setResult(null); initGame(pickEnemy(p1Id), pickStage()); }, delay);
  };

  const oppRating = () => botRatingForElo(parseInt(localStorage.getItem("pb_elo") || "1000", 10)) + winsRef.current * 40;

  const initGame = (enemyCharId, stageId) => {
    const canvas = canvasRef.current; if (!canvas) return;
    gameRef.current?.stop();
    const mpRaw = localStorage.getItem("pb_mp"); const mp = mpRaw ? JSON.parse(mpRaw) : null;
    const net = mp ? new Netplay(mp.role, mp.roomId) : null; netRef.current = net;
    const p1Id = mp ? mp.hostChar : localStorage.getItem("pb_p1") || "ryo";
    const game = new FightGame(canvas, { playerCharId: p1Id, enemyCharId, stageId, difficulty: localStorage.getItem("pb_diff") || "normal", eloScale: eloScaleForElo(parseInt(localStorage.getItem("pb_elo") || "1000", 10)), keys: keys.current, training: !mp && isTraining, netRole: mp ? mp.role : null, net, onMatchEnd: (w) => handleEnd(w, p1Id, enemyCharId) });
    gameRef.current = game;
    if (!showTutorial) game.start();
  };

  const handleEnd = (w, p1Id) => {
    setResult(w); setEnded(true);
    const wins = parseInt(localStorage.getItem("pb_wins") || "0", 10); const losses = parseInt(localStorage.getItem("pb_losses") || "0", 10);
    if (w === "player") localStorage.setItem("pb_wins", wins + 1); else localStorage.setItem("pb_losses", losses + 1);
    if (isGauntlet) { handleGauntletEnd(w, p1Id); return; }
    if (!isTraining) {
      (async () => {
        try {
          let oppElo = 1000; const mpRaw = localStorage.getItem("pb_mp");
          if (mpRaw) { const mp = JSON.parse(mpRaw); const room = await base44.entities.MatchRoom.get(mp.roomId); const oppId = mp.role === "host" ? room.guest_id : room.host_id; if (oppId) { const opp = await getProfileByUser(oppId); if (opp) oppElo = opp.elo; } }
          else { oppElo = botRatingForElo(parseInt(localStorage.getItem("pb_elo") || "1000", 10)); }
          const updated = await recordMatchResult(w === "player", oppElo);
          localStorage.setItem("pb_elo", String(updated.elo)); localStorage.setItem("pb_wins", String(updated.wins)); localStorage.setItem("pb_losses", String(updated.losses));
          if (isPlayerRanked) { setPrEloDelta(updated.delta || 0); const r = rankForElo(updated.elo); setPrRankName(r.name); setPrRankImg(RANK_IMAGES[r.name]); }
        } catch (e) {}
      })();
    }
  };

  const handleGauntletEnd = (w, p1Id) => {
    if (gOverRef.current) return;
    if (w === "player") {
      (async () => { try { const res = await recordMatchResult(true, oppRating()); eloRef.current += res.delta || 0; setEloGained(eloRef.current); } catch (e) {} })();
      const newWins = winsRef.current + 1; winsRef.current = newWins; setGWins(newWins);
      if (newWins >= MAX_GAUNTLET) { setGChamp(true); setGOver(true); gOverRef.current = true; }
      else { setGRound(newWins + 1); setCleared(true); advanceRound(p1Id, 1800); }
    } else {
      (async () => { try { await recordMatchResult(false, oppRating()); } catch (e) {} })();
      setGOver(true); gOverRef.current = true;
    }
  };

  useEffect(() => {
    (async () => { try { const me = await base44.auth.me(); setPlayerName(me.full_name || (me.email ? me.email.split("@")[0] : "FIGHTER")); } catch (e) {} })();
    if (showTutorial) return;
    const mpRaw = localStorage.getItem("pb_mp"); const mp = mpRaw ? JSON.parse(mpRaw) : null;
    const p1Id = mp ? mp.hostChar : localStorage.getItem("pb_p1") || "ryo";
    if (isGauntlet) { initGame(pickEnemy(p1Id), pickStage()); }
    else { const enemy = mp ? mp.guestChar : (localStorage.getItem("pb_p2") || pickEnemy(p1Id)); const stage = mp ? mp.stageId : (localStorage.getItem("pb_stage") || pickStage()); initGame(enemy, stage); }
    return () => { if (revealTimer.current) { clearTimeout(revealTimer.current); revealTimer.current = null; } gameRef.current?.stop(); const net = netRef.current; if (net) { net.stop(); const m = localStorage.getItem("pb_mp"); if (m) { try { endRoom(JSON.parse(m).roomId); } catch (e) {} } } };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTutorial]);

  const togglePause = () => { const g = gameRef.current; if (!g) return; if (paused) { g.start(); setPaused(false); } else { g.stop(); setPaused(true); } };
  const restart = () => { setEnded(false); setResult(null); const g = gameRef.current; g.roundWins = [0, 0]; g.resetRound(); g.start(); };
  const retryGauntlet = () => { winsRef.current = 0; eloRef.current = 0; gOverRef.current = false; setGWins(0); setGRound(1); setEloGained(0); setGOver(false); setGChamp(false); setEnded(false); setResult(null); const p1Id = localStorage.getItem("pb_p1") || "ryo"; initGame(pickEnemy(p1Id), pickStage()); };
  const dismissTutorial = () => { localStorage.setItem("pb_tutorial_seen", "1"); setShowTutorial(false); };
  const toggleHitboxes = () => { gameRef.current?.toggleHitboxes(); setShowBoxes((s) => !s); };
  const resetDummy = () => gameRef.current?.resetDummy();
  const cycleDummy = () => { const g = gameRef.current; if (!g) return; const ids = ["ryo", "brutus", "ayumi", "axel"]; const next = ids[(ids.indexOf(g.dummyCharId) + 1) % ids.length]; g.switchDummy(next); };

  const quitDest = isMp ? "/multiplayer" : "/select";
  const curRankName = rankNameForWins(gWins);
  const curRankImg = rankImageForWins(gWins);

  return (
    <div className="min-h-screen bg-[#0a0a14] flex flex-col items-center justify-center p-2">
      <div ref={wrapRef} className={isFs ? "fixed inset-0 bg-[#0a0a14] flex items-center justify-center" : "w-full max-w-4xl"}>
        {!isFs && (
          <div className="flex justify-between items-center mb-2 gap-2">
            <button onClick={() => { localStorage.removeItem("pb_mp"); navigate(quitDest); }} className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] text-[#c8b890] bg-[#1a1410] border-2 border-[#3a2f24] border-b-4 hover:border-[#c8a040] hover:text-[#f0c060] transition-colors active:translate-y-0.5 active:border-b-2" style={{ fontFamily: "'Press Start 2P', monospace", clipPath: "polygon(0 5px,5px 0,100% 0,100% calc(100% - 5px),calc(100% - 5px) 100%,0 100%)" }}>◀ QUIT</button>
            <div className="flex items-center gap-2">
              <button onClick={togglePause} className="px-3 py-1.5 text-[9px] text-[#c8b890] bg-[#1a1410] border-2 border-[#3a2f24] border-b-4 hover:border-[#c8a040] hover:text-[#f0c060] transition-colors active:translate-y-0.5 active:border-b-2" style={{ fontFamily: "'Press Start 2P', monospace", clipPath: "polygon(0 5px,5px 0,100% 0,100% calc(100% - 5px),calc(100% - 5px) 100%,0 100%)" }}>{paused ? "RESUME" : "PAUSE"}</button>
              <button onClick={toggleFullscreen} title="Fullscreen" className="flex items-center gap-1.5 px-2.5 py-2 text-[9px] text-[#c8b890] bg-[#1a1410] border-2 border-[#3a2f24] border-b-4 hover:border-[#c8a040] hover:text-[#f0c060] hover:shadow-[0_0_12px_rgba(200,160,64,0.4)] transition-all active:translate-y-0.5 active:border-b-2" style={{ fontFamily: "'Press Start 2P', monospace", clipPath: "polygon(0 5px,5px 0,100% 0,100% calc(100% - 5px),calc(100% - 5px) 100%,0 100%)" }}>{isFs ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}<span className="hidden sm:inline">{isFs ? "EXIT" : "FULL"}</span></button>
            </div>
          </div>
        )}
        <div className={isFs ? "relative w-full h-full" : "relative w-full"} style={isFs ? undefined : { aspectRatio: "800 / 450" }}>
          <canvas ref={canvasRef} width={800} height={450} className="w-full h-full bg-black" style={{ imageRendering: "pixelated" }} />
          <div className="absolute inset-0 pointer-events-none opacity-[0.06] z-[5]" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0 1px, transparent 1px 3px)" }} />
          {isFs && (<button onClick={toggleFullscreen} title="Exit fullscreen" className="absolute top-3 right-3 z-20 text-[#8a7a5a] hover:text-[#f0c060] bg-black/50 px-2 py-2"><Minimize2 className="w-4 h-4" /></button>)}
          {isGauntlet && !isFs && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 px-4 py-1.5 bg-black/70 border border-[#5a4020]" style={{ clipPath: "polygon(0 8px,8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%)" }}>
              <span className="text-[8px] text-[#f0c060]" style={{ fontFamily: "'Press Start 2P', monospace" }}>{isContinues ? "CONTINUES" : "RANKED"}</span>
              <span className="text-[8px] text-[#e8d8b0]" style={{ fontFamily: "'Press Start 2P', monospace" }}>{playerName}</span>
              <span className="text-[8px] text-[#8a7a5a]" style={{ fontFamily: "'Press Start 2P', monospace" }}>RD {gRound}/{MAX_GAUNTLET}</span>
              <span className="text-[8px] text-[#5ad860]" style={{ fontFamily: "'Press Start 2P', monospace" }}>W:{gWins}</span>
              {eloGained !== 0 && <span className="text-[8px] text-[#5a9af8]" style={{ fontFamily: "'Press Start 2P', monospace" }}>ELO{eloGained >= 0 ? "+" : ""}{eloGained}</span>}
            </div>
          )}
          {isGauntlet && isContinues && !ended && !cleared && (
            <div className="absolute bottom-2 right-2 z-10 flex flex-col items-center">
              <div className="w-14 h-14 border-2 border-[#5a4020] bg-black/60 overflow-hidden"><Image src={curRankImg} alt={curRankName} className="w-full h-full" fittingType="fill" /></div>
              <span className="text-[7px] text-[#c8a040] mt-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>{curRankName.toUpperCase()}</span>
            </div>
          )}
          {showTutorial && (
            <div className="absolute inset-0 bg-black/85 flex items-center justify-center p-4">
              <div className="bg-[#2a2520] border-2 border-[#f0c060] p-5 max-w-md w-full">
                <h3 className="text-center text-[#f0c060] text-sm mb-4" style={{ fontFamily: "'Press Start 2P', monospace" }}>PLAY TUTORIAL?</h3>
                <div className="text-[9px] text-[#9a8a70] space-y-2 mb-5" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                  <p>MOVE: {codeToLabel(keys.current.backward)} {codeToLabel(keys.current.forward)}</p>
                  <p>JUMP: {codeToLabel(keys.current.jump)}  BLOCK: {codeToLabel(keys.current.block)}</p>
                  <p>ATTACK: {codeToLabel(keys.current.attack)}</p>
                  <p>SKILLS: {codeToLabel(keys.current.skill1)} {codeToLabel(keys.current.skill2)} {codeToLabel(keys.current.skill3)}</p>
                  <p>DASH: {codeToLabel(keys.current.dash)}</p>
                </div>
                <div className="flex gap-3 justify-center"><PixelButton variant="primary" onClick={dismissTutorial}>Yes</PixelButton><PixelButton variant="ghost" onClick={dismissTutorial}>No</PixelButton></div>
              </div>
            </div>
          )}
          {paused && !showTutorial && (<div className="absolute inset-0 bg-black/70 flex items-center justify-center"><div className="text-center"><h3 className="text-[#f0c060] text-lg mb-4" style={{ fontFamily: "'Press Start 2P', monospace" }}>PAUSED</h3><PixelButton variant="primary" onClick={togglePause}>Resume</PixelButton></div></div>)}
          {isGauntlet && cleared && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="text-center bg-black/70 px-8 py-6 border-2 border-[#5ad860]"><h3 className="text-[#5ad860] text-xl mb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>ROUND CLEARED</h3><p className="text-[#e8d8b0] text-[10px]" style={{ fontFamily: "'Press Start 2P', monospace" }}>NEXT OPPONENT INCOMING...</p></div></div>
          )}
          {ended && !isGauntlet && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <div className="text-center">
                <h3 className={"text-2xl mb-4 " + (result === "player" ? "text-[#f0c060]" : "text-[#d8442a]")} style={{ fontFamily: "'Press Start 2P', monospace" }}>{result === "player" ? "VICTORY" : "DEFEAT"}</h3>
                {isPlayerRanked && (
                  <div className="flex flex-col items-center gap-2 mb-6">
                    {isContinues && prRankImg && (<div className="w-16 h-16 border-2 border-[#5a4020] bg-black/60 overflow-hidden"><Image src={prRankImg} alt={prRankName} className="w-full h-full" fittingType="fill" /></div>)}
                    {prEloDelta !== null && (<span className={"text-xs " + (prEloDelta >= 0 ? "text-[#5ad860]" : "text-[#d8442a]")} style={{ fontFamily: "'Press Start 2P', monospace" }}>ELO {prEloDelta >= 0 ? "+" : ""}{prEloDelta}</span>)}
                    {isContinues && prRankName && (<span className="text-[10px] text-[#c8a040]" style={{ fontFamily: "'Press Start 2P', monospace" }}>{prRankName.toUpperCase()}</span>)}
                  </div>
                )}
                <div className="flex gap-3 justify-center">
                  {isMp ? (<PixelButton variant="primary" onClick={() => { localStorage.removeItem("pb_mp"); navigate("/multiplayer"); }}>Leave</PixelButton>) : (<PixelButton variant="primary" onClick={restart}>Rematch</PixelButton>)}
                  <PixelButton variant="ghost" onClick={() => { localStorage.removeItem("pb_mp"); navigate("/select"); }}>New Fight</PixelButton>
                  <PixelButton variant="ghost" onClick={() => { localStorage.removeItem("pb_mp"); navigate("/menu"); }}>Menu</PixelButton>
                </div>
              </div>
            </div>
          )}
          {isGauntlet && gOver && (
            <div className="absolute inset-0 bg-black/85 flex items-center justify-center p-4">
              <div className="text-center max-w-sm w-full">
                {isContinues && (<div className="w-24 h-24 mx-auto mb-4 border-2 border-[#5a4020] bg-black/60 overflow-hidden"><Image src={curRankImg} alt={curRankName} className="w-full h-full" fittingType="fill" /></div>)}
                <h3 className={"text-2xl mb-2 " + (gChamp ? "text-[#f0c060]" : "text-[#d8442a]")} style={{ fontFamily: "'Press Start 2P', monospace", textShadow: gChamp ? "0 0 14px rgba(240,192,96,0.8)" : "none" }}>{gChamp ? "CHAMPION!" : "GAME OVER"}</h3>
                {!isContinues && <p className="text-[#c8a040] text-sm mb-4" style={{ fontFamily: "'Press Start 2P', monospace" }}>{curRankName.toUpperCase()}</p>}
                <div className="flex justify-center gap-4 mb-6 text-[10px]" style={{ fontFamily: "'Press Start 2P', monospace" }}><span className="text-[#5ad860]">WINS {gWins}</span><span className="text-[#5a9af8]">ELO {eloGained >= 0 ? "+" : ""}{eloGained}</span></div>
                <div className="flex gap-3 justify-center"><PixelButton variant="primary" onClick={retryGauntlet}>Retry</PixelButton><PixelButton variant="ghost" onClick={() => navigate("/menu")}>Menu</PixelButton></div>
              </div>
            </div>
          )}
        </div>
        {isTraining && !isFs && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 px-4 py-2 bg-[#0e0a08] border border-[#2a2018]" style={{ clipPath: "polygon(0 6px,6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%)" }}>
            <span className="text-[9px] text-[#f0c060] mr-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>TRAINING</span>
            <button onClick={toggleHitboxes} className="px-3 py-1.5 text-[8px] bg-[#1a1410] border-2 border-[#3a2f24] border-b-4 hover:border-[#f0c060] hover:text-[#f0c060] text-[#e8d8b0] transition-colors active:translate-y-0.5 active:border-b-2" style={{ fontFamily: "'Press Start 2P', monospace", clipPath: "polygon(0 4px,4px 0,100% 0,100% calc(100% - 4px),calc(100% - 4px) 100%,0 100%)" }}>HITBOXES: {showBoxes ? "ON" : "OFF"}</button>
            <button onClick={resetDummy} className="px-3 py-1.5 text-[8px] bg-[#1a1410] border-2 border-[#3a2f24] border-b-4 hover:border-[#f0c060] hover:text-[#f0c060] text-[#e8d8b0] transition-colors active:translate-y-0.5 active:border-b-2" style={{ fontFamily: "'Press Start 2P', monospace", clipPath: "polygon(0 4px,4px 0,100% 0,100% calc(100% - 4px),calc(100% - 4px) 100%,0 100%)" }}>RESET DUMMY</button>
            <button onClick={cycleDummy} className="px-3 py-1.5 text-[8px] bg-[#1a1410] border-2 border-[#3a2f24] border-b-4 hover:border-[#f0c060] hover:text-[#f0c060] text-[#e8d8b0] transition-colors active:translate-y-0.5 active:border-b-2" style={{ fontFamily: "'Press Start 2P', monospace", clipPath: "polygon(0 4px,4px 0,100% 0,100% calc(100% - 4px),calc(100% - 4px) 100%,0 100%)" }}>SWITCH DUMMY</button>
          </div>
        )}
        {!isFs && (
          <div className="mt-3 px-4 py-2 bg-[#0e0a08] border border-[#2a2018] text-[8px] text-[#6a5a3a] text-center flex flex-wrap justify-center gap-x-3 gap-y-1" style={{ fontFamily: "'Press Start 2P', monospace", clipPath: "polygon(0 6px,6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%)" }}>
            {Object.entries(KEY_LABELS).map(([k, label]) => (<span key={k}><span className="text-[#8a7a4a]">{label}</span> {codeToLabel(keys.current[k])}</span>))}
          </div>
        )}
      </div>
    </div>
  );
}
