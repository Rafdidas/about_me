import { Section } from "@/components/Section/Section";
import { TagList } from "@/components/Tag/Tag";
import { TextLink } from "@/components/TextLink/TextLink";
import { Tile } from "@/components/Tile/Tile";
import { uiCopy } from "@/data/site";
import type { Project } from "@/data/types";
import { EVIDENCE_SECTION_ID, getEvidenceLinks, sectionId } from "@/lib/projects";
import styles from "./ProjectBody.module.scss";

export function ProjectBody({ project }: { project: Project }) {
  const evidence = getEvidenceLinks(project);

  return (
    <Section>
      <div className={styles.reading}>
        {project.sections.map((section, index) => {
          const id = sectionId(index);
          return (
            <section key={id} id={id} className={styles.section} aria-labelledby={`${id}-title`}>
              <h2 id={`${id}-title`} className={styles.title}>
                {section.title}
              </h2>
              {section.stack ? <TagList items={section.stack} /> : null}
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className={styles.paragraph}>
                  {paragraph}
                </p>
              ))}
              {section.items ? (
                <ul className={styles.items}>
                  {section.items.map((item) => (
                    <li key={item.text}>
                      <Tile>
                        {item.label ? <strong className={styles.itemLabel}>{item.label}</strong> : null}
                        <span className={styles.itemText}>{item.text}</span>
                      </Tile>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          );
        })}

        {evidence.length > 0 ? (
          <section id={EVIDENCE_SECTION_ID} className={styles.section} aria-labelledby={`${EVIDENCE_SECTION_ID}-title`}>
            <h2 id={`${EVIDENCE_SECTION_ID}-title`} className={styles.title}>
              {uiCopy.evidenceTitle}
            </h2>
            <ul className={styles.evidence}>
              {evidence.map((link) => (
                <li key={link.href}>
                  <TextLink href={link.href}>{link.label}</TextLink>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </Section>
  );
}
