import type { NavItem } from "@/data/types";
import { getNavItem, navHref } from "./nav";

describe("navHref", () => {
  it("메인 페이지(spy)에서는 현재 페이지 앵커", () => {
    expect(navHref("career", true)).toBe("#career");
  });

  it("상세·404에서는 메인으로 가는 앵커", () => {
    expect(navHref("career", false)).toBe("/#career");
  });
});

describe("getNavItem", () => {
  const items: NavItem[] = [
    { id: "about", label: "소개" },
    { id: "career", label: "경력" }
  ];

  it("id로 항목을 찾는다", () => {
    expect(getNavItem(items, "career")).toEqual({ id: "career", label: "경력" });
  });

  it("없는 id는 에러(순서 의존 구조분해로 잘못된 섹션이 붙는 일을 막는다)", () => {
    expect(() => getNavItem(items, "nope")).toThrow(/nope/);
  });
});
