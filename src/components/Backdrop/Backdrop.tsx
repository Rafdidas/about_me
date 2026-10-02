import styles from "./Backdrop.module.scss";

export function Backdrop() {
  return <div className={styles.backdrop} aria-hidden="true" />;
}
