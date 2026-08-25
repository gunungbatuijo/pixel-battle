import React, { useMemo } from "react";

export default function Embers({ count = 28 }) {
  const embers = useMemo(() => Array.from({ length: count }, () => ({ left: Math.random() * 100, delay: Math.random() * 5, dur: 3 + Math.random() * 5, size: 1 + Math.random() * 2.5, op: 0.25 + Math.random() * 0.5, red: Math.random() < 0.4 })), [count]);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <style>{`@keyframes emberRise{0%{transform:translateY(0) translateX(0);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateY(-105vh) translateX(24px);opacity:0}}`}</style>
      {embers.map((e, i) => (
        <div key={i} className="absolute bottom-0 rounded-full" style={{ left: `${e.left}%`, width: e.size, height: e.size, background: e.red ? "#c82828" : "#e8a040", opacity: e.op, animation: `emberRise ${e.dur}s linear ${e.delay}s infinite`, boxShadow: "0 0 5px currentColor" }} />
      ))}
    </div>
  );
}
