import { Section } from "@/components/Section/Section";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { Tile } from "@/components/Tile/Tile";
import { profile } from "@/data/profile";
import { sectionHeadings } from "@/data/site";
import styles from "./AboutCards.module.scss";

const HEADING_ID = "about-cards-title";

export function AboutCards() {
  return (
    <Section labelledBy={HEADING_ID}>
      <SectionHeader headingId={HEADING_ID} icon="about" heading={sectionHeadings.about} />
      <ol className={styles.grid}>
        {profile.competencies.map((item, index) => (
          <li key={item.text}>
            <Tile className={styles.card}>
              <span className={styles.number} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              {item.label ? <h3 className={styles.label}>{item.label}</h3> : null}
              <p className={styles.text}>{item.text}</p>
            </Tile>
          </li>
        ))}
      </ol>
    </Section>
  );
}
