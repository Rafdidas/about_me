import type { ReactNode } from "react";
import { Container } from "./Container";

type SectionProps = {
  title: string;
  description?: string;
  id?: string;
  children: ReactNode;
};

export function Section({ title, description, id, children }: SectionProps) {
  return (
    <section className="l-section" id={id}>
      <Container>
        <div className="l-section__header">
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        {children}
      </Container>
    </section>
  );
}
