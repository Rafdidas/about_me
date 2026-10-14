import { ContactLinks } from "@/components/ContactLinks/ContactLinks";
import { uiCopy } from "@/data/site";
import styles from "./SiteFooter.module.scss";

export function SiteFooter() {
  return (
    <footer data-tone="canvas" className={styles.footer}>
      <div className={styles.inner}>
        <ContactLinks />
        <p className={styles.copy}>{uiCopy.footer}</p>
      </div>
    </footer>
  );
}
