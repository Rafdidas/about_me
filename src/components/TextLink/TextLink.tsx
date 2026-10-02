import Link from "next/link";
import type { ReactNode } from "react";
import { uiCopy } from "@/data/site";
import styles from "./TextLink.module.scss";

type TextLinkProps = { href: string; className?: string; children: ReactNode };

export function TextLink({ href, className, children }: TextLinkProps) {
  const classes = [styles.link, className].filter(Boolean).join(" ");

  if (href.startsWith("http")) {
    return (
      <a className={classes} href={href} target="_blank" rel="noopener noreferrer">
        {children}
        <span className={styles.hidden}>{uiCopy.newWindow}</span>
      </a>
    );
  }

  return (
    <Link className={classes} href={href}>
      {children}
    </Link>
  );
}
