import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink/ButtonLink";
import { PageShell } from "@/components/PageShell/PageShell";
import { uiCopy } from "@/data/site";
import styles from "./not-found.module.scss";

export const metadata: Metadata = { title: uiCopy.notFoundTitle };

export default function NotFound() {
  return (
    <PageShell navItems={[]} navLabel={uiCopy.sectionNavLabel}>
      <section className={styles.section}>
        <h1 className={styles.title}>{uiCopy.notFoundTitle}</h1>
        <p className={styles.body}>{uiCopy.notFoundBody}</p>
        <div>
          <ButtonLink href="/">{uiCopy.notFoundLink}</ButtonLink>
        </div>
      </section>
    </PageShell>
  );
}
