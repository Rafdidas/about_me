import { SectionHeading } from "@/components/SectionHeading/SectionHeading";
import { career } from "@/data/career";
import { CareerItem } from "./CareerItem";
import styles from "./CareerSection.module.scss";

export function CareerSection({ id, title }: { id: string; title: string }) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <SectionHeading id={`${id}-title`}>{title}</SectionHeading>
      <div className={styles.list}>
        {career.map((entry) => (
          <CareerItem key={entry.company} entry={entry} />
        ))}
      </div>
    </section>
  );
}
