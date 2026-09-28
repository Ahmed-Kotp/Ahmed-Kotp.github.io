"use client";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useLocale } from "@/components/providers/locale-provider";
import { getProjects } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Item = { id: string; label: string; group: string; href: string; kind: "section" | "project" };

export function CommandPalette() {
  const { dict } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const items = useMemo<Item[]>(() => {
    const sections: Item[] = dict.nav.map((item) => ({
      id: item.id,
      label: item.label,
      group: dict.command.groupSections,
      href: `/#${item.id}`,
      kind: "section",
    }));
    const projects: Item[] = getProjects().map((project) => ({
      id: project.id,
      label: project.name,
      group: dict.command.groupProjects,
      href: `/projects/${project.id}/`,
      kind: "project",
    }));
    return [...sections, ...projects];
  }, [dict]);

  const filtered = items.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setActive(0);
        setOpen((value) => !value);
      }
    };
    const openPalette = () => {
      setActive(0);
      setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command", openPalette);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command", openPalette);
    };
  }, []);

  function run(item: Item | undefined) {
    if (!item) return;
    setOpen(false);
    setQuery("");
    if (item.kind === "section" && pathname === "/") {
      const el = document.getElementById(item.id);
      if (el) scrollToTarget(el);
      history.pushState(null, "", `#${item.id}`);
      return;
    }
    router.push(item.href);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent closeLabel={dict.buttons.closeMenu} className="no-print p-3">
        <DialogTitle className="sr-only">{dict.buttons.commandPalette}</DialogTitle>
        <DialogDescription className="sr-only">{dict.command.placeholder}</DialogDescription>
        <input
          autoFocus
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          placeholder={dict.command.placeholder}
          aria-label={dict.command.placeholder}
          className="h-12 w-full rounded-2xl bg-transparent px-3 text-base outline-none"
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActive((value) => Math.min(value + 1, Math.max(filtered.length - 1, 0)));
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setActive((value) => Math.max(value - 1, 0));
            }
            if (event.key === "Enter") {
              event.preventDefault();
              run(filtered[active]);
            }
          }}
        />
        <ul className="mt-2 max-h-80 overflow-auto" role="listbox" aria-label={dict.command.placeholder}>
          {filtered.length === 0 ? <li className="px-3 py-6 text-sm text-muted-foreground">{dict.command.empty}</li> : null}
          {filtered.map((item, index) => (
            <li key={`${item.kind}-${item.id}`}>
              <button
                type="button"
                role="option"
                aria-selected={index === active}
                onMouseEnter={() => setActive(index)}
                onClick={() => run(item)}
                className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-start text-sm ${index === active ? "bg-muted" : ""}`}
              >
                <span>{item.label}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{item.group}</span>
              </button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
