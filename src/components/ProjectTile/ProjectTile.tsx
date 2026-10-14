import Image from "next/image";
import Link from "next/link";
import { TagList } from "@/components/Tag/Tag";
import { Tile } from "@/components/Tile/Tile";
import type { Project } from "@/data/types";
import { formatPeriod } from "@/lib/format";
import styles from "./ProjectTile.module.scss";

type ProjectTileProps = { project: Project; withImage?: boolean };

export function ProjectTile({ project, withImage = false }: ProjectTileProps) {
  const image = withImage ? project.images?.[0] : undefined;

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
            sizes="(min-width: 768px) 480px, 100vw"
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
      <p className={styles.summary}>{project.summary}</p>
      <p className={styles.period}>{formatPeriod(project.period)}</p>
      <TagList items={project.stack} />
    </Tile>
  );
}
