"use client";

import { Reveal, SectionHeading } from "@/components/motion/reveal";
import { useLocale } from "@/components/providers/locale-provider";
import { getProfile } from "@/lib/data";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function About() {
  const { dict } = useLocale();
  const profile = getProfile();
  const section = dict.sections.about;

  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8">
      <SectionHeading id={`${section.id}-title`} eyebrow={section.eyebrow} title={section.title} lede={section.lede} />
      <div className="mt-12 grid gap-4 md:grid-cols-6">
        <Reveal className="glass rounded-3xl p-7 md:col-span-4 md:row-span-2">
          <p className="text-lg leading-relaxed text-foreground/90 sm:text-xl">{dict.profile.summary}</p>
        </Reveal>
        <Reveal delay={0.05} className="glass rounded-3xl p-6 md:col-span-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">{dict.buttons.status}</p>
          <p className="mt-4 inline-flex items-center gap-2 font-display text-3xl tracking-tight">
            <span className="pulse-dot relative size-2 rounded-full bg-emerald-400" />
            {dict.profile.availability}
          </p>
        </Reveal>
        <Reveal delay={0.1} className="glass rounded-3xl p-6 md:col-span-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">{dict.profile.locationLabel}</p>
          <p className="mt-4 font-display text-3xl tracking-tight">{profile.location}</p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-signal">{dict.profile.languagesLabel}</p>
          <ul className="mt-3 space-y-1 text-sm">
            {profile.languages.map((language) => (
              <li key={language.name} className="flex justify-between gap-4">
                <span>{language.name}</span>
                <span className="text-muted-foreground">{language.level}</span>
              </li>
            ))}
          </ul>
          {profile.showPhone ? <p className="mt-4 text-sm">{profile.phone}</p> : null}
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 md:col-span-6 lg:grid-cols-5">
          {profile.stats.map((stat, index) => {
            const label = dict.stats.find((item) => item.id === stat.id)?.label ?? stat.label;
            return (
              <Reveal key={stat.id} delay={index * 0.04} className="glass rounded-3xl p-6">
                <Counter value={stat.value} suffix={stat.suffix} />
                <p className="mt-2 text-sm text-muted-foreground">{label}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 900, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, value]);

  return (
    <p ref={ref} className="font-display text-5xl tracking-tight tabular-nums">
      <motion.span>{reduced ? value : display}</motion.span>
      {suffix}
    </p>
  );
}
