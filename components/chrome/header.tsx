"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useLocale } from "@/components/providers/locale-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { buttonVariants } from "@/components/ui/button";
import { getProfile } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { Menu, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Header() {
  const { dict, locale, toggle } = useLocale();
  const { toggle: toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const profile = getProfile();
  const onHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(dict.nav[0]?.id ?? "about");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!onHome) return;
    const nodes = dict.nav
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: [0.15, 0.4] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [dict.nav, onHome]);

  function go(id: string) {
    setOpen(false);
    if (onHome) {
      const el = document.getElementById(id);
      if (el) scrollToTarget(el);
      history.pushState(null, "", `#${id}`);
      return;
    }
    router.push(`/#${id}`);
  }

  return (
    <header className={cn("no-print fixed inset-x-0 top-0 z-40 transition-colors", scrolled && "bg-background/75 backdrop-blur-xl")}>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
      >
        {dict.buttons.skipToContent}
      </a>
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-8">
        <Link href="/" className="font-display text-lg tracking-tight" aria-label={profile.name}>
          AK
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {dict.nav.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => go(item.id)}
              aria-current={onHome && active === item.id ? "true" : undefined}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
                onHome && active === item.id && "bg-muted text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href={profile.cvPath} download className={cn(buttonVariants({ variant: "primary", size: "sm" }), "hidden sm:inline-flex")}>
            {dict.buttons.downloadCv}
          </a>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("open-command"))}
            className="hidden h-10 items-center gap-2 rounded-full border border-border px-3 text-xs text-muted-foreground sm:inline-flex"
            aria-label={dict.buttons.commandPalette}
          >
            <span>⌘K</span>
          </button>
          <button
            type="button"
            onClick={toggle}
            className="inline-flex h-10 items-center rounded-full border border-border px-3 font-mono text-xs"
            aria-label={dict.buttons.toggleLocale}
          >
            {locale === "en" ? "عربي" : "EN"}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border"
            aria-label={dict.buttons.toggleTheme}
          >
            <Sun className="icon-sun size-4" />
            <Moon className="icon-moon size-4" />
          </button>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-border lg:hidden"
            aria-label={dict.buttons.openMenu}
            onClick={() => setOpen(true)}
          >
            <Menu className="size-4" />
          </button>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent closeLabel={dict.buttons.closeMenu} className="lg:hidden">
          <DialogTitle className="font-display text-2xl">{profile.name}</DialogTitle>
          <nav className="mt-6 grid gap-2" aria-label="Mobile">
            <a href={profile.cvPath} download className={buttonVariants({ variant: "primary" })} onClick={() => setOpen(false)}>
              {dict.buttons.downloadCv}
            </a>
            {dict.nav.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => go(item.id)}
                className="rounded-2xl px-3 py-3 text-start text-lg hover:bg-muted"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </DialogContent>
      </Dialog>
    </header>
  );
}
