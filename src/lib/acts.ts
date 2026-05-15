export const NUM_ACTS = 8;

export type Act = {
  i: number;
  key: string;
  copy: string;
  align?: "left" | "right" | "center";
  small?: string;
};

export const ACTS: readonly Act[] = [
  {
    i: 0,
    key: "hero",
    copy: "It's the unseen and invisible signals that make us *human*.",
    align: "left",
    small: "Scroll to explore",
  },
  {
    i: 1,
    key: "thesis",
    copy: "From Artificial Intelligence to *Personal Intelligence*.",
    align: "center",
    small: "Scroll to explore",
  },
  {
    i: 2,
    key: "cube",
    copy: "AIs can now learn from one another, sharing human-aligned understanding across every domain. A shift from isolated models to a *shared consciousness*.",
    align: "right",
  },
  {
    i: 3,
    key: "sphere",
    copy: "Where intent becomes *signal*, and signal becomes understanding.",
    align: "right",
  },
  {
    i: 4,
    key: "ribbons",
    copy: "The world's first network for *human intent*.",
    align: "center",
  },
  {
    i: 5,
    key: "rings",
    copy: "When AI learns from human signals, it stops mimicking — and starts *mirroring*.",
    align: "left",
  },
  {
    i: 6,
    key: "iconfield",
    copy: "We built machines that could reason, but not *remember us*. They know what we type, what we click, but nothing of who we are.",
    align: "center",
  },
  {
    i: 7,
    key: "human",
    copy: "Real intelligence isn't trained. It's *felt*.",
    align: "center",
  },
] as const;

// math helpers shared by Rig + acts
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// fade-in 0-0.22, hold, fade-out 0.80-1
export function window01(t: number): number {
  if (t <= 0 || t >= 1) return 0;
  if (t < 0.22) return t / 0.22;
  if (t > 0.8) return (1 - t) / 0.2;
  return 1;
}

export function smoothstep(t: number): number {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
}
