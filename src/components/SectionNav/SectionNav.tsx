"use client";

import { useEffect, useRef, useState } from "react";
import type { NavItem } from "@/data/types";
import { pickActiveId } from "@/lib/sectionNav";
import styles from "./SectionNav.module.scss";

type SectionNavProps = {
  items: NavItem[];
  label: string;
  orientation: "vertical" | "horizontal";
};

export function SectionNav({ items, label, orientation }: SectionNavProps) {
  const [activeId, setActiveId] = useState<string | undefined>(items[0]?.id);
  const listRef = useRef<HTMLUListElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ids = items.map((item) => item.id);
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (targets.length === 0) return;

    const visible = new Set<string>();
    let frame = 0;

    function update() {
      frame = 0;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      setActiveId((current) => pickActiveId({ ids, visibleIds: [...visible], atBottom, current }));
    }

    function schedule() {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        schedule();
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    targets.forEach((target) => observer.observe(target));
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [items]);

  useEffect(() => {
    const list = listRef.current;
    const nav = navRef.current;
    const active = list?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!list || !nav || !active) return;

    function place() {
      if (!list || !active) return;
      const vertical = orientation === "vertical";
      list.style.setProperty("--indicator-offset", `${vertical ? active.offsetTop : active.offsetLeft}px`);
      list.style.setProperty("--indicator-size", `${vertical ? active.offsetHeight : active.offsetWidth}px`);
    }

    place();
    if (orientation === "horizontal") {
      nav.scrollTo({ left: Math.max(0, active.offsetLeft - 16) });
    }
    const resizeObserver = new ResizeObserver(place);
    resizeObserver.observe(list);
    return () => resizeObserver.disconnect();
  }, [activeId, orientation]);

  if (items.length === 0) return null;

  return (
    <nav ref={navRef} className={`${styles.nav} ${styles[orientation]}`} aria-label={label}>
      <ul ref={listRef} className={styles.list}>
        {items.map((item) => (
          <li key={item.id}>
            <a
              className={styles.link}
              href={`#${item.id}`}
              aria-current={item.id === activeId ? "location" : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
        <li className={styles.indicator} aria-hidden="true" />
      </ul>
    </nav>
  );
}
