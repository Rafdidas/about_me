import { contrastRatio, parseScssColorMap } from "./contrast";

describe("contrastRatio", () => {
  it("흑백 대비는 21:1", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 1);
  });

  it("같은 색은 1:1이고 순서와 무관하다", () => {
    expect(contrastRatio("#1D1D1F", "#1D1D1F")).toBeCloseTo(1, 5);
    expect(contrastRatio("#1D1D1F", "#F5F5F7")).toBeCloseTo(contrastRatio("#F5F5F7", "#1D1D1F"), 5);
  });

  it("잘못된 hex는 에러", () => {
    expect(() => contrastRatio("red", "#FFFFFF")).toThrow();
  });
});

describe("parseScssColorMap", () => {
  const source = `
$theme-light: (
  bg: #F5F5F7,
  glass: rgba(245, 245, 247, 0.8),
  text: #1D1D1F,
);
$theme-dark: (
  bg: #000000,
);`;

  it("지정한 맵의 hex 값만 추출한다", () => {
    expect(parseScssColorMap(source, "theme-light")).toEqual({ bg: "#F5F5F7", text: "#1D1D1F" });
    expect(parseScssColorMap(source, "theme-dark")).toEqual({ bg: "#000000" });
  });

  it("맵이 없으면 에러", () => {
    expect(() => parseScssColorMap(source, "theme-sepia")).toThrow();
  });
});
