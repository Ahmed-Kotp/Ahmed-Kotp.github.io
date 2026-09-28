"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { getProfile } from "@/lib/data";
import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export function TerminalWidget() {
  const { dict } = useLocale();
  const profile = getProfile();
  const reduced = useReducedMotion();
  const users = profile.stats.find((stat) => stat.id === "users");
  const apps = profile.stats.find((stat) => stat.id === "apps");
  const lines = [
    `${dict.terminal.whoami}  →  ${profile.name}`,
    `${dict.terminal.role}    →  ${dict.profile.title}`,
    `${dict.terminal.location} →  ${profile.location}`,
    `${dict.terminal.shipped} →  ${apps?.value ?? ""}${apps?.suffix ?? ""} apps · ${users?.value ?? ""}${users?.suffix ?? ""} users`,
  ];
  const full = lines.join("\n");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => {
      setCount((value) => {
        if (value >= full.length) {
          window.clearInterval(timer);
          return value;
        }
        return value + 1;
      });
    }, 18);
    return () => window.clearInterval(timer);
  }, [full, reduced]);

  return (
    <div className="glass max-w-xl rounded-2xl p-4 font-mono text-[12px] leading-relaxed text-muted-foreground" aria-label={dict.terminal.whoami}>
      <div className="mb-3 flex gap-1.5" aria-hidden="true">
        <span className="size-2.5 rounded-full bg-rose-400/80" />
        <span className="size-2.5 rounded-full bg-amber-300/80" />
        <span className="size-2.5 rounded-full bg-emerald-400/80" />
      </div>
      <pre className="whitespace-pre-wrap text-foreground/90">
        {(reduced ? full : full.slice(0, count))}
        <span className="ms-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-cyan-300 align-middle" />
      </pre>
    </div>
  );
}
