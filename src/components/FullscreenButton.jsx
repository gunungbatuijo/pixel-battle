import React from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { useFullscreen } from "@/hooks/useFullscreen";

export default function FullscreenButton({ className = "" }) {
  const { isFs, toggle } = useFullscreen();
  return (
    <button onClick={() => toggle()} title={isFs ? "Exit Fullscreen" : "Fullscreen"} className={`flex items-center gap-1.5 px-2.5 py-2 text-[9px] text-[#c8b890] bg-[#1a1410] border-2 border-[#3a2f24] border-b-4 hover:border-[#c8a040] hover:text-[#f0c060] hover:shadow-[0_0_12px_rgba(200,160,64,0.4)] transition-all active:translate-y-0.5 active:border-b-2 ${className}`} style={{ fontFamily: "'Press Start 2P', monospace", clipPath: "polygon(0 5px,5px 0,100% 0,100% calc(100% - 5px),calc(100% - 5px) 100%,0 100%)" }}>
      {isFs ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
      <span className="hidden sm:inline">{isFs ? "EXIT" : "FULL"}</span>
    </button>
  );
}
