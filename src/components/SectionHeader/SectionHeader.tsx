import { Icon, type IconName } from "@/components/Icon/Icon";
import type { SectionHeading } from "@/data/types";
import { splitAccent } from "@/lib/accent";
import styles from "./SectionHeader.module.scss";

type SectionHeaderProps = {
  headingId: string;
  icon: IconName;
  heading: SectionHeading;
  level?: 1 | 2;
};

export function SectionHeader({ headingId, icon, heading, level = 2 }: SectionHeaderProps) {
  const Heading = level === 1 ? "h1" : "h2";
  const parts = splitAccent(heading.title, heading.accent);

  return (
    <div className={styles.header}>
      <p className={styles.label}>
        <Icon name={icon} className={styles.labelIcon} />
        {heading.label}
      </p>
      <Heading id={headingId} className={level === 1 ? styles.titleHero : styles.title}>
        {parts ? (
          <>
            {parts.before}
            <em className={styles.accent}>{parts.accent}</em>
            {parts.after}
          </>
        ) : (
          heading.title
        )}
      </Heading>
    </div>
  );
}
