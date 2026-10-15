import { PillButton } from "@/components/PillButton/PillButton";
import { ProjectsBadge } from "@/components/ProjectsBadge/ProjectsBadge";
import { Section } from "@/components/Section/Section";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { profile } from "@/data/profile";
import { sectionHeadings, uiCopy } from "@/data/site";
import styles from "./Hero.module.scss";

export function Hero({ id }: { id: string }) {
  const headingId = `${id}-title`;

  return (
    <Section labelledBy={headingId}>
      <SectionHeader headingId={headingId} icon="intro" heading={sectionHeadings.intro} level={1} />
      <p className={styles.lead}>{profile.intro}</p>
      <div className={styles.actions}>
        <PillButton href="#projects">{uiCopy.heroProjects}</PillButton>
        <PillButton href={`mailto:${profile.email}`} variant="secondary">
          {uiCopy.heroContact}
        </PillButton>
        <span className={styles.badgeSlot}>
          <ProjectsBadge />
        </span>
      </div>
    </Section>
  );
}
