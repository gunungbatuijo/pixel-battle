import React from "react";

export default function PixelButton({ children, icon: Icon, onClick, variant = "default", className = "", ...props }) {
  const variants = {
    default: "bg-[linear-gradient(180deg,#3a3530,#1f1b16)] text-[#e8d8b0] border-[#6a5a3a] hover:border-[#c8a040] hover:shadow-[0_0_16px_rgba(200,160,64,0.45)]",
    primary: "bg-[linear-gradient(180deg,#c8542a,#7a2410)] text-[#fff0d0] border-[#e8a040] hover:border-[#ffd070] hover:shadow-[0_0_18px_rgba(232,120,40,0.6)]",
    ghost: "bg-[linear-gradient(180deg,#2a2520,#15110d)] text-[#c8b890] border-[#4a4540] hover:border-[#8a7a4a] hover:shadow-[0_0_14px_rgba(150,130,80,0.35)]"
  };
  return (
    <button
      onClick={onClick}
      className={"group relative font-display tracking-wider px-6 py-3 border-2 border-b-4 uppercase text-sm sm:text-base transition-all duration-100 active:translate-y-0.5 active:border-b-2 " + (variants[variant] || variants.default) + " " + className}
      style={{ fontFamily: "'Press Start 2P', monospace", clipPath: "polygon(0 6px,6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%)" }}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        {children}
      </span>
    </button>
  );
}
