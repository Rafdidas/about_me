import { Section } from "@/components/Section/Section";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { Tile } from "@/components/Tile/Tile";
import { education } from "@/data/education";
import { sectionHeadings } from "@/data/site";
import styles from "./EducationSection.module.scss";

export function EducationSection({ id }: { id: string }) {
  const headingId = `${id}-title`;

  return (
    <Section id={id} labelledBy={headingId}>
      <SectionHeader headingId={headingId} icon="education" heading={sectionHeadings.education} />
      <Tile>
        <ul className={styles.list}>
          {education.map((item) => (
            <li key={item.title} className={styles.item}>
              <span className={styles.name}>{item.title}</span>
              {item.detail ? <span className={styles.detail}>{item.detail}</span> : null}
            </li>
          ))}
        </ul>
      </Tile>
    </Section>
  );
}
