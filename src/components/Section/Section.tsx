import type { ReactNode } from "react";
import styles from "./Section.module.scss";

type SectionProps = { id?: string; labelledBy?: string; className?: string; children: ReactNode };

export function Section({ id, labelledBy, className, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={[styles.section, className].filter(Boolean).join(" ")}>
      {children}
    </section>
  );
}
