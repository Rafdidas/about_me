import Link from "next/link";
import { Badge } from "@/components/common/Badge";
import { ButtonLink } from "@/components/common/Button";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { homeHero, homeHighlights, homeProofPanel, strengths } from "@/data/home";
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
              <ButtonLink href={homeHero.primaryCta.href}>{homeHero.primaryCta.label}</ButtonLink>
              <ButtonLink href={homeHero.secondaryCta.href} variant="secondary">
                {homeHero.secondaryCta.label}
              </ButtonLink>
            </div>
          </div>
          <div className="p-home__system-panel" aria-label="Design system preview">
            <div className="p-home__panel-header">
              <span>{homeProofPanel.title}</span>
              <Badge tone="success">{homeProofPanel.status}</Badge>
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

      <Section title="Strengths" description="완성도보다 완결성을 우선해, 만든 화면은 상태와 반응형까지 마무리합니다.">
        <div className="l-grid l-grid--three">
          {strengths.map((item) => (
            <article className="c-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Design System Preview" description="색상, 타이포그래피, 컴포넌트 상태를 문서가 아니라 실제 렌더링으로 확인합니다.">
        <div className="p-home__highlight-list">
          {homeHighlights.map((highlight) => (
            <p key={highlight}>{highlight}</p>
          ))}
        </div>
      </Section>

      <Section title="Featured Projects" description="기존 GitHub 프로젝트는 새 리팩토링 없이 README와 코드 증빙으로 연결합니다.">
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
