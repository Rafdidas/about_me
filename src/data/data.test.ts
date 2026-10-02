import { career } from "./career";
import { education } from "./education";
import { profile } from "./profile";
import { personalProjectsIntro, projects } from "./projects";
import { sectionNav, siteMeta, uiCopy } from "./site";
import { skills } from "./skills";

const allData = { profile, career, projects, personalProjectsIntro, skills, education, sectionNav, siteMeta, uiCopy };
const PERIOD = /^\d{4}\.\d{2}$/;

describe("데이터 무결성", () => {
  it("프로젝트 slug는 중복되지 않고 URL에 안전하다", () => {
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    slugs.forEach((slug) => expect(slug).toMatch(/^[a-z0-9-]+$/));
  });

  it("설계 문서의 slug 6개가 순서대로 있다", () => {
    expect(projects.map((project) => project.slug)).toEqual([
      "weseedcon",
      "weseed-crm-design-system",
      "construction-logistics-systems",
      "ecommerce",
      "monibuk",
      "fe-daily-study"
    ]);
  });

  it("모든 프로젝트는 제목·요약·기술·섹션을 갖고, 섹션은 본문을 갖는다", () => {
    projects.forEach((project) => {
      expect(project.title.trim()).not.toBe("");
      expect(project.summary.trim()).not.toBe("");
      expect(project.stack.length).toBeGreaterThan(0);
      expect(project.sections.length).toBeGreaterThan(0);
      project.sections.forEach((section) => {
        const bodyCount = (section.paragraphs?.length ?? 0) + (section.items?.length ?? 0);
        expect(bodyCount, `${project.slug} / ${section.title}`).toBeGreaterThan(0);
      });
    });
  });

  it("기간 형식은 YYYY.MM", () => {
    const periods = [...career.map((entry) => entry.period), ...projects.map((project) => project.period)];
    periods.forEach((period) => {
      if (typeof period === "string") return;
      expect(period.start).toMatch(PERIOD);
      if (period.end !== null) expect(period.end).toMatch(PERIOD);
    });
  });

  it("외부 링크는 모두 https", () => {
    const hrefs = [profile.github, ...projects.flatMap((project) => project.links.map((link) => link.href))];
    hrefs.forEach((href) => expect(href).toMatch(/^https:\/\//));
  });

  it("이미지가 있으면 alt가 비어 있지 않다", () => {
    projects.forEach((project) =>
      project.images?.forEach((image) => expect(image.alt.trim(), project.slug).not.toBe(""))
    );
  });

  it("전화번호·거주지를 포함하지 않는다", () => {
    const text = JSON.stringify(allData);
    expect(text).not.toMatch(/01[016789][-.\s]?\d{3,4}[-.\s]?\d{4}/);
    expect(text).not.toMatch(/영등포/);
  });

  it("섹션 내비 id는 중복되지 않는다", () => {
    const ids = sectionNav.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
