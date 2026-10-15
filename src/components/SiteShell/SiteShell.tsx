import type { ReactNode } from "react";
import { ContactSection } from "@/components/ContactSection/ContactSection";
import { ProfileCard } from "@/components/ProfileCard/ProfileCard";
import { SiteNav } from "@/components/SiteNav/SiteNav";
import { sectionNav, uiCopy } from "@/data/site";
import { getNavItem } from "@/lib/nav";
import styles from "./SiteShell.module.scss";

type SiteShellProps = {
  spy: boolean;
  contact?: boolean;
  // 1024px 미만에서 프로필 카드를 본문 앞("first") 또는 뒤("after")에 둔다. 1024px 이상은 grid 영역이라 위치가 같다.
  profile?: "first" | "after";
  children: ReactNode;
};

const contactNav = getNavItem(sectionNav, "contact");

export function SiteShell({ spy, contact = true, profile = "first", children }: SiteShellProps) {
  const profileSlot = (
    <div className={styles.profileSlot}>
      <ProfileCard />
    </div>
  );

  return (
    <>
      <SiteNav variant="bar" items={sectionNav} label={uiCopy.sectionNavLabel} spy={spy} />
      <div className={styles.shell}>
        {profile === "first" ? profileSlot : null}
        <div className={styles.column}>
          <main id="main" tabIndex={-1} className={styles.main}>
            {children}
            {contact ? <ContactSection id={contactNav.id} /> : null}
          </main>
          <footer className={styles.footer}>
            <p>{uiCopy.footer}</p>
          </footer>
        </div>
        {profile === "after" ? profileSlot : null}
        <div className={styles.railSlot}>
          <SiteNav variant="rail" items={sectionNav} label={uiCopy.sectionNavLabel} spy={spy} />
        </div>
      </div>
    </>
  );
}
