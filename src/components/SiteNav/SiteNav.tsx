"use client";

import Link from "next/link";
import { MobileMenu } from "@/components/MobileMenu/MobileMenu";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import { profile } from "@/data/profile";
import type { NavItem } from "@/data/types";
import { navHref } from "@/lib/nav";
import { useActiveSection } from "@/lib/useActiveSection";
import styles from "./SiteNav.module.scss";

type SiteNavProps = { items: NavItem[]; label: string; spy: boolean };

export function SiteNav({ items, label, spy }: SiteNavProps) {
  const activeId = useActiveSection(
    items.map((item) => item.id),
    spy
  );

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link className={styles.brand} href="/">
          {profile.name}
        </Link>
        <nav className={styles.nav} aria-label={label}>
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  className={styles.link}
                  href={navHref(item.id, spy)}
                  aria-current={item.id === activeId ? "location" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.actions}>
          <ThemeToggle />
          <MobileMenu items={items} label={label} spy={spy} activeId={activeId} />
        </div>
      </div>
    </header>
  );
}
