import { ButtonLink } from "@/components/common/Button";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { careerItems, skillGroups } from "@/data/career";
import { siteMeta } from "@/data/site";

export default function CareerPage() {
  return (
    <div className="p-career">
      <Container>
        <header className="p-page-header">
          <h1>Career</h1>
          <p>연차, 역할, 주요 업무를 빠르게 확인할 수 있도록 요약했습니다. 상세 경력은 PDF 이력서와 Case Study로 위임합니다.</p>
          <ButtonLink href={siteMeta.resumeUrl}>PDF 이력서 다운로드</ButtonLink>
        </header>
      </Container>
      <Section title="Timeline">
        <div className="p-career__timeline">
          {careerItems.map((item) => (
            <article className="p-career__item" key={item.company}>
              <span>{item.period}</span>
              <h2>{item.company}</h2>
              <p>{item.role}</p>
              <ul>
                {item.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>
      <Section title="Skills">
        <div className="l-grid l-grid--three">
          {skillGroups.map((group) => (
            <article className="c-card" key={group.title}>
              <h3>{group.title}</h3>
              <p>{group.items.join(" / ")}</p>
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
}
