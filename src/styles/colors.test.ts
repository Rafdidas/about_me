import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { contrastRatio, parseScssColorMap } from "@/lib/contrast";

const source = readFileSync(resolve(process.cwd(), "src/styles/_colors.scss"), "utf8");
const MIN = 4.5;


const BANDS = [
  "band-light-canvas",
  "band-light-white",
  "band-light-ink",
  "band-dark-canvas",
  "band-dark-white",
  "band-dark-ink"
];

describe.each(BANDS)("%s 대비", (mapName) => {
  const colors = parseScssColorMap(source, mapName);

  it.each(["fg", "sub", "mute", "link"])("%s ≥ 4.5:1 (띠 배경 위, 타일 위)", (key) => {
    expect(colors[key], `${key} 누락`).toBeDefined();
    expect(contrastRatio(colors[key], colors.bg)).toBeGreaterThanOrEqual(MIN);
    expect(contrastRatio(colors[key], colors.tile)).toBeGreaterThanOrEqual(MIN);
  });

  it("포커스 링은 띠 배경 대비 3:1 이상", () => {
    expect(contrastRatio(colors.focus, colors.bg)).toBeGreaterThanOrEqual(3);
  });
});

describe("주 버튼 대비", () => {
  const colors = parseScssColorMap(source, "primary");

  it.each(["primary", "primary-hover", "primary-pressed"])("흰 글자 / %s ≥ 4.5:1", (key) => {
    expect(colors[key], `${key} 누락`).toBeDefined();
    expect(contrastRatio(colors["on-primary"], colors[key])).toBeGreaterThanOrEqual(MIN);
  });
});
