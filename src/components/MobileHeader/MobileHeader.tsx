import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import { profile } from "@/data/profile";
import styles from "./MobileHeader.module.scss";

export function MobileHeader({ nav }: { nav: ReactNode }) {
  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <Link className={styles.brand} href="/">
          {profile.name}
        </Link>
        <ThemeToggle />
      </div>
      {nav}
    </header>
  );
}
