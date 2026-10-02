import styles from "./Tag.module.scss";

export function TagList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={[styles.list, className].filter(Boolean).join(" ")}>
      {items.map((item) => (
        <li key={item} className={styles.tag}>
          {item}
        </li>
      ))}
    </ul>
  );
}
