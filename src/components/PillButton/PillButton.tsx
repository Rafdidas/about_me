import Link from "next/link";
import type { ReactNode } from "react";
import { uiCopy } from "@/data/site";
import styles from "./PillButton.module.scss";

type PillButtonProps = {
  href: string;
  variant?: "primary" | "secondary";
  size?: "regular" | "compact";
  children: ReactNode;
};

export function PillButton({ href, variant = "primary", size = "regular", children }: PillButtonProps) {
  const className = `${styles.button} ${styles[variant]} ${styles[size]}`;

  if (href.startsWith("http")) {
    return (
      <a className={className} href={href} target="_blank" rel="noopener noreferrer">
        {children}
        <span className={styles.hidden}>{uiCopy.newWindow}</span>
      </a>
    );
  }

  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}
