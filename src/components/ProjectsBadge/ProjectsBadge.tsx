import { Icon } from "@/components/Icon/Icon";
import { uiCopy } from "@/data/site";
import styles from "./ProjectsBadge.module.scss";

const CIRCLE = "M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0";

export function ProjectsBadge() {
  return (
    <a className={styles.badge} href="#projects" aria-label={uiCopy.heroProjects}>
      <svg className={styles.ring} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
        <defs>
          <path id="projects-badge-circle" d={CIRCLE} />
        </defs>
        <text className={styles.ringText}>
          <textPath href="#projects-badge-circle" textLength="288" lengthAdjust="spacing">
            {uiCopy.projectsBadge.repeat(2)}
          </textPath>
        </text>
      </svg>
      <Icon name="arrow" className={styles.arrow} />
    </a>
  );
}
