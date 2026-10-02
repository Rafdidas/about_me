import { ButtonLink } from "@/components/ButtonLink/ButtonLink";
import { TagList } from "@/components/Tag/Tag";
import { uiCopy } from "@/data/site";
import type { Project } from "@/data/types";
import { formatPeriod } from "@/lib/format";
import { getPrimaryLinks } from "@/lib/projects";
import styles from "./ProjectHeader.module.scss";

export function ProjectHeader({ project }: { project: Project }) {
  const links = getPrimaryLinks(project);

  return (
    <header className={styles.header}>
      <p className={styles.label}>{project.label}</p>
      <h1 className={styles.title}>{project.title}</h1>
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
              <ButtonLink href={link.href} variant={index === 0 ? "primary" : "secondary"}>
                {link.label}
              </ButtonLink>
            </li>
          ))}
        </ul>
      ) : null}
    </header>
  );
}
