import { Badge } from "@/components/common/Badge";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { caseStudies } from "@/data/caseStudies";

export default function CaseStudiesPage() {
  return (
    <div className="p-case-studies">
      <Container>
        <header className="p-page-header">
          <h1>Case Studies</h1>
          <p>경력기술서의 업무를 문제 해결 과정으로 압축했습니다. 공개 불가 수치와 화면은 재구성 예시로 대체합니다.</p>
        </header>
      </Container>
      <Section title="Selected Work">
        <div className="p-case-studies__list">
          {caseStudies.map((study) => (
            <article className="p-case-card" key={study.title}>
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
