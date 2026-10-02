import { TextLink } from "@/components/TextLink/TextLink";
import { profile } from "@/data/profile";
import { uiCopy } from "@/data/site";
import styles from "./ContactLinks.module.scss";

export function ContactLinks({ className }: { className?: string }) {
  return (
    <dl className={[styles.list, className].filter(Boolean).join(" ")} aria-label={uiCopy.contactLabel}>
      <div className={styles.row}>
        <dt className={styles.term}>{uiCopy.contactEmail}</dt>
        <dd>
          <TextLink href={`mailto:${profile.email}`}>{profile.email}</TextLink>
        </dd>
      </div>
      <div className={styles.row}>
        <dt className={styles.term}>{uiCopy.contactGithub}</dt>
        <dd>
          <TextLink href={profile.github}>{profile.github.replace("https://", "")}</TextLink>
        </dd>
      </div>
    </dl>
  );
}
