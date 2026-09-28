import { ProjectDetail } from "@/components/projects/project-detail";
import { getProject, getProjects, getUi } from "@/lib/data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return getProjects().map((project) => ({ id: project.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = getProject(id);
  const ui = getUi();
  if (!project) return {};
  return {
    title: project.name,
    description: project.tagline,
    alternates: { canonical: `/projects/${project.id}/` },
    openGraph: {
      title: `${project.name} · ${ui.seo.siteName}`,
      description: project.description,
      url: `/projects/${project.id}/`,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
