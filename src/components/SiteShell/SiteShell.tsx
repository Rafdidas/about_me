import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter/SiteFooter";
import { SiteNav } from "@/components/SiteNav/SiteNav";
import { sectionNav, uiCopy } from "@/data/site";

export function SiteShell({ spy, children }: { spy: boolean; children: ReactNode }) {
  return (
    <>
      <SiteNav items={sectionNav} label={uiCopy.sectionNavLabel} spy={spy} />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
