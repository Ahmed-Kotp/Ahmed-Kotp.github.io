import enJson from "@/data/i18n/en.json";
import certificatesJson from "@/data/certificates.json";
import educationJson from "@/data/education.json";
import experienceJson from "@/data/experience.json";
import profileJson from "@/data/profile.json";
import projectsJson from "@/data/projects.json";
import skillsJson from "@/data/skills.json";
import uiJson from "@/data/ui.json";
import {
  certificateSchema,
  dictionarySchema,
  educationSchema,
  experienceSchema,
  profileSchema,
  projectSchema,
  skillsSchema,
  uiSchema,
  type Certificate,
  type Dictionary,
  type Education,
  type Experience,
  type Locale,
  type Profile,
  type Project,
  type SkillsFile,
  type Ui,
} from "@/lib/schemas";
import { stableStringify } from "@/lib/utils";
import { z } from "zod";

const profile = profileSchema.parse(profileJson);
const skills = skillsSchema.parse(skillsJson);
const experience = z.array(experienceSchema).parse(experienceJson);
const projects = z.array(projectSchema).parse(projectsJson);
const education = z.array(educationSchema).parse(educationJson);
const certificates = z.array(certificateSchema).parse(certificatesJson);
const ui = uiSchema.parse(uiJson);
const en = dictionarySchema.parse(enJson);

const uiCopy = dictionarySchema.parse(ui);

if (stableStringify(uiCopy) !== stableStringify(en)) {
  throw new Error("data/ui.json copy and data/i18n/en.json are out of sync.");
}

if (en.profile.summary !== profile.summary || en.profile.title !== profile.title) {
  throw new Error("English profile copy drifted from data/profile.json.");
}

const projectIds = new Set(projects.map((project) => project.id));
for (const job of experience) {
  for (const projectId of job.projectIds) {
    if (!projectIds.has(projectId)) {
      throw new Error(`Experience "${job.id}" references unknown project "${projectId}".`);
    }
  }
}

const dictionaries: Record<Locale, Dictionary> = { en };

export function getProfile(): Profile {
  return profile;
}

export function getSkills(): SkillsFile {
  return skills;
}

export function getExperience(): Experience[] {
  return experience;
}

export function getProjects(): Project[] {
  return projects;
}

export function getProject(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}

export function getPublicProjects(): Project[] {
  return projects.filter((project) => project.status === "live" || project.status === "inLab");
}

export function getFeaturedProjects(): Project[] {
  return getPublicProjects().filter((project) => project.featured);
}

export function getEducation(): Education[] {
  return education;
}

export function getCertificates(): Certificate[] {
  return certificates;
}

export function getUi(): Ui {
  return ui;
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function getRelatedProjects(project: Project, limit = 3): Project[] {
  const scored = getPublicProjects()
    .filter((item) => item.id !== project.id)
    .map((item) => ({
      item,
      score: item.tech.filter((tech) => project.tech.includes(tech)).length + (item.company === project.company ? 2 : 0),
    }))
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name));
  return scored.slice(0, limit).map((entry) => entry.item);
}
