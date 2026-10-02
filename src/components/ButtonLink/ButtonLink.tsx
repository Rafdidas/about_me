import Link from "next/link";
import type { ReactNode } from "react";
import { uiCopy } from "@/data/site";
import styles from "./ButtonLink.module.scss";

type ButtonLinkProps = { href: string; variant?: "primary" | "secondary"; children: ReactNode };

export function ButtonLink({ href, variant = "primary", children }: ButtonLinkProps) {
  const className = `${styles.button} ${styles[variant]}`;

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
