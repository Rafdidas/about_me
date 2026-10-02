import { SectionHeading } from "@/components/SectionHeading/SectionHeading";
import { personalProjectsIntro, projects } from "@/data/projects";
import { uiCopy } from "@/data/site";
import { ProjectCard } from "./ProjectCard";
import styles from "./ProjectsSection.module.scss";

export function ProjectsSection({ id, title }: { id: string; title: string }) {
  const work = projects.filter((project) => project.kind === "work");
  const personal = projects.filter((project) => project.kind === "personal");

  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <SectionHeading id={`${id}-title`}>{title}</SectionHeading>

      <div className={styles.group}>
        <h3 className={styles.groupTitle}>{uiCopy.workProjectsTitle}</h3>
        <div className={styles.grid}>
          {work.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <h3 className={styles.groupTitle}>{uiCopy.personalProjectsTitle}</h3>
        <p className={styles.groupIntro}>{personalProjectsIntro}</p>
        <div className={styles.grid}>
          {personal.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
