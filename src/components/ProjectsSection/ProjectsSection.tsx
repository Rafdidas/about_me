import { ProjectCard } from "@/components/ProjectCard/ProjectCard";
import { ProjectTile } from "@/components/ProjectTile/ProjectTile";
import { Section } from "@/components/Section/Section";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { TiltTile } from "@/components/TiltTile/TiltTile";
import { personalProjectsIntro, projects } from "@/data/projects";
import { sectionHeadings, uiCopy } from "@/data/site";
import styles from "./ProjectsSection.module.scss";

const HALF_TILE_SIZES = "(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw";

export function ProjectsSection({ id }: { id: string }) {
  const headingId = `${id}-title`;
  const work = projects.filter((project) => project.kind === "work");
  const personal = projects.filter((project) => project.kind === "personal");

  return (
    <Section id={id} labelledBy={headingId}>
      <SectionHeader headingId={headingId} icon="projects" heading={sectionHeadings.projects} />

      <h3 className={styles.groupTitle}>{uiCopy.workProjectsTitle}</h3>
      <ul className={styles.workList}>
        {work.map((project) => (
          <li key={project.slug}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>

      <h3 className={styles.groupTitle}>{uiCopy.personalProjectsTitle}</h3>
      <p className={styles.intro}>{personalProjectsIntro}</p>
      <ul className={styles.grid}>
        {personal.map((project, index) => {
          const wide = index % 3 === 0;
          return (
            <li key={project.slug} className={wide ? styles.wide : undefined}>
              <TiltTile>
                <ProjectTile project={project} withImage sizes={wide ? undefined : HALF_TILE_SIZES} />
              </TiltTile>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
