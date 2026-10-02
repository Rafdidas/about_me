import { projects } from "@/data/projects";
import { uiCopy } from "@/data/site";
import type { ExternalLink, NavItem, Project } from "@/data/types";

export const EVIDENCE_SECTION_ID = "evidence";

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getAdjacentProjects(slug: string): { prev?: Project; next?: Project } {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return {};
  return { prev: projects[index - 1], next: projects[index + 1] };
}

export function sectionId(index: number): string {
  return `section-${index + 1}`;
}

export function getEvidenceLinks(project: Project): ExternalLink[] {
  return project.links.filter((link) => link.kind === "evidence");
}

export function getPrimaryLinks(project: Project): ExternalLink[] {
  return project.links.filter((link) => link.kind !== "evidence");
}

export function getProjectToc(project: Project): NavItem[] {
  const items = project.sections.map((section, index) => ({ id: sectionId(index), label: section.title }));
  if (getEvidenceLinks(project).length > 0) {
    items.push({ id: EVIDENCE_SECTION_ID, label: uiCopy.evidenceTitle });
  }
  return items;
}
