import type { ReactNode } from "react";
import { MobileHeader } from "@/components/MobileHeader/MobileHeader";
import { SectionNav } from "@/components/SectionNav/SectionNav";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { uiCopy } from "@/data/site";
import type { NavItem } from "@/data/types";
import styles from "./PageShell.module.scss";

type PageShellProps = {
  navItems: NavItem[];
  navLabel: string;
  sidebarExtra?: ReactNode;
  children: ReactNode;
};

export function PageShell({ navItems, navLabel, sidebarExtra, children }: PageShellProps) {
  return (
    <>
      <MobileHeader nav={<SectionNav items={navItems} label={navLabel} orientation="horizontal" />} />
      <div className={styles.shell}>
        <Sidebar nav={<SectionNav items={navItems} label={navLabel} orientation="vertical" />} extra={sidebarExtra} />
        <div className={styles.column}>
          <main id="main" tabIndex={-1} className={styles.main}>
            {children}
          </main>
          <footer className={styles.footer}>{uiCopy.footer}</footer>
        </div>
      </div>
    </>
  );
}
