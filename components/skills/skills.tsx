"use client";

import { SectionHeading } from "@/components/motion/reveal";
import { useLocale } from "@/components/providers/locale-provider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSkills } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  Apple,
  Atom,
  AudioLines,
  Bell,
  Bot,
  Box,
  Braces,
  Bug,
  Check,
  Cloud,
  Code,
  CreditCard,
  Database,
  Flame,
  GitBranch,
  KeyRound,
  Layers,
  LayoutGrid,
  MousePointer2,
  PenTool,
  Play,
  Radio,
  Server,
  Smartphone,
  Sparkles,
  Terminal,
  TestTube,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";

const icons: Record<string, LucideIcon> = {
  smartphone: Smartphone,
  layers: Layers,
  terminal: Terminal,
  atom: Atom,
  braces: Braces,
  code: Code,
  workflow: Workflow,
  box: Box,
  database: Database,
  spark: Sparkles,
  bot: Bot,
  audio: AudioLines,
  radio: Radio,
  bell: Bell,
  card: CreditCard,
  server: Server,
  flame: Flame,
  cloud: Cloud,
  key: KeyRound,
  apple: Apple,
  play: Play,
  users: Users,
  check: Check,
  layout: LayoutGrid,
  git: GitBranch,
  figma: PenTool,
  test: TestTube,
  bug: Bug,
  cursor: MousePointer2,
};

export function Skills() {
  const { dict } = useLocale();
  const skills = getSkills();
  const section = dict.sections.skills;
  const [category, setCategory] = useState("all");
  const names = skills.categories.flatMap((group) => group.skills.map((skill) => skill.name));
  const visible =
    category === "all" ? skills.categories : skills.categories.filter((group) => group.id === category);

  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="mx-auto min-w-0 max-w-[1400px] px-5 py-24 sm:px-8">
      <SectionHeading id={`${section.id}-title`} eyebrow={section.eyebrow} title={section.title} lede={section.lede} />
      <div className="marquee mt-10 overflow-hidden rounded-full border border-border py-3" aria-hidden="true">
        <div className="marquee-track flex w-max gap-8 px-4 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {[...names, ...names].map((name, index) => (
            <span key={`${name}-${index}`} className="inline-flex items-center gap-3">
              {name}
              <span className="text-signal" aria-hidden="true">
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
      <Tabs value={category} onValueChange={setCategory} className="mt-8">
        <TabsList aria-label={section.title}>
          <TabsTrigger value="all">{dict.buttons.all}</TabsTrigger>
          {skills.categories.map((group) => (
            <TabsTrigger key={group.id} value={group.id}>
              {group.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <LayoutGroup>
        <div className="mt-8 space-y-10">
          {visible.map((group) => (
            <div key={group.id}>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">{group.label}</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.skills.map((skill) => (
                  <motion.div key={skill.name} layout>
                    <TiltCard>
                      <article className="glass h-full rounded-3xl p-5">
                        <div className="flex items-center justify-between gap-3">
                          <SkillIcon name={skill.icon} />
                          {skill.level !== undefined ? (
                            <span className="font-mono text-[11px] text-muted-foreground">{skill.level}/5</span>
                          ) : null}
                        </div>
                        <h4 className="mt-4 font-display text-2xl tracking-tight">{skill.name}</h4>
                        {skill.level !== undefined ? (
                          <div
                            className="mt-4 h-1 overflow-hidden rounded-full bg-muted"
                            role="meter"
                            aria-valuemin={0}
                            aria-valuemax={5}
                            aria-valuenow={skill.level}
                            aria-label={skill.name}
                          >
                            <div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-300" style={{ width: `${(skill.level / 5) * 100}%` }} />
                          </div>
                        ) : null}
                      </article>
                    </TiltCard>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </LayoutGroup>
    </section>
  );
}

function SkillIcon({ name }: { name?: string }) {
  const Icon = (name && icons[name]) || Sparkles;
  return (
    <span className="grid size-10 place-items-center rounded-2xl bg-muted text-signal">
      <Icon className="size-4" aria-hidden="true" />
    </span>
  );
}

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  function onMove(event: React.MouseEvent<HTMLDivElement>) {
    if (reduced || !ref.current) return;
    const bounds = ref.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    ref.current.style.transform = `rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg)`;
  }

  return (
    <div className="h-full [perspective:900px]">
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => {
          if (ref.current) ref.current.style.transform = "rotateX(0) rotateY(0)";
        }}
        className={cn("h-full transition-transform duration-200 [transform-style:preserve-3d]")}
      >
        {children}
      </div>
    </div>
  );
}
