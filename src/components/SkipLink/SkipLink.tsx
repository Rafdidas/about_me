import { uiCopy } from "@/data/site";
import styles from "./SkipLink.module.scss";

export function SkipLink() {
  return (
    <a className={styles.skipLink} href="#main">
      {uiCopy.skipLink}
    </a>
  );
}
