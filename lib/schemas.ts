import { z } from "zod";

export const socialSchema = z.object({
  id: z.string(),
  label: z.string(),
  url: z.string().url(),
});

export const statSchema = z.object({
  id: z.string(),
  value: z.number(),
  suffix: z.string(),
  label: z.string(),
});

export const languageSchema = z.object({
  name: z.string(),
  level: z.string(),
});

export const profileSchema = z.object({
  name: z.string(),
  title: z.string(),
  subtitle: z.string(),
  tagline: z.string(),
  summary: z.string(),
  location: z.string(),
  email: z.email(),
  phone: z.string(),
  showPhone: z.boolean(),
  availability: z.object({
    status: z.enum(["available", "limited", "unavailable"]),
    label: z.string(),
    relocation: z.string(),
  }),
  socials: z.array(socialSchema).min(1),
  stats: z.array(statSchema).min(1),
  languages: z.array(languageSchema).min(1),
  roles: z.array(z.string()).min(1),
  cvPath: z.string(),
  portrait: z.string(),
});

export const skillSchema = z.object({
  name: z.string(),
  level: z.number().min(0).max(5).optional(),
  icon: z.string().optional(),
});

export const skillCategorySchema = z.object({
  id: z.string(),
  label: z.string(),
  skills: z.array(skillSchema).min(1),
});

export const skillsSchema = z.object({
  categories: z.array(skillCategorySchema).min(1),
});

export const experienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  role: z.string(),
  period: z.string(),
  location: z.string(),
  type: z.enum(["full-time", "freelance", "contract", "part-time", "prior"]),
  engagement: z.string(),
  focus: z.string(),
  description: z.array(z.string()).min(1),
  tech: z.array(z.string()),
  projectIds: z.array(z.string()),
  accent: z.string(),
  muted: z.boolean().optional(),
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  role: z.string(),
  platform: z.array(z.enum(["iOS", "Android"])).min(1),
  appStoreUrl: z.string(),
  playStoreUrl: z.string(),
  tech: z.array(z.string()),
  highlights: z.array(z.string()),
  status: z.enum(["live", "inLab"]),
  featured: z.boolean(),
  accent: z.string(),
  image: z.string().optional(),
  visual: z.enum(["market", "story", "fitness", "chat", "gold", "broadcast", "generic"]),
  metric: z.string().optional(),
  company: z.string(),
});

export const educationSchema = z.object({
  id: z.string(),
  degree: z.string(),
  school: z.string(),
  detail: z.string(),
  year: z.string(),
});

export const certificateSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string(),
  year: z.string(),
});

export const navItemSchema = z.object({
  id: z.string(),
  label: z.string(),
});

export const sectionCopySchema = z.object({
  id: z.string(),
  eyebrow: z.string(),
  title: z.string(),
  lede: z.string(),
});

export const dictionarySchema = z.object({
  nav: z.array(navItemSchema).min(1),
  buttons: z.object({
    viewWork: z.string(),
    startProject: z.string(),
    downloadCv: z.string(),
    backToTop: z.string(),
    copyEmail: z.string(),
    copied: z.string(),
    send: z.string(),
    sending: z.string(),
    sent: z.string(),
    mailOpened: z.string(),
    sendError: z.string(),
    viewProject: z.string(),
    appStore: z.string(),
    playStore: z.string(),
    all: z.string(),
    fullTime: z.string(),
    freelance: z.string(),
    contract: z.string(),
    partTime: z.string(),
    skipIntro: z.string(),
    skipToContent: z.string(),
    openMenu: z.string(),
    closeMenu: z.string(),
    toggleTheme: z.string(),
    toggleLocale: z.string(),
    commandPalette: z.string(),
    showEarlier: z.string(),
    hideEarlier: z.string(),
    printCv: z.string(),
    backHome: z.string(),
    related: z.string(),
    highlights: z.string(),
    role: z.string(),
    status: z.string(),
    tech: z.string(),
    scroll: z.string(),
    noResults: z.string(),
    featured: z.string(),
    name: z.string(),
    email: z.string(),
    company: z.string(),
    projectType: z.string(),
    message: z.string(),
    optionMobile: z.string(),
    optionFullStack: z.string(),
    optionAi: z.string(),
    optionProduct: z.string(),
    formNote: z.string(),
    previous: z.string(),
    next: z.string(),
  }),
  sections: z.object({
    about: sectionCopySchema,
    skills: sectionCopySchema,
    experience: sectionCopySchema,
    projects: sectionCopySchema,
    education: sectionCopySchema,
    contact: sectionCopySchema,
  }),
  status: z.object({
    live: z.string(),
    inLab: z.string(),
  }),
  types: z.object({
    "full-time": z.string(),
    freelance: z.string(),
    contract: z.string(),
    "part-time": z.string(),
    prior: z.string(),
  }),
  footer: z.object({
    rights: z.string(),
    hint: z.string(),
  }),
  intro: z.object({
    line: z.string(),
  }),
  command: z.object({
    placeholder: z.string(),
    empty: z.string(),
    groupSections: z.string(),
    groupProjects: z.string(),
  }),
  profile: z.object({
    title: z.string(),
    subtitle: z.string(),
    tagline: z.string(),
    summary: z.string(),
    availability: z.string(),
    relocation: z.string(),
    languagesLabel: z.string(),
    locationLabel: z.string(),
  }),
  stats: z.array(z.object({ id: z.string(), label: z.string() })).min(1),
  roles: z.array(z.string()).min(1),
  cv: z.object({
    kicker: z.string(),
    print: z.string(),
    skills: z.string(),
    experience: z.string(),
    projects: z.string(),
    education: z.string(),
    certificates: z.string(),
    languages: z.string(),
  }),
  educationHeading: z.string(),
  certificatesHeading: z.string(),
  terminal: z.object({
    whoami: z.string(),
    role: z.string(),
    location: z.string(),
    shipped: z.string(),
  }),
});

export const uiSchema = dictionarySchema.extend({
  siteUrl: z.string().url(),
  seo: z.object({
    title: z.string(),
    siteName: z.string(),
    description: z.string(),
    keywords: z.array(z.string()).min(1),
  }),
});

export type Profile = z.infer<typeof profileSchema>;
export type SkillsFile = z.infer<typeof skillsSchema>;
export type SkillCategory = z.infer<typeof skillCategorySchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Certificate = z.infer<typeof certificateSchema>;
export type Dictionary = z.infer<typeof dictionarySchema>;
export type Ui = z.infer<typeof uiSchema>;
export type Locale = "en";
export type ProjectStatus = Project["status"];
export type ExperienceType = Experience["type"];
