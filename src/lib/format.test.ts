import { formatPeriod } from "./format";

describe("formatPeriod", () => {
  it("종료일이 있으면 시작 – 종료", () => {
    expect(formatPeriod({ start: "2019.10", end: "2024.11" })).toBe("2019.10 – 2024.11");
  });

  it("종료일이 null이면 재직 중", () => {
    expect(formatPeriod({ start: "2025.09", end: null })).toBe("2025.09 – 재직 중");
  });

  it("문자열은 그대로 반환", () => {
    expect(formatPeriod("공개 서비스 운영 중")).toBe("공개 서비스 운영 중");
  });
});
