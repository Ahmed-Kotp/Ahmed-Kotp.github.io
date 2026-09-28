"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    document.documentElement.classList.add("custom-cursor");
    const el = dot.current;
    if (!el) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    let hovering = false;
    let frame = 0;

    const onMove = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;
      const target = event.target instanceof Element ? event.target : null;
      hovering = Boolean(target?.closest("a, button, input, textarea, select, [data-cursor='magnetic']"));
    };

    const loop = () => {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      const size = hovering ? 56 : 14;
      el.style.transform = `translate3d(${cx - size / 2}px, ${cy - size / 2}px, 0)`;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.opacity = hovering ? "0.35" : "0.9";
      frame = window.requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    frame = window.requestAnimationFrame(loop);

    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", onMove);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="cursor-dot pointer-events-none fixed left-0 top-0 z-[75] hidden rounded-full md:block"
    />
  );
}
