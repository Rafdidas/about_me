import Image from "next/image";
import { ContactLinks } from "@/components/ContactLinks/ContactLinks";
import { PillButton } from "@/components/PillButton/PillButton";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import { profile } from "@/data/profile";
import { uiCopy } from "@/data/site";
import styles from "./ProfileCard.module.scss";

export function ProfileCard() {
  return (
    <aside className={styles.card} aria-label={uiCopy.profileLabel}>
      <div className={styles.avatar}>
        <Image
          src="/profile/avatar.png"
          alt={uiCopy.avatarAlt}
          width={315}
          height={315}
          sizes="(min-width: 1024px) 240px, 160px"
          priority
        />
      </div>
      <div className={styles.identity}>
        <p className={styles.name}>{profile.name}</p>
        <p className={styles.role}>{profile.role}</p>
      </div>
      <ContactLinks className={styles.contacts} />
      <div className={styles.actions}>
        <PillButton href={`mailto:${profile.email}`} size="compact">
          {uiCopy.contactCta}
        </PillButton>
        <span className={styles.toggleSlot}>
          <ThemeToggle />
        </span>
      </div>
    </aside>
  );
}
