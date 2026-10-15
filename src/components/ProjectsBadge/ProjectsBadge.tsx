import { Icon } from "@/components/Icon/Icon";
import { uiCopy } from "@/data/site";
import styles from "./ProjectsBadge.module.scss";

const CIRCLE = "M48 48m-37 0a37 37 0 1 1 74 0a37 37 0 1 1-74 0";

export function ProjectsBadge() {
  return (
    <a className={styles.badge} href="#projects" aria-label={uiCopy.projectsBadgeLabel}>
      <svg className={styles.ring} viewBox="0 0 96 96" aria-hidden="true" focusable="false">
        <defs>
          <path id="projects-badge-circle" d={CIRCLE} />
        </defs>
        <text className={styles.ringText}>
          <textPath href="#projects-badge-circle" textLength="232" lengthAdjust="spacing">
            {uiCopy.projectsBadge}
          </textPath>
        </text>
      </svg>
      <Icon name="arrow" className={styles.arrow} />
    </a>
  );
}
