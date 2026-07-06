import { describe, expect, it } from "vitest";
import { careerItems } from "./career";
import { caseStudies } from "./caseStudies";
import { projects } from "./projects";
import { siteMeta } from "./site";

describe("portfolio content requirements", () => {
  it("includes deploy demo links for projects that have public demos", () => {
    expect(projects.find((project) => project.slug === "poke-dex-next")?.demoUrl).toBe(
      "https://poke-dex-next.vercel.app"
    );
    expect(projects.find((project) => project.slug === "tmdb-ai-reco")?.demoUrl).toBe(
      "https://tmdb-ai-reco.vercel.app"
    );
  });

  it("uses a title with the candidate name for browser and OG metadata", () => {
    expect(siteMeta.title).toBe("박현규 | UI Publisher Portfolio");
  });

  it("connects career timeline items to relevant case studies", () => {
    const links = careerItems.flatMap((item) => item.highlights.map((highlight) => highlight.caseStudyHref));

    expect(links).toContain("/case-studies#weseed-design-system");
    expect(links).toContain("/case-studies#b2b-admin-ui");
  });

  it("keeps career roles focused on work instead of rank", () => {
    expect(careerItems.map((item) => item.role).join(" ")).not.toContain("주임");
  });

  it("adds at least one measurable scale cue to each case study result", () => {
    const resultSections = caseStudies.map((study) => study.sections.find((section) => section.label === "Result")?.body);

    expect(resultSections).toHaveLength(2);
    resultSections.forEach((body) => {
      expect(body).toMatch(/\d/);
    });
  });
});
