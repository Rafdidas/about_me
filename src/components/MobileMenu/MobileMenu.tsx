"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { uiCopy } from "@/data/site";
import type { NavItem } from "@/data/types";
import { navHref } from "@/lib/nav";
import styles from "./MobileMenu.module.scss";

type MobileMenuProps = { items: NavItem[]; label: string; spy: boolean; activeId?: string };

export function MobileMenu({ items, label, spy, activeId }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <div className={styles.root}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.button}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? uiCopy.menuClose : uiCopy.menuOpen}
        onClick={() => setOpen((value) => !value)}
      >
        <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            d={open ? "M6 6l12 12M18 6L6 18" : "M4 8h16M4 16h16"}
          />
        </svg>
      </button>
      <div id={panelId} className={styles.panel} hidden={!open}>
        <nav aria-label={label}>
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  className={styles.link}
                  href={navHref(item.id, spy)}
                  aria-current={item.id === activeId ? "location" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
