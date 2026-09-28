"use client";

import { TerminalWidget } from "@/components/hero/terminal-widget";
import { useLocale } from "@/components/providers/locale-provider";
import { PhoneMockup } from "@/components/projects/phone-mockup";
import { buttonVariants } from "@/components/ui/button";
import { getFeaturedProjects, getProfile } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";

const HeroCanvas = dynamic(() => import("@/components/hero/hero-canvas"), { ssr: false });

function subscribeWebgl(onStoreChange: () => void) {
  const queries = [window.matchMedia("(prefers-reduced-motion: reduce)"), window.matchMedia("(max-width: 768px)")];
  queries.forEach((query) => query.addEventListener("change", onStoreChange));
  return () => queries.forEach((query) => query.removeEventListener("change", onStoreChange));
}

function readWebgl() {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const lowPower = (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) || navigator.hardwareConcurrency <= 4;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const narrow = window.matchMedia("(max-width: 768px)").matches;
  return !reduce && !narrow && !lowPower && !nav.connection?.saveData;
}

export function Hero() {
  const { dict } = useLocale();
  const profile = getProfile();
  const phones = getFeaturedProjects().slice(0, 3);
  const reduced = useReducedMotion();
  const webgl = useSyncExternalStore(subscribeWebgl, readWebgl, () => false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => {
      setRoleIndex((value) => (value + 1) % dict.roles.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, [dict.roles.length, reduced]);

  const role = dict.roles[roleIndex] ?? dict.roles[0] ?? "";
  const [firstName, ...lastParts] = profile.name.split(" ");
  const lastName = lastParts.join(" ") || firstName;

  return (
    <section
      className="relative flex min-h-dvh items-end overflow-hidden pb-16 pt-[calc(7rem+env(safe-area-inset-top))]"
      onMouseMove={(event) => {
        if (reduced) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        setPointer({
          x: (event.clientX - bounds.left) / bounds.width - 0.5,
          y: (event.clientY - bounds.top) / bounds.height - 0.5,
        });
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        {webgl ? <HeroCanvas /> : null}
      </div>
      <div className="relative mx-auto grid w-full max-w-[1400px] items-end gap-10 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="flex items-center gap-4">
            <figure className="relative size-20 shrink-0 overflow-hidden rounded-full border border-border shadow-[0_16px_40px_-20px_rgba(139,92,246,0.9)] sm:size-28">
              <Image
                src={profile.portrait}
                alt={profile.name}
                fill
                priority
                sizes="112px"
                className="object-cover object-[center_18%]"
              />
            </figure>
            <p className="inline-flex max-w-full flex-col items-start gap-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="pulse-dot relative size-2 rounded-full bg-emerald-400" />
              {dict.profile.availability}
            </span>
            <span>{dict.profile.relocation}</span>
            <span className="whitespace-nowrap">{profile.location}</span>
            </p>
          </div>
          <h1 className="mt-6 font-display text-[clamp(3.25rem,15vw,8.6rem)] leading-[0.82] tracking-[-0.07em]">
            <span className="sr-only">
              {profile.name}. {dict.profile.title}
            </span>
            <span aria-hidden="true" className="block whitespace-nowrap">
              <KineticLine text={firstName ?? profile.name} delay={0} />
            </span>
            <span aria-hidden="true" className="block whitespace-nowrap text-gradient">
              <KineticLine text={lastName} delay={0.12} />
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-foreground/90 sm:text-xl">{dict.profile.title}</p>
          <p className="mt-3 h-8 font-mono text-sm uppercase tracking-[0.22em] text-signal" aria-hidden="true">
            <AnimatePresence mode="wait">
              <motion.span
                key={role}
                className="inline-block"
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                {role}
              </motion.span>
            </AnimatePresence>
          </p>
          <p className="sr-only">{dict.roles.join(", ")}</p>
          <p className="mt-2 text-muted-foreground">{dict.profile.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" className={buttonVariants({ variant: "gradient" })} onClick={() => scrollToTarget("#contact")}>
              {dict.buttons.startProject}
            </button>
            <a className={buttonVariants({ variant: "primary" })} href={profile.cvPath} download>
              {dict.buttons.downloadCv}
            </a>
            <button type="button" className={buttonVariants({ variant: "ghost" })} onClick={() => scrollToTarget("#work")}>
              {dict.buttons.viewWork}
            </button>
          </div>
          <div className="mt-8">
            <TerminalWidget />
          </div>
        </div>
        <div className="relative mx-auto h-72 w-full max-w-md sm:h-[460px]" aria-hidden="true">
          {phones.map((project, index) => (
            <div
              key={project.id}
              className="absolute w-32 sm:w-52"
              style={{
                left: `${index * 22}%`,
                top: `${index === 1 ? 0 : 48}px`,
                zIndex: index === 1 ? 3 : 1,
                transform: reduced
                  ? `rotate(${index === 1 ? 0 : index === 0 ? -8 : 8}deg)`
                  : `translate3d(${pointer.x * (18 + index * 10)}px, ${pointer.y * (12 + index * 8)}px, 0) rotate(${(index === 1 ? 0 : index === 0 ? -8 : 8) + pointer.x * 4}deg)`,
              }}
            >
              <PhoneMockup project={project} />
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => scrollToTarget("#about")}
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground"
      >
        {dict.buttons.scroll}
        <span className="block h-10 w-px bg-gradient-to-b from-transparent via-foreground/70 to-transparent" />
      </button>
    </section>
  );
}

function KineticLine({ text, delay }: { text: string; delay: number }) {
  const reduced = useReducedMotion();
  if (reduced) return <>{text}</>;
  return (
    <>
      {text.split("").map((char, index) => (
        <span key={`${char}-${index}`} className="inline-block overflow-hidden">
          <motion.span
            className={cn("inline-block")}
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.85, delay: delay + index * 0.045, ease: [0.22, 1, 0.36, 1] }}
          >
            {char}
          </motion.span>
        </span>
      ))}
    </>
  );
}
