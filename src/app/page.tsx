import Link from "next/link";
import { Badge } from "@/components/common/Badge";
import { ButtonLink } from "@/components/common/Button";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { homeCaseLinks, homeHero, homeHighlights, homeProofPanel, homeSections, strengths } from "@/data/home";
import { projects } from "@/data/projects";
import { getExternalLinkProps } from "@/lib/links";

export default function HomePage() {
  return (
    <div className="p-home">
      <section className="p-home__hero">
        <Container className="p-home__hero-inner">
          <div className="p-home__hero-copy">
            <h1>{homeHero.title}</h1>
            <p>{homeHero.description}</p>
            <div className="p-home__hero-actions">
              {homeHero.ctas.map((cta) => (
                <ButtonLink href={cta.href} key={cta.href} variant={cta.variant}>
                  {cta.label}
                </ButtonLink>
              ))}
            </div>
          </div>
          <div className="p-home__system-panel" aria-label="Design system preview">
            <div className="p-home__panel-header">
              <span>{homeProofPanel.title}</span>
            </div>
            {homeProofPanel.items.map((item) => (
              <Link className="p-home__panel-row" href={item.href} key={item.label}>
                <span>{item.label}</span>
                <span>{item.value}</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <Section title={homeSections.strengths.title} description={homeSections.strengths.description}>
        <div className="l-grid l-grid--three">
          {strengths.map((item) => (
            <article className="c-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section title={homeSections.designSystemPreview.title} description={homeSections.designSystemPreview.description}>
        <div className="p-home__highlight-list">
          {homeHighlights.map((highlight) => (
            <p key={highlight}>{highlight}</p>
          ))}
        </div>
      </Section>

      <Section title={homeCaseLinks.title} description={homeCaseLinks.description}>
        <div className="p-home__case-links">
          {homeCaseLinks.items.map((item) => (
            <Link className="p-home__case-link" href={item.href} key={item.href}>
              <strong>{item.title}</strong>
              <span>{item.summary}</span>
            </Link>
          ))}
        </div>
      </Section>

      <Section title={homeSections.featuredProjects.title} description={homeSections.featuredProjects.description}>
        <div className="l-grid l-grid--three">
          {projects.slice(0, 3).map((project) => (
            <article className="c-card" key={project.slug}>
              <Badge>{project.stack[0]}</Badge>
              <h3>{project.name}</h3>
              <p>{project.summary}</p>
              <div className="p-home__project-actions">
                {project.demoUrl ? (
                  <Link className="c-text-link" href={project.demoUrl} {...getExternalLinkProps(project.demoUrl)}>
                    Demo
                  </Link>
                ) : null}
                <Link className="c-text-link" href="/projects">
                  자세히 보기
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
}
