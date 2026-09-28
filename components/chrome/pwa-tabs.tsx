"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { scrollToTarget } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { Briefcase, GraduationCap, Layers, Mail, Smartphone, UserRound, type LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const icons: Record<string, LucideIcon> = {
  about: UserRound,
  skills: Layers,
  experience: Briefcase,
  work: Smartphone,
  education: GraduationCap,
  contact: Mail,
};

export function PwaTabs() {
  const { dict } = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const onHome = pathname === "/";
  const [active, setActive] = useState(dict.nav[0]?.id ?? "about");

  useEffect(() => {
    if (!onHome) return;
    const nodes = dict.nav.map((item) => document.getElementById(item.id)).filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: [0.15, 0.4] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [dict.nav, onHome]);

  function go(id: string) {
    if (onHome) {
      const el = document.getElementById(id);
      if (el) scrollToTarget(el);
      history.pushState(null, "", `#${id}`);
      setActive(id);
      return;
    }
    router.push(`/#${id}`);
  }

  return (
    <nav className="pwa-tabs no-print lg:hidden" aria-label="Sections">
      {dict.nav.map((item) => {
        const Icon = icons[item.id] ?? Smartphone;
        const current = onHome && active === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => go(item.id)}
            aria-current={current ? "true" : undefined}
            className={cn(
              "flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-2 text-[10px] leading-none",
              current ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <Icon className="size-5 shrink-0" aria-hidden="true" />
            <span className="max-w-full truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
