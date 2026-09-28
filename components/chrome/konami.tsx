"use client";

import { useEffect, useRef } from "react";

const CODE = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];

export function Konami() {
  const index = useRef(0);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      index.current = key === CODE[index.current] ? index.current + 1 : key === CODE[0] ? 1 : 0;
      if (index.current !== CODE.length) return;
      index.current = 0;
      burst();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return null;
}

function burst() {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:fixed;inset:0;z-index:90;pointer-events:none;width:100%;height:100%";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  const colors = ["#8b5cf6", "#22d3ee", "#f6f3ec", "#f59e0b", "#fb7185"];
  const pieces = Array.from({ length: 90 }, () => ({
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: (Math.random() - 0.5) * 16,
    vy: Math.random() * -14 - 4,
    g: 0.28 + Math.random() * 0.12,
    s: 4 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)] ?? "#fff",
    life: 90 + Math.random() * 30,
  }));
  let frame = 0;
  const tick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((piece) => {
      piece.vy += piece.g;
      piece.x += piece.vx;
      piece.y += piece.vy;
      piece.life -= 1;
      ctx.globalAlpha = Math.max(piece.life / 120, 0);
      ctx.fillStyle = piece.color;
      ctx.fillRect(piece.x, piece.y, piece.s, piece.s * 0.6);
    });
    frame += 1;
    if (frame < 130) requestAnimationFrame(tick);
    else canvas.remove();
  };
  tick();
}
