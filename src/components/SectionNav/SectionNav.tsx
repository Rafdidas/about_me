"use client";

import { useEffect, useRef, useState } from "react";
import type { NavItem } from "@/data/types";
import styles from "./SectionNav.module.scss";

type SectionNavProps = {
  items: NavItem[];
  label: string;
  orientation: "vertical" | "horizontal";
};

export function SectionNav({ items, label, orientation }: SectionNavProps) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!list || !active) return;

    function place() {
      if (!list || !active) return;
      const vertical = orientation === "vertical";
      list.style.setProperty("--indicator-offset", `${vertical ? active.offsetTop : active.offsetLeft}px`);
      list.style.setProperty("--indicator-size", `${vertical ? active.offsetHeight : active.offsetWidth}px`);
      if (!vertical) active.scrollIntoView({ block: "nearest", inline: "nearest" });
    }

    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [activeId, orientation]);

  if (items.length === 0) return null;

  return (
    <nav className={`${styles.nav} ${styles[orientation]}`} aria-label={label}>
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
