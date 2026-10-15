import type { NavItem } from "@/data/types";
import styles from "./LocalNav.module.scss";

export function LocalNav({ items, label }: { items: NavItem[]; label: string }) {
  if (items.length === 0) return null;

  return (
    <nav className={styles.nav} aria-label={label}>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id}>
            <a className={styles.link} href={`#${item.id}`}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
