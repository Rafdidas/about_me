import { Badge } from "@/components/common/Badge";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { caseStudies, caseStudiesIntro } from "@/data/caseStudies";

export default function CaseStudiesPage() {
  return (
    <div className="p-case-studies">
      <Container>
        <header className="p-page-header">
          <div className="p-page-header__eyebrow">Problem · Role · Action · Result</div>
          <h1>Case Studies</h1>
          <p>{caseStudiesIntro}</p>
        </header>
      </Container>
      <Section eyebrow="Selected Work" title="">
        <div className="p-case-studies__list">
          {caseStudies.map((study) => (
            <article className="p-case-card" id={study.id} key={study.title}>
              <div className="p-case-card__meta">
                <Badge>{study.category}</Badge>
                <span>{study.period}</span>
              </div>
              <h2>{study.title}</h2>
              {study.sections.map((section) => (
                <div className="p-case-card__section" key={section.label}>
                  <h3>{section.label}</h3>
                  <p>{section.body}</p>
                </div>
              ))}
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
}
