"use client";

import { AnimatePresence, LazyMotion, MotionConfig, domAnimation } from "motion/react";
import * as m from "motion/react-m";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { uiCopy } from "@/data/site";
import type { NavItem } from "@/data/types";
import { navHref } from "@/lib/nav";
import styles from "./MobileMenu.module.scss";

type MobileMenuProps = { items: NavItem[]; label: string; spy: boolean; activeId?: string };

const PANEL_SPRING = { type: "spring", stiffness: 420, damping: 34 } as const;

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
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <div
          className={styles.root}
          onBlur={(event) => {
            if (open && event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) {
              setOpen(false);
            }
          }}
        >
          <button
            ref={buttonRef}
            type="button"
            className={styles.button}
            aria-expanded={open}
            aria-controls={open ? panelId : undefined}
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
          <AnimatePresence>
            {open ? (
              <m.div
                key="panel"
                id={panelId}
                className={styles.panel}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={PANEL_SPRING}
              >
                <nav aria-label={label}>
                  <ul className={styles.list}>
                    {items.map((item, index) => (
                      <m.li
                        key={item.id}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...PANEL_SPRING, delay: 0.04 * index }}
                      >
                        <Link
                          className={styles.link}
                          href={navHref(item.id, spy)}
                          aria-current={item.id === activeId ? "location" : undefined}
                          onClick={() => setOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </m.li>
                    ))}
                  </ul>
                </nav>
              </m.div>
            ) : null}
          </AnimatePresence>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
