import { useEffect, useRef } from "react";
import { useScrollProgress } from "../lib/useScrollProgress";

export function ProgressBar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = useScrollProgress.subscribe((state) => {
      if (!ref.current) return;
      ref.current.style.transform = `scaleX(${state.progress})`;
    });
    return unsub;
  }, []);

  return (
    <div className="progress-bar" aria-hidden>
      <div className="progress-bar__fill" ref={ref} />
    </div>
  );
}
