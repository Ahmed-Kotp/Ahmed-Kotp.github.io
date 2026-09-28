import { PrintButton } from "@/components/cv/print-button";
import { getCertificates, getDictionary, getEducation, getExperience, getProfile, getProjects, getSkills } from "@/lib/data";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CV",
  robots: { index: true, follow: true },
};

export default function CvPage() {
  const dict = getDictionary("en");
  const profile = getProfile();
  const skills = getSkills();
  const experience = getExperience().filter((job) => job.type !== "prior");
  const prior = getExperience().filter((job) => job.type === "prior");
  const projects = getProjects().filter((project) => project.featured);
  const education = getEducation();
  const certificates = getCertificates();

  return (
    <main className="cv-sheet mx-auto max-w-3xl px-6 py-10">
      <div className="no-print mb-8 flex items-center justify-between gap-4">
        <Link href="/" className="text-sm underline">
          {dict.buttons.backHome}
        </Link>
        <PrintButton label={dict.cv.print} />
      </div>
      <header>
        <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">{dict.cv.kicker}</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">{profile.name}</h1>
        <p className="mt-2 text-lg">{profile.title}</p>
        <p className="mt-1 text-sm text-neutral-600">{profile.subtitle}</p>
        <p className="mt-3 text-sm">
          {profile.location}
          {" · "}
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          {profile.showPhone ? ` · ${profile.phone}` : null}
        </p>
      </header>
      <section className="mt-8">
        <h2 className="border-b border-neutral-300 pb-1 text-sm uppercase tracking-[0.16em]">Profile</h2>
        <p className="mt-3 text-sm leading-relaxed">{profile.summary}</p>
      </section>
      <section className="mt-8">
        <h2 className="border-b border-neutral-300 pb-1 text-sm uppercase tracking-[0.16em]">{dict.cv.experience}</h2>
        <div className="mt-4 space-y-5">
          {experience.map((job) => (
            <article key={job.id}>
              <h3 className="text-base font-semibold">
                {job.role}, {job.company}
              </h3>
              <p className="text-sm text-neutral-600">
                {job.period} · {job.location} · {job.engagement}
              </p>
              <p className="mt-1 text-sm">{job.focus}</p>
              <ul className="mt-2 list-disc ps-5 text-sm leading-relaxed">
                {job.description.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
          {prior.map((job) => (
            <article key={job.id}>
              <h3 className="text-base font-semibold">
                {job.role}, {job.company}
              </h3>
              <p className="text-sm text-neutral-600">
                {job.period} · {job.location}
              </p>
              <p className="mt-1 text-sm">{job.focus}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="mt-8">
        <h2 className="border-b border-neutral-300 pb-1 text-sm uppercase tracking-[0.16em]">{dict.cv.projects}</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {projects.map((project) => (
            <li key={project.id}>
              <strong>{project.name}</strong> — {project.tagline}
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-8">
        <h2 className="border-b border-neutral-300 pb-1 text-sm uppercase tracking-[0.16em]">{dict.cv.skills}</h2>
        {skills.categories.map((category) => (
          <p key={category.id} className="mt-2 text-sm">
            <strong>{category.label}: </strong>
            {category.skills.map((skill) => skill.name).join(", ")}
          </p>
        ))}
      </section>
      <section className="mt-8">
        <h2 className="border-b border-neutral-300 pb-1 text-sm uppercase tracking-[0.16em]">{dict.cv.education}</h2>
        {education.map((item) => (
          <p key={item.id} className="mt-2 text-sm">
            <strong>{item.degree}</strong>, {item.school}. {item.detail} {item.year}.
          </p>
        ))}
      </section>
      <section className="mt-8">
        <h2 className="border-b border-neutral-300 pb-1 text-sm uppercase tracking-[0.16em]">{dict.cv.certificates}</h2>
        <ul className="mt-2 list-disc ps-5 text-sm">
          {certificates.map((item) => (
            <li key={item.id}>
              {item.name} — {item.issuer}, {item.year}
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-8">
        <h2 className="border-b border-neutral-300 pb-1 text-sm uppercase tracking-[0.16em]">{dict.cv.languages}</h2>
        <p className="mt-2 text-sm">{profile.languages.map((language) => `${language.name} (${language.level})`).join(" · ")}</p>
      </section>
    </main>
  );
}
