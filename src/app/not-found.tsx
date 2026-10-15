import type { Metadata } from "next";
import { PillButton } from "@/components/PillButton/PillButton";
import { Section } from "@/components/Section/Section";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { SiteShell } from "@/components/SiteShell/SiteShell";
import { uiCopy } from "@/data/site";
import styles from "./not-found.module.scss";

export const metadata: Metadata = { title: uiCopy.notFoundTitle };

export default function NotFound() {
  return (
    <SiteShell spy={false} contact={false}>
      <Section labelledBy="not-found-title">
        <SectionHeader
          headingId="not-found-title"
          icon="intro"
          heading={{ label: "404", title: uiCopy.notFoundTitle }}
          level={1}
        />
        <p className={styles.body}>{uiCopy.notFoundBody}</p>
        <div className={styles.action}>
          <PillButton href="/">{uiCopy.notFoundLink}</PillButton>
        </div>
      </Section>
    </SiteShell>
  );
}
