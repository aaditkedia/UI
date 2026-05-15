import { useEffect, useRef } from "react";
import SplitType from "split-type";
import { gsap, ScrollTrigger } from "../lib/smoothScroll";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

/**
 * Parse "make us *human*" → "make us <b>human</b>"
 * The signature one-bold-word-per-sentence move.
 */
function parseBold(input: string): string {
  return input.replace(/\*([^*]+)\*/g, "<b>$1</b>");
}

export function RevealText({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const splitRef = useRef<SplitType | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const setup = () => {
      if (splitRef.current) {
        splitRef.current.revert();
      }
      const split = new SplitType(el, { types: "lines,words" });
      splitRef.current = split;

      if (!split.lines) return;

      if (prefersReduced) {
        gsap.set(split.lines, { yPercent: 0, opacity: 1, filter: "blur(0px)" });
        return;
      }

      gsap.set(split.lines, {
        yPercent: 110,
        opacity: 0,
        filter: "blur(12px)",
      });
      gsap.to(split.lines, {
        yPercent: 0,
        opacity: 1,
        filter: "blur(0px)",
        stagger: 0.09,
        duration: 1.05,
        ease: "power3.out",
        delay,
        scrollTrigger: {
          trigger: el,
          start: "top 95%",
          once: true,
        },
      });
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setup();
        ScrollTrigger.refresh();
      });
    } else {
      setup();
    }

    return () => {
      splitRef.current?.revert();
      splitRef.current = null;
    };
  }, [delay]);

  if (typeof children === "string") {
    return (
      <span
        ref={ref}
        className={`reveal ${className}`}
        dangerouslySetInnerHTML={{ __html: parseBold(children) }}
      />
    );
  }

  return (
    <span ref={ref} className={`reveal ${className}`}>
      {children}
    </span>
  );
}

export const parseBoldHtml = parseBold;
