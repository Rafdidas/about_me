import Image from "next/image";
import Link from "next/link";
import { TagList } from "@/components/Tag/Tag";
import { Tile } from "@/components/Tile/Tile";
import type { Project } from "@/data/types";
import { formatPeriod } from "@/lib/format";
import styles from "./ProjectCard.module.scss";

export function ProjectCard({ project }: { project: Project }) {
  const image = project.images?.[0];

  return (
    <Tile
      as="article"
      interactive
      media={
        image ? (
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(min-width: 1024px) 760px, 100vw"
          />
        ) : undefined
      }
    >
      <p className={styles.label}>{project.label}</p>
      <h4 className={styles.title}>
        <Link className={styles.link} href={`/projects/${project.slug}`}>
          {project.title}
        </Link>
      </h4>
      <p className={styles.meta}>
        {formatPeriod(project.period)}
        {project.role ? ` · ${project.role}` : null}
      </p>
      <p className={styles.summary}>{project.summary}</p>
      {project.highlights && project.highlights.length > 0 ? (
        <div className={styles.highlightsBox}>
          <ul className={styles.highlights}>
            {project.highlights.map((highlight) => (
              <li key={highlight} className={styles.highlight}>
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <TagList items={project.stack} />
    </Tile>
  );
}
