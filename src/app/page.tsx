import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
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
            <div className="p-home__hero-badge">
              <span />
              {homeHero.badge}
            </div>
            <h1>
              {homeHero.titleLines.map((line, lineIndex) => (
                <Fragment key={lineIndex}>
                  {lineIndex > 0 ? <br /> : null}
                  {line.map((segment, segmentIndex) => (
                    <span
                      key={segmentIndex}
                      className={
                        [segment.nowrap ? "u-keep" : "", segment.accent ? "p-home__hero-accent" : ""]
                          .filter(Boolean)
                          .join(" ") || undefined
                      }
                    >
                      {segment.text}
                    </span>
                  ))}
                </Fragment>
              ))}
            </h1>
            <p>{homeHero.description}</p>
            <div className="p-home__hero-actions">
              {homeHero.ctas.map((cta) => (
                <ButtonLink href={cta.href} key={cta.href} variant={cta.variant}>
                  {cta.label}
                </ButtonLink>
              ))}
            </div>
          </div>
          <div className="p-home__system-panel">
            <div className="p-home__panel-header">
              <h3>{homeProofPanel.title}</h3>
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

      <div className="p-home__body">
      <Section eyebrow="What I bring" title={homeSections.strengths.title} description={homeSections.strengths.description}>
        <div className="l-grid l-grid--three">
          {strengths.map((item, index) => (
            <article className="c-card p-home__strength-card" key={item.title}>
              <div className="p-home__strength-top">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span aria-hidden="true">
                  <span />
                </span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section eyebrow="Foundations" title={homeSections.designSystemPreview.title} description={homeSections.designSystemPreview.description}>
        <div className="p-home__highlight-list">
          {homeHighlights.map((highlight, index) => (
            <p key={highlight}>
              <span>{["①", "②", "③"][index]}</span>
              {highlight}
            </p>
          ))}
        </div>
        <Link className="c-text-link p-home__section-link" href="/design-system">
          Design System 전체 보기 →
        </Link>
      </Section>

      <Section eyebrow="Selected work" title={homeCaseLinks.title} description={homeCaseLinks.description}>
        <div className="p-home__case-links">
          {homeCaseLinks.items.map((item) => (
            <Link className="p-home__case-link" href={item.href} key={item.href}>
              <span>{item.category}</span>
              <strong>{item.title}</strong>
              <span>{item.summary}</span>
              <em>자세히 보기 →</em>
            </Link>
          ))}
        </div>
      </Section>

      <Section eyebrow="Side projects" title={homeSections.featuredProjects.title} description={homeSections.featuredProjects.description}>
        <div className="l-grid l-grid--three">
          {projects.slice(0, 3).map((project) => (
            <article className="c-card p-home__project-card" key={project.slug}>
              <Image className="p-home__project-image" src={project.screenshot.src} alt={project.screenshot.alt} />
              <span className="p-project-tag">{project.stack[0]}</span>
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
    </div>
  );
}
