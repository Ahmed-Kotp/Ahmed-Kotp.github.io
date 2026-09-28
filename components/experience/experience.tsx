"use client";

import { SectionHeading } from "@/components/motion/reveal";
import { useLocale } from "@/components/providers/locale-provider";
import { getExperience, getProject } from "@/lib/data";
import type { ExperienceType } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const filters: Array<{ id: "all" | ExperienceType; labelKey: "all" | "fullTime" | "contract" | "partTime" | "freelance" }> = [
  { id: "all", labelKey: "all" },
  { id: "full-time", labelKey: "fullTime" },
  { id: "contract", labelKey: "contract" },
  { id: "part-time", labelKey: "partTime" },
  { id: "freelance", labelKey: "freelance" },
];

export function Experience() {
  const { dict } = useLocale();
  const jobs = getExperience();
  const section = dict.sections.experience;
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [showPrior, setShowPrior] = useState(false);
  const line = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);

  const current = jobs.filter((job) => job.type !== "prior" && (filter === "all" || job.type === filter));
  const prior = jobs.filter((job) => job.type === "prior");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let alive = true;
    let revert = () => {};
    void (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (!alive || !line.current || !list.current) return;
      const ctx = gsap.context(() => {
        gsap.fromTo(
          line.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: list.current,
              start: "top 70%",
              end: "bottom 60%",
              scrub: 0.6,
            },
          },
        );
        gsap.utils.toArray<HTMLElement>("[data-job]").forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 36 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: { trigger: card, start: "top 85%" },
            },
          );
        });
      }, list);
      revert = () => ctx.revert();
    })();
    return () => {
      alive = false;
      revert();
    };
  }, [filter, showPrior]);

  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8">
      <SectionHeading id={`${section.id}-title`} eyebrow={section.eyebrow} title={section.title} lede={section.lede} />
      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label={section.title}>
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
            className={cn(
              "rounded-full border border-border px-4 py-2 text-sm",
              filter === item.id && "border-transparent bg-foreground text-background",
            )}
          >
            {dict.buttons[item.labelKey]}
          </button>
        ))}
      </div>
      <div ref={list} className="relative mt-12">
        <div className="absolute bottom-0 start-3 top-0 w-px bg-border md:start-6" />
        <div ref={line} className="absolute bottom-0 start-3 top-0 w-px origin-top bg-gradient-to-b from-violet-400 to-cyan-300 md:start-6" />
        <div className="space-y-6">
          {current.map((job) => (
            <JobCard key={job.id} jobId={job.id} />
          ))}
        </div>
        {prior.length > 0 && filter === "all" ? (
          <div className="relative mt-8 ps-10 md:ps-16">
            <button type="button" className="text-sm text-signal underline-offset-4 hover:underline" onClick={() => setShowPrior((value) => !value)} aria-expanded={showPrior}>
              {showPrior ? dict.buttons.hideEarlier : dict.buttons.showEarlier}
            </button>
            {showPrior ? (
              <div className="mt-4">
                {prior.map((job) => (
                  <JobCard key={job.id} jobId={job.id} muted />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function JobCard({ jobId, muted = false }: { jobId: string; muted?: boolean }) {
  const { dict } = useLocale();
  const job = getExperience().find((item) => item.id === jobId);
  if (!job) return null;
  return (
    <article data-job className={cn("relative ps-10 md:ps-16", muted && "opacity-70")}>
      <span className="absolute start-[7px] top-7 size-3 rounded-full border-2 bg-background md:start-[19px]" style={{ borderColor: job.accent }} />
      <div className="glass rounded-3xl p-6 md:p-8" style={{ boxShadow: `0 24px 70px -40px ${job.accent}` }}>
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">{job.period}</p>
          <span className="rounded-full border border-border px-2 py-0.5 text-[11px]">{dict.types[job.type]}</span>
          <span className="text-[11px] text-muted-foreground">{job.engagement}</span>
        </div>
        <h3 className="mt-3 font-display text-3xl tracking-tight">{job.role}</h3>
        <p className="mt-1 text-muted-foreground">
          {job.company}
          <span aria-hidden="true"> · </span>
          {job.location}
        </p>
        <p className="mt-4 text-foreground/90">{job.focus}</p>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
          {job.description.map((item) => (
            <li key={item} className="ps-4 [text-indent:-1rem] before:me-2 before:content-['–']">
              {item}
            </li>
          ))}
        </ul>
        {job.tech.length > 0 ? (
          <ul className="mt-5 flex flex-wrap gap-2">
            {job.tech.map((tech) => (
              <li key={tech} className="rounded-full bg-muted px-3 py-1 text-xs">
                {tech}
              </li>
            ))}
          </ul>
        ) : null}
        {job.projectIds.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            {job.projectIds.map((id) => {
              const project = getProject(id);
              if (!project || (project.status !== "live" && project.status !== "inLab")) return null;
              return (
                <Link key={id} href={`/projects/${id}/`} className="text-signal underline-offset-4 hover:underline">
                  {project.name}
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
    </article>
  );
}
