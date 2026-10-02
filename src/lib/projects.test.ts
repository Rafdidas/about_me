import { projects } from "@/data/projects";
import {
  EVIDENCE_SECTION_ID,
  getAdjacentProjects,
  getEvidenceLinks,
  getPrimaryLinks,
  getProjectBySlug,
  getProjectToc,
  sectionId
} from "./projects";

describe("projects 조회", () => {
  it("slug로 프로젝트를 찾는다", () => {
    expect(getProjectBySlug("monibuk")?.title).toBe("머니북가계부");
    expect(getProjectBySlug("nope")).toBeUndefined();
  });

  it("배열 순서 기준으로 이전/다음을 반환한다", () => {
    expect(getAdjacentProjects(projects[0].slug)).toEqual({ prev: undefined, next: projects[1] });
    const last = projects[projects.length - 1];
    expect(getAdjacentProjects(last.slug)).toEqual({ prev: projects[projects.length - 2], next: undefined });
  });

  it("없는 slug의 이전/다음은 빈 객체", () => {
    expect(getAdjacentProjects("nope")).toEqual({});
  });

  it("확인 자료가 없는 프로젝트는 빈 배열", () => {
    expect(getEvidenceLinks(getProjectBySlug("weseedcon")!)).toEqual([]);
  });

  it("sectionId는 1부터 시작한다", () => {
    expect(sectionId(0)).toBe("section-1");
  });

  it("목차는 섹션 + 확인 자료(있을 때만)", () => {
    const monibuk = getProjectBySlug("monibuk")!;
    expect(getProjectToc(monibuk)).toEqual([
      { id: "section-1", label: "개요" },
      { id: "section-2", label: "구현 내용" },
      { id: EVIDENCE_SECTION_ID, label: "확인 자료" }
    ]);
    const crm = getProjectBySlug("weseed-crm-design-system")!;
    expect(getProjectToc(crm).map((item) => item.id)).not.toContain(EVIDENCE_SECTION_ID);
  });

  it("링크를 종류별로 나눈다", () => {
    const monibuk = getProjectBySlug("monibuk")!;
    expect(getPrimaryLinks(monibuk).map((link) => link.kind)).toEqual(["service", "github"]);
    expect(getEvidenceLinks(monibuk)).toHaveLength(1);
  });
});
