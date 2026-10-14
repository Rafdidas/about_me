import { Band } from "@/components/Band/Band";
import { ProjectTile } from "@/components/ProjectTile/ProjectTile";
import { SectionTitle } from "@/components/SectionTitle/SectionTitle";
import { TiltTile } from "@/components/TiltTile/TiltTile";
import { personalProjectsIntro, projects } from "@/data/projects";
import { uiCopy } from "@/data/site";
import styles from "./ProjectsBands.module.scss";

export function ProjectsBands({ id, title }: { id: string; title: string }) {
  const work = projects.filter((project) => project.kind === "work");
  const personal = projects.filter((project) => project.kind === "personal");

  return (
    <div id={id}>
      <Band tone="canvas" labelledBy={`${id}-title`}>
        <SectionTitle id={`${id}-title`}>{title}</SectionTitle>
        <h3 className={styles.groupTitle}>{uiCopy.workProjectsTitle}</h3>
        <ul className={styles.grid}>
          {work.map((project) => (
            <li key={project.slug}>
              <ProjectTile project={project} />
            </li>
          ))}
        </ul>
      </Band>
      <Band tone="ink">
        <h3 className={styles.groupTitle}>{uiCopy.personalProjectsTitle}</h3>
        <p className={styles.intro}>{personalProjectsIntro}</p>
        <ul className={styles.grid}>
          {personal.map((project) => (
            <li key={project.slug}>
              <TiltTile>
                <ProjectTile project={project} withImage />
              </TiltTile>
            </li>
          ))}
        </ul>
      </Band>
    </div>
  );
}
