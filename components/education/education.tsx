"use client";

import { Reveal, SectionHeading } from "@/components/motion/reveal";
import { useLocale } from "@/components/providers/locale-provider";
import { getCertificates, getEducation } from "@/lib/data";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

export function Education() {
  const { dict } = useLocale();
  const section = dict.sections.education;
  const education = getEducation();
  const certificates = getCertificates();
  const scroller = useRef<HTMLDivElement>(null);

  function slide(direction: number) {
    scroller.current?.scrollBy({ left: direction * 320, behavior: "smooth" });
  }

  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8">
      <SectionHeading id={`${section.id}-title`} eyebrow={section.eyebrow} title={section.title} lede={section.lede} />
      <div className="mt-12 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">{dict.educationHeading}</h3>
          <div className="mt-4 space-y-4">
            {education.map((item) => (
              <Reveal key={item.id} className="glass rounded-3xl p-6">
                <p className="font-mono text-xs text-signal">{item.year}</p>
                <h4 className="mt-3 font-display text-3xl tracking-tight">{item.degree}</h4>
                <p className="mt-2">{item.school}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">{dict.certificatesHeading}</h3>
            <div className="flex gap-2">
              <button type="button" className="inline-flex size-10 items-center justify-center rounded-full border border-border" onClick={() => slide(-1)} aria-label={dict.buttons.previous}>
                <ChevronLeft className="size-4 rtl:rotate-180" />
              </button>
              <button type="button" className="inline-flex size-10 items-center justify-center rounded-full border border-border" onClick={() => slide(1)} aria-label={dict.buttons.next}>
                <ChevronRight className="size-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
          <div ref={scroller} className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
            {certificates.map((item) => (
              <article key={item.id} className="glass w-72 shrink-0 snap-start rounded-3xl p-6">
                <p className="font-mono text-xs text-signal">{item.year}</p>
                <h4 className="mt-4 font-display text-2xl leading-tight tracking-tight">{item.name}</h4>
                <p className="mt-4 text-sm text-muted-foreground">{item.issuer}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
