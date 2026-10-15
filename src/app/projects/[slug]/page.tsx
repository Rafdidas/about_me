import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalNav } from "@/components/LocalNav/LocalNav";
import { ProjectBody } from "@/components/ProjectBody/ProjectBody";
import { ProjectGallery } from "@/components/ProjectGallery/ProjectGallery";
import { ProjectHeader } from "@/components/ProjectHeader/ProjectHeader";
import { ProjectPager } from "@/components/ProjectPager/ProjectPager";
import { SiteShell } from "@/components/SiteShell/SiteShell";
import { projects } from "@/data/projects";
import { uiCopy } from "@/data/site";
import { getAdjacentProjects, getProjectBySlug, getProjectToc } from "@/lib/projects";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  const url = `/projects/${slug}`;
  return {
    title: project.title,
    description: project.summary,
    openGraph: { title: project.title, description: project.summary, url, type: "article" },
    alternates: { canonical: url }
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const { prev, next } = getAdjacentProjects(slug);

  return (
    <SiteShell spy={false} profile="after">
      <ProjectHeader project={project} />
      <LocalNav items={getProjectToc(project)} label={uiCopy.tocLabel} />
      <ProjectGallery images={project.images} />
      <ProjectBody project={project} />
      <ProjectPager prev={prev} next={next} />
    </SiteShell>
  );
}
