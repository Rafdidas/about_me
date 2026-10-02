import Link from "next/link";
import { TagList } from "@/components/Tag/Tag";
import type { Project } from "@/data/types";
import { formatPeriod } from "@/lib/format";
import styles from "./ProjectsSection.module.scss";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={styles.card}>
      <p className={styles.label}>{project.label}</p>
      <h4 className={styles.title}>
        <Link className={styles.link} href={`/projects/${project.slug}`}>
          {project.title}
        </Link>
      </h4>
      <p className={styles.summary}>{project.summary}</p>
      <p className={styles.period}>{formatPeriod(project.period)}</p>
      <TagList items={project.stack} />
    </article>
  );
}
