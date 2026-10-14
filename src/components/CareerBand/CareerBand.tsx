import { Band } from "@/components/Band/Band";
import { SectionTitle } from "@/components/SectionTitle/SectionTitle";
import { Tile } from "@/components/Tile/Tile";
import { career } from "@/data/career";
import { formatPeriod } from "@/lib/format";
import styles from "./CareerBand.module.scss";

export function CareerBand({ id, title }: { id: string; title: string }) {
  return (
    <Band tone="ink" id={id} labelledBy={`${id}-title`}>
      <SectionTitle id={`${id}-title`}>{title}</SectionTitle>
      <ul className={styles.grid}>
        {career.map((entry) => (
          <li key={entry.company}>
            <Tile as="article">
              <h3 className={styles.company}>{entry.company}</h3>
              <p className={styles.meta}>
                {entry.position} · {formatPeriod(entry.period)}
              </p>
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
      </ul>
    </Band>
  );
}
