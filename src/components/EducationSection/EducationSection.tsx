import { SectionHeading } from "@/components/SectionHeading/SectionHeading";
import { education } from "@/data/education";
import styles from "./EducationSection.module.scss";

export function EducationSection({ id, title }: { id: string; title: string }) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <SectionHeading id={`${id}-title`}>{title}</SectionHeading>
      <ul className={styles.list}>
        {education.map((item) => (
          <li key={item.title} className={styles.item}>
            <span>{item.title}</span>
            {item.detail ? <span className={styles.detail}>{item.detail}</span> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
