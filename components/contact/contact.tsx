"use client";

import { GithubIcon, LinkedinIcon } from "@/components/icons/brand";
import { Reveal, SectionHeading } from "@/components/motion/reveal";
import { useLocale } from "@/components/providers/locale-provider";
import { buttonVariants } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { getProfile } from "@/lib/data";
import { Mail } from "lucide-react";
import { useState } from "react";

const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";
const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "";

export function Contact() {
  const { dict } = useLocale();
  const profile = getProfile();
  const section = dict.sections.contact;
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [note, setNote] = useState("");

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (String(data.get("company") ?? "").trim()) return;
    setStatus("sending");
    if (accessKey) data.set("access_key", accessKey);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("sent");
      setNote(dict.buttons.sent);
      form.reset();
    } catch {
      setStatus("error");
      setNote(dict.buttons.sendError);
    }
  }

  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="mx-auto max-w-[1400px] px-5 py-28 sm:px-8">
      <SectionHeading id={`${section.id}-title`} eyebrow={section.eyebrow} title={section.title} lede={section.lede} />
      <Reveal className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <a href={`mailto:${profile.email}`} className="font-display text-3xl tracking-tight underline-offset-4 hover:underline sm:text-5xl">
            {profile.email}
          </a>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="button" onClick={copyEmail} className={buttonVariants({ variant: "ghost", size: "sm" })}>
              {copied ? dict.buttons.copied : dict.buttons.copyEmail}
            </button>
            <a className={buttonVariants({ variant: "gradient", size: "sm" })} href={`mailto:${profile.email}`}>
              {dict.buttons.email}
            </a>
          </div>
          <p className="sr-only" aria-live="polite">
            {copied ? dict.buttons.copied : ""}
          </p>
          <ul className="mt-8 flex gap-3">
            {profile.socials.map((social) => (
              <li key={social.id}>
                <Tooltip label={social.label}>
                  <a
                    href={social.url}
                    data-cursor="magnetic"
                    aria-label={social.label}
                    className="inline-flex size-12 items-center justify-center rounded-full border border-border transition-transform hover:-translate-y-0.5"
                    target={social.url.startsWith("http") ? "_blank" : undefined}
                    rel={social.url.startsWith("http") ? "noreferrer" : undefined}
                  >
                    <SocialGlyph id={social.id} />
                  </a>
                </Tooltip>
              </li>
            ))}
          </ul>
        </div>
        {endpoint ? (
          <form onSubmit={onSubmit} className="glass grid gap-4 rounded-3xl p-6">
            <label className="grid gap-2 text-sm">
              {dict.buttons.name}
              <input required name="name" className="h-12 rounded-2xl border border-border bg-transparent px-4" autoComplete="name" />
            </label>
            <label className="grid gap-2 text-sm">
              {dict.buttons.email}
              <input required type="email" name="email" className="h-12 rounded-2xl border border-border bg-transparent px-4" autoComplete="email" />
            </label>
            <label className="grid gap-2 text-sm">
              {dict.buttons.message}
              <textarea required name="message" rows={5} className="rounded-2xl border border-border bg-transparent px-4 py-3" />
            </label>
            <label className="absolute -left-[9999px]" aria-hidden="true">
              Company
              <input name="company" tabIndex={-1} autoComplete="off" />
            </label>
            <button className={buttonVariants({ variant: "primary" })} type="submit" disabled={status === "sending"}>
              {status === "sending" ? dict.buttons.sending : dict.buttons.send}
            </button>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {note || dict.buttons.formNote}
            </p>
          </form>
        ) : null}
      </Reveal>
    </section>
  );
}

function SocialGlyph({ id }: { id: string }) {
  if (id === "github") return <GithubIcon className="size-5" />;
  if (id === "linkedin") return <LinkedinIcon className="size-5" />;
  return <Mail className="size-5" aria-hidden="true" />;
}
