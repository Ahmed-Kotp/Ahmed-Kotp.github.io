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
  const { dict, locale } = useLocale();
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
    if (String(data.get("_honey") ?? "").trim()) return;
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const company = String(data.get("company") ?? "");
    const project = String(data.get("project") ?? "");
    const message = String(data.get("message") ?? "");
    setStatus("sending");
    try {
      const response = endpoint
        ? await fetch(endpoint, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: (() => {
              const body = new FormData();
              body.set("name", name);
              body.set("email", email);
              body.set("company", company);
              body.set("project", project);
              body.set("message", message);
              body.set("subject", `Project request: ${project} — ${name}`);
              if (accessKey) body.set("access_key", accessKey);
              return body;
            })(),
          })
        : await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(profile.email)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
              name,
              email,
              company,
              project,
              message,
              _subject: `Project request: ${project} — ${name}`,
              _replyto: email,
              _template: "table",
              _captcha: "false",
            }),
          });
      const payload = (await response.json().catch(() => null)) as { success?: string | boolean; message?: string } | null;
      const accepted = response.ok && payload?.success !== false && payload?.success !== "false";
      if (!accepted) {
        const needsActivation = !endpoint && (payload?.message ?? "").toLowerCase().includes("activation");
        if (needsActivation) {
          const subject = encodeURIComponent(`Project request: ${project} — ${name}`);
          const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nCompany: ${company}\nProject: ${project}\n\n${message}`);
          window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
          setStatus("sent");
          setNote(dict.buttons.mailOpened);
          return;
        }
        throw new Error("Request failed");
      }
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
            <a className={buttonVariants({ variant: "gradient", size: "sm" })} href={profile.cvPath} download>
              {dict.buttons.downloadCv}
            </a>
            <button type="button" onClick={copyEmail} className={buttonVariants({ variant: "ghost", size: "sm" })}>
              {copied ? dict.buttons.copied : dict.buttons.copyEmail}
            </button>
          </div>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">{dict.profile.relocation}</p>
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
        <form key={locale} onSubmit={onSubmit} className="glass grid gap-4 rounded-3xl p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm">
              {dict.buttons.name}
              <input required name="name" className="h-12 rounded-2xl border border-border bg-transparent px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400" autoComplete="name" />
            </label>
            <label className="grid gap-2 text-sm">
              {dict.buttons.email}
              <input required type="email" name="email" className="h-12 rounded-2xl border border-border bg-transparent px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400" autoComplete="email" />
            </label>
          </div>
          <label className="grid gap-2 text-sm">
            {dict.buttons.company}
            <input name="company" className="h-12 rounded-2xl border border-border bg-transparent px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400" autoComplete="organization" />
          </label>
          <label className="grid gap-2 text-sm">
            {dict.buttons.projectType}
            <select name="project" required defaultValue={dict.buttons.optionProduct} className="h-12 rounded-2xl border border-border bg-transparent px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400">
              <option value={dict.buttons.optionProduct}>{dict.buttons.optionProduct}</option>
              <option value={dict.buttons.optionMobile}>{dict.buttons.optionMobile}</option>
              <option value={dict.buttons.optionFullStack}>{dict.buttons.optionFullStack}</option>
              <option value={dict.buttons.optionAi}>{dict.buttons.optionAi}</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            {dict.buttons.message}
            <textarea required name="message" rows={5} className="rounded-2xl border border-border bg-transparent px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400" />
          </label>
          <label className="absolute -left-[9999px]" aria-hidden="true">
            Website
            <input name="_honey" tabIndex={-1} autoComplete="off" />
          </label>
          <button className={buttonVariants({ variant: "gradient" })} type="submit" disabled={status === "sending"}>
            {status === "sending" ? dict.buttons.sending : dict.buttons.send}
          </button>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {note || dict.buttons.formNote}
          </p>
          {status === "error" ? (
            <a className="text-sm underline-offset-4 hover:underline" href={`mailto:${profile.email}?subject=${encodeURIComponent("Mobile app project request")}`}>
              {profile.email}
            </a>
          ) : null}
        </form>
      </Reveal>
    </section>
  );
}

function SocialGlyph({ id }: { id: string }) {
  if (id === "github") return <GithubIcon className="size-5" />;
  if (id === "linkedin") return <LinkedinIcon className="size-5" />;
  return <Mail className="size-5" aria-hidden="true" />;
}
