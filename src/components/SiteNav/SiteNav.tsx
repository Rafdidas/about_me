"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import * as m from "motion/react-m";
import Link from "next/link";
import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { MobileMenu } from "@/components/MobileMenu/MobileMenu";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import { profile } from "@/data/profile";
import type { NavItem } from "@/data/types";
import { navHref } from "@/lib/nav";
import { useActiveSection } from "@/lib/useActiveSection";
import styles from "./SiteNav.module.scss";

type SiteNavProps = { items: NavItem[]; label: string; spy: boolean };
type PillRect = { x: number; width: number };

const SPRING = { type: "spring", stiffness: 380, damping: 32 } as const;

function measure(element: Element | null | undefined): PillRect | null {
  if (!(element instanceof HTMLElement)) return null;
  return { x: element.offsetLeft, width: element.offsetWidth };
}

export function SiteNav({ items, label, spy }: SiteNavProps) {
  const activeId = useActiveSection(
    items.map((item) => item.id),
    spy
  );
  const listRef = useRef<HTMLUListElement>(null);
  const [activeRect, setActiveRect] = useState<PillRect | null>(null);
  const [hoverRect, setHoverRect] = useState<PillRect | null>(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const update = () => setActiveRect(measure(list.querySelector('[aria-current="location"]')));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(list);
    return () => observer.disconnect();
  }, [activeId]);

  function showHover(event: SyntheticEvent<HTMLElement>) {
    setHoverRect(measure(event.currentTarget));
    setHovering(true);
  }

  function hideHover() {
    setHovering(false);
  }

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <header className={styles.header}>
          <div className={styles.bar}>
            <Link className={styles.brand} href="/">
              {profile.name}
            </Link>
            <nav className={styles.nav} aria-label={label}>
              <ul ref={listRef} className={styles.list}>
                {activeRect ? (
                  <m.span
                    aria-hidden="true"
                    className={styles.activePill}
                    initial={false}
                    animate={{ x: activeRect.x, width: activeRect.width }}
                    transition={SPRING}
                  />
                ) : null}
                {hoverRect ? (
                  <m.span
                    aria-hidden="true"
                    className={styles.hoverPill}
                    initial={false}
                    animate={{ x: hoverRect.x, width: hoverRect.width, opacity: hovering ? 1 : 0 }}
                    transition={SPRING}
                  />
                ) : null}
                {items.map((item) => (
                  <li key={item.id}>
                    <Link
                      className={styles.link}
                      href={navHref(item.id, spy)}
                      aria-current={item.id === activeId ? "location" : undefined}
                      onPointerEnter={showHover}
                      onPointerLeave={hideHover}
                      onFocus={showHover}
                      onBlur={hideHover}
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
      </MotionConfig>
    </LazyMotion>
  );
}
