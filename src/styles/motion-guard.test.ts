import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

function collect(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? collect(path) : [path];
  });
}

const scssFiles = collect(resolve(process.cwd(), "src")).filter((file) => file.endsWith(".scss"));

describe("스크롤 연동 CSS 모션 안전장치", () => {
  const usesTimeline = scssFiles.filter((file) => /animation-timeline\s*:/.test(readFileSync(file, "utf8")));

  it("animation-timeline을 쓰는 SCSS 파일이 하나 이상 있다(검사 대상이 비어 있지 않음)", () => {
    expect(usesTimeline.length).toBeGreaterThan(0);
  });

  it.each(usesTimeline.map((file) => [file.replace(process.cwd(), ""), file]))(
    "%s: 지원 감지와 움직임 줄이기 조건 안에서만 선언한다",
    (_relative, file) => {
      const source = readFileSync(file, "utf8");
      expect(source).toMatch(/@supports\s*\(animation-timeline/);
      expect(source).toMatch(/prefers-reduced-motion:\s*no-preference/);
    }
  );

  it("모듈 SCSS가 요소를 opacity: 0으로 고정하지 않는다 (애니메이션 키프레임 밖)", () => {
    scssFiles.forEach((file) => {
      const source = readFileSync(file, "utf8");
      const outsideKeyframes = source.replace(/@keyframes[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, "");
      expect(outsideKeyframes, file).not.toMatch(/opacity\s*:\s*0\s*;/);
    });
  });
});
