import { ContactLinks } from "@/components/ContactLinks/ContactLinks";
import { profile } from "@/data/profile";
import { uiCopy } from "@/data/site";
import styles from "./AboutSection.module.scss";

export function AboutSection({ id }: { id: string }) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <p className={styles.role}>{profile.role}</p>
      <h1 id={`${id}-title`} className={styles.headline}>
        {profile.headline}
      </h1>
      <p className={styles.intro}>{profile.intro}</p>
      <ContactLinks className={styles.contacts} />
      <h2 className={styles.subTitle}>{uiCopy.competenciesTitle}</h2>
      <ul className={styles.competencies}>
        {profile.competencies.map((item) => (
          <li key={item.label} className={styles.competency}>
            <strong className={styles.label}>{item.label}</strong>
            <span className={styles.text}>{item.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
