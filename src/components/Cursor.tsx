import { useEffect, useRef } from "react";

export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const tick = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      if (el) el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    const onOverInteractive = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("button, a, .nav__pill")) el?.classList.add("cursor--lg");
      else el?.classList.remove("cursor--lg");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOverInteractive, true);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOverInteractive, true);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div className="cursor" ref={ref} aria-hidden />;
}
