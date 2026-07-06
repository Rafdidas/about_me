import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { careerItems, careerSummary, certificationItems, educationItems, portfolioLinks, projectHistory, skillGroups } from "@/data/career";

export default function CareerPage() {
  return (
    <div className="p-career">
      <Container>
        <header className="p-page-header">
          <h1>Career</h1>
          <p>{careerSummary.body}</p>
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
                  <li key={highlight.text}>
                    {highlight.text}
                    {highlight.caseStudyHref ? (
                      <Link className="p-career__case-link" href={highlight.caseStudyHref}>
                        Case 보기
                      </Link>
                    ) : null}
                  </li>
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
      <Section title="Project History">
        <div className="p-career__project-history">
          {projectHistory.map((group) => (
            <article className="c-card" key={group.company}>
              <h3>{group.company}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>
      <Section title="Education & Certificates">
        <div className="p-career__info-grid">
          <article className="c-card">
            <h3>Education</h3>
            {educationItems.map((item) => (
              <div className="p-career__info-item" key={item.school}>
                <strong>{item.school}</strong>
                <span>{item.period}</span>
                <p>{item.description}</p>
              </div>
            ))}
          </article>
          <article className="c-card">
            <h3>Certificates</h3>
            {certificationItems.map((item) => (
              <div className="p-career__info-item" key={item.name}>
                <strong>{item.name}</strong>
                <span>{item.issuedAt}</span>
                <p>{item.issuer}</p>
              </div>
            ))}
          </article>
          <article className="c-card">
            <h3>Links</h3>
            <div className="p-career__links">
              {portfolioLinks.map((link) => (
                <a className="c-text-link" href={link.href} key={link.href} rel="noreferrer" target="_blank">
                  {link.label}
                </a>
              ))}
            </div>
          </article>
        </div>
      </Section>
    </div>
  );
}
