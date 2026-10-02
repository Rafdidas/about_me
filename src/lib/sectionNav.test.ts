import { pickActiveId } from "./sectionNav";

describe("pickActiveId", () => {
  const ids = ["a", "b", "c"];

  it("페이지 하단이면 마지막 id를 강제한다", () => {
    expect(pickActiveId({ ids, visibleIds: ["a"], atBottom: true, current: "a" })).toBe("c");
  });

  it("보이는 id 중 문서 순서상 가장 앞선 것을 고른다", () => {
    expect(pickActiveId({ ids, visibleIds: ["c", "b"], atBottom: false, current: "a" })).toBe("b");
  });

  it("보이는 id가 없으면 현재 값을 유지한다", () => {
    expect(pickActiveId({ ids, visibleIds: [], atBottom: false, current: "b" })).toBe("b");
  });

  it("현재 값도 없으면 첫 id로 되돌린다", () => {
    expect(pickActiveId({ ids, visibleIds: [], atBottom: false, current: undefined })).toBe("a");
  });

  it("ids가 비어 있으면 undefined", () => {
    expect(pickActiveId({ ids: [], visibleIds: [], atBottom: true, current: undefined })).toBeUndefined();
  });
});
