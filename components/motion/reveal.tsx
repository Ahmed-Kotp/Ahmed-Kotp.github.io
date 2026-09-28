"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={cn("reveal", className)}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  id,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  id: string;
}) {
  return (
    <Reveal className="max-w-3xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-signal">{eyebrow}</p>
      <h2 id={id} className="mt-3 font-display text-4xl leading-[0.95] tracking-[-0.04em] sm:text-6xl">
        {title}
      </h2>
      {lede ? <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{lede}</p> : null}
    </Reveal>
  );
}
