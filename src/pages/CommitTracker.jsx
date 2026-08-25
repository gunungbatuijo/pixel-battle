import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GitCommit, Search, ExternalLink, Swords } from "lucide-react";
import PixelButton from "@/components/PixelButton";
import { base44 } from "@/api/base44Client";

export default function CommitTracker() {
  const navigate = useNavigate();
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [branch, setBranch] = useState("main");
  const [path, setPath] = useState("src/game");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const fetchData = async () => { if (!owner.trim() || !repo.trim()) { setError("Enter owner and repo."); return; } setLoading(true); setError(""); setData(null); try { const res = await base44.functions.invoke("getCombatCommits", { owner: owner.trim(), repo: repo.trim(), branch: branch.trim() || "main", path: path.trim() }); setData(res.data); } catch (e) { setError(e.response?.data?.error || e.message || "Failed to load commits"); } finally { setLoading(false); } };
  const commits = data?.combatCommits?.length ? data.combatCommits : (data?.commits || []);
  return (
    <div className="min-h-screen bg-[#08060c] text-[#e8d8b0] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1428] via-[#0c0916] to-[#050309]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.07]" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 3px)" }} />
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate("/menu")} className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] text-[#c8b890] bg-[#1a1410] border-2 border-[#3a2f24] border-b-4 hover:border-[#c8a040] hover:text-[#f0c060] transition-colors active:translate-y-0.5 active:border-b-2" style={{ fontFamily: "'Press Start 2P', monospace", clipPath: "polygon(0 5px,5px 0,100% 0,100% calc(100% - 5px),calc(100% - 5px) 100%,0 100%)" }}>◀ MENU</button>
          <h1 className="text-[#f0c060] text-sm flex items-center gap-2" style={{ fontFamily: "'Press Start 2P', monospace", textShadow: "2px 2px 0 #6a1a08" }}><Swords className="w-4 h-4" /> COMMIT TRACKER</h1>
        </div>
        <p className="text-[9px] text-[#8a7a5a] mb-5 leading-relaxed" style={{ fontFamily: "'Press Start 2P', monospace" }}>TRACK COMBAT MECHANIC COMMITS FROM YOUR GITHUB REPO.</p>
        <div className="bg-[#1a1410] border-2 border-[#3a2f24] p-4 mb-5" style={{ clipPath: "polygon(0 8px,8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%)" }}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div><label className="text-[8px] text-[#8a7a5a] block mb-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>OWNER</label><input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="e.g. my-org" className="w-full bg-[#0e0a08] border-2 border-[#3a2f24] px-3 py-2 text-[10px] text-[#e8d8b0] focus:border-[#c8a040] outline-none" style={{ fontFamily: "'Press Start 2P', monospace" }} /></div>
            <div><label className="text-[8px] text-[#8a7a5a] block mb-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>REPO</label><input value={repo} onChange={(e) => setRepo(e.target.value)} placeholder="e.g. pixel-battle" className="w-full bg-[#0e0a08] border-2 border-[#3a2f24] px-3 py-2 text-[10px] text-[#e8d8b0] focus:border-[#c8a040] outline-none" style={{ fontFamily: "'Press Start 2P', monospace" }} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div><label className="text-[8px] text-[#8a7a5a] block mb-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>BRANCH</label><input value={branch} onChange={(e) => setBranch(e.target.value)} className="w-full bg-[#0e0a08] border-2 border-[#3a2f24] px-3 py-2 text-[10px] text-[#e8d8b0] focus:border-[#c8a040] outline-none" style={{ fontFamily: "'Press Start 2P', monospace" }} /></div>
            <div><label className="text-[8px] text-[#8a7a5a] block mb-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>PATH</label><input value={path} onChange={(e) => setPath(e.target.value)} placeholder="src/game" className="w-full bg-[#0e0a08] border-2 border-[#3a2f24] px-3 py-2 text-[10px] text-[#e8d8b0] focus:border-[#c8a040] outline-none" style={{ fontFamily: "'Press Start 2P', monospace" }} /></div>
          </div>
          <div className="flex justify-center"><PixelButton variant="primary" icon={Search} onClick={fetchData} className={loading ? "opacity-60 pointer-events-none" : ""}>{loading ? "LOADING..." : "TRACK COMMITS"}</PixelButton></div>
        </div>
        {error && <p className="text-[#d8442a] text-[9px] mb-4" style={{ fontFamily: "'Press Start 2P', monospace" }}>{error}</p>}
        {data && (
          <div className="bg-[#1a1410] border-2 border-[#3a2f24] p-4" style={{ clipPath: "polygon(0 8px,8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%)" }}>
            <div className="flex justify-between text-[9px] mb-4" style={{ fontFamily: "'Press Start 2P', monospace" }}><span className="text-[#c8a040]">{data.combat}/{data.total} COMBAT</span><span className="text-[#8a7a5a]">{data.owner}/{data.repo} · {data.branch}</span></div>
            {commits.length === 0 ? (<p className="text-[#8a7a5a] text-[9px] text-center py-6" style={{ fontFamily: "'Press Start 2P', monospace" }}>NO COMMITS FOUND</p>) : (
              <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
                {commits.map((c) => (
                  <a key={c.sha} href={c.url} target="_blank" rel="noreferrer" className="block bg-[#0e0a08] border-l-2 border-[#5a2010] hover:border-[#c8542a] px-3 py-2 transition-colors group">
                    <div className="flex items-start gap-2"><GitCommit className="w-3 h-3 text-[#8a7a4a] mt-1 flex-shrink-0" /><div className="min-w-0 flex-1"><p className="text-[9px] text-[#e8d8b0] group-hover:text-[#f0c060] transition-colors break-words leading-relaxed" style={{ fontFamily: "'Press Start 2P', monospace" }}>{c.message.split("\n")[0]}</p><div className="flex items-center gap-2 mt-1.5"><span className="text-[7px] text-[#c8a040] truncate max-w-[80px]" style={{ fontFamily: "'Press Start 2P', monospace" }}>{c.author}</span><span className="text-[7px] text-[#6a5a3a]" style={{ fontFamily: "'Press Start 2P', monospace" }}>{c.sha.slice(0, 7)}</span>{c.date && <span className="text-[7px] text-[#6a5a3a]" style={{ fontFamily: "'Press Start 2P', monospace" }}>{new Date(c.date).toLocaleDateString()}</span>}<ExternalLink className="w-2.5 h-2.5 text-[#4a3f2f] ml-auto" /></div></div></div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
