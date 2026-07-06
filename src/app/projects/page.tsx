import type { CSSProperties } from "react";
import { Badge } from "@/components/common/Badge";
import { ButtonLink } from "@/components/common/Button";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { projects, projectsIntro } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <div className="p-projects">
      <Container>
        <header className="p-page-header">
          <div className="p-page-header__eyebrow">UI flow · State · Data</div>
          <h1>Projects</h1>
          <p>{projectsIntro}</p>
        </header>
      </Container>
      <Section eyebrow="Curated GitHub Projects" title="">
        <div className="l-grid l-grid--three">
          {projects.map((project) => (
            <article className="c-card p-project-card" key={project.slug}>
              <div className="p-project-thumb p-project-thumb--large" style={{ "--thumb-bg": project.thumbBg, "--thumb-ink": project.thumbInk } as CSSProperties}>
                <span>{project.thumbLabel}</span>
              </div>
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
