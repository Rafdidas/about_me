import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell/PageShell";
import { ProjectBody } from "@/components/ProjectBody/ProjectBody";
import { ProjectGallery } from "@/components/ProjectGallery/ProjectGallery";
import { ProjectHeader } from "@/components/ProjectHeader/ProjectHeader";
import { ProjectPager } from "@/components/ProjectPager/ProjectPager";
import { TextLink } from "@/components/TextLink/TextLink";
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
  return { title: project.title, description: project.summary };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const { prev, next } = getAdjacentProjects(slug);

  return (
    <PageShell
      navItems={getProjectToc(project)}
      navLabel={uiCopy.tocLabel}
      sidebarExtra={<TextLink href="/#projects">{uiCopy.backToProjects}</TextLink>}
    >
      <ProjectHeader project={project} />
      <ProjectGallery images={project.images} />
      <ProjectBody project={project} />
      <ProjectPager prev={prev} next={next} />
    </PageShell>
  );
}
