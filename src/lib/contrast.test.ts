import { contrastRatio, parseScssColorMap } from "./contrast";

describe("contrastRatio", () => {
  it("흑백 대비는 21:1", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 1);
  });

  it("같은 색은 1:1이고 순서와 무관하다", () => {
    expect(contrastRatio("#433633", "#433633")).toBeCloseTo(1, 5);
    expect(contrastRatio("#433633", "#F7F0F5")).toBeCloseTo(contrastRatio("#F7F0F5", "#433633"), 5);
  });

  it("잘못된 hex는 에러", () => {
    expect(() => contrastRatio("red", "#FFFFFF")).toThrow();
  });
});

describe("parseScssColorMap", () => {
  const source = `
$theme-light: (
  bg: #F7F0F5,
  glass: rgba(247, 240, 245, 0.55),
  text: #433633,
);
$theme-dark: (
  bg: #1C1719,
);`;

  it("지정한 맵의 hex 값만 추출한다", () => {
    expect(parseScssColorMap(source, "theme-light")).toEqual({ bg: "#F7F0F5", text: "#433633" });
    expect(parseScssColorMap(source, "theme-dark")).toEqual({ bg: "#1C1719" });
  });

  it("맵이 없으면 에러", () => {
    expect(() => parseScssColorMap(source, "theme-sepia")).toThrow();
  });
});
