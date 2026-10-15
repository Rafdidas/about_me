import type { ReactNode } from "react";
import { ContactSection } from "@/components/ContactSection/ContactSection";
import { ProfileCard } from "@/components/ProfileCard/ProfileCard";
import { SiteNav } from "@/components/SiteNav/SiteNav";
import { sectionNav, uiCopy } from "@/data/site";
import { getNavItem } from "@/lib/nav";
import styles from "./SiteShell.module.scss";

type SiteShellProps = { spy: boolean; contact?: boolean; children: ReactNode };

const contactNav = getNavItem(sectionNav, "contact");

export function SiteShell({ spy, contact = true, children }: SiteShellProps) {
  return (
    <>
      <SiteNav variant="bar" items={sectionNav} label={uiCopy.sectionNavLabel} spy={spy} />
      <div className={styles.shell}>
        <div className={styles.profileSlot}>
          <ProfileCard />
        </div>
        <div className={styles.column}>
          <main id="main" tabIndex={-1} className={styles.main}>
            {children}
            {contact ? <ContactSection id={contactNav.id} /> : null}
          </main>
          <footer className={styles.footer}>
            <p>{uiCopy.footer}</p>
          </footer>
        </div>
        <div className={styles.railSlot}>
          <SiteNav variant="rail" items={sectionNav} label={uiCopy.sectionNavLabel} spy={spy} />
        </div>
      </div>
    </>
  );
}
