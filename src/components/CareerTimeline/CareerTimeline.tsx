import { Section } from "@/components/Section/Section";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { Tile } from "@/components/Tile/Tile";
import { career } from "@/data/career";
import { sectionHeadings } from "@/data/site";
import { formatPeriod } from "@/lib/format";
import styles from "./CareerTimeline.module.scss";

export function CareerTimeline({ id }: { id: string }) {
  const headingId = `${id}-title`;

  return (
    <Section id={id} labelledBy={headingId}>
      <SectionHeader headingId={headingId} icon="career" heading={sectionHeadings.career} />
      <div className={styles.timeline}>
        <span className={styles.track} aria-hidden="true">
          <span className={styles.fill} />
        </span>
        <ol className={styles.list}>
          {career.map((entry) => (
            <li key={entry.company} className={styles.item}>
              <span className={styles.dot} aria-hidden="true" />
              <Tile as="article">
                <p className={styles.period}>{formatPeriod(entry.period)}</p>
                <h3 className={styles.company}>{entry.company}</h3>
                <p className={styles.position}>{entry.position}</p>
                <p className={styles.summary}>{entry.summary}</p>
                <ul className={styles.highlights}>
                  {entry.highlights.map((highlight) => (
                    <li key={highlight.text} className={styles.highlight}>
                      {highlight.label ? <strong>{highlight.label}: </strong> : null}
                      {highlight.text}
                    </li>
                  ))}
                </ul>
              </Tile>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
