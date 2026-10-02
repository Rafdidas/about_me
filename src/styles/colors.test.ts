import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { contrastRatio, parseScssColorMap } from "@/lib/contrast";

const source = readFileSync(resolve(process.cwd(), "src/styles/_colors.scss"), "utf8");
const MIN = 4.5;

describe.each(["theme-light", "theme-dark"])("%s 텍스트 대비", (mapName) => {
  const colors = parseScssColorMap(source, mapName);

  it.each([
    ["text", "bg"],
    ["text", "surface"],
    ["text-sub", "bg"],
    ["text-sub", "surface"],
    ["accent", "bg"],
    ["accent", "surface"],
    ["on-accent", "accent"]
  ])("%s on %s ≥ 4.5:1", (fg, bg) => {
    expect(colors[fg], `${fg} 누락`).toBeDefined();
    expect(colors[bg], `${bg} 누락`).toBeDefined();
    expect(contrastRatio(colors[fg], colors[bg])).toBeGreaterThanOrEqual(MIN);
  });
});
