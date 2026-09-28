"use client";

import { SectionHeading } from "@/components/motion/reveal";
import { useLocale } from "@/components/providers/locale-provider";
import { PhoneMockup } from "@/components/projects/phone-mockup";
import { buttonVariants } from "@/components/ui/button";
import { getProjects } from "@/lib/data";
import type { Project, ProjectStatus } from "@/lib/schemas";
import { cn, hasUrl } from "@/lib/utils";
import { LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";

const statusTone: Record<ProjectStatus, string> = {
  live: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
  unreleased: "bg-amber-500/15 text-amber-900 dark:text-amber-100",
  delisted: "bg-rose-500/15 text-rose-800 dark:text-rose-100",
};

export function Projects() {
  const { dict } = useLocale();
  const projects = getProjects();
  const section = dict.sections.projects;
  const featured = projects.filter((project) => project.featured);
  const [platform, setPlatform] = useState<"all" | "iOS" | "Android">("all");
  const [status, setStatus] = useState<"all" | ProjectStatus>("all");
  const [tech, setTech] = useState("all");
  const technologies = useMemo(() => Array.from(new Set(projects.flatMap((project) => project.tech))).sort(), [projects]);
  const filtering = platform !== "all" || status !== "all" || tech !== "all";
  const pool = filtering ? projects : projects.filter((project) => !project.featured);
  const visible = pool.filter((project) => {
    const platformOk = platform === "all" || project.platform.includes(platform);
    const statusOk = status === "all" || project.status === status;
    const techOk = tech === "all" || project.tech.includes(tech);
    return platformOk && statusOk && techOk;
  });

  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="py-24">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <SectionHeading id={`${section.id}-title`} eyebrow={section.eyebrow} title={section.title} lede={section.lede} />
      </div>
      {filtering ? null : <FeaturedShowcase projects={featured} />}
      <div className="mx-auto mt-16 max-w-[1400px] px-5 sm:px-8">
        <div className="flex flex-col gap-3">
          <ChipRow
            label={dict.buttons.all}
            value={platform}
            options={["all", "iOS", "Android"]}
            onChange={setPlatform}
            format={(value) => (value === "all" ? dict.buttons.all : value)}
          />
          <ChipRow
            label={dict.buttons.status}
            value={status}
            options={["all", "live", "unreleased", "delisted"]}
            onChange={setStatus}
            format={(value) => (value === "all" ? dict.buttons.all : dict.status[value])}
          />
          <ChipRow
            label={dict.buttons.tech}
            value={tech}
            options={["all", ...technologies]}
            onChange={setTech}
            format={(value) => (value === "all" ? dict.buttons.all : value)}
          />
        </div>
        <LayoutGroup>
          <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {visible.map((project) => (
              <motion.div key={project.id} layout className="mb-4 break-inside-avoid">
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        </LayoutGroup>
        {visible.length === 0 ? <p className="mt-8 text-muted-foreground">{dict.buttons.noResults}</p> : null}
      </div>
    </section>
  );
}

function FeaturedShowcase({ projects }: { projects: Project[] }) {
  const { dict } = useLocale();
  const track = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  function onScroll() {
    const element = track.current;
    if (!element) return;
    const max = element.scrollWidth - element.clientWidth;
    setProgress(max > 0 ? Math.min(Math.abs(element.scrollLeft) / max, 1) : 0);
  }

  return (
    <div className="relative mt-12">
      <div className="mx-auto mb-4 h-px max-w-[1400px] bg-border px-5 sm:px-8">
        <div className="h-px origin-left bg-gradient-to-r from-violet-400 to-cyan-300" style={{ transform: `scaleX(${Math.max(progress, 0.08)})` }} />
      </div>
      <div ref={track} onScroll={onScroll} className="flex snap-x snap-mandatory gap-0 overflow-x-auto">
        {projects.map((project) => (
          <article key={project.id} className="w-[88vw] shrink-0 snap-center px-5 sm:px-8 lg:w-[70vw] lg:px-10">
            <div className="grid items-center gap-8 lg:min-h-[80vh] lg:grid-cols-2">
              <div className="mx-auto w-52 sm:w-64">
                <PhoneMockup project={project} />
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">{dict.buttons.featured}</p>
                <h3 className="mt-3 font-display text-5xl tracking-tight sm:text-7xl">{project.name}</h3>
                <p className="mt-4 max-w-xl text-lg text-muted-foreground">{project.tagline}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <StatusBadge status={project.status} label={dict.status[project.status]} />
                  {project.metric ? <span className="rounded-full bg-muted px-3 py-1 text-xs">{project.metric}</span> : null}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={`/projects/${project.id}/`} className={buttonVariants({ variant: "gradient", size: "sm" })}>
                    {dict.buttons.viewProject}
                  </Link>
                  <StoreLinks project={project} />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const { dict } = useLocale();
  return (
    <article className="glass overflow-hidden rounded-3xl" style={{ boxShadow: `0 24px 60px -36px ${project.accent}` }}>
      <Link href={`/projects/${project.id}/`} className="block p-4">
        <div className="mx-auto w-36">
          <PhoneMockup project={project} />
        </div>
        <div className="mt-4 flex items-start justify-between gap-3">
          <h3 className="font-display text-2xl tracking-tight">{project.name}</h3>
          <StatusBadge status={project.status} label={dict.status[project.status]} />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{project.tagline}</p>
      </Link>
      <div className="flex flex-wrap gap-2 px-4 pb-4">
        {project.tech.slice(0, 4).map((item) => (
          <span key={item} className="rounded-full bg-muted px-2.5 py-1 text-[11px]">
            {item}
          </span>
        ))}
      </div>
    </article>
  );
}

export function StatusBadge({ status, label }: { status: ProjectStatus; label: string }) {
  return <span className={cn("rounded-full px-2.5 py-1 text-[11px]", statusTone[status])}>{label}</span>;
}

export function StoreLinks({ project }: { project: Project }) {
  const { dict } = useLocale();
  return (
    <>
      {hasUrl(project.appStoreUrl) ? (
        <a className={buttonVariants({ variant: "ghost", size: "sm" })} href={project.appStoreUrl} target="_blank" rel="noreferrer">
          {dict.buttons.appStore}
        </a>
      ) : null}
      {hasUrl(project.playStoreUrl) ? (
        <a className={buttonVariants({ variant: "ghost", size: "sm" })} href={project.playStoreUrl} target="_blank" rel="noreferrer">
          {dict.buttons.playStore}
        </a>
      ) : null}
    </>
  );
}

function ChipRow<T extends string>({
  label,
  value,
  options,
  onChange,
  format,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
  format: (value: T) => string;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          className={cn(
            "shrink-0 rounded-full border border-border px-3 py-1.5 text-xs",
            value === option && "border-transparent bg-foreground text-background",
          )}
        >
          {format(option)}
        </button>
      ))}
    </div>
  );
}
