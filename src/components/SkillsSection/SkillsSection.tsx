import { SectionHeading } from "@/components/SectionHeading/SectionHeading";
import { TagList } from "@/components/Tag/Tag";
import { skills } from "@/data/skills";
import styles from "./SkillsSection.module.scss";

export function SkillsSection({ id, title }: { id: string; title: string }) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <SectionHeading id={`${id}-title`}>{title}</SectionHeading>
      <dl className={styles.list}>
        {skills.map((group) => (
          <div key={group.category} className={styles.row}>
            <dt className={styles.category}>{group.category}</dt>
            <dd className={styles.items}>
              <TagList items={group.items} />
              {group.note ? <p className={styles.note}>{group.note}</p> : null}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
