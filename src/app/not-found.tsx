import type { Metadata } from "next";
import { Band } from "@/components/Band/Band";
import { PillButton } from "@/components/PillButton/PillButton";
import { SiteShell } from "@/components/SiteShell/SiteShell";
import { uiCopy } from "@/data/site";
import styles from "./not-found.module.scss";

export const metadata: Metadata = { title: uiCopy.notFoundTitle };

export default function NotFound() {
  return (
    <SiteShell spy={false}>
      <Band tone="canvas" labelledBy="not-found-title" spacious>
        <div className={styles.content}>
          <h1 id="not-found-title" className={styles.title}>
            {uiCopy.notFoundTitle}
          </h1>
          <p className={styles.body}>{uiCopy.notFoundBody}</p>
          <PillButton href="/">{uiCopy.notFoundLink}</PillButton>
        </div>
      </Band>
    </SiteShell>
  );
}
