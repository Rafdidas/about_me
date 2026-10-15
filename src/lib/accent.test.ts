import { splitAccent } from "./accent";

describe("splitAccent", () => {
  it("강조 구절을 기준으로 앞·강조·뒤로 나눈다", () => {
    expect(splitAccent("이커머스에서 B2B 업무 시스템까지", "B2B 업무 시스템")).toEqual({
      before: "이커머스에서 ",
      accent: "B2B 업무 시스템",
      after: "까지"
    });
  });

  it("첫 번째로 나오는 위치만 강조한다", () => {
    expect(splitAccent("기술과 기술", "기술")).toEqual({ before: "", accent: "기술", after: "과 기술" });
  });

  it("강조 구절이 제목에 없으면 null", () => {
    expect(splitAccent("학력과 자격", "경력")).toBeNull();
  });

  it("강조 구절이 없거나 빈 문자열이면 null", () => {
    expect(splitAccent("학력과 자격")).toBeNull();
    expect(splitAccent("학력과 자격", "")).toBeNull();
  });

  it("제목 전체가 강조 구절이어도 동작한다", () => {
    expect(splitAccent("기술", "기술")).toEqual({ before: "", accent: "기술", after: "" });
  });
});
