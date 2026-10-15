"use client";

import { LazyMotion, MotionConfig, domAnimation, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon, NAV_ICONS } from "@/components/Icon/Icon";
import { MobileMenu } from "@/components/MobileMenu/MobileMenu";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import { profile } from "@/data/profile";
import type { NavItem } from "@/data/types";
import { navHref } from "@/lib/nav";
import { useActiveSection } from "@/lib/useActiveSection";
import styles from "./SiteNav.module.scss";

type SiteNavProps = { items: NavItem[]; label: string; spy: boolean; variant: "bar" | "rail" };
type RailProps = { items: NavItem[]; label: string; spy: boolean; activeId?: string };
type PillRect = { y: number; height: number };

const SPRING = { type: "spring", stiffness: 380, damping: 32 } as const;

function measure(element: Element | null | undefined): PillRect | null {
  if (!(element instanceof HTMLElement)) return null;
  return { y: element.offsetTop, height: element.offsetHeight };
}

function Rail({ items, label, spy, activeId }: RailProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [activeRect, setActiveRect] = useState<PillRect | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const update = () => setActiveRect(measure(list.querySelector('[aria-current="location"]')));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(list);
    return () => observer.disconnect();
  }, [activeId]);

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <header className={styles.railHeader}>
          <nav aria-label={label}>
            <div className={styles.railWrap}>
              {activeRect ? (
                <m.span
                  aria-hidden="true"
                  className={styles.activePill}
                  initial={false}
                  animate={{ y: activeRect.y, height: activeRect.height }}
                  transition={reduceMotion ? { duration: 0 } : SPRING}
                />
              ) : null}
              <ul ref={listRef} className={styles.railList}>
                {items.map((item) => (
                  <li key={item.id}>
                    <Link
                      className={styles.railLink}
                      href={navHref(item.id, spy)}
                      aria-label={item.label}
                      aria-current={item.id === activeId ? "location" : undefined}
                    >
                      <Icon name={NAV_ICONS[item.id] ?? "intro"} className={styles.railIcon} />
                      <span className={styles.tip} aria-hidden="true">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </header>
      </MotionConfig>
    </LazyMotion>
  );
}

export function SiteNav({ items, label, spy, variant }: SiteNavProps) {
  const activeId = useActiveSection(
    items.map((item) => item.id),
    spy
  );

  if (variant === "rail") {
    return <Rail items={items} label={label} spy={spy} activeId={activeId} />;
  }

  return (
    <header className={styles.bar}>
      <div className={styles.barInner}>
        <Link className={styles.brand} href="/">
          {profile.name}
        </Link>
        <div className={styles.actions}>
          <ThemeToggle />
          <MobileMenu items={items} label={label} spy={spy} activeId={activeId} />
        </div>
      </div>
    </header>
  );
}
