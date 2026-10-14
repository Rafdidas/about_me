import { Band } from "@/components/Band/Band";
import { PillButton } from "@/components/PillButton/PillButton";
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
    <Band tone="canvas" labelledBy="project-title" spacious>
      <div className={styles.content}>
        <TextLink href="/#projects">{uiCopy.backToProjects}</TextLink>
        <p className={styles.label}>{project.label}</p>
        <h1 id="project-title" className={styles.title}>
          {project.title}
        </h1>
        <p className={styles.meta}>
          {formatPeriod(project.period)}
          {project.role ? ` · ${project.role}` : null}
        </p>
        <TagList items={project.stack} className={styles.tags} />
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
    </Band>
  );
}
