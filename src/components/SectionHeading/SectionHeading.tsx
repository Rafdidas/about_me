import type { ReactNode } from "react";
import styles from "./SectionHeading.module.scss";

export function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className={styles.heading}>
      {children}
    </h2>
  );
}
