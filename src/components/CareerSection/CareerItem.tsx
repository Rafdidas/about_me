import type { CareerEntry } from "@/data/types";
import { formatPeriod } from "@/lib/format";
import styles from "./CareerSection.module.scss";

export function CareerItem({ entry }: { entry: CareerEntry }) {
  return (
    <article className={styles.item}>
      <header className={styles.header}>
        <h3 className={styles.company}>{entry.company}</h3>
        <p className={styles.meta}>
          {entry.position} · {formatPeriod(entry.period)}
        </p>
      </header>
      <p className={styles.summary}>{entry.summary}</p>
      <ul className={styles.highlights}>
        {entry.highlights.map((highlight) => (
          <li key={highlight.text} className={styles.highlight}>
            {highlight.label ? <strong>{highlight.label}: </strong> : null}
            {highlight.text}
          </li>
        ))}
      </ul>
    </article>
  );
}
