import type { Metadata } from "next";
import Image from "next/image";
import { Badge } from "@/components/common/Badge";
import { ButtonLink } from "@/components/common/Button";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { projects, projectsEyebrow, projectsIntro, projectsSectionEyebrow } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects"
};

export default function ProjectsPage() {
  return (
    <div className="p-projects">
      <Container>
        <header className="p-page-header">
          <div className="p-page-header__eyebrow">{projectsEyebrow}</div>
          <h1>Projects</h1>
          <p>{projectsIntro}</p>
        </header>
      </Container>
      <Section eyebrow={projectsSectionEyebrow} title="">
        <div className="l-grid l-grid--three">
          {projects.map((project) => (
            <article className="c-card p-project-card" key={project.slug}>
              <Image className="p-project-card__image" src={project.screenshot.src} alt={project.screenshot.alt} />
              <div className="p-project-card__badges">
                {project.stack.map((stack) => (
                  <Badge key={stack}>{stack}</Badge>
                ))}
              </div>
              <h2>{project.name}</h2>
              <p>{project.summary}</p>
              <h3>UI/UX Point</h3>
              <ul>
                {project.uiPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <h3>Tech Point</h3>
              <ul>
                {project.techPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <div className="p-project-card__actions">
                <ButtonLink href={project.githubUrl} variant="secondary">
                  GitHub
                </ButtonLink>
                {project.demoUrl ? <ButtonLink href={project.demoUrl}>Demo</ButtonLink> : null}
              </div>
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
}
