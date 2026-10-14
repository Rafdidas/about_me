import { Band } from "@/components/Band/Band";
import { PillButton } from "@/components/PillButton/PillButton";
import { profile } from "@/data/profile";
import { uiCopy } from "@/data/site";
import styles from "./Hero.module.scss";

export function Hero({ id }: { id: string }) {
  return (
    <Band tone="canvas" labelledBy={`${id}-title`} spacious>
      <div className={styles.content}>
        <p className={styles.overline}>{profile.role}</p>
        <h1 id={`${id}-title`} className={styles.title}>
          {profile.headline}
        </h1>
        <p className={styles.lead}>{profile.intro}</p>
        <div className={styles.actions}>
          <PillButton href="#projects">{uiCopy.heroProjects}</PillButton>
          <PillButton href={`mailto:${profile.email}`} variant="secondary">
            {uiCopy.heroContact}
          </PillButton>
        </div>
      </div>
    </Band>
  );
}
