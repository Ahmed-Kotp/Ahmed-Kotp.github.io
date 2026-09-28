import { getProjects, getUi } from "@/lib/data";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const ui = getUi();
  const base = ui.siteUrl.replace(/\/$/, "");
  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/cv/`, changeFrequency: "yearly", priority: 0.4 },
    ...getProjects().map((project) => ({
      url: `${base}/projects/${project.id}/`,
      changeFrequency: "monthly" as const,
      priority: project.featured ? 0.8 : 0.6,
    })),
  ];
}
