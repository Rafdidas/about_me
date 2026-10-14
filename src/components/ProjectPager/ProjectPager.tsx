import Link from "next/link";
import { Band } from "@/components/Band/Band";
import { Tile } from "@/components/Tile/Tile";
import { uiCopy } from "@/data/site";
import type { Project } from "@/data/types";
import styles from "./ProjectPager.module.scss";

type ProjectPagerProps = { prev?: Project; next?: Project };

export function ProjectPager({ prev, next }: ProjectPagerProps) {
  if (!prev && !next) return null;

  return (
    <Band tone="white">
      <nav aria-label={uiCopy.pagerLabel}>
        <ul className={styles.list}>
          {prev ? (
            <li>
              <Tile interactive>
                <span className={styles.direction}>{uiCopy.prevProject}</span>
                <Link className={styles.link} href={`/projects/${prev.slug}`}>
                  {prev.title}
                </Link>
              </Tile>
            </li>
          ) : null}
          {next ? (
            <li className={styles.next}>
              <Tile interactive>
                <span className={styles.direction}>{uiCopy.nextProject}</span>
                <Link className={styles.link} href={`/projects/${next.slug}`}>
                  {next.title}
                </Link>
              </Tile>
            </li>
          ) : null}
        </ul>
      </nav>
    </Band>
  );
}
