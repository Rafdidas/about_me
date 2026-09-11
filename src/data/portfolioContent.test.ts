import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { careerItems, portfolioLinks } from "./career";
import { caseStudies, caseStudiesDisclosure } from "./caseStudies";
import { adminTableBridge, designSystemOverview } from "./designTokens";
import { homeProofPanel } from "./home";
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

  it("describes Monibuk as an operating AI-assisted project", () => {
    const monibuk = projects.find((project) => project.slug === "money-book");

    expect(monibuk?.displayName).toBe("모니북");
    expect(monibuk?.status).toBe("운영 중");
    expect(monibuk?.developmentMethod).toBe("AI 활용 개발");
    expect(monibuk?.demoUrl).toBe("https://monibuk.com");
  });

  it("keeps public examples distinct from internal work", () => {
    expect(designSystemOverview.description).toContain("포트폴리오용 예시");
    expect(adminTableBridge.description).toContain("가상 데이터");
    expect(caseStudiesDisclosure).toContain("내부 자료는 공개하지 않습니다");
  });

  it("does not present unverified scale or security claims", () => {
    const publishedContent = JSON.stringify({ projects, caseStudies });

    expect(publishedContent).not.toMatch(/5종 이상|7개.*기준화|RLS 기반 데이터 보호/);
  });

  it("exposes a working contact email for footer mailto", () => {
    expect(siteMeta.email).toBe("yhu930421@naver.com");
  });

  it("does not link to the previous portfolio from the career page", () => {
    expect(portfolioLinks.map((link) => link.href).join(" ")).not.toContain("about-portfolio-blush");
  });

  it("uses the corrected concrete domain term in case studies", () => {
    expect(JSON.stringify(caseStudies)).not.toContain("단설관리");
    expect(JSON.stringify(caseStudies)).toContain("타설관리");
  });

  it("links the home proof panel to concrete portfolio sections", () => {
    expect(homeProofPanel.items.map((item) => item.href)).toEqual([
      "/case-studies",
      "/design-system#admin-table",
      "/projects#money-book"
    ]);
  });

  it("connects the design system example to real B2B work context", () => {
    expect(designSystemOverview.description).toContain("포트폴리오용 예시");
    expect(adminTableBridge.description).toContain("업무 화면에서 다룬 UI 흐름");
    expect(adminTableBridge.caseStudyHref).toBe("/case-studies#b2b-admin-ui");
  });

  it("renders the Monibuk anchor and case-study disclosure", () => {
    const projectsPage = readFileSync(resolve("src/app/projects/page.tsx"), "utf8");
    const caseStudiesPage = readFileSync(resolve("src/app/case-studies/page.tsx"), "utf8");

    expect(projectsPage).toContain('id={project.slug === "money-book" ? "money-book" : undefined}');
    expect(caseStudiesPage).toContain("caseStudiesDisclosure");
  });

  it("documents the portfolio scope and verification commands", () => {
    const readme = readFileSync(resolve("README.md"), "utf8");

    expect(readme).toContain("포트폴리오용 예시");
    expect(readme).toContain("실제 업무 화면과 내부 자료는 공개하지 않습니다");
    expect(readme).toContain("npm run build");
  });
});
