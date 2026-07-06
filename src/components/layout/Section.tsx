import type { ReactNode } from "react";
import { Container } from "./Container";

type SectionProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  id?: string;
  children: ReactNode;
};

export function Section({ title, description, eyebrow, id, children }: SectionProps) {
  return (
    <section className="l-section" id={id}>
      <Container>
        <div className="l-section__header">
          {eyebrow ? <div className="l-section__eyebrow">{eyebrow}</div> : null}
          {title ? <h2>{title}</h2> : null}
          {description ? <p>{description}</p> : null}
        </div>
        {children}
      </Container>
    </section>
  );
}
