import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollProgress } from "./useScrollProgress";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

export function initSmoothScroll() {
  if (lenis) return lenis;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  lenis = new Lenis({
    lerp: prefersReduced ? 1 : 0.1,
    smoothWheel: !prefersReduced,
    duration: 1.2,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((t) => {
    lenis?.raf(t * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      useScrollProgress.getState().setProgress(self.progress);
    },
  });

  const onPointer = (e: PointerEvent) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -((e.clientY / window.innerHeight) * 2 - 1);
    useScrollProgress.getState().setPointer(x, y);
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  const onResize = () => {
    ScrollTrigger.refresh();
  };
  window.addEventListener("resize", onResize);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  return lenis;
}

export function destroySmoothScroll() {
  lenis?.destroy();
  lenis = null;
}

export { gsap, ScrollTrigger };
