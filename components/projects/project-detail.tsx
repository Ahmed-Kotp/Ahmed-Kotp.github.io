"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { PhoneMockup } from "@/components/projects/phone-mockup";
import { StatusBadge, StoreLinks } from "@/components/projects/projects";
import { buttonVariants } from "@/components/ui/button";
import { getRelatedProjects } from "@/lib/data";
import type { Project } from "@/lib/schemas";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function ProjectDetail({ project }: { project: Project }) {
  const { dict } = useLocale();
  const related = getRelatedProjects(project);

  return (
    <article className="mx-auto max-w-[1400px] px-5 pb-24 pt-28 sm:px-8">
      <Link href="/#work" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        <ArrowLeft className="size-4 rtl:rotate-180" />
        {dict.buttons.backHome}
      </Link>
      <div className="mt-8 grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="mx-auto w-60 sm:w-72 lg:sticky lg:top-28">
          <PhoneMockup project={project} priority />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={project.status} label={dict.status[project.status]} />
            {project.platform.map((item) => (
              <span key={item} className="rounded-full border border-border px-2.5 py-1 text-[11px]">
                {item}
              </span>
            ))}
            {project.metric ? <span className="rounded-full bg-muted px-2.5 py-1 text-[11px]">{project.metric}</span> : null}
          </div>
          <h1 className="mt-4 font-display text-5xl tracking-[-0.05em] sm:text-7xl">{project.name}</h1>
          <p className="mt-4 max-w-2xl text-xl text-muted-foreground">{project.tagline}</p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed">{project.description}</p>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">{dict.buttons.role}</dt>
              <dd className="mt-2">{project.role}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">{dict.profile.locationLabel}</dt>
              <dd className="mt-2">{project.company}</dd>
            </div>
          </dl>
          <h2 className="mt-10 font-display text-3xl tracking-tight">{dict.buttons.highlights}</h2>
          <ul className="mt-4 space-y-3 text-muted-foreground">
            {project.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h2 className="mt-10 font-display text-3xl tracking-tight">{dict.buttons.tech}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tech.map((item) => (
              <li key={item} className="rounded-full bg-muted px-3 py-1 text-sm">
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <StoreLinks project={project} />
          </div>
        </div>
      </div>
      <h2 className="mt-20 font-display text-3xl tracking-tight">{dict.buttons.related}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {related.map((item) => (
          <Link key={item.id} href={`/projects/${item.id}/`} className={buttonVariants({ variant: "ghost", className: "h-auto flex-col items-start rounded-3xl p-5" })}>
            <span className="font-display text-2xl">{item.name}</span>
            <span className="mt-2 text-start text-sm text-muted-foreground">{item.tagline}</span>
          </Link>
        ))}
      </div>
    </article>
  );
}
