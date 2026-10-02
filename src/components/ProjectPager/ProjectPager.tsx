import Link from "next/link";
import { uiCopy } from "@/data/site";
import type { Project } from "@/data/types";
import styles from "./ProjectPager.module.scss";

type ProjectPagerProps = { prev?: Project; next?: Project };

export function ProjectPager({ prev, next }: ProjectPagerProps) {
  if (!prev && !next) return null;

  return (
    <nav className={styles.pager} aria-label={uiCopy.pagerLabel}>
      {prev ? (
        <Link className={styles.link} href={`/projects/${prev.slug}`}>
          <span className={styles.direction}>{uiCopy.prevProject}</span>
          <span className={styles.title}>{prev.title}</span>
        </Link>
      ) : null}
      {next ? (
        <Link className={`${styles.link} ${styles.next}`} href={`/projects/${next.slug}`}>
          <span className={styles.direction}>{uiCopy.nextProject}</span>
          <span className={styles.title}>{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
