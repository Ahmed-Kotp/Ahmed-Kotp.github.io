"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { getProfile } from "@/lib/data";
import { motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";

function finish() {
  sessionStorage.setItem("ak-intro", "1");
  document.documentElement.dataset.intro = "done";
}

export function Intro() {
  const { dict } = useLocale();
  const profile = getProfile();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (document.documentElement.dataset.intro === "done" || reduced) {
      document.documentElement.dataset.intro = "done";
      return;
    }
    const timer = window.setTimeout(finish, 1500);
    return () => window.clearTimeout(timer);
  }, [reduced]);

  return (
    <motion.div
      className="intro-overlay no-print fixed inset-0 z-[80] flex items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      role="dialog"
      aria-label={profile.name}
    >
      <button
        type="button"
        onClick={finish}
        className="absolute end-6 top-6 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
      >
        {dict.buttons.skipIntro}
      </button>
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-signal">{dict.intro.line}</p>
        <p className="mt-4 font-display text-6xl tracking-[-0.06em] sm:text-8xl">{profile.name}</p>
        <div className="mx-auto mt-8 h-px w-40 overflow-hidden bg-border">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-400 to-cyan-300"
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </motion.div>
  );
}
