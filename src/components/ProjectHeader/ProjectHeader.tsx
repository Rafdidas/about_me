import { PillButton } from "@/components/PillButton/PillButton";
import { Section } from "@/components/Section/Section";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { TagList } from "@/components/Tag/Tag";
import { TextLink } from "@/components/TextLink/TextLink";
import { uiCopy } from "@/data/site";
import type { Project } from "@/data/types";
import { formatPeriod } from "@/lib/format";
import { getPrimaryLinks } from "@/lib/projects";
import styles from "./ProjectHeader.module.scss";

export function ProjectHeader({ project }: { project: Project }) {
  const links = getPrimaryLinks(project);

  return (
    <Section labelledBy="project-title">
      <p className={styles.back}>
        <TextLink href="/#projects">{uiCopy.backToProjects}</TextLink>
      </p>
      <SectionHeader
        headingId="project-title"
        icon="projects"
        heading={{ label: project.label, title: project.title }}
        level={1}
      />
      <div className={styles.content}>
        <p className={styles.meta}>
          {formatPeriod(project.period)}
          {project.role ? ` · ${project.role}` : null}
        </p>
        <TagList items={project.stack} />
        {project.note ? <p className={styles.note}>{project.note}</p> : null}
        {links.length > 0 ? (
          <ul className={styles.links} aria-label={uiCopy.projectLinksLabel}>
            {links.map((link, index) => (
              <li key={link.href}>
                <PillButton href={link.href} variant={index === 0 ? "primary" : "secondary"}>
                  {link.label}
                </PillButton>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Section>
  );
}
