"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { getProfile } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";
import { ArrowUp } from "lucide-react";

export function Footer() {
  const { dict } = useLocale();
  const profile = getProfile();
  const year = new Date().getFullYear();

  return (
    <footer className="no-print border-t border-border">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-5 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <p className="font-display text-2xl tracking-tight">{profile.name}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            © {year} {dict.footer.rights}
          </p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{dict.footer.hint}</p>
        </div>
        <button
          type="button"
          onClick={() => scrollToTarget(0)}
          className="inline-flex items-center gap-2 self-start rounded-full border border-border px-4 py-2 text-sm"
        >
          <ArrowUp className="size-4" />
          {dict.buttons.backToTop}
        </button>
      </div>
    </footer>
  );
}
