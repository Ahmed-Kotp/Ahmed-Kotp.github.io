import type { Project } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function PhoneMockup({
  project,
  className,
  priority = false,
}: {
  project: Pick<Project, "name" | "accent" | "visual" | "image" | "tagline">;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative aspect-[9/19] w-full rounded-[2.2rem] border border-white/15 bg-[#0a0a0f] p-[7px] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      <div className="absolute left-1/2 top-[14px] z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-black" />
      <div className="relative h-full overflow-hidden rounded-[1.7rem]" style={{ background: screenBackground(project.accent, project.visual) }}>
        {project.image ? (
          <Image src={project.image} alt="" fill priority={priority} className="object-cover" sizes="280px" />
        ) : (
          <Screen project={project} />
        )}
      </div>
    </div>
  );
}

function screenBackground(accent: string, visual: Project["visual"]) {
  if (visual === "gold") return "linear-gradient(180deg, #1c1406 0%, #3a2a08 100%)";
  if (visual === "story") return "linear-gradient(180deg, #2a1608 0%, #120c18 100%)";
  return `linear-gradient(180deg, #12121a 0%, color-mix(in srgb, ${accent} 35%, #09090d) 100%)`;
}

function Screen({ project }: { project: Pick<Project, "name" | "accent" | "visual" | "tagline"> }) {
  return (
    <div className="flex h-full flex-col px-4 pb-4 pt-10 text-white">
      <div className="flex items-center justify-between text-[10px] text-white/70">
        <span>9:41</span>
        <span>{project.visual === "chat" ? "RAG" : "LTE"}</span>
      </div>
      <p className="mt-4 font-display text-lg leading-none tracking-tight">{project.name}</p>
      <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-white/70">{project.tagline}</p>
      <div className="mt-4 flex-1">
        <ScreenBody visual={project.visual} accent={project.accent} />
      </div>
    </div>
  );
}

function ScreenBody({ visual, accent }: { visual: Project["visual"]; accent: string }) {
  if (visual === "chat") {
    return (
      <div className="space-y-2">
        <Bubble align="start" text="ما مدة الإجازة السنوية؟" />
        <Bubble align="end" text="حسب المادة… يتم الاسترجاع من المصادر." accent={accent} />
        <Bubble align="start" text="Article retrieved" />
      </div>
    );
  }
  if (visual === "story") {
    return (
      <div className="space-y-3">
        <div className="h-24 rounded-2xl bg-white/10" />
        <div className="h-2 w-4/5 rounded-full bg-white/30" />
        <div className="h-2 w-3/5 rounded-full bg-white/20" />
        <div className="mt-4 h-10 rounded-full" style={{ background: accent }} />
      </div>
    );
  }
  if (visual === "gold") {
    return (
      <div>
        <p className="font-mono text-3xl text-amber-200">2,418</p>
        <p className="text-[10px] text-amber-100/70">USD / oz</p>
        <div className="mt-4 flex h-16 items-end gap-1">
          {[40, 55, 48, 70, 62, 80, 74].map((height) => (
            <span key={height} className="flex-1 rounded-sm bg-amber-300/80" style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>
    );
  }
  if (visual === "fitness") {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-full border-2 text-[10px]" style={{ borderColor: accent }}>
            72%
          </span>
          <div className="flex-1 space-y-1">
            <span className="block h-2 rounded-full bg-white/20" />
            <span className="block h-2 w-2/3 rounded-full bg-white/15" />
          </div>
        </div>
        {["Push", "Pull", "Legs"].map((item) => (
          <div key={item} className="rounded-xl bg-white/10 px-3 py-2 text-[11px]">
            {item}
          </div>
        ))}
      </div>
    );
  }
  if (visual === "market") {
    return (
      <div className="space-y-2">
        {["Live auction", "Fixed price", "Seller"].map((item, index) => (
          <div key={item} className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2 text-[11px]">
            <span>{item}</span>
            <span style={{ color: accent }}>{index === 0 ? "02:14" : "Open"}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <div className="h-16 rounded-2xl bg-white/10" />
      <div className="h-2 w-full rounded-full bg-white/25" />
      <div className="h-2 w-4/5 rounded-full bg-white/15" />
      <div className="h-2 w-2/3 rounded-full bg-white/15" />
    </div>
  );
}

function Bubble({ align, text, accent }: { align: "start" | "end"; text: string; accent?: string }) {
  return (
    <p
      className={cn("max-w-[90%] rounded-2xl px-3 py-2 text-[10px] leading-snug", align === "end" ? "ms-auto text-black" : "bg-white/10")}
      style={align === "end" ? { background: accent ?? "#fff" } : undefined}
    >
      {text}
    </p>
  );
}
