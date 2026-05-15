import { useEffect, useRef } from "react";
import { useScrollProgress } from "../lib/useScrollProgress";

export function Glow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = useScrollProgress.subscribe((state) => {
      if (!ref.current) return;
      // hero glow is brightest 0..0.12, fades to ~0.35 by end of hero
      const p = state.progress;
      const opacity =
        p < 0.06
          ? 1
          : p < 0.18
          ? 1 - (p - 0.06) * (0.55 / 0.12)
          : Math.max(0.32, 0.45 - (p - 0.18) * 0.2);
      ref.current.style.opacity = opacity.toFixed(3);
    });
    return unsub;
  }, []);

  return <div className="glow" ref={ref} aria-hidden />;
}
