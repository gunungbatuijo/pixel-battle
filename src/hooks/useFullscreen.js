import { useCallback, useEffect, useRef, useState } from "react";
export function useFullscreen() {
  const [isFs, setIsFs] = useState(false);
  const enteredRef = useRef(false);
  useEffect(() => { const onFs = () => { const fs = !!document.fullscreenElement; setIsFs(fs); if (fs) enteredRef.current = true; }; document.addEventListener("fullscreenchange", onFs); return () => { document.removeEventListener("fullscreenchange", onFs); if (enteredRef.current && document.fullscreenElement) { document.exitFullscreen?.().catch(() => {}); } }; }, []);
  const enter = useCallback((el) => { const target = el || document.documentElement; target?.requestFullscreen?.().catch(() => {}); }, []);
  const exit = useCallback(() => { document.exitFullscreen?.().catch(() => {}); }, []);
  const toggle = useCallback((el) => { if (!document.fullscreenElement) enter(el); else exit(); }, [enter, exit]);
  return { isFs, enter, exit, toggle };
}
