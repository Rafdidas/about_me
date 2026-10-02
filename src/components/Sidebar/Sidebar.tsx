import Link from "next/link";
import type { ReactNode } from "react";
import { ContactLinks } from "@/components/ContactLinks/ContactLinks";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import { profile } from "@/data/profile";
import styles from "./Sidebar.module.scss";

type SidebarProps = { nav: ReactNode; extra?: ReactNode };

export function Sidebar({ nav, extra }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <Link className={styles.brand} href="/">
        <span className={styles.name}>{profile.name}</span>
        <span className={styles.role}>{profile.role}</span>
      </Link>
      {extra ? <div className={styles.extra}>{extra}</div> : null}
      <div className={styles.nav}>{nav}</div>
      <div className={styles.footer}>
        <ContactLinks />
        <ThemeToggle />
      </div>
    </aside>
  );
}
