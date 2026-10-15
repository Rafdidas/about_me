import { Section } from "@/components/Section/Section";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { TextLink } from "@/components/TextLink/TextLink";
import { profile } from "@/data/profile";
import { sectionHeadings } from "@/data/site";
import styles from "./ContactSection.module.scss";

export function ContactSection({ id }: { id: string }) {
  const headingId = `${id}-title`;

  return (
    <Section id={id} labelledBy={headingId}>
      <SectionHeader headingId={headingId} icon="contact" heading={sectionHeadings.contact} />
      <a className={styles.email} href={`mailto:${profile.email}`}>
        {profile.email}
      </a>
      <p className={styles.github}>
        <TextLink href={profile.github}>{profile.github.replace("https://", "")}</TextLink>
      </p>
    </Section>
  );
}
