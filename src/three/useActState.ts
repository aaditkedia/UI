import { useRef } from "react";
import { useScrollProgress } from "../lib/useScrollProgress";
import { NUM_ACTS, clamp01, window01 } from "../lib/acts";

/**
 * Returns a ref whose .current is the live { local, visible } for this act.
 * Cheap — no React re-renders. Updated by caller inside useFrame via refresh().
 */
export type ActState = { local: number; visible: number };

export function useActState(actIndex: number) {
  const ref = useRef<ActState>({ local: 0, visible: 0 });
  // refresh is called every frame from the act's own useFrame
  const refresh = () => {
    const p = useScrollProgress.getState().progress;
    const t = p * NUM_ACTS - actIndex;
    ref.current.local = clamp01(t);
    ref.current.visible = window01(t);
    return ref.current;
  };
  return { state: ref, refresh };
}
