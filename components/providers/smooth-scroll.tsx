"use client";

import { registerScroller } from "@/lib/scroll";
import { useEffect } from "react";
import "lenis/dist/lenis.css";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let alive = true;
    let cleanup = () => {};

    async function setup() {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (!alive || reduced.matches) return;

      const { default: Lenis } = await import("lenis");
      const lenis = new Lenis({
        lerp: 0.09,
        smoothWheel: true,
        anchors: false,
      });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const unregister = registerScroller((target) => {
        lenis.scrollTo(target, { offset: -80 });
      });

      const onClick = (event: MouseEvent) => {
        const anchor = (event.target as HTMLElement | null)?.closest("a");
        const href = anchor?.getAttribute("href");
        if (!href?.startsWith("#")) return;
        const el = document.querySelector(href);
        if (!el) return;
        event.preventDefault();
        lenis.scrollTo(el as HTMLElement, { offset: -80 });
        history.pushState(null, "", href);
      };
      document.addEventListener("click", onClick);

      cleanup = () => {
        document.removeEventListener("click", onClick);
        unregister();
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    }

    void setup();
    return () => {
      alive = false;
      cleanup();
    };
  }, []);

  return children;
}
