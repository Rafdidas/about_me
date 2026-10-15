import { Section } from "@/components/Section/Section";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { TagList } from "@/components/Tag/Tag";
import { Tile } from "@/components/Tile/Tile";
import { sectionHeadings } from "@/data/site";
import { skills } from "@/data/skills";
import styles from "./SkillsSection.module.scss";

export function SkillsSection({ id }: { id: string }) {
  const headingId = `${id}-title`;

  return (
    <Section id={id} labelledBy={headingId}>
      <SectionHeader headingId={headingId} icon="skills" heading={sectionHeadings.skills} />
      <ul className={styles.grid}>
        {skills.map((group) => (
          <li key={group.category}>
            <Tile>
              <dl className={styles.group}>
                <dt className={styles.category}>{group.category}</dt>
                <dd className={styles.items}>
                  <TagList items={group.items} />
                  {group.note ? <p className={styles.note}>{group.note}</p> : null}
                </dd>
              </dl>
            </Tile>
          </li>
        ))}
      </ul>
    </Section>
  );
}
