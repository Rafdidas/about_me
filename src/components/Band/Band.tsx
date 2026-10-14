import type { ReactNode } from "react";
import styles from "./Band.module.scss";

export type BandTone = "canvas" | "white" | "ink";

type BandProps = {
  tone: BandTone;
  id?: string;
  labelledBy?: string;
  spacious?: boolean;
  className?: string;
  children: ReactNode;
};

export function Band({ tone, id, labelledBy, spacious = false, className, children }: BandProps) {
  const classes = [styles.band, spacious ? styles.spacious : null, className].filter(Boolean).join(" ");

  return (
    <section id={id} data-tone={tone} aria-labelledby={labelledBy} className={classes}>
      <div className={styles.inner}>{children}</div>
    </section>
  );
}
