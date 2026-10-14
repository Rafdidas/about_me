# 포트폴리오 애플 스타일 리디자인 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 왼쪽 사이드바 구조의 현재 사이트를 애플 스타일(상단 유리 내비, 전체 폭 명암 교차 띠, 큰 타이포, 파란 알약 버튼, 절제된 모션)로 전면 교체한다. 콘텐츠와 데이터는 그대로 둔다.

**Architecture:** 색은 "띠 톤"(`canvas`/`white`/`ink`) 단위 CSS 변수(`--band-*`)로 정의하고 `Band`가 `data-tone`으로 톤을 바꿔 준다. 모든 섹션은 `Band` + `Tile`로 조립하고, 스크롤 연동 모션은 CSS(서버 컴포넌트 유지), 내비 알약·모바일 메뉴·타일 기울기만 Motion(`LazyMotion` + `domAnimation` + `m`)으로 구현한다. 새 토큰은 옛 토큰을 지우지 않고 먼저 추가해 매 커밋 빌드가 통과하게 하고, 마지막 정리 작업에서 `LEGACY(Task 9)` 표시 블록을 일괄 삭제한다.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, SCSS Modules, Pretendard(`next/font/local`), `motion`(motion/react, motion/react-m), Vitest

**Spec:** `docs/superpowers/specs/2026-10-14-apple-style-redesign-design.md` (이 계획의 기준. 아래 "스펙 대비 의도된 차이" 참조)

**모든 명령은 저장소 루트 `C:\dev\about-me`에서, 브랜치 `redesign/apple-style`에서 실행한다.** 셸은 Bash(POSIX 문법).

## Global Constraints

- 작업 브랜치: `redesign/apple-style`. `main` 직접 커밋 금지. **push·병합은 사용자가 말하기 전에는 하지 않는다.**
- 커밋: 한 커밋 = 한 가지 변경, 한국어 메시지 허용, 타입 접두어 `feat`/`fix`/`content`/`chore`/`style`/`docs`/`test`. **Co-Authored-By 등 트레일러·서명 금지**(저장소 `CLAUDE.md` 규칙이 기본 첨부 지침보다 우선).
- 매 Task 끝에서 `npm run lint`, `npm test`, `npm run build`가 모두 통과해야 한다.
- 커밋에 포함하지 않는 것: `portfolio-content-design.md`(untracked), `.claude/`, `*.tsbuildinfo`, `.superpowers/`.
- 모듈 SCSS에서 색상 값(hex/rgb), `font-size`, 간격 숫자(px/rem)를 직접 쓰지 않는다. `var(--…)` 토큰과 믹스인만 쓴다. 예외: `0`, `1px` 테두리, `2px` 포커스 링·표시, 비율·퍼센트, `aspect-ratio`, `scale()` 같은 무차원 값.
- 타이포는 `@include text(hero|section|tile|lead|body|body-sm|caption|overline|button|button-sm)`로만 적용한다. 반응형 글자 크기는 토큰 값 재정의로 처리하고 컴포넌트에 글자 크기용 media query를 두지 않는다.
- 모듈 SCSS 첫 줄은 `@use "../../styles/mixins" as *;`(믹스인을 쓰지 않으면 생략 가능). `src/app/` 아래는 깊이에 맞춰 상대 경로 조정.
- 글꼴은 Pretendard 단일(SF Pro·Tailwind 금지). 콘텐츠·UI 문구는 `src/data/`에만 둔다. 이력서 콘텐츠는 바꾸지 않는다(UI 문구 추가만 허용).
- client component는 `ThemeToggle`, `SiteNav`, `MobileMenu`, `TiltTile` 4개만. 나머지는 Server Component.
- Motion: `LazyMotion features={domAnimation}`과 `import * as m from "motion/react-m"`만 사용. `layoutId`·드래그 금지(`domMax` 필요). Motion을 쓰는 client component는 각자 `LazyMotion`과 `MotionConfig reducedMotion="user"`로 자기 출력을 감싼다.
- 모션: 시간 0.2~0.8초(히어로 진입만 최대 0.8초), `transform`·`opacity` 위주, 스크롤 가로채기·자동 재생·무한 반복 금지. CSS 모션은 `@media (prefers-reduced-motion: no-preference)`와(스크롤 연동은) `@supports (animation-timeline: view())` 안에서만 선언. 모션이 실패해도 내용은 항상 보여야 한다.
- 추가되는 클라이언트 JavaScript: gzip 기준 약 20KB 이하(최종 Task에서 실측).
- 글자 대비 4.5:1 이상(라이트·다크 × 톤 3종 × 글자 4종 × `--band-bg`·`--band-tile`). `--band-mute`는 캡션 전용(14px 미만 보조 문구).
- 연락처는 이메일·GitHub만 노출. 최소 지원 폭 360px, 브레이크포인트 `md` 768px / `lg` 1024px(모바일 우선).
- 색 토큰 값(라이트): canvas `bg #F5F5F7 / fg #1D1D1F / sub #515154 / mute #6E6E73 / link #0066CC / tile #FFFFFF / focus #0071E3 / border rgba(0,0,0,.08)`, white `bg #FFFFFF / tile #F5F5F7`(나머지 canvas와 동일), ink `bg #000000 / fg #F5F5F7 / sub #A1A1A6 / mute #86868B / link #2997FF / tile #1D1D1F / focus #2997FF / border rgba(255,255,255,.12)`.
- 색 토큰 값(다크): canvas·ink `bg #000000`, white `bg #101012`, 공통 `fg #F5F5F7 / sub #A1A1A6 / mute #86868B / link #2997FF / tile #1D1D1F / focus #2997FF / border rgba(255,255,255,.12)`.
- 공통 색: `primary #0071E3`, `primary-hover #0076DF`, `primary-pressed #006EDB`, `on-primary #FFFFFF`. 유리: 라이트 `rgba(245,245,247,.8)` / 다크 `rgba(29,29,31,.72)`, blur 20px saturate 180%.
- 타이포(데스크톱 / 모바일): `hero` 56px·60px / 40px·44px 600 -0.005em, `section` 40·44 / 28·32 600 0, `tile` 28·32 / 22·28 600 +0.007em, `lead` 21·30 / 17·26 400 -0.01em, `body` 17·28 400 -0.022em, `body-sm` 14·20 400 -0.016em, `caption` 12·17 400 -0.01em, `overline` 12·16 600 +0.06em 대문자.
- 모양: 타일 반경 18px, 컨트롤 8px, 알약 980px. 띠 위아래 여백 96px(모바일 64px), 콘텐츠 최대 폭 980px, 읽기 열 680px, 타일 간격 20px. 그림자 없음.

## 스펙 대비 의도된 차이 (구현 시 따르고, Task 10에서 스펙 문서에 반영한다)

1. 히어로 진입은 "줄 단위"가 아니라 **블록 단위**(오버라인 → 제목 → 문장 → 버튼)로 순차 등장한다. 한 문장 제목의 실제 줄바꿈 위치를 CSS로 알 수 없어서다.
2. 타이포 역할에 `button`(17px/22px)과 `button-sm`(14px/18px)을 추가한다(알약 버튼 높이 44px·36px을 맞추기 위함).
3. 띠 타일 배경 변수 이름은 `--tile-bg`가 아니라 **`--band-tile`**이다.
4. 프로젝트 상세의 로컬 내비(`LocalNav`)는 서버 컴포넌트라 **현재 위치 강조가 없는 점프 링크**다(client component 4개 한도 유지).
5. 내비 알약은 `x` 이동 + `width` 변경으로 구동한다(알약 크기가 항목마다 달라서 `width`는 transform 규칙의 예외).
6. 타일 hover 확대는 `transform`이 아니라 개별 속성 `scale`을 쓴다(스크롤 등장의 `transform` 애니메이션과 충돌하지 않게).

## Review Focus

스펙이 암시하지만 개별 Task 테스트가 놓치기 쉬운 입력·조건과, 그것을 고정하는 위치:

1. **0 크기·범위 밖·NaN 포인터 입력으로 타일 기울기 계산이 깨지거나 ±4°를 넘는 경우** → Task 8 `tilt.test.ts`
2. **프로젝트 상세·404에서 내비 링크가 `#about`(현재 페이지 앵커)로 가서 아무 일도 안 일어나는 경우**(메인으로 가야 함) → Task 4 `nav.test.ts`
3. **다크 테마 `white` 띠(`#101012`) 등 모든 톤×테마 조합의 글자 대비 미달** → Task 2 `colors.test.ts`
4. **스크롤 연동 CSS 미지원·움직임 줄이기에서 내용이 투명하게 남는 경우** → Task 7 `motion-guard.test.ts`
5. **앵커 이동 시 제목이 고정 내비·로컬 내비에 가려지는 경우, 360px에서 긴 한글 제목이 타일 밖으로 넘치는 경우, 모바일 메뉴의 Escape·포커스 복귀** → Task 5·6·8 브라우저 검증 단계(수치로 확인)

## 파일 구조

```
package.json                          motion 추가
src/
  app/
    layout.tsx                        Backdrop 제거
    page.tsx                          SiteShell + 새 섹션
    not-found.tsx / .module.scss      새 구조
    icon.tsx · opengraph-image.tsx    새 팔레트
    projects/[slug]/page.tsx          새 구조
  styles/
    _colors.scss                      띠 톤·프라이머리·유리 맵 + 방출 믹스인 (LEGACY 맵 임시 유지)
    _typography.scss                  새 타이포 토큰 (LEGACY 별칭 임시 유지)
    _mixins.scss                      glass-bar, focus-ring 갱신, reveal 범위
    globals.scss                      토큰 방출, 리셋, 본문 색
    colors.test.ts                    톤별 대비 테스트
    motion-guard.test.ts              (Task 7) 스크롤 연동 CSS 안전장치 검사
  lib/
    nav.ts(.test.ts)                  navHref, getNavItem
    useActiveSection.ts               현재 섹션 감지 훅
    tilt.ts(.test.ts)                 기울기 각도 계산
  data/site.ts                        UI 문구 추가
  components/
    Band/ SectionTitle/ Tile/ PillButton/ ProjectTile/ SiteFooter/
    Hero/ CompetenciesBand/ CareerBand/ ProjectsBands/ SkillsBand/ EducationBand/
    SiteShell/ SiteNav/ MobileMenu/ LocalNav/ TiltTile/
    (재스타일) Tag/ TextLink/ ThemeToggle/ SkipLink/ ContactLinks/
    (재작성) ProjectHeader/ ProjectGallery/ ProjectBody/ ProjectPager/
    (삭제, Task 9) Sidebar/ MobileHeader/ PageShell/ Backdrop/ ButtonLink/ SectionNav/ SectionHeading/
                  AboutSection/ CareerSection/ ProjectsSection/ SkillsSection/ EducationSection/
```

---

### Task 1: motion 의존성 추가와 번들 기준선

**Files:**
- Modify: `package.json`, `package-lock.json`

**Interfaces:**
- Produces: `motion` 패키지(`motion/react`, `motion/react-m`)와 기준선 파일 `.git/sdd/js-baseline.txt`(추적되지 않는 로컬 파일, 최종 Task에서 비교에 사용)

- [ ] **Step 1: 브랜치 확인**

Run: `git branch --show-current`
Expected: `redesign/apple-style`

- [ ] **Step 2: 기준선 측정 (motion 추가 전)**

```bash
npm run build
mkdir -p "$(git rev-parse --git-path sdd)"
node -e '
const fs=require("fs"),zlib=require("zlib"),path=require("path");
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const files=walk(".next/static").filter(f=>f.endsWith(".js"));
const total=files.reduce((s,f)=>s+zlib.gzipSync(fs.readFileSync(f)).length,0);
console.log(total)' | tee "$(git rev-parse --git-path sdd)/js-baseline.txt"
```
Expected: 빌드 성공, 숫자 하나(바이트) 출력과 기준선 파일 생성

- [ ] **Step 3: 의존성 설치**

```bash
npm install motion
```

- [ ] **Step 4: 내보내기 경로 확인**

```bash
node -e "const p=require('./node_modules/motion/package.json'); console.log(p.version, Object.keys(p.exports).filter(k=>k.startsWith('./react')).join(' '))"
```
Expected: 버전과 함께 `./react`, `./react-m`이 목록에 포함 (둘 중 하나라도 없으면 BLOCKED로 보고하고 중단)

- [ ] **Step 5: 전체 검증**

Run: `npm run lint && npm test && npm run build`
Expected: 모두 통과 (테스트 개수는 기존과 동일)

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: 내비·모바일 메뉴·타일 인터랙션용 motion 의존성 추가"
```

---

### Task 2: 새 디자인 토큰(색·타이포·모양)과 대비 테스트

**Files:**
- Modify: `src/styles/_colors.scss`, `src/styles/_typography.scss`, `src/styles/_mixins.scss`, `src/styles/globals.scss`, `src/styles/colors.test.ts`

**Interfaces:**
- Consumes: `parseScssColorMap(source, mapName)`, `contrastRatio(fg, bg)` (`src/lib/contrast.ts`, 기존)
- Produces:
  - SCSS 맵(`_colors.scss`): `$band-light-canvas`, `$band-light-white`, `$band-light-ink`, `$band-dark-canvas`, `$band-dark-white`, `$band-dark-ink` (키: `bg, fg, sub, mute, link, tile, focus, border`), `$primary`, `$glass-light`, `$glass-dark`
  - 믹스인: `colors.emit-band($map)`(`--band-<key>`), `colors.emit-solid($map, $prefix)`(`--<prefix><key>`), `glass-bar`, `focus-ring`(이제 `--band-focus` 사용), `text($role)`
  - CSS 변수: `--band-{bg,fg,sub,mute,link,tile,focus,border}`, `--color-{primary,primary-hover,primary-pressed,on-primary}`, `--glass-{bg,border}`, `--text-{hero,section,tile,lead,body,body-sm,caption,overline,button,button-sm}-{size,weight,line-height,letter-spacing}`, `--radius-{control,tile,pill}`, `--band-pad-y`, `--band-max`, `--reading-max`, `--tile-gap`, `--nav-height`, `--local-nav-height`, `--control-height-{regular,compact}`, `--pill-padding-{regular,compact}`, `--duration-{fast,base,slow}`, `--ease-{out,spring}`, `--space-{20,24}`
  - `[data-tone="canvas|white|ink"]` 요소가 톤 변수를 덮어쓴다. `:root`는 canvas 톤이 기본값.

- [ ] **Step 1: 실패하는 테스트 — `src/styles/colors.test.ts` 전체 교체**

```ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { contrastRatio, parseScssColorMap } from "@/lib/contrast";

const source = readFileSync(resolve(process.cwd(), "src/styles/_colors.scss"), "utf8");
const MIN = 4.5;

// LEGACY(Task 9) 시작
describe.each(["theme-light", "theme-dark"])("%s 텍스트 대비 (옛 토큰)", (mapName) => {
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
// LEGACY(Task 9) 끝

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
```

- [ ] **Step 2: 실패 확인**

Run: `npx vitest run src/styles/colors.test.ts`
Expected: FAIL — `SCSS map not found: $band-light-canvas`

- [ ] **Step 3: `src/styles/_colors.scss` 전체 교체**

```scss
// 색상 토큰의 원본. 값 변경 시 colors.test.ts가 대비(4.5:1)를 검증한다.
// 띠 톤 맵의 키는 CSS 변수 --band-<key>로 출력된다.

// LEGACY(Task 9) 시작
$theme-light: (
  bg: #F7F0F5,
  surface: #FFFFFF,
  glass: rgba(247, 240, 245, 0.55),
  glass-border: rgba(255, 255, 255, 0.6),
  border: rgba(67, 54, 51, 0.1),
  text: #433633,
  text-sub: #5C5552,
  decor: #8F857D,
  tint: #DECBB7,
  tint-2: #E9D8E4,
  accent: #A0522D,
  on-accent: #F7F0F5,
);

$theme-dark: (
  bg: #1C1719,
  surface: #262023,
  glass: rgba(75, 59, 71, 0.35),
  glass-border: rgba(224, 216, 222, 0.12),
  border: rgba(224, 216, 222, 0.1),
  text: #E0D8DE,
  text-sub: #9C9990,
  decor: #6A6262,
  tint: #4B3B47,
  tint-2: rgba(207, 210, 178, 0.12),
  accent: #E0956B,
  on-accent: #1C1719,
);

@mixin emit($theme) {
  @each $name, $value in $theme {
    --color-#{$name}: #{$value};
  }
}
// LEGACY(Task 9) 끝

$band-light-canvas: (
  bg: #F5F5F7,
  fg: #1D1D1F,
  sub: #515154,
  mute: #6E6E73,
  link: #0066CC,
  tile: #FFFFFF,
  focus: #0071E3,
  border: rgba(0, 0, 0, 0.08),
);

$band-light-white: (
  bg: #FFFFFF,
  fg: #1D1D1F,
  sub: #515154,
  mute: #6E6E73,
  link: #0066CC,
  tile: #F5F5F7,
  focus: #0071E3,
  border: rgba(0, 0, 0, 0.08),
);

$band-light-ink: (
  bg: #000000,
  fg: #F5F5F7,
  sub: #A1A1A6,
  mute: #86868B,
  link: #2997FF,
  tile: #1D1D1F,
  focus: #2997FF,
  border: rgba(255, 255, 255, 0.12),
);

$band-dark-canvas: (
  bg: #000000,
  fg: #F5F5F7,
  sub: #A1A1A6,
  mute: #86868B,
  link: #2997FF,
  tile: #1D1D1F,
  focus: #2997FF,
  border: rgba(255, 255, 255, 0.12),
);

$band-dark-white: (
  bg: #101012,
  fg: #F5F5F7,
  sub: #A1A1A6,
  mute: #86868B,
  link: #2997FF,
  tile: #1D1D1F,
  focus: #2997FF,
  border: rgba(255, 255, 255, 0.12),
);

$band-dark-ink: (
  bg: #000000,
  fg: #F5F5F7,
  sub: #A1A1A6,
  mute: #86868B,
  link: #2997FF,
  tile: #1D1D1F,
  focus: #2997FF,
  border: rgba(255, 255, 255, 0.12),
);

$primary: (
  primary: #0071E3,
  primary-hover: #0076DF,
  primary-pressed: #006EDB,
  on-primary: #FFFFFF,
);

$glass-light: (
  glass-bg: rgba(245, 245, 247, 0.8),
  glass-border: rgba(0, 0, 0, 0.08),
);

$glass-dark: (
  glass-bg: rgba(29, 29, 31, 0.72),
  glass-border: rgba(255, 255, 255, 0.12),
);

@mixin emit-band($map) {
  @each $name, $value in $map {
    --band-#{$name}: #{$value};
  }
}

@mixin emit-solid($map, $prefix: "") {
  @each $name, $value in $map {
    --#{$prefix}#{$name}: #{$value};
  }
}
```

- [ ] **Step 4: `src/styles/_typography.scss` 전체 교체**

```scss
// 기본값(primitive) 토큰은 컴포넌트에서 직접 쓰지 않는다.
// 컴포넌트는 의미(semantic) 토큰을 @include text(<role>)로만 사용한다.

@mixin primitive-tokens {
  --font-size-12: 0.75rem;
  --font-size-14: 0.875rem;
  --font-size-17: 1.0625rem;
  --font-size-21: 1.3125rem;
  --font-size-22: 1.375rem;
  --font-size-28: 1.75rem;
  --font-size-40: 2.5rem;
  --font-size-56: 3.5rem;

  --font-weight-regular: 400;
  --font-weight-semibold: 600;

  // LEGACY(Task 9) 시작
  --font-weight-bold: 700;
  // LEGACY(Task 9) 끝
}

// 모바일 기준값. md 이상에서 hero·section·tile·lead만 커진다 (semantic-tokens-md).
@mixin semantic-tokens {
  --text-hero-size: var(--font-size-40);
  --text-hero-weight: var(--font-weight-semibold);
  --text-hero-line-height: 2.75rem;
  --text-hero-letter-spacing: -0.005em;

  --text-section-size: var(--font-size-28);
  --text-section-weight: var(--font-weight-semibold);
  --text-section-line-height: 2rem;
  --text-section-letter-spacing: 0;

  --text-tile-size: var(--font-size-22);
  --text-tile-weight: var(--font-weight-semibold);
  --text-tile-line-height: 1.75rem;
  --text-tile-letter-spacing: 0.007em;

  --text-lead-size: var(--font-size-17);
  --text-lead-weight: var(--font-weight-regular);
  --text-lead-line-height: 1.625rem;
  --text-lead-letter-spacing: -0.01em;

  --text-body-size: var(--font-size-17);
  --text-body-weight: var(--font-weight-regular);
  --text-body-line-height: 1.75rem;
  --text-body-letter-spacing: -0.022em;

  --text-body-sm-size: var(--font-size-14);
  --text-body-sm-weight: var(--font-weight-regular);
  --text-body-sm-line-height: 1.25rem;
  --text-body-sm-letter-spacing: -0.016em;

  --text-caption-size: var(--font-size-12);
  --text-caption-weight: var(--font-weight-regular);
  --text-caption-line-height: 1.0625rem;
  --text-caption-letter-spacing: -0.01em;

  --text-overline-size: var(--font-size-12);
  --text-overline-weight: var(--font-weight-semibold);
  --text-overline-line-height: 1rem;
  --text-overline-letter-spacing: 0.06em;

  --text-button-size: var(--font-size-17);
  --text-button-weight: var(--font-weight-regular);
  --text-button-line-height: 1.375rem;
  --text-button-letter-spacing: -0.022em;

  --text-button-sm-size: var(--font-size-14);
  --text-button-sm-weight: var(--font-weight-regular);
  --text-button-sm-line-height: 1.125rem;
  --text-button-sm-letter-spacing: -0.016em;

  // LEGACY(Task 9) 시작
  --text-display-size: var(--text-hero-size);
  --text-display-weight: var(--text-hero-weight);
  --text-display-line-height: var(--text-hero-line-height);
  --text-display-letter-spacing: var(--text-hero-letter-spacing);

  --text-heading-1-size: var(--text-section-size);
  --text-heading-1-weight: var(--text-section-weight);
  --text-heading-1-line-height: var(--text-section-line-height);
  --text-heading-1-letter-spacing: var(--text-section-letter-spacing);

  --text-heading-2-size: var(--text-tile-size);
  --text-heading-2-weight: var(--text-tile-weight);
  --text-heading-2-line-height: var(--text-tile-line-height);
  --text-heading-2-letter-spacing: var(--text-tile-letter-spacing);
  // LEGACY(Task 9) 끝
}

@mixin semantic-tokens-md {
  --text-hero-size: var(--font-size-56);
  --text-hero-line-height: 3.75rem;

  --text-section-size: var(--font-size-40);
  --text-section-line-height: 2.75rem;

  --text-tile-size: var(--font-size-28);
  --text-tile-line-height: 2rem;

  --text-lead-size: var(--font-size-21);
  --text-lead-line-height: 1.875rem;
}
```

- [ ] **Step 5: `src/styles/_mixins.scss` 전체 교체**

```scss
@use "sass:map";

$breakpoints: (
  md: 768px,
  lg: 1024px,
);

@mixin up($bp) {
  @media (min-width: map.get($breakpoints, $bp)) {
    @content;
  }
}

@mixin down($bp) {
  @media (max-width: (map.get($breakpoints, $bp) - 0.02px)) {
    @content;
  }
}

@mixin text($role) {
  font-size: var(--text-#{$role}-size);
  font-weight: var(--text-#{$role}-weight);
  line-height: var(--text-#{$role}-line-height);
  letter-spacing: var(--text-#{$role}-letter-spacing);
  @if $role == overline {
    text-transform: uppercase;
  }
}

@mixin focus-ring {
  outline: 2px solid var(--band-focus);
  outline-offset: 2px;
}

@mixin visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

// 상단 내비·모바일 메뉴 전용 유리 효과 (사이트에서 유리는 여기만 쓴다).
@mixin glass-bar {
  background: var(--glass-bg);
  border-bottom: 1px solid var(--glass-border);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  backdrop-filter: blur(20px) saturate(180%);

  @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
    background: var(--band-bg);
  }

  @media (prefers-reduced-transparency: reduce) {
    background: var(--band-bg);
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }
}

// LEGACY(Task 9) 시작
@mixin glass {
  background: var(--color-glass);
  border: 1px solid var(--color-glass-border);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  backdrop-filter: blur(14px) saturate(140%);

  @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
    background: var(--color-surface);
  }

  @media (prefers-reduced-transparency: reduce) {
    background: var(--color-surface);
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }
}
// LEGACY(Task 9) 끝

// CSS Modules는 keyframes 이름을 모듈 단위로 바꾸므로,
// reveal을 쓰는 모듈은 파일 최상단에서 reveal-keyframes를 함께 include한다.
@mixin reveal-keyframes {
  @keyframes reveal {
    from {
      opacity: 0;
      transform: translateY(var(--space-4));
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
}

// 스크롤 등장. 미지원 브라우저·움직임 줄이기 설정에서는 처음부터 보인다.
@mixin reveal {
  @media (prefers-reduced-motion: no-preference) {
    @supports (animation-timeline: view()) {
      animation: reveal linear both;
      animation-timeline: view();
      animation-range: entry 0% entry 40%;
    }
  }
}
```

- [ ] **Step 6: `src/styles/globals.scss`의 `:root` 블록과 색 방출 블록 교체**

파일 상단부터 `:root,\n:root[data-theme="dark"] {...}` 블록(색 방출 두 블록) 끝까지를 아래로 교체한다. (`*, *::before…` 리셋 이후는 이 Task에서 건드리지 않는다.)

```scss
@use "colors";
@use "typography";
@use "mixins" as *;

:root {
  @include typography.primitive-tokens;
  @include typography.semantic-tokens;

  @include up(md) {
    @include typography.semantic-tokens-md;
  }

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

  --radius-control: 0.5rem;
  --radius-tile: 1.125rem;
  --radius-pill: 980px;

  --nav-height: 3rem;
  --local-nav-height: 3rem;
  --band-pad-y: var(--space-16);
  --band-max: 61.25rem;
  --reading-max: 42.5rem;
  --tile-gap: var(--space-5);

  --control-height-regular: 2.75rem;
  --control-height-compact: 2.25rem;
  --pill-padding-regular: 0.6875rem 1.3125rem;
  --pill-padding-compact: 0.5rem 0.9375rem;

  --duration-fast: 200ms;
  --duration-base: 400ms;
  --duration-slow: 800ms;
  --ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
  --ease-spring: linear(0, 0.2 6%, 0.62 14%, 0.9 22%, 1.04 30%, 1.07 38%, 1.04 48%, 1.01 62%, 1);

  // LEGACY(Task 9) 시작
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --header-offset: calc(var(--space-16) + var(--space-12));
  --sidebar-width: 18rem;
  --content-max: 45rem;
  // LEGACY(Task 9) 끝

  @include colors.emit-solid(colors.$primary, "color-");

  @include up(md) {
    --band-pad-y: var(--space-24);
  }
}

:root,
:root[data-theme="light"] {
  // LEGACY(Task 9) 시작
  @include colors.emit(colors.$theme-light);
  // LEGACY(Task 9) 끝
  @include colors.emit-band(colors.$band-light-canvas);
  @include colors.emit-solid(colors.$glass-light);
  color-scheme: light;

  [data-tone="canvas"] {
    @include colors.emit-band(colors.$band-light-canvas);
  }

  [data-tone="white"] {
    @include colors.emit-band(colors.$band-light-white);
  }

  [data-tone="ink"] {
    @include colors.emit-band(colors.$band-light-ink);
  }
}

:root[data-theme="dark"] {
  // LEGACY(Task 9) 시작
  @include colors.emit(colors.$theme-dark);
  // LEGACY(Task 9) 끝
  @include colors.emit-band(colors.$band-dark-canvas);
  @include colors.emit-solid(colors.$glass-dark);
  color-scheme: dark;

  [data-tone="canvas"] {
    @include colors.emit-band(colors.$band-dark-canvas);
  }

  [data-tone="white"] {
    @include colors.emit-band(colors.$band-dark-white);
  }

  [data-tone="ink"] {
    @include colors.emit-band(colors.$band-dark-ink);
  }
}
```

- [ ] **Step 7: 대비 테스트 통과 확인**

Run: `npx vitest run src/styles/colors.test.ts`
Expected: PASS. 띠 맵 6개 × (글자 4 + 포커스 1) = 30개 + 주 버튼 3개 + 옛 토큰 14개. 하나라도 실패하면 값을 바꾸지 말고 BLOCKED로 보고한다(스펙의 표가 기준이다).

- [ ] **Step 8: 전체 검증**

Run: `npm run lint && npm test && npm run build`
Expected: 모두 통과. 빌드의 Sass 경고(특히 `mixed-decls`)가 있으면 출력을 보고서에 그대로 남긴다.

- [ ] **Step 9: Commit**

```bash
git add src/styles
git commit -m "style: 애플 스타일 띠 톤 색·타이포·모양 토큰을 옛 토큰과 함께 추가하고 톤별 글자 대비 테스트 작성"
```

---

### Task 3: 기본 컴포넌트(Band·Tile·PillButton·SectionTitle·SiteFooter)와 기존 공용 컴포넌트 재스타일

**Files:**
- Create: `src/components/Band/Band.tsx`, `src/components/Band/Band.module.scss`, `src/components/SectionTitle/SectionTitle.tsx`, `src/components/SectionTitle/SectionTitle.module.scss`, `src/components/Tile/Tile.tsx`, `src/components/Tile/Tile.module.scss`, `src/components/PillButton/PillButton.tsx`, `src/components/PillButton/PillButton.module.scss`, `src/components/SiteFooter/SiteFooter.tsx`, `src/components/SiteFooter/SiteFooter.module.scss`
- Modify: `src/data/site.ts`, `src/components/Tag/Tag.module.scss`, `src/components/TextLink/TextLink.module.scss`, `src/components/ThemeToggle/ThemeToggle.module.scss`, `src/components/SkipLink/SkipLink.module.scss`, `src/components/ContactLinks/ContactLinks.module.scss`

**Interfaces:**
- Consumes: Task 2의 토큰, 기존 `TextLink`, `ContactLinks`, `uiCopy`
- Produces:
  - `<Band tone: "canvas"|"white"|"ink" id?: string labelledBy?: string spacious?: boolean className?: string>children</Band>` — `<section data-tone>` + 안쪽 `.inner`(최대 폭·좌우 여백)
  - `<SectionTitle id: string>children</SectionTitle>` — 가운데 정렬 `h2`
  - `<Tile as?: "div"|"article" media?: ReactNode interactive?: boolean className?: string>children</Tile>`
  - `<PillButton href: string variant?: "primary"|"secondary" size?: "regular"|"compact">children</PillButton>`
  - `<SiteFooter />`
  - `uiCopy.heroProjects`("프로젝트 보기"), `uiCopy.heroContact`("이메일 보내기"), `uiCopy.menuOpen`("메뉴 열기"), `uiCopy.menuClose`("메뉴 닫기")

- [ ] **Step 1: `src/data/site.ts`의 `uiCopy`에 문구 추가** — `skipLink: "본문 바로가기",` 줄 바로 아래에 삽입

```ts
  heroProjects: "프로젝트 보기",
  heroContact: "이메일 보내기",
  menuOpen: "메뉴 열기",
  menuClose: "메뉴 닫기",
```

- [ ] **Step 2: `Band`**

```tsx
// src/components/Band/Band.tsx
import type { ReactNode } from "react";
import styles from "./Band.module.scss";

export type BandTone = "canvas" | "white" | "ink";

type BandProps = {
  tone: BandTone;
  id?: string;
  labelledBy?: string;
  spacious?: boolean;
  className?: string;
  children: ReactNode;
};

export function Band({ tone, id, labelledBy, spacious = false, className, children }: BandProps) {
  const classes = [styles.band, spacious ? styles.spacious : null, className].filter(Boolean).join(" ");

  return (
    <section id={id} data-tone={tone} aria-labelledby={labelledBy} className={classes}>
      <div className={styles.inner}>{children}</div>
    </section>
  );
}
```

```scss
// src/components/Band/Band.module.scss
@use "../../styles/mixins" as *;

.band {
  background: var(--band-bg);
  color: var(--band-fg);
  padding-block: var(--band-pad-y);
}

.spacious {
  padding-block: calc(var(--band-pad-y) + var(--space-12));
}

.inner {
  max-width: var(--band-max);
  margin-inline: auto;
  padding-inline: var(--space-5);

  @include up(md) {
    padding-inline: var(--space-6);
  }
}
```

- [ ] **Step 3: `SectionTitle`**

```tsx
// src/components/SectionTitle/SectionTitle.tsx
import type { ReactNode } from "react";
import styles from "./SectionTitle.module.scss";

export function SectionTitle({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className={styles.title}>
      {children}
    </h2>
  );
}
```

```scss
// src/components/SectionTitle/SectionTitle.module.scss
@use "../../styles/mixins" as *;

.title {
  margin-bottom: var(--space-12);
  text-align: center;
  @include text(section);
}
```

- [ ] **Step 4: `Tile`**

```tsx
// src/components/Tile/Tile.tsx
import type { ReactNode } from "react";
import styles from "./Tile.module.scss";

type TileProps = {
  as?: "div" | "article";
  media?: ReactNode;
  interactive?: boolean;
  className?: string;
  children: ReactNode;
};

export function Tile({ as: Component = "div", media, interactive = false, className, children }: TileProps) {
  const classes = [styles.tile, interactive ? styles.interactive : null, className].filter(Boolean).join(" ");

  return (
    <Component className={classes}>
      {media ? <div className={styles.media}>{media}</div> : null}
      <div className={styles.body}>{children}</div>
    </Component>
  );
}
```

```scss
// src/components/Tile/Tile.module.scss
@use "../../styles/mixins" as *;

.tile {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border: 1px solid var(--band-border);
  border-radius: var(--radius-tile);
  background: var(--band-tile);
  color: var(--band-fg);

  &:has(:focus-visible) {
    @include focus-ring;
  }
}

.interactive {
  cursor: pointer;
}

.media {
  aspect-ratio: 16 / 10;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
  }
}

.body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-6);
}
```

- [ ] **Step 5: `PillButton`**

```tsx
// src/components/PillButton/PillButton.tsx
import Link from "next/link";
import type { ReactNode } from "react";
import { uiCopy } from "@/data/site";
import styles from "./PillButton.module.scss";

type PillButtonProps = {
  href: string;
  variant?: "primary" | "secondary";
  size?: "regular" | "compact";
  children: ReactNode;
};

export function PillButton({ href, variant = "primary", size = "regular", children }: PillButtonProps) {
  const className = `${styles.button} ${styles[variant]} ${styles[size]}`;

  if (href.startsWith("http")) {
    return (
      <a className={className} href={href} target="_blank" rel="noopener noreferrer">
        {children}
        <span className={styles.hidden}>{uiCopy.newWindow}</span>
      </a>
    );
  }

  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}
```

```scss
// src/components/PillButton/PillButton.module.scss
@use "../../styles/mixins" as *;

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: var(--radius-pill);
  transition:
    background-color var(--duration-fast) var(--ease-out),
    border-color var(--duration-fast) var(--ease-out),
    color var(--duration-fast) var(--ease-out);
}

.regular {
  min-height: var(--control-height-regular);
  padding: var(--pill-padding-regular);
  @include text(button);
}

.compact {
  min-height: var(--control-height-compact);
  padding: var(--pill-padding-compact);
  @include text(button-sm);
}

.primary {
  background: var(--color-primary);
  color: var(--color-on-primary);

  &:hover {
    background: var(--color-primary-hover);
  }

  &:active {
    background: var(--color-primary-pressed);
  }
}

.secondary {
  border-color: var(--band-link);
  background: transparent;
  color: var(--band-link);

  &:hover {
    background: color-mix(in srgb, var(--band-link) 10%, transparent);
  }
}

.hidden {
  @include visually-hidden;
}
```

- [ ] **Step 6: `SiteFooter`**

```tsx
// src/components/SiteFooter/SiteFooter.tsx
import { ContactLinks } from "@/components/ContactLinks/ContactLinks";
import { uiCopy } from "@/data/site";
import styles from "./SiteFooter.module.scss";

export function SiteFooter() {
  return (
    <footer data-tone="canvas" className={styles.footer}>
      <div className={styles.inner}>
        <ContactLinks />
        <p className={styles.copy}>{uiCopy.footer}</p>
      </div>
    </footer>
  );
}
```

```scss
// src/components/SiteFooter/SiteFooter.module.scss
@use "../../styles/mixins" as *;

.footer {
  border-top: 1px solid var(--band-border);
  background: var(--band-bg);
  color: var(--band-fg);
}

.inner {
  display: grid;
  gap: var(--space-4);
  max-width: var(--band-max);
  margin-inline: auto;
  padding: var(--space-8) var(--space-5);

  @include up(md) {
    padding-inline: var(--space-6);
  }
}

.copy {
  color: var(--band-mute);
  @include text(caption);
}
```

- [ ] **Step 7: 기존 공용 컴포넌트 SCSS를 새 토큰으로 교체** (TSX는 그대로)

`src/components/Tag/Tag.module.scss`:

```scss
@use "../../styles/mixins" as *;

.list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.tag {
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--band-fg) 8%, transparent);
  color: var(--band-sub);
  @include text(caption);
}
```

`src/components/TextLink/TextLink.module.scss`:

```scss
@use "../../styles/mixins" as *;

.link {
  color: var(--band-link);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.2em;
  transition: text-decoration-thickness var(--duration-fast) var(--ease-out);

  &:hover {
    text-decoration-thickness: 2px;
  }
}

.hidden {
  @include visually-hidden;
}
```

`src/components/ThemeToggle/ThemeToggle.module.scss`:

```scss
@use "../../styles/mixins" as *;

.toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--space-8);
  height: var(--space-8);
  padding: 0;
  border: 1px solid var(--band-border);
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--band-fg);
  cursor: pointer;
  transition:
    border-color var(--duration-fast) var(--ease-out),
    color var(--duration-fast) var(--ease-out);

  &:hover {
    border-color: var(--band-link);
    color: var(--band-link);
  }
}

.icon {
  width: var(--space-4);
  height: var(--space-4);
}

.sun {
  display: none;
}

:global(:root[data-theme="dark"]) {
  .moon {
    display: none;
  }

  .sun {
    display: block;
  }
}
```

`src/components/SkipLink/SkipLink.module.scss`:

```scss
@use "../../styles/mixins" as *;

.skipLink {
  position: fixed;
  top: var(--space-2);
  left: var(--space-2);
  z-index: 100;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-control);
  background: var(--color-primary);
  color: var(--color-on-primary);
  @include text(body-sm);
  transform: translateY(-200%);

  &:focus-visible {
    transform: none;
  }
}
```

`src/components/ContactLinks/ContactLinks.module.scss`:

```scss
@use "../../styles/mixins" as *;

.list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-8);
  @include text(body-sm);
}

.row {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
}

.term {
  color: var(--band-mute);
  @include text(caption);
}
```

- [ ] **Step 8: 전체 검증**

Run: `npm run lint && npm test && npm run build`
Expected: 모두 통과. 이 Task는 옛 화면이 그대로 동작하는 상태를 유지한다(옛 컴포넌트가 새 공용 컴포넌트를 쓰므로 색이 일시적으로 어색해도 정상). 화면 확인은 Task 5에서 한다.

- [ ] **Step 9: Commit**

```bash
git add src/data/site.ts src/components
git commit -m "feat: 띠·타일·알약 버튼·섹션 제목·푸터 컴포넌트를 추가하고 공용 컴포넌트를 새 토큰으로 재스타일"
```

---

### Task 4: 상단 내비(SiteNav)와 모바일 메뉴(MobileMenu)

**Files:**
- Create: `src/lib/nav.ts`, `src/lib/nav.test.ts`, `src/lib/useActiveSection.ts`, `src/components/SiteNav/SiteNav.tsx`, `src/components/SiteNav/SiteNav.module.scss`, `src/components/MobileMenu/MobileMenu.tsx`, `src/components/MobileMenu/MobileMenu.module.scss`

**Interfaces:**
- Consumes: `pickActiveId`(`src/lib/sectionNav.ts`), `NavItem`(`@/data/types`), `ThemeToggle`, `profile.name`, `uiCopy.menuOpen/menuClose`, `glass-bar` 믹스인
- Produces:
  - `navHref(id: string, spy: boolean): string` — `spy`(현재 페이지가 메인)이면 `#id`, 아니면 `/#id`
  - `getNavItem(items: NavItem[], id: string): NavItem` — 없으면 `Error` throw
  - `useActiveSection(ids: string[], enabled: boolean): string | undefined`
  - `<SiteNav items: NavItem[] label: string spy: boolean />` (client)
  - `<MobileMenu items: NavItem[] label: string spy: boolean activeId?: string />` (client)

- [ ] **Step 1: 실패하는 테스트 `src/lib/nav.test.ts`**

```ts
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
```

- [ ] **Step 2: 실패 확인**

Run: `npx vitest run src/lib/nav.test.ts`
Expected: FAIL — `./nav` 모듈 없음

- [ ] **Step 3: `src/lib/nav.ts`**

```ts
import type { NavItem } from "@/data/types";

export function navHref(id: string, spy: boolean): string {
  return spy ? `#${id}` : `/#${id}`;
}

export function getNavItem(items: NavItem[], id: string): NavItem {
  const item = items.find((candidate) => candidate.id === id);
  if (!item) throw new Error(`Unknown nav item: ${id}`);
  return item;
}
```

- [ ] **Step 4: 통과 확인**

Run: `npx vitest run src/lib/nav.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: `src/lib/useActiveSection.ts`** (기존 `SectionNav`의 감지 로직을 훅으로 옮긴 것)

```ts
import { useEffect, useState } from "react";
import { pickActiveId } from "@/lib/sectionNav";

export function useActiveSection(ids: string[], enabled: boolean): string | undefined {
  const [activeId, setActiveId] = useState<string | undefined>(ids[0]);
  const key = ids.join("|");

  useEffect(() => {
    if (!enabled) return;
    const list = key === "" ? [] : key.split("|");
    const targets = list
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (targets.length === 0) return;

    const visible = new Set<string>();
    let frame = 0;

    function update() {
      frame = 0;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      setActiveId((current) => pickActiveId({ ids: list, visibleIds: [...visible], atBottom, current }));
    }

    function schedule() {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        schedule();
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    targets.forEach((target) => observer.observe(target));
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [key, enabled]);

  return enabled ? activeId : undefined;
}
```

- [ ] **Step 6: `SiteNav`**

```tsx
// src/components/SiteNav/SiteNav.tsx
"use client";

import Link from "next/link";
import { MobileMenu } from "@/components/MobileMenu/MobileMenu";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import { profile } from "@/data/profile";
import type { NavItem } from "@/data/types";
import { navHref } from "@/lib/nav";
import { useActiveSection } from "@/lib/useActiveSection";
import styles from "./SiteNav.module.scss";

type SiteNavProps = { items: NavItem[]; label: string; spy: boolean };

export function SiteNav({ items, label, spy }: SiteNavProps) {
  const activeId = useActiveSection(
    items.map((item) => item.id),
    spy
  );

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link className={styles.brand} href="/">
          {profile.name}
        </Link>
        <nav className={styles.nav} aria-label={label}>
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  className={styles.link}
                  href={navHref(item.id, spy)}
                  aria-current={item.id === activeId ? "location" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.actions}>
          <ThemeToggle />
          <MobileMenu items={items} label={label} spy={spy} activeId={activeId} />
        </div>
      </div>
    </header>
  );
}
```

```scss
// src/components/SiteNav/SiteNav.module.scss
@use "../../styles/mixins" as *;

.header {
  position: sticky;
  top: 0;
  z-index: 50;
  color: var(--band-fg);

  // 유리 배경 레이어 (스크롤 연동 모션이 이 레이어의 opacity를 다룬다).
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    @include glass-bar;
  }
}

.bar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  height: var(--nav-height);
  max-width: var(--band-max);
  margin-inline: auto;
  padding-inline: var(--space-5);

  @include up(md) {
    padding-inline: var(--space-6);
  }
}

.brand {
  justify-self: start;
  font-weight: var(--font-weight-semibold);
  @include text(body-sm);
}

.nav {
  display: none;

  @include up(md) {
    display: block;
    justify-self: center;
  }
}

.list {
  position: relative;
  display: flex;
  gap: var(--space-1);
}

.link {
  position: relative;
  z-index: 1;
  display: block;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-pill);
  color: var(--band-fg);
  @include text(body-sm);
  transition: color var(--duration-fast) var(--ease-out);

  &:hover {
    color: var(--band-link);
  }

  &[aria-current="location"] {
    font-weight: var(--font-weight-semibold);
    background: color-mix(in srgb, var(--band-fg) 8%, transparent);
  }
}

.actions {
  display: flex;
  grid-column: 3;
  align-items: center;
  justify-self: end;
  gap: var(--space-2);
}
```

- [ ] **Step 7: `MobileMenu`**

```tsx
// src/components/MobileMenu/MobileMenu.tsx
"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { uiCopy } from "@/data/site";
import type { NavItem } from "@/data/types";
import { navHref } from "@/lib/nav";
import styles from "./MobileMenu.module.scss";

type MobileMenuProps = { items: NavItem[]; label: string; spy: boolean; activeId?: string };

export function MobileMenu({ items, label, spy, activeId }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <div className={styles.root}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.button}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? uiCopy.menuClose : uiCopy.menuOpen}
        onClick={() => setOpen((value) => !value)}
      >
        <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            d={open ? "M6 6l12 12M18 6L6 18" : "M4 8h16M4 16h16"}
          />
        </svg>
      </button>
      <div id={panelId} className={styles.panel} hidden={!open}>
        <nav aria-label={label}>
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  className={styles.link}
                  href={navHref(item.id, spy)}
                  aria-current={item.id === activeId ? "location" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
```

```scss
// src/components/MobileMenu/MobileMenu.module.scss
@use "../../styles/mixins" as *;

@keyframes menu-in {
  from {
    opacity: 0;
    transform: translateY(calc(var(--space-2) * -1));
  }

  to {
    opacity: 1;
    transform: none;
  }
}

.root {
  @include up(md) {
    display: none;
  }
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--space-8);
  height: var(--space-8);
  padding: 0;
  border: 0;
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--band-fg);
  cursor: pointer;
}

.icon {
  width: var(--space-5);
  height: var(--space-5);
}

.panel {
  position: fixed;
  top: var(--nav-height);
  right: 0;
  left: 0;
  padding: var(--space-2) var(--space-5) var(--space-5);
  @include glass-bar;

  @media (prefers-reduced-motion: no-preference) {
    animation: menu-in var(--duration-fast) var(--ease-out);
  }
}

.list {
  display: grid;
}

.link {
  display: block;
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--glass-border);
  color: var(--band-fg);
  @include text(lead);

  &[aria-current="location"] {
    color: var(--band-link);
  }
}
```

- [ ] **Step 8: 전체 검증**

Run: `npm run lint && npm test && npm run build`
Expected: 통과. 이 Task의 컴포넌트는 아직 어떤 페이지에서도 쓰이지 않으므로 화면 확인은 Task 5에서 한다.

- [ ] **Step 9: Commit**

```bash
git add src/lib/nav.ts src/lib/nav.test.ts src/lib/useActiveSection.ts src/components/SiteNav src/components/MobileMenu
git commit -m "feat: 스크롤 위치를 따라가는 상단 유리 내비와 모바일 메뉴 추가"
```

---

### Task 5: 메인 페이지를 새 구조로 전환

**Files:**
- Create: `src/components/Hero/Hero.tsx`, `src/components/Hero/Hero.module.scss`, `src/components/CompetenciesBand/CompetenciesBand.tsx`, `src/components/CompetenciesBand/CompetenciesBand.module.scss`, `src/components/CareerBand/CareerBand.tsx`, `src/components/CareerBand/CareerBand.module.scss`, `src/components/ProjectTile/ProjectTile.tsx`, `src/components/ProjectTile/ProjectTile.module.scss`, `src/components/ProjectsBands/ProjectsBands.tsx`, `src/components/ProjectsBands/ProjectsBands.module.scss`, `src/components/SkillsBand/SkillsBand.tsx`, `src/components/SkillsBand/SkillsBand.module.scss`, `src/components/EducationBand/EducationBand.tsx`, `src/components/EducationBand/EducationBand.module.scss`, `src/components/SiteShell/SiteShell.tsx`
- Modify: `src/app/page.tsx`, `src/app/layout.tsx`, `src/styles/globals.scss`

**Interfaces:**
- Consumes: Task 2~4 산출물 전부, `profile`, `career`, `projects`, `personalProjectsIntro`, `skills`, `education`, `sectionNav`, `uiCopy`, `formatPeriod`, `getNavItem`
- Produces:
  - `<SiteShell spy: boolean>children</SiteShell>` — `SiteNav` + `<main id="main" tabIndex={-1}>` + `SiteFooter`
  - `<Hero id: string />`, `<CompetenciesBand />`, `<CareerBand id title />`, `<ProjectsBands id title />`, `<SkillsBand id title />`, `<EducationBand id title />`
  - `<ProjectTile project: Project withImage?: boolean />` — 제목 링크 하나로 카드 전체가 클릭되는 타일(`<article>`, 제목 `h4`)

- [ ] **Step 1: `SiteShell`**

```tsx
// src/components/SiteShell/SiteShell.tsx
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter/SiteFooter";
import { SiteNav } from "@/components/SiteNav/SiteNav";
import { sectionNav, uiCopy } from "@/data/site";

export function SiteShell({ spy, children }: { spy: boolean; children: ReactNode }) {
  return (
    <>
      <SiteNav items={sectionNav} label={uiCopy.sectionNavLabel} spy={spy} />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
```

- [ ] **Step 2: `Hero`**

```tsx
// src/components/Hero/Hero.tsx
import { Band } from "@/components/Band/Band";
import { PillButton } from "@/components/PillButton/PillButton";
import { profile } from "@/data/profile";
import { uiCopy } from "@/data/site";
import styles from "./Hero.module.scss";

export function Hero({ id }: { id: string }) {
  return (
    <Band tone="canvas" id={id} labelledBy={`${id}-title`} spacious>
      <div className={styles.content}>
        <p className={styles.overline}>{profile.role}</p>
        <h1 id={`${id}-title`} className={styles.title}>
          {profile.headline}
        </h1>
        <p className={styles.lead}>{profile.intro}</p>
        <div className={styles.actions}>
          <PillButton href="#projects">{uiCopy.heroProjects}</PillButton>
          <PillButton href={`mailto:${profile.email}`} variant="secondary">
            {uiCopy.heroContact}
          </PillButton>
        </div>
      </div>
    </Band>
  );
}
```

```scss
// src/components/Hero/Hero.module.scss
@use "../../styles/mixins" as *;

.content {
  display: grid;
  justify-items: center;
  gap: var(--space-5);
  text-align: center;
}

.overline {
  color: var(--band-sub);
  @include text(overline);
}

.title {
  max-width: var(--band-max);
  @include text(hero);
}

.lead {
  max-width: var(--reading-max);
  color: var(--band-sub);
  @include text(lead);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-3);
  margin-top: var(--space-3);
}
```

- [ ] **Step 3: `CompetenciesBand`**

```tsx
// src/components/CompetenciesBand/CompetenciesBand.tsx
import { Band } from "@/components/Band/Band";
import { SectionTitle } from "@/components/SectionTitle/SectionTitle";
import { Tile } from "@/components/Tile/Tile";
import { profile } from "@/data/profile";
import { uiCopy } from "@/data/site";
import styles from "./CompetenciesBand.module.scss";

export function CompetenciesBand() {
  return (
    <Band tone="white" labelledBy="competencies-title">
      <SectionTitle id="competencies-title">{uiCopy.competenciesTitle}</SectionTitle>
      <ul className={styles.grid}>
        {profile.competencies.map((item) => (
          <li key={item.text}>
            <Tile>
              {item.label ? <h3 className={styles.label}>{item.label}</h3> : null}
              <p className={styles.text}>{item.text}</p>
            </Tile>
          </li>
        ))}
      </ul>
    </Band>
  );
}
```

```scss
// src/components/CompetenciesBand/CompetenciesBand.module.scss
@use "../../styles/mixins" as *;

.grid {
  display: grid;
  gap: var(--tile-gap);

  @include up(md) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.label {
  @include text(tile);
}

.text {
  color: var(--band-sub);
  @include text(body-sm);
}
```

- [ ] **Step 4: `CareerBand`**

```tsx
// src/components/CareerBand/CareerBand.tsx
import { Band } from "@/components/Band/Band";
import { SectionTitle } from "@/components/SectionTitle/SectionTitle";
import { Tile } from "@/components/Tile/Tile";
import { career } from "@/data/career";
import { formatPeriod } from "@/lib/format";
import styles from "./CareerBand.module.scss";

export function CareerBand({ id, title }: { id: string; title: string }) {
  return (
    <Band tone="ink" id={id} labelledBy={`${id}-title`}>
      <SectionTitle id={`${id}-title`}>{title}</SectionTitle>
      <ul className={styles.grid}>
        {career.map((entry) => (
          <li key={entry.company}>
            <Tile as="article">
              <h3 className={styles.company}>{entry.company}</h3>
              <p className={styles.meta}>
                {entry.position} · {formatPeriod(entry.period)}
              </p>
              <p className={styles.summary}>{entry.summary}</p>
              <ul className={styles.highlights}>
                {entry.highlights.map((highlight) => (
                  <li key={highlight.text} className={styles.highlight}>
                    {highlight.label ? <strong>{highlight.label}: </strong> : null}
                    {highlight.text}
                  </li>
                ))}
              </ul>
            </Tile>
          </li>
        ))}
      </ul>
    </Band>
  );
}
```

```scss
// src/components/CareerBand/CareerBand.module.scss
@use "../../styles/mixins" as *;

.grid {
  display: grid;
  gap: var(--tile-gap);

  @include up(md) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.company {
  @include text(tile);
}

.meta {
  color: var(--band-mute);
  @include text(caption);
}

.summary {
  color: var(--band-sub);
  @include text(body-sm);
}

.highlights {
  display: grid;
  gap: var(--space-2);
  margin-top: var(--space-2);
}

.highlight {
  position: relative;
  padding-left: var(--space-4);
  @include text(body-sm);

  &::before {
    content: "";
    position: absolute;
    top: 0.65em;
    left: 0;
    width: var(--space-1);
    height: var(--space-1);
    border-radius: 50%;
    background: var(--band-mute);
  }
}
```

- [ ] **Step 5: `ProjectTile`**

```tsx
// src/components/ProjectTile/ProjectTile.tsx
import Image from "next/image";
import Link from "next/link";
import { TagList } from "@/components/Tag/Tag";
import { Tile } from "@/components/Tile/Tile";
import type { Project } from "@/data/types";
import { formatPeriod } from "@/lib/format";
import styles from "./ProjectTile.module.scss";

type ProjectTileProps = { project: Project; withImage?: boolean };

export function ProjectTile({ project, withImage = false }: ProjectTileProps) {
  const image = withImage ? project.images?.[0] : undefined;

  return (
    <Tile
      as="article"
      interactive
      media={
        image ? (
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(min-width: 768px) 480px, 100vw"
          />
        ) : undefined
      }
    >
      <p className={styles.label}>{project.label}</p>
      <h4 className={styles.title}>
        <Link className={styles.link} href={`/projects/${project.slug}`}>
          {project.title}
        </Link>
      </h4>
      <p className={styles.summary}>{project.summary}</p>
      <p className={styles.period}>{formatPeriod(project.period)}</p>
      <TagList items={project.stack} />
    </Tile>
  );
}
```

```scss
// src/components/ProjectTile/ProjectTile.module.scss
@use "../../styles/mixins" as *;

.label {
  color: var(--band-sub);
  @include text(overline);
}

.title {
  @include text(tile);
}

// 제목 링크 하나로 타일 전체를 클릭 영역으로 만든다. 포커스 링은 타일(Tile)이 그린다.
.link {
  &::after {
    content: "";
    position: absolute;
    inset: 0;
  }

  &:focus-visible {
    outline: none;
  }
}

.summary {
  flex: 1;
  color: var(--band-sub);
  @include text(body-sm);
}

.period {
  color: var(--band-mute);
  @include text(caption);
}
```

- [ ] **Step 6: `ProjectsBands`**

```tsx
// src/components/ProjectsBands/ProjectsBands.tsx
import { Band } from "@/components/Band/Band";
import { ProjectTile } from "@/components/ProjectTile/ProjectTile";
import { SectionTitle } from "@/components/SectionTitle/SectionTitle";
import { personalProjectsIntro, projects } from "@/data/projects";
import { uiCopy } from "@/data/site";
import styles from "./ProjectsBands.module.scss";

export function ProjectsBands({ id, title }: { id: string; title: string }) {
  const work = projects.filter((project) => project.kind === "work");
  const personal = projects.filter((project) => project.kind === "personal");

  return (
    <>
      <Band tone="canvas" id={id} labelledBy={`${id}-title`}>
        <SectionTitle id={`${id}-title`}>{title}</SectionTitle>
        <h3 className={styles.groupTitle}>{uiCopy.workProjectsTitle}</h3>
        <ul className={styles.grid}>
          {work.map((project) => (
            <li key={project.slug}>
              <ProjectTile project={project} />
            </li>
          ))}
        </ul>
      </Band>
      <Band tone="ink">
        <h3 className={styles.groupTitle}>{uiCopy.personalProjectsTitle}</h3>
        <p className={styles.intro}>{personalProjectsIntro}</p>
        <ul className={styles.grid}>
          {personal.map((project) => (
            <li key={project.slug}>
              <ProjectTile project={project} withImage />
            </li>
          ))}
        </ul>
      </Band>
    </>
  );
}
```

```scss
// src/components/ProjectsBands/ProjectsBands.module.scss
@use "../../styles/mixins" as *;

.groupTitle {
  margin-bottom: var(--space-6);
  text-align: center;
  @include text(tile);
}

.intro {
  max-width: var(--reading-max);
  margin: calc(var(--space-3) * -1) auto var(--space-8);
  color: var(--band-sub);
  text-align: center;
  @include text(body-sm);
}

.grid {
  display: grid;
  gap: var(--tile-gap);

  @include up(md) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
```

- [ ] **Step 7: `SkillsBand`**

```tsx
// src/components/SkillsBand/SkillsBand.tsx
import { Band } from "@/components/Band/Band";
import { SectionTitle } from "@/components/SectionTitle/SectionTitle";
import { TagList } from "@/components/Tag/Tag";
import { Tile } from "@/components/Tile/Tile";
import { skills } from "@/data/skills";
import styles from "./SkillsBand.module.scss";

export function SkillsBand({ id, title }: { id: string; title: string }) {
  return (
    <Band tone="white" id={id} labelledBy={`${id}-title`}>
      <SectionTitle id={`${id}-title`}>{title}</SectionTitle>
      <ul className={styles.grid}>
        {skills.map((group) => (
          <li key={group.category}>
            <Tile>
              <dl className={styles.group}>
                <dt className={styles.category}>{group.category}</dt>
                <dd className={styles.items}>
                  <TagList items={group.items} />
                  {group.note ? <p className={styles.note}>{group.note}</p> : null}
                </dd>
              </dl>
            </Tile>
          </li>
        ))}
      </ul>
    </Band>
  );
}
```

```scss
// src/components/SkillsBand/SkillsBand.module.scss
@use "../../styles/mixins" as *;

.grid {
  display: grid;
  gap: var(--tile-gap);

  @include up(md) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.group {
  display: grid;
  gap: var(--space-3);
}

.category {
  @include text(tile);
}

.items {
  display: grid;
  gap: var(--space-3);
}

.note {
  color: var(--band-mute);
  @include text(caption);
}
```

- [ ] **Step 8: `EducationBand`**

```tsx
// src/components/EducationBand/EducationBand.tsx
import { Band } from "@/components/Band/Band";
import { SectionTitle } from "@/components/SectionTitle/SectionTitle";
import { Tile } from "@/components/Tile/Tile";
import { education } from "@/data/education";
import styles from "./EducationBand.module.scss";

export function EducationBand({ id, title }: { id: string; title: string }) {
  return (
    <Band tone="canvas" id={id} labelledBy={`${id}-title`}>
      <SectionTitle id={`${id}-title`}>{title}</SectionTitle>
      <div className={styles.wrap}>
        <Tile>
          <ul className={styles.list}>
            {education.map((item) => (
              <li key={item.title} className={styles.item}>
                <span className={styles.name}>{item.title}</span>
                {item.detail ? <span className={styles.detail}>{item.detail}</span> : null}
              </li>
            ))}
          </ul>
        </Tile>
      </div>
    </Band>
  );
}
```

```scss
// src/components/EducationBand/EducationBand.module.scss
@use "../../styles/mixins" as *;

.wrap {
  max-width: var(--reading-max);
  margin-inline: auto;
}

.list {
  display: grid;
  gap: var(--space-4);
}

.item {
  display: grid;
  gap: var(--space-1);
}

.name {
  @include text(body);
}

.detail {
  color: var(--band-mute);
  @include text(caption);
}
```

- [ ] **Step 9: `src/app/page.tsx` 교체**

```tsx
import { CareerBand } from "@/components/CareerBand/CareerBand";
import { CompetenciesBand } from "@/components/CompetenciesBand/CompetenciesBand";
import { EducationBand } from "@/components/EducationBand/EducationBand";
import { Hero } from "@/components/Hero/Hero";
import { ProjectsBands } from "@/components/ProjectsBands/ProjectsBands";
import { SiteShell } from "@/components/SiteShell/SiteShell";
import { SkillsBand } from "@/components/SkillsBand/SkillsBand";
import { sectionNav } from "@/data/site";
import { getNavItem } from "@/lib/nav";

const about = getNavItem(sectionNav, "about");
const career = getNavItem(sectionNav, "career");
const projects = getNavItem(sectionNav, "projects");
const skills = getNavItem(sectionNav, "skills");
const education = getNavItem(sectionNav, "education");

export default function HomePage() {
  return (
    <SiteShell spy>
      <Hero id={about.id} />
      <CompetenciesBand />
      <CareerBand id={career.id} title={career.label} />
      <ProjectsBands id={projects.id} title={projects.label} />
      <SkillsBand id={skills.id} title={skills.label} />
      <EducationBand id={education.id} title={education.label} />
    </SiteShell>
  );
}
```

- [ ] **Step 10: `src/app/layout.tsx`에서 Backdrop 제거**

`import { Backdrop } from "@/components/Backdrop/Backdrop";` 줄과 `<Backdrop />` 줄을 삭제한다. (나머지는 그대로)

- [ ] **Step 11: `src/styles/globals.scss` 본문·앵커 규칙 교체**

`body { … }` 블록의 `background`/`color` 두 줄을 교체한다.

```scss
  background: var(--band-bg);
  color: var(--band-fg);
```

`html { … }` 블록 안의 아래 부분을 교체한다.

```scss
  @include down(lg) {
    scroll-padding-top: var(--header-offset);
  }
```
→
```scss
  scroll-padding-top: calc(var(--nav-height) + var(--space-4));
```

그리고 `:focus:not(:focus-visible) {…}` 블록 바로 아래에 추가한다.

```scss
main:focus {
  outline: none;
}
```

- [ ] **Step 12: 자동 검증**

Run: `npm run lint && npm test && npm run build`
Expected: 통과. 빌드의 정적 라우트에 `/`와 `/projects/*` 8개가 그대로 있다.

- [ ] **Step 13: 브라우저 검증** (Browser 도구 `preview_start {name:"dev"}`; 도구가 없으면 없다고 명시하고 이 단계만 건너뛴다)

수치로 확인하고 보고서에 값을 남긴다.
1. 1280px 라이트: 첫 화면에 히어로(큰 제목, 알약 버튼 2개)와 상단 유리 내비. 띠 순서가 밝음 → 흰색 → 검정 → 밝음 → 검정 → 흰색 → 밝음 → 푸터. `getComputedStyle(document.querySelector('[data-tone=ink]')).backgroundColor`가 `rgb(0, 0, 0)`.
2. 같은 화면 다크(토글 클릭): `data-theme="dark"`, `white` 톤 띠의 배경이 `rgb(16, 16, 18)`, 모든 글자 읽힘. 새로고침해도 첫 페인트부터 다크(깜빡임 없음).
3. 360px, 768px, 1280px × 라이트/다크: `document.documentElement.scrollWidth <= window.innerWidth`. 360px에서 긴 제목("WeSeed CRM·Admin 디자인 시스템 개선")이 타일 밖으로 넘치지 않음(`tile.scrollWidth <= tile.clientWidth`).
4. 앵커: 내비의 "경력" 클릭 → `document.getElementById('career').getBoundingClientRect().top`이 내비 높이(48px) 이상이고 제목이 가려지지 않음. 1280px와 360px 둘 다.
5. 스크롤하면 내비의 현재 섹션이 바뀜(`aria-current="location"`), 페이지 맨 아래에서는 "학력 · 자격"이 현재.
6. 키보드: 첫 Tab에 "본문 바로가기" → Enter로 `#main`; Tab 순서가 이름 → 내비 링크 → 토글 → 본문. 프로젝트 타일에서 Tab 시 타일 전체에 포커스 링, Enter로 상세 페이지(아직 옛 구조여도 URL만 확인).
7. 360px 모바일 메뉴: 버튼 클릭으로 열림(`aria-expanded="true"`), 링크 클릭으로 닫히고 해당 섹션으로 이동, 열린 상태에서 Escape → 닫히고 포커스가 메뉴 버튼으로 돌아옴(`document.activeElement`가 버튼).
8. 제목 구조(`read_page`): `h1` 하나, `h2`(핵심 역량·경력·프로젝트·기술·학력 · 자격), `h3`(회사명·그룹 제목), `h4`(프로젝트 타일 제목).
9. `resize_window` preset "desktop"과 `preview_stop`으로 정리.

- [ ] **Step 14: Commit**

```bash
git add src/components src/app/page.tsx src/app/layout.tsx src/styles/globals.scss
git commit -m "feat: 메인 페이지를 전체 폭 띠와 타일로 구성한 애플 스타일 구조로 전환"
```

---

### Task 6: 프로젝트 상세 페이지와 404를 새 구조로 전환

**Files:**
- Create: `src/components/LocalNav/LocalNav.tsx`, `src/components/LocalNav/LocalNav.module.scss`
- Modify(전체 재작성): `src/components/ProjectHeader/ProjectHeader.tsx`, `src/components/ProjectHeader/ProjectHeader.module.scss`, `src/components/ProjectGallery/ProjectGallery.tsx`, `src/components/ProjectGallery/ProjectGallery.module.scss`, `src/components/ProjectBody/ProjectBody.tsx`, `src/components/ProjectBody/ProjectBody.module.scss`, `src/components/ProjectPager/ProjectPager.tsx`, `src/components/ProjectPager/ProjectPager.module.scss`, `src/app/projects/[slug]/page.tsx`, `src/app/not-found.tsx`, `src/app/not-found.module.scss`

**Interfaces:**
- Consumes: Task 3~5 산출물, `getProjectToc`, `getAdjacentProjects`, `getPrimaryLinks`, `getEvidenceLinks`, `sectionId`, `EVIDENCE_SECTION_ID`, `formatPeriod`, `ProjectImage`
- Produces: `<LocalNav items: NavItem[] label: string />`(서버 컴포넌트, 현재 위치 강조 없음), 새 구조의 `ProjectHeader`/`ProjectGallery`/`ProjectBody`/`ProjectPager`(시그니처는 기존과 동일)

- [ ] **Step 1: `LocalNav`**

```tsx
// src/components/LocalNav/LocalNav.tsx
import type { NavItem } from "@/data/types";
import styles from "./LocalNav.module.scss";

export function LocalNav({ items, label }: { items: NavItem[]; label: string }) {
  if (items.length === 0) return null;

  return (
    <nav data-tone="canvas" className={styles.nav} aria-label={label}>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id}>
            <a className={styles.link} href={`#${item.id}`}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

```scss
// src/components/LocalNav/LocalNav.module.scss
@use "../../styles/mixins" as *;

.nav {
  position: sticky;
  top: var(--nav-height);
  z-index: 40;
  overflow-x: auto;
  border-bottom: 1px solid var(--band-border);
  background: var(--band-bg);
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.list {
  display: flex;
  gap: var(--space-6);
  max-width: var(--band-max);
  height: var(--local-nav-height);
  margin-inline: auto;
  padding-inline: var(--space-5);
  align-items: center;
  white-space: nowrap;

  @include up(md) {
    padding-inline: var(--space-6);
  }
}

.link {
  display: block;
  padding-block: var(--space-1);
  color: var(--band-sub);
  @include text(body-sm);

  &:hover {
    color: var(--band-link);
  }
}
```

- [ ] **Step 2: `ProjectHeader` 교체**

```tsx
// src/components/ProjectHeader/ProjectHeader.tsx
import { Band } from "@/components/Band/Band";
import { PillButton } from "@/components/PillButton/PillButton";
import { TagList } from "@/components/Tag/Tag";
import { TextLink } from "@/components/TextLink/TextLink";
import { uiCopy } from "@/data/site";
import type { Project } from "@/data/types";
import { formatPeriod } from "@/lib/format";
import { getPrimaryLinks } from "@/lib/projects";
import styles from "./ProjectHeader.module.scss";

export function ProjectHeader({ project }: { project: Project }) {
  const links = getPrimaryLinks(project);

  return (
    <Band tone="canvas" labelledBy="project-title" spacious>
      <div className={styles.content}>
        <TextLink href="/#projects">{uiCopy.backToProjects}</TextLink>
        <p className={styles.label}>{project.label}</p>
        <h1 id="project-title" className={styles.title}>
          {project.title}
        </h1>
        <p className={styles.meta}>
          {formatPeriod(project.period)}
          {project.role ? ` · ${project.role}` : null}
        </p>
        <TagList items={project.stack} className={styles.tags} />
        {project.note ? <p className={styles.note}>{project.note}</p> : null}
        {links.length > 0 ? (
          <ul className={styles.links} aria-label={uiCopy.projectLinksLabel}>
            {links.map((link, index) => (
              <li key={link.href}>
                <PillButton href={link.href} variant={index === 0 ? "primary" : "secondary"}>
                  {link.label}
                </PillButton>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Band>
  );
}
```

`TagList`는 `className` prop을 이미 지원한다. `src/components/ProjectHeader/ProjectHeader.module.scss`:

```scss
@use "../../styles/mixins" as *;

.content {
  display: grid;
  justify-items: center;
  gap: var(--space-4);
  text-align: center;
}

.label {
  color: var(--band-sub);
  @include text(overline);
}

.title {
  max-width: var(--band-max);
  @include text(section);
}

.meta {
  color: var(--band-sub);
  @include text(body-sm);
}

.tags {
  justify-content: center;
}

.note {
  max-width: var(--reading-max);
  padding: var(--space-4);
  border-radius: var(--radius-tile);
  background: var(--band-tile);
  color: var(--band-sub);
  text-align: left;
  @include text(body-sm);
}

.links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-3);
  margin-top: var(--space-2);
}
```

- [ ] **Step 3: `ProjectGallery` 교체**

```tsx
// src/components/ProjectGallery/ProjectGallery.tsx
import Image from "next/image";
import { Band } from "@/components/Band/Band";
import { uiCopy } from "@/data/site";
import type { ProjectImage } from "@/data/types";
import styles from "./ProjectGallery.module.scss";

export function ProjectGallery({ images }: { images?: ProjectImage[] }) {
  if (!images || images.length === 0) return null;

  return (
    <Band tone="white">
      <ul className={styles.gallery} aria-label={uiCopy.galleryLabel}>
        {images.map((image, index) => (
          <li key={image.src} className={styles.item}>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(min-width: 1024px) 980px, 100vw"
              priority={index === 0}
            />
          </li>
        ))}
      </ul>
    </Band>
  );
}
```

```scss
// src/components/ProjectGallery/ProjectGallery.module.scss
.gallery {
  display: grid;
  gap: var(--tile-gap);
}

// 화면 캡처는 가로·세로 비율이 제각각이라 위쪽을 기준으로 잘라 같은 비율로 맞춘다.
.item {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border: 1px solid var(--band-border);
  border-radius: var(--radius-tile);
  background: var(--band-tile);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
  }
}
```

- [ ] **Step 4: `ProjectBody` 교체**

```tsx
// src/components/ProjectBody/ProjectBody.tsx
import { Band } from "@/components/Band/Band";
import { TagList } from "@/components/Tag/Tag";
import { TextLink } from "@/components/TextLink/TextLink";
import { Tile } from "@/components/Tile/Tile";
import { uiCopy } from "@/data/site";
import type { Project } from "@/data/types";
import { EVIDENCE_SECTION_ID, getEvidenceLinks, sectionId } from "@/lib/projects";
import styles from "./ProjectBody.module.scss";

export function ProjectBody({ project }: { project: Project }) {
  const evidence = getEvidenceLinks(project);

  return (
    <Band tone="canvas">
      <div className={styles.reading}>
        {project.sections.map((section, index) => {
          const id = sectionId(index);
          return (
            <section key={id} id={id} className={styles.section} aria-labelledby={`${id}-title`}>
              <h2 id={`${id}-title`} className={styles.title}>
                {section.title}
              </h2>
              {section.stack ? <TagList items={section.stack} /> : null}
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className={styles.paragraph}>
                  {paragraph}
                </p>
              ))}
              {section.items ? (
                <ul className={styles.items}>
                  {section.items.map((item) => (
                    <li key={item.text}>
                      <Tile>
                        {item.label ? <strong className={styles.itemLabel}>{item.label}</strong> : null}
                        <span className={styles.itemText}>{item.text}</span>
                      </Tile>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          );
        })}

        {evidence.length > 0 ? (
          <section id={EVIDENCE_SECTION_ID} className={styles.section} aria-labelledby={`${EVIDENCE_SECTION_ID}-title`}>
            <h2 id={`${EVIDENCE_SECTION_ID}-title`} className={styles.title}>
              {uiCopy.evidenceTitle}
            </h2>
            <ul className={styles.evidence}>
              {evidence.map((link) => (
                <li key={link.href}>
                  <TextLink href={link.href}>{link.label}</TextLink>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </Band>
  );
}
```

```scss
// src/components/ProjectBody/ProjectBody.module.scss
@use "../../styles/mixins" as *;

.reading {
  display: grid;
  gap: var(--space-16);
  max-width: var(--reading-max);
  margin-inline: auto;
}

.section {
  display: grid;
  gap: var(--space-4);
  scroll-margin-top: calc(var(--nav-height) + var(--local-nav-height) + var(--space-4));
}

.title {
  @include text(tile);
}

.paragraph {
  @include text(body);
}

.items {
  display: grid;
  gap: var(--space-3);
}

.itemLabel {
  @include text(lead);
  font-weight: var(--font-weight-semibold);
}

.itemText {
  color: var(--band-sub);
  @include text(body-sm);
}

.evidence {
  display: grid;
  gap: var(--space-2);
}
```

- [ ] **Step 5: `ProjectPager` 교체**

```tsx
// src/components/ProjectPager/ProjectPager.tsx
import Link from "next/link";
import { Band } from "@/components/Band/Band";
import { Tile } from "@/components/Tile/Tile";
import { uiCopy } from "@/data/site";
import type { Project } from "@/data/types";
import styles from "./ProjectPager.module.scss";

type ProjectPagerProps = { prev?: Project; next?: Project };

export function ProjectPager({ prev, next }: ProjectPagerProps) {
  if (!prev && !next) return null;

  return (
    <Band tone="white">
      <nav aria-label={uiCopy.pagerLabel}>
        <ul className={styles.list}>
          {prev ? (
            <li>
              <Tile interactive>
                <span className={styles.direction}>{uiCopy.prevProject}</span>
                <Link className={styles.link} href={`/projects/${prev.slug}`}>
                  {prev.title}
                </Link>
              </Tile>
            </li>
          ) : null}
          {next ? (
            <li className={styles.next}>
              <Tile interactive>
                <span className={styles.direction}>{uiCopy.nextProject}</span>
                <Link className={styles.link} href={`/projects/${next.slug}`}>
                  {next.title}
                </Link>
              </Tile>
            </li>
          ) : null}
        </ul>
      </nav>
    </Band>
  );
}
```

```scss
// src/components/ProjectPager/ProjectPager.module.scss
@use "../../styles/mixins" as *;

.list {
  display: grid;
  gap: var(--tile-gap);

  @include up(md) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.next {
  @include up(md) {
    grid-column: 2;
  }
}

.direction {
  color: var(--band-mute);
  @include text(caption);
}

// 제목 링크 하나로 타일 전체를 클릭 영역으로 만든다 (포커스 링은 Tile이 그린다).
.link {
  @include text(tile);

  &::after {
    content: "";
    position: absolute;
    inset: 0;
  }

  &:focus-visible {
    outline: none;
  }
}
```

- [ ] **Step 6: `src/app/projects/[slug]/page.tsx`의 `ProjectPage` 컴포넌트와 import 교체**

파일 상단 import 중 `PageShell`, `TextLink` import를 지우고 아래를 추가한다.

```tsx
import { LocalNav } from "@/components/LocalNav/LocalNav";
import { SiteShell } from "@/components/SiteShell/SiteShell";
```

`export default async function ProjectPage` 함수의 반환부를 교체한다.

```tsx
  return (
    <SiteShell spy={false}>
      <ProjectHeader project={project} />
      <LocalNav items={getProjectToc(project)} label={uiCopy.tocLabel} />
      <ProjectGallery images={project.images} />
      <ProjectBody project={project} />
      <ProjectPager prev={prev} next={next} />
    </SiteShell>
  );
```

(`generateStaticParams`, `generateMetadata`, `dynamicParams`는 그대로.)

- [ ] **Step 7: 404 교체**

```tsx
// src/app/not-found.tsx
import type { Metadata } from "next";
import { Band } from "@/components/Band/Band";
import { PillButton } from "@/components/PillButton/PillButton";
import { SiteShell } from "@/components/SiteShell/SiteShell";
import { uiCopy } from "@/data/site";
import styles from "./not-found.module.scss";

export const metadata: Metadata = { title: uiCopy.notFoundTitle };

export default function NotFound() {
  return (
    <SiteShell spy={false}>
      <Band tone="canvas" labelledBy="not-found-title" spacious>
        <div className={styles.content}>
          <h1 id="not-found-title" className={styles.title}>
            {uiCopy.notFoundTitle}
          </h1>
          <p className={styles.body}>{uiCopy.notFoundBody}</p>
          <PillButton href="/">{uiCopy.notFoundLink}</PillButton>
        </div>
      </Band>
    </SiteShell>
  );
}
```

```scss
// src/app/not-found.module.scss
@use "../styles/mixins" as *;

.content {
  display: grid;
  justify-items: center;
  gap: var(--space-4);
  text-align: center;
}

.title {
  @include text(section);
}

.body {
  color: var(--band-sub);
  @include text(lead);
}
```

- [ ] **Step 8: 자동 검증**

Run: `npm run lint && npm test && npm run build`
Expected: 통과. 정적 라우트에 `/projects/*` 8개, `/icon`, `/opengraph-image`, 404.

- [ ] **Step 9: 브라우저 검증** (`preview_start {name:"dev"}`; 정적 라우트 목록이 바뀌었으므로 서버를 새로 시작한다)

1. `/projects/weseedcon`(이미지 없음), `/projects/monibuk`(이미지 4장, 확인 자료), `/projects/construction-logistics-systems`(`note`), `/projects/fe-daily-study`(이전만), `/projects/weseedcon`(다음만), `/projects/nope`(404, HTTP 404)를 1280px·360px × 라이트·다크로 확인. 각 페이지 `scrollWidth <= innerWidth`.
2. 상세 페이지의 내비 링크(예: "경력")를 클릭하면 `/#career`로 이동(메인으로 감). **`navHref`가 `/#id`를 쓰는지 URL로 확인.**
3. 로컬 내비 항목 클릭 → 해당 섹션 제목의 `getBoundingClientRect().top`이 `nav-height + local-nav-height`(96px) 이상(고정 바 두 개에 가려지지 않음). 로컬 내비가 스크롤 중 내비 아래에 붙어 있음(`position: sticky`, top 48px).
4. 이미지: 갤러리 이미지가 16:10으로 잘려 보이고(`clientWidth/clientHeight` ≈ 1.6), `alt`가 있음. 첫 이미지만 `priority`.
5. 외부 링크는 `target="_blank"`와 `rel`에 `noopener`. 타일(이전/다음) 전체가 클릭 영역이고 Tab 시 타일 전체에 포커스 링.
6. 제목 구조: 페이지당 `h1` 하나, 본문 섹션 `h2`. `resize_window` preset "desktop", `preview_stop`.

- [ ] **Step 10: Commit**

```bash
git add src/components src/app
git commit -m "feat: 프로젝트 상세·404 페이지를 새 구조로 전환하고 보조 내비 추가"
```

---

### Task 7: CSS 모션(등장·히어로·hover·내비 경계선)

**Files:**
- Create: `src/styles/motion-guard.test.ts`
- Modify: `src/styles/_mixins.scss`, `src/components/Tile/Tile.module.scss`, `src/components/PillButton/PillButton.module.scss`, `src/components/Hero/Hero.module.scss`, `src/components/SiteNav/SiteNav.module.scss`, `src/components/ProjectsBands/ProjectsBands.module.scss`, `src/components/CompetenciesBand/CompetenciesBand.module.scss`, `src/components/CareerBand/CareerBand.module.scss`, `src/components/SkillsBand/SkillsBand.module.scss`

**Interfaces:**
- Consumes: `reveal-keyframes`, `reveal` 믹스인, 토큰 `--duration-*`, `--ease-*`
- Produces: `--reveal-shift`(그리드 `li`가 지정하는 등장 시작 지점 오프셋 변수), 모션 안전장치 테스트

- [ ] **Step 1: 실패하는 테스트 `src/styles/motion-guard.test.ts`**

```ts
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

  it.each(usesTimeline.map((file) => [file.replace(process.cwd(), "")]))(
    "%s: 지원 감지와 움직임 줄이기 조건 안에서만 선언한다",
    (relative) => {
      const source = readFileSync(resolve(process.cwd(), relative.replace(/^[\\/]/, "")), "utf8");
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
```

- [ ] **Step 2: 현재 상태 확인**

Run: `npx vitest run src/styles/motion-guard.test.ts`
Expected: `_mixins.scss`의 `reveal`이 이미 조건 안에 있어 통과할 수 있다. 실패하면(예: 어딘가가 `opacity: 0;`을 고정) 원인을 보고하고 고친다. **이 테스트는 이후 Step에서 추가하는 모션이 조건을 어기면 실패하는 안전장치다.**

- [ ] **Step 3: `src/styles/_mixins.scss`의 `reveal` 믹스인 교체** (타일별 시작 지점 오프셋 변수 지원)

```scss
// 스크롤 등장. 미지원 브라우저·움직임 줄이기 설정에서는 처음부터 보인다.
// 같은 줄의 타일은 그리드 li가 --reveal-shift를 달리 주어 순차 등장처럼 보이게 한다.
@mixin reveal {
  @media (prefers-reduced-motion: no-preference) {
    @supports (animation-timeline: view()) {
      animation: reveal linear both;
      animation-timeline: view();
      animation-range: entry var(--reveal-shift, 0%) entry calc(40% + var(--reveal-shift, 0%));
    }
  }
}
```

- [ ] **Step 4: `Tile.module.scss` — 등장 + hover** (파일 맨 위 `@use` 다음 줄에 `@include reveal-keyframes;`를 추가하고, `.tile`/`.media`에 아래를 반영)

`.tile` 블록 안에 추가:

```scss
  @include reveal;
```

파일 끝에 추가:

```scss
@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  .tile {
    transition: scale var(--duration-base) var(--ease-spring);
  }

  .interactive:hover {
    scale: 1.02;
  }

  .media img {
    transition: transform var(--duration-slow) var(--ease-out);
  }

  .interactive:hover .media img {
    transform: scale(1.04);
  }
}
```

- [ ] **Step 5: 그리드 `li`의 `--reveal-shift`** — 아래 4개 모듈의 `.grid` 블록 끝에 각각 추가

`CompetenciesBand.module.scss`, `CareerBand.module.scss`, `SkillsBand.module.scss`, `ProjectsBands.module.scss`:

```scss
  li:nth-child(even) {
    --reveal-shift: 8%;
  }
```

(`.grid { … }` 안, 기존 `@include up(md) {…}` 바로 아래.)

- [ ] **Step 6: `PillButton.module.scss` — 눌림 피드백** — 파일 끝에 추가

```scss
@media (prefers-reduced-motion: no-preference) {
  .button {
    transition:
      background-color var(--duration-fast) var(--ease-out),
      border-color var(--duration-fast) var(--ease-out),
      color var(--duration-fast) var(--ease-out),
      scale var(--duration-fast) var(--ease-spring);
  }

  .button:active {
    scale: 0.97;
  }
}
```

- [ ] **Step 7: `Hero.module.scss` — 진입(블록 순차)과 스크롤 퇴장** — 파일 끝에 추가

```scss
@keyframes hero-in {
  from {
    opacity: 0;
    transform: translateY(var(--space-4));
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes hero-out {
  from {
    opacity: 1;
    transform: none;
  }

  to {
    opacity: 0;
    transform: translateY(calc(var(--space-8) * -1)) scale(0.96);
  }
}

@media (prefers-reduced-motion: no-preference) {
  .overline,
  .title,
  .lead,
  .actions {
    animation: hero-in var(--duration-slow) var(--ease-out) both;
  }

  .title {
    animation-delay: 80ms;
  }

  .lead {
    animation-delay: 160ms;
  }

  .actions {
    animation-delay: 240ms;
  }

  @supports (animation-timeline: view()) {
    .content {
      animation: hero-out linear both;
      animation-timeline: scroll();
      animation-range: 0 40vh;
    }
  }
}
```

- [ ] **Step 8: `SiteNav.module.scss` — 스크롤 시 유리 배경 나타남** — 파일 끝에 추가

```scss
@keyframes nav-glass-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .header::before {
      animation: nav-glass-in linear both;
      animation-timeline: scroll();
      animation-range: 0 var(--space-16);
    }
  }
}
```

- [ ] **Step 9: 검증**

Run: `npx vitest run src/styles/motion-guard.test.ts` → PASS, 이어서 `npm run lint && npm test && npm run build` → 통과

브라우저(`preview_start {name:"dev"}`):
1. 처음 로드에서 히어로 요소가 순서대로 떠오름(1초 안에 모두 `opacity: 1`). 스크롤하면 히어로가 위로 올라가며 흐려지고, 맨 위에서는 내비가 투명, 조금 내리면 유리 배경이 나타남(`getComputedStyle(header, '::before').opacity`가 0→1).
2. 화면 밖 타일이 스크롤로 들어오면 나타남(`getComputedStyle(tile).animationTimeline`이 `view()` 계열). 이미 화면 안에 있는 타일은 `opacity: 1`.
3. 타일 hover 시 `scale`이 1.02, 이미지가 확대. 버튼 눌림 시 0.97.
4. 움직임 줄이기는 에뮬레이션이 안 되면 위 CSS가 모두 `prefers-reduced-motion: no-preference` 안에 있음을 소스로 확인하고 "에뮬레이션 불가"로 보고.
5. `resize_window` preset "desktop", `preview_stop`.

- [ ] **Step 10: Commit**

```bash
git add src/styles src/components
git commit -m "feat: 스크롤 등장·히어로 진입·퇴장·타일 hover 등 CSS 모션 추가"
```

---

### Task 8: Motion 모션(내비 알약, 모바일 메뉴, 타일 기울기)

**Files:**
- Create: `src/lib/tilt.ts`, `src/lib/tilt.test.ts`, `src/components/TiltTile/TiltTile.tsx`, `src/components/TiltTile/TiltTile.module.scss`
- Modify(전체 교체): `src/components/SiteNav/SiteNav.tsx`, `src/components/MobileMenu/MobileMenu.tsx`
- Modify: `src/components/SiteNav/SiteNav.module.scss`, `src/components/MobileMenu/MobileMenu.module.scss`, `src/components/ProjectsBands/ProjectsBands.tsx`

**Interfaces:**
- Consumes: `motion/react`(`LazyMotion`, `MotionConfig`, `domAnimation`, `AnimatePresence`, `useMotionValue`, `useSpring`, `useReducedMotion`), `motion/react-m`(`m`)
- Produces:
  - `tiltAngles(input: { x: number; y: number; width: number; height: number; max?: number }): { rotateX: number; rotateY: number; glowX: number; glowY: number }`
  - `<TiltTile>children</TiltTile>`(client) — 개인 프로젝트 타일을 감싸는 장식 래퍼

- [ ] **Step 1: 실패하는 테스트 `src/lib/tilt.test.ts`**

```ts
import { tiltAngles } from "./tilt";

const box = { width: 200, height: 100 };

describe("tiltAngles", () => {
  it("중앙에서는 기울지 않는다", () => {
    expect(tiltAngles({ x: 100, y: 50, ...box })).toEqual({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 });
  });

  it("오른쪽 아래 모서리는 최대 각도(기본 4°)", () => {
    const result = tiltAngles({ x: 200, y: 100, ...box });
    expect(result.rotateY).toBe(4);
    expect(result.rotateX).toBe(-4);
    expect(result.glowX).toBe(100);
    expect(result.glowY).toBe(100);
  });

  it("범위 밖 좌표는 최대 각도를 넘지 않는다", () => {
    const result = tiltAngles({ x: 9999, y: -9999, ...box });
    expect(Math.abs(result.rotateX)).toBeLessThanOrEqual(4);
    expect(Math.abs(result.rotateY)).toBeLessThanOrEqual(4);
    expect(result.glowX).toBeLessThanOrEqual(100);
    expect(result.glowY).toBeGreaterThanOrEqual(0);
  });

  it("max 인자를 따른다", () => {
    expect(tiltAngles({ x: 200, y: 50, ...box, max: 10 }).rotateY).toBe(10);
  });

  it("크기가 0이거나 NaN이면 중립값(NaN·-0 없음)", () => {
    const neutral = { rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 };
    expect(tiltAngles({ x: 10, y: 10, width: 0, height: 100 })).toEqual(neutral);
    expect(tiltAngles({ x: 10, y: 10, width: 100, height: 0 })).toEqual(neutral);
    expect(tiltAngles({ x: Number.NaN, y: 10, ...box })).toEqual(neutral);
    expect(Object.is(tiltAngles({ x: 100, y: 50, ...box }).rotateX, 0)).toBe(true);
  });
});
```

- [ ] **Step 2: 실패 확인**

Run: `npx vitest run src/lib/tilt.test.ts`
Expected: FAIL — `./tilt` 모듈 없음

- [ ] **Step 3: `src/lib/tilt.ts`**

```ts
type TiltInput = { x: number; y: number; width: number; height: number; max?: number };
type Tilt = { rotateX: number; rotateY: number; glowX: number; glowY: number };

const NEUTRAL: Tilt = { rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 };

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// -0을 만들지 않도록 +0을 더한다.
function round(value: number): number {
  return Math.round(value * 100) / 100 + 0;
}

export function tiltAngles({ x, y, width, height, max = 4 }: TiltInput): Tilt {
  if (![x, y, width, height, max].every(Number.isFinite) || width <= 0 || height <= 0) return { ...NEUTRAL };

  const nx = clamp((x / width) * 2 - 1, -1, 1);
  const ny = clamp((y / height) * 2 - 1, -1, 1);

  return {
    rotateX: round(-ny * max),
    rotateY: round(nx * max),
    glowX: round((nx + 1) * 50),
    glowY: round((ny + 1) * 50)
  };
}
```

- [ ] **Step 4: 통과 확인**

Run: `npx vitest run src/lib/tilt.test.ts`
Expected: PASS (5 tests)

- [ ] **Step 5: `TiltTile`**

```tsx
// src/components/TiltTile/TiltTile.tsx
"use client";

import { LazyMotion, MotionConfig, domAnimation, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useState, type PointerEvent, type ReactNode } from "react";
import { tiltAngles } from "@/lib/tilt";
import styles from "./TiltTile.module.scss";

const SPRING = { stiffness: 220, damping: 22, mass: 0.6 };

export function TiltTile({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const [canHover, setCanHover] = useState(false);
  const rotateX = useSpring(useMotionValue(0), SPRING);
  const rotateY = useSpring(useMotionValue(0), SPRING);
  const enabled = canHover && !reduceMotion;

  useEffect(() => {
    const query = window.matchMedia("(hover: hover)");
    const update = () => setCanHover(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    if (!enabled) return;
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const angles = tiltAngles({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      width: rect.width,
      height: rect.height
    });
    rotateX.set(angles.rotateX);
    rotateY.set(angles.rotateY);
    element.style.setProperty("--glow-x", `${angles.glowX}%`);
    element.style.setProperty("--glow-y", `${angles.glowY}%`);
    element.style.setProperty("--glow-opacity", "1");
  }

  function handleLeave(event: PointerEvent<HTMLDivElement>) {
    rotateX.set(0);
    rotateY.set(0);
    event.currentTarget.style.setProperty("--glow-opacity", "0");
  }

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <m.div
          className={styles.tilt}
          style={{ rotateX, rotateY, transformPerspective: 900 }}
          onPointerMove={handleMove}
          onPointerLeave={handleLeave}
        >
          {children}
        </m.div>
      </MotionConfig>
    </LazyMotion>
  );
}
```

```scss
// src/components/TiltTile/TiltTile.module.scss
.tilt {
  position: relative;
  height: 100%;
  border-radius: var(--radius-tile);

  // 포인터를 따라다니는 빛 번짐 (장식, 클릭을 가로채지 않는다).
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    opacity: var(--glow-opacity, 0);
    pointer-events: none;
    background: radial-gradient(
      circle at var(--glow-x, 50%) var(--glow-y, 50%),
      color-mix(in srgb, var(--band-fg) 14%, transparent),
      transparent 60%
    );
    transition: opacity var(--duration-base) var(--ease-out);
  }
}
```

- [ ] **Step 6: `ProjectsBands.tsx` — 개인 프로젝트 타일을 `TiltTile`로 감싼다**

`import { SectionTitle } …` 아래에 추가: `import { TiltTile } from "@/components/TiltTile/TiltTile";`

개인 프로젝트 `li` 안을 교체:

```tsx
            <li key={project.slug}>
              <TiltTile>
                <ProjectTile project={project} withImage />
              </TiltTile>
            </li>
```

- [ ] **Step 7: `SiteNav.tsx` 전체 교체** (알약이 항목 사이를 스프링으로 이동)

```tsx
// src/components/SiteNav/SiteNav.tsx
"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import * as m from "motion/react-m";
import Link from "next/link";
import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { MobileMenu } from "@/components/MobileMenu/MobileMenu";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import { profile } from "@/data/profile";
import type { NavItem } from "@/data/types";
import { navHref } from "@/lib/nav";
import { useActiveSection } from "@/lib/useActiveSection";
import styles from "./SiteNav.module.scss";

type SiteNavProps = { items: NavItem[]; label: string; spy: boolean };
type PillRect = { x: number; width: number };

const SPRING = { type: "spring", stiffness: 380, damping: 32 } as const;

function measure(element: Element | null | undefined): PillRect | null {
  if (!(element instanceof HTMLElement)) return null;
  return { x: element.offsetLeft, width: element.offsetWidth };
}

export function SiteNav({ items, label, spy }: SiteNavProps) {
  const activeId = useActiveSection(
    items.map((item) => item.id),
    spy
  );
  const listRef = useRef<HTMLUListElement>(null);
  const [activeRect, setActiveRect] = useState<PillRect | null>(null);
  const [hoverRect, setHoverRect] = useState<PillRect | null>(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const update = () => setActiveRect(measure(list.querySelector('[aria-current="location"]')));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(list);
    return () => observer.disconnect();
  }, [activeId]);

  function showHover(event: SyntheticEvent<HTMLElement>) {
    setHoverRect(measure(event.currentTarget));
    setHovering(true);
  }

  function hideHover() {
    setHovering(false);
  }

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <header className={styles.header}>
          <div className={styles.bar}>
            <Link className={styles.brand} href="/">
              {profile.name}
            </Link>
            <nav className={styles.nav} aria-label={label}>
              <ul ref={listRef} className={styles.list}>
                {activeRect ? (
                  <m.span
                    aria-hidden="true"
                    className={styles.activePill}
                    initial={false}
                    animate={{ x: activeRect.x, width: activeRect.width }}
                    transition={SPRING}
                  />
                ) : null}
                {hoverRect ? (
                  <m.span
                    aria-hidden="true"
                    className={styles.hoverPill}
                    initial={false}
                    animate={{ x: hoverRect.x, width: hoverRect.width, opacity: hovering ? 1 : 0 }}
                    transition={SPRING}
                  />
                ) : null}
                {items.map((item) => (
                  <li key={item.id}>
                    <Link
                      className={styles.link}
                      href={navHref(item.id, spy)}
                      aria-current={item.id === activeId ? "location" : undefined}
                      onPointerEnter={showHover}
                      onPointerLeave={hideHover}
                      onFocus={showHover}
                      onBlur={hideHover}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className={styles.actions}>
              <ThemeToggle />
              <MobileMenu items={items} label={label} spy={spy} activeId={activeId} />
            </div>
          </div>
        </header>
      </MotionConfig>
    </LazyMotion>
  );
}
```

- [ ] **Step 8: `SiteNav.module.scss` — CSS 활성 배경을 알약 요소로 교체**

`.link { … }` 블록 안의 `&[aria-current="location"]` 규칙에서 `background` 줄을 삭제한다(굵기만 남김).

```scss
  &[aria-current="location"] {
    font-weight: var(--font-weight-semibold);
  }
```

`.list { … }` 블록 뒤에 추가:

```scss
.activePill,
.hoverPill {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  height: 100%;
  border-radius: var(--radius-pill);
  pointer-events: none;
}

.activePill {
  background: color-mix(in srgb, var(--band-fg) 10%, transparent);
}

.hoverPill {
  background: color-mix(in srgb, var(--band-fg) 6%, transparent);
}
```

- [ ] **Step 9: `MobileMenu.tsx` 전체 교체** (스프링으로 열리고 항목이 순서대로 나타남)

```tsx
// src/components/MobileMenu/MobileMenu.tsx
"use client";

import { AnimatePresence, LazyMotion, MotionConfig, domAnimation } from "motion/react";
import * as m from "motion/react-m";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { uiCopy } from "@/data/site";
import type { NavItem } from "@/data/types";
import { navHref } from "@/lib/nav";
import styles from "./MobileMenu.module.scss";

type MobileMenuProps = { items: NavItem[]; label: string; spy: boolean; activeId?: string };

const PANEL_SPRING = { type: "spring", stiffness: 420, damping: 34 } as const;

export function MobileMenu({ items, label, spy, activeId }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <div className={styles.root}>
          <button
            ref={buttonRef}
            type="button"
            className={styles.button}
            aria-expanded={open}
            aria-controls={open ? panelId : undefined}
            aria-label={open ? uiCopy.menuClose : uiCopy.menuOpen}
            onClick={() => setOpen((value) => !value)}
          >
            <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                d={open ? "M6 6l12 12M18 6L6 18" : "M4 8h16M4 16h16"}
              />
            </svg>
          </button>
          <AnimatePresence>
            {open ? (
              <m.div
                key="panel"
                id={panelId}
                className={styles.panel}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={PANEL_SPRING}
              >
                <nav aria-label={label}>
                  <ul className={styles.list}>
                    {items.map((item, index) => (
                      <m.li
                        key={item.id}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...PANEL_SPRING, delay: 0.04 * index }}
                      >
                        <Link
                          className={styles.link}
                          href={navHref(item.id, spy)}
                          aria-current={item.id === activeId ? "location" : undefined}
                          onClick={() => setOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </m.li>
                    ))}
                  </ul>
                </nav>
              </m.div>
            ) : null}
          </AnimatePresence>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
```

- [ ] **Step 10: `MobileMenu.module.scss` — CSS 진입 애니메이션 삭제**

파일 맨 위의 `@keyframes menu-in { … }` 블록 전체와 `.panel` 안의 아래 부분을 삭제한다.

```scss
  @media (prefers-reduced-motion: no-preference) {
    animation: menu-in var(--duration-fast) var(--ease-out);
  }
```

- [ ] **Step 11: 자동 검증**

Run: `npm run lint && npm test && npm run build`
Expected: 통과(테스트 5개 증가). 타입 오류가 `motion/react-m` 가져오기에서 나면 `import * as m from "motion/react-m"` 형태가 맞는지 먼저 확인하고, 그래도 안 되면 정확한 오류를 보고하고 BLOCKED로 중단한다(`motion` 전체 import로 우회하지 않는다).

- [ ] **Step 12: 브라우저 검증** (`preview_start {name:"dev"}`)

1. 1280px: 내비 링크 위를 지나가면 hover 알약이 항목 사이를 미끄러지고, 스크롤로 현재 섹션이 바뀌면 활성 알약이 이동한다(`.activePill`의 `transform`/`width`가 바뀜). 맨 위에서는 첫 항목에 알약이 있음.
2. 개인 프로젝트 타일에서 마우스를 움직이면 ±4° 안에서 기울고 빛이 따라다니며, 벗어나면 원위치. 터치 에뮬레이션(`resize_window` 모바일 프리셋)에서는 기울지 않음. 타일 클릭은 여전히 상세 페이지로 이동(장식 래퍼가 클릭을 막지 않음).
3. 360px: 메뉴 버튼 → 패널이 열리며 항목이 순서대로 나타남, 링크 클릭·Escape로 닫힘(Escape 후 `document.activeElement`가 버튼), `aria-expanded` 값 정확.
4. `window.getComputedStyle`로 모션이 `transform`/`opacity`/알약 `width`뿐인지 확인. 움직임 줄이기는 에뮬레이션이 안 되면 `MotionConfig reducedMotion="user"`와 `useReducedMotion` 사용을 소스로 확인하고 "에뮬레이션 불가"로 보고.
5. `resize_window` preset "desktop", `preview_stop`.

- [ ] **Step 13: Commit**

```bash
git add src/lib/tilt.ts src/lib/tilt.test.ts src/components
git commit -m "feat: 내비 알약·모바일 메뉴·개인 프로젝트 타일 기울기를 Motion으로 구현"
```

---

### Task 9: 옛 컴포넌트와 옛 토큰 삭제

**Files:**
- Delete: `src/components/Sidebar/`, `src/components/MobileHeader/`, `src/components/PageShell/`, `src/components/Backdrop/`, `src/components/ButtonLink/`, `src/components/SectionNav/`, `src/components/SectionHeading/`, `src/components/AboutSection/`, `src/components/CareerSection/`, `src/components/ProjectsSection/`, `src/components/SkillsSection/`, `src/components/EducationSection/`
- Modify: `src/styles/_colors.scss`, `src/styles/_typography.scss`, `src/styles/_mixins.scss`, `src/styles/globals.scss`, `src/styles/colors.test.ts` (`LEGACY(Task 9)` 블록 삭제)

- [ ] **Step 1: 삭제 대상을 참조하는 곳이 없는지 확인**

```bash
grep -rnE "components/(Sidebar|MobileHeader|PageShell|Backdrop|ButtonLink|SectionNav|SectionHeading|AboutSection|CareerSection|ProjectsSection|SkillsSection|EducationSection)/" src --include=*.ts --include=*.tsx | grep -vE "^src/components/(Sidebar|MobileHeader|PageShell|Backdrop|ButtonLink|SectionNav|SectionHeading|AboutSection|CareerSection|ProjectsSection|SkillsSection|EducationSection)/"
```
Expected: 출력 없음(삭제 대상 폴더 밖에서의 참조가 없다). 출력이 있으면 그 파일을 먼저 새 컴포넌트로 바꾸고 BLOCKED로 보고한다.

- [ ] **Step 2: 옛 컴포넌트 삭제**

```bash
git rm -r -q src/components/Sidebar src/components/MobileHeader src/components/PageShell src/components/Backdrop src/components/ButtonLink src/components/SectionNav src/components/SectionHeading src/components/AboutSection src/components/CareerSection src/components/ProjectsSection src/components/SkillsSection src/components/EducationSection
```

- [ ] **Step 3: `LEGACY(Task 9)` 블록 삭제**

```bash
node -e '
const fs=require("fs");
const files=["src/styles/_colors.scss","src/styles/_typography.scss","src/styles/_mixins.scss","src/styles/globals.scss","src/styles/colors.test.ts"];
let removed=0;
for (const f of files) {
  const s=fs.readFileSync(f,"utf8");
  const out=s.replace(/[ \t]*\/\/ LEGACY\(Task 9\) 시작[\s\S]*?\/\/ LEGACY\(Task 9\) 끝\r?\n?/g,()=>{removed++;return ""});
  fs.writeFileSync(f,out);
}
console.log("removed blocks:",removed)'
grep -rn "LEGACY" src || echo "LEGACY 표시 없음"
```
Expected: `removed blocks: 8`(`_colors` 1, `_typography` 2, `_mixins` 1, `globals` 3, `colors.test.ts` 1), 마지막 줄 `LEGACY 표시 없음`

- [ ] **Step 4: 옛 토큰 참조가 남지 않았는지 확인**

```bash
grep -rnE "var\(--(color-(bg|surface|text|text-sub|decor|tint|tint-2|accent|on-accent|glass|glass-border|border)|header-offset|sidebar-width|content-max|radius-(sm|md|lg)|font-weight-bold)\)|text\((display|heading-1|heading-2)\)|@include glass;" src || echo "옛 토큰 참조 없음"
```
Expected: `옛 토큰 참조 없음`. 출력이 있으면 해당 파일을 새 토큰으로 고친 뒤 다시 확인한다(고친 내용은 보고서에 남긴다).

- [ ] **Step 5: 전체 검증**

Run: `npm run lint && npm test && npm run build`
Expected: 통과. 테스트 개수는 옛 토큰 대비 테스트 14개가 줄어든 값(Task 8 이후 개수에서 -14).

- [ ] **Step 6: Commit**

```bash
git add -A src
git commit -m "chore: 사이드바 구조의 옛 컴포넌트와 모카 팔레트 옛 토큰을 삭제"
```

---

### Task 10: 문서 갱신과 아이콘·OG 이미지 교체

**Files:**
- Modify: `CLAUDE.md`, `AGENTS.md`, `README.md`, `docs/superpowers/specs/2026-10-14-apple-style-redesign-design.md`, `docs/superpowers/specs/2026-10-02-portfolio-renewal-design.md`, `src/app/icon.tsx`, `src/app/opengraph-image.tsx`

- [ ] **Step 1: `src/app/icon.tsx`** — 배경·글자색 교체

`background: "#A0522D",` → `background: "#0071E3",`
`color: "#F7F0F5",` → `color: "#FFFFFF",`

- [ ] **Step 2: `src/app/opengraph-image.tsx`** — 색 교체

`background: "#F7F0F5",` → `background: "#F5F5F7",`
`color: "#433633",` → `color: "#1D1D1F",`
`color: "#A0522D"` (직함 줄) → `color: "#0071E3"`

- [ ] **Step 3: `CLAUDE.md` 전체 교체** (`AGENTS.md`는 첫 줄 제목만 `# AGENTS.md — AI 에이전트 작업 가이드`로 바꾸고 나머지는 동일)

````markdown
# CLAUDE.md — AI 에이전트 작업 가이드

이 저장소에서 AI 도구로 작업할 때 따르는 규칙이다. 사람이 작업하든 AI가 작업하든
같은 기준(구조·컨벤션·접근성·완료 기준)을 적용해 일관성과 품질을 유지한다.
설계 기준 문서: `docs/superpowers/specs/2026-10-14-apple-style-redesign-design.md`

## 콘텐츠 원칙

- 사이트는 범용 이력서의 웹 확장판이다. 특정 지원처를 언급하지 않는다. 경력상의 회사·고객사는 실명을 쓴다.
- 콘텐츠·UI 문구는 `src/data/`에만 둔다. 컴포넌트에 문구를 하드코딩하지 않는다.
- 연락처는 이메일·GitHub만 노출한다. 전화번호·거주지는 넣지 않는다 (`data.test.ts`가 검사).
- 개인 프로젝트 저장소(money_book, dev_study 등)는 이 저장소에서 수정하지 않는다.

## 범위

- 라우트: `/`(메인 원페이지), `/projects/[slug]`(상세, 정적 생성), 404
- 새 페이지·기능·의존성은 즉흥적으로 추가하지 않고 기록한 뒤 판단한다.
- 범위 밖: 블로그·MDX·CMS, 다국어, Tailwind, 분석 도구, 문의 폼, SF Pro 글꼴

## 기술 스택 · 컨벤션

- Next.js App Router + React + TypeScript + SCSS Modules + Vercel
- 컴포넌트: `src/components/<Name>/<Name>.tsx` + `<Name>.module.scss`
- Server Component 기본. client component는 `ThemeToggle`, `SiteNav`, `MobileMenu`, `TiltTile`뿐이다. 늘리려면 이유를 기록한다.
- 이미지 `next/image`(alt 필수), 폰트 `next/font/local`(Pretendard 단일)

## 스타일 규칙

- 토큰 원본: `src/styles/_colors.scss`(띠 톤·프라이머리·유리), `_typography.scss`(타이포), `globals.scss`(간격·모양·시간)
- 색은 띠 톤 토큰(`--band-bg|fg|sub|mute|link|tile|focus|border`)만 쓴다. 톤은 `Band`(`data-tone="canvas|white|ink"`)가 바꿔 준다. 컴포넌트에서 색 값을 직접 쓰지 않는다.
- 모듈 SCSS에서 색상 값, `font-size`, 간격 숫자를 직접 쓰지 않는다. `var(--…)` 토큰과 믹스인만 쓴다.
  (예외: `0`, `1px` 테두리, `2px` 포커스 링·표시, 비율·퍼센트, `aspect-ratio`, `scale()` 같은 무차원 값)
- 타이포는 `@include text(hero|section|tile|lead|body|body-sm|caption|overline|button|button-sm)`로만 적용한다.
- 반응형 글자 크기는 토큰 값 재정의로 처리한다. 컴포넌트에 글자 크기용 media query를 두지 않는다.
- 브레이크포인트 믹스인 `up(md|lg)` / `down(md|lg)` — md 768px, lg 1024px, 모바일 우선
- `--band-mute`는 캡션 전용(14px 미만 보조 문구). 색상 토큰을 바꾸면 `npm test`의 대비 테스트(4.5:1)를 통과해야 한다.
- 유리 효과(`@include glass-bar`)는 `SiteNav`와 `MobileMenu` 패널에만 쓴다. 그림자는 쓰지 않는다.

## 모션 규칙

- 스크롤 연동·등장·hover는 CSS로, 내비 알약·모바일 메뉴·타일 기울기만 Motion 라이브러리로 구현한다.
- Motion은 `LazyMotion features={domAnimation}`과 `import * as m from "motion/react-m"`만 쓴다. `layoutId`·드래그는 쓰지 않는다(`domMax` 필요). Motion을 쓰는 client component는 각자 `LazyMotion`과 `MotionConfig reducedMotion="user"`로 감싼다.
- CSS 모션은 `@media (prefers-reduced-motion: no-preference)`와 스크롤 연동은 `@supports (animation-timeline: view())` 안에서만 선언한다 (`motion-guard.test.ts`가 검사). 모션이 꺼져도 내용은 항상 보여야 한다.
- 시간 0.2~0.8초(0.8초는 히어로 진입 한정), `transform`·`opacity` 위주. 스크롤 가로채기, 자동 재생, 무한 반복(marquee 등)은 쓰지 않는다.

## 접근성 (모든 UI 작업의 기본)

- 랜드마크(`header`/`nav`/`main`/`footer`), 페이지당 `h1` 하나, 제목 단계 건너뛰지 않기
- 클릭 요소는 `button` 또는 `a`. 링크 안에 다른 인터랙티브 요소를 넣지 않는다.
- `:focus-visible` 포커스 링 필수, 키보드만으로 모든 링크·토글·모바일 메뉴 접근 가능
- 외부 링크는 새 창 + 스크린리더용 "(새 창)" 안내 (`TextLink`, `PillButton` 사용)
- 색상만으로 의미를 전달하지 않는다 (현재 메뉴: 색 + 굵기 + 알약 표시)

## 완료 기준 (모든 화면 작업)

- [ ] 360px · 768px · 1280px × 라이트 · 다크에서 레이아웃 확인, 가로 스크롤 없음
- [ ] 키보드 탐색 순서와 포커스 링 확인
- [ ] 위 스타일·모션 규칙과 접근성 항목 준수
- [ ] `npm run lint`, `npm test`, `npm run build` 통과

## 커밋 규칙

- 한 커밋 = 한 가지 변경. 큰 작업은 의미 단위로 쪼갠다.
- 메시지는 무엇을 왜 바꿨는지 구체적으로. 뭉뚱그린 요약 금지
  - 나쁜 예: `fix: address review issues`, `chore: update stuff`
  - 좋은 예: `fix: 모바일 메뉴가 Escape로 닫히지 않던 문제 수정`, `content: 위시드콘 카드 요약 문구 수정`
- 한국어 메시지 허용. 타입 접두어: feat/fix/content/chore/style/docs/test
- 커밋에 서명·트레일러(Co-Authored-By 등)를 붙이지 않는다
- 배포 가능한 상태를 유지하며 단계 단위로 커밋한다
````

- [ ] **Step 4: `README.md`의 "구현 원칙" 목록 교체** (그 위·아래는 유지)

```markdown
## 구현 원칙

- Next.js App Router의 Server Component를 기본으로 하고, 테마 토글·상단 내비·모바일 메뉴·타일 기울기만 Client Component로 구현했습니다.
- 콘텐츠는 `src/data/`의 타입 있는 데이터로 분리하고, 컴포넌트는 이를 렌더링만 합니다.
- 전체 폭 "띠"가 밝음·흰색·검정으로 번갈아 나오는 구조이며, 색상은 띠 톤 단위 CSS 변수 토큰으로, 타이포는 의미 토큰과 믹스인으로 정의합니다. 컴포넌트 스타일(SCSS Modules)은 토큰과 믹스인만 사용합니다.
- 라이트·다크 테마는 같은 의미 토큰에 모드별 값을 연결하며, 모든 톤·테마 조합의 텍스트 대비 4.5:1 이상을 테스트로 검증합니다.
- 스크롤 연동 모션은 CSS(`animation-timeline`)로, 내비 알약·모바일 메뉴·타일 기울기는 Motion(`LazyMotion`)으로 구현하고, 모든 모션은 움직임 줄이기 설정을 따릅니다.
```

- [ ] **Step 5: 스펙 문서 반영** — `docs/superpowers/specs/2026-10-14-apple-style-redesign-design.md`

다음을 수정한다(계획 상단 "스펙 대비 의도된 차이" 6개를 그대로 반영).
1. 6.1 표의 "히어로 진입" 행: "첫 로드에서 제목이 줄 단위로 순차 등장. 줄 단위로만 나눠 스크린리더가 읽는 문장은 그대로" → "첫 로드에서 오버라인 → 제목 → 문장 → 버튼이 블록 단위로 순차 등장(문장은 쪼개지 않아 스크린리더가 읽는 내용은 그대로)".
2. 5.2 표에 `button`(17px/22px, 400, -0.022em)과 `button-sm`(14px/18px, 400, -0.016em) 행 추가(알약 버튼 44px·36px용).
3. 5.1의 `--tile-bg` → `--band-tile` (표 두 곳).
4. 4.3에 "섹션 목차는 서버 컴포넌트로 현재 위치 강조 없는 점프 링크" 한 줄 추가.
5. 6의 첫 문단 "움직이는 속성은 `transform`과 `opacity`뿐" 뒤에 "(내비 알약의 `width`는 예외)" 추가.
6. 6.1 "타일 hover" 행의 `scale(1.02)`에 "개별 속성 `scale` 사용(등장 애니메이션의 transform과 충돌 방지)" 추가.
7. 문서 맨 위 상태 줄을 "상태: 구현 완료(검증 대기)"로 변경.

그리고 `docs/superpowers/specs/2026-10-02-portfolio-renewal-design.md` 맨 위 "상태" 줄 아래에 한 줄 추가: `> 2026-10-14: 레이아웃·토큰·모션·컴포넌트 구성은 애플 스타일 리디자인 설계(2026-10-14-apple-style-redesign-design.md)로 대체되었다. 이 문서의 콘텐츠·데이터·접근성·검증 기준은 유효하다.`

- [ ] **Step 6: 검증**

```bash
grep -rn "A0522D\|F7F0F5\|모카\|테라코타\|SectionNav\|Sidebar" CLAUDE.md AGENTS.md README.md src || echo "옛 흔적 없음"
diff <(tail -n +2 CLAUDE.md) <(tail -n +2 AGENTS.md) && echo "CLAUDE/AGENTS 동일"
npm run lint && npm test && npm run build
```
Expected: `옛 흔적 없음`(예외: README의 과거 서술이 남아 있으면 지우고 보고), `CLAUDE/AGENTS 동일`, 빌드 통과

- [ ] **Step 7: Commit (두 개로 나눈다)**

```bash
git add src/app/icon.tsx src/app/opengraph-image.tsx
git commit -m "style: 아이콘과 OG 이미지를 새 팔레트(파랑·회색)로 교체"
git add CLAUDE.md AGENTS.md README.md docs/superpowers/specs
git commit -m "docs: 애플 스타일 구조에 맞춰 작업 규칙·README·설계 문서를 갱신"
```

---

### Task 11: 최종 검증 (코드 변경 없음)

**Files:** 없음 (결함 발견 시 보고만 하고, 수정은 별도 단계에서 한다)

- [ ] **Step 1: 자동 검증**

Run: `npm run lint && npm test && npm run build`
Expected: 모두 통과. 정적 생성 라우트: `/`, `/projects/*` 8개, `/icon`, `/opengraph-image`, 404.

- [ ] **Step 2: 추가 JavaScript 크기 측정**

```bash
node -e '
const fs=require("fs"),zlib=require("zlib"),path=require("path");
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const total=walk(".next/static").filter(f=>f.endsWith(".js")).reduce((s,f)=>s+zlib.gzipSync(fs.readFileSync(f)).length,0);
const base=Number(fs.readFileSync(process.argv[1],"utf8"));
console.log("now",total,"baseline",base,"delta KB",((total-base)/1024).toFixed(1))' "$(git rev-parse --git-path sdd)/js-baseline.txt"
```
Expected: `delta KB`가 약 20 이하. 초과하면 수치를 그대로 보고하고 이유(어떤 청크가 늘었는지 `ls -la .next/static/chunks`)를 덧붙인다.

- [ ] **Step 3: 프로덕션 빌드 화면 검증**

`.claude/launch.json`에 `prod` 구성(`npm run start`, port 3000, autoPort)을 임시로 추가해 `preview_start {name:"prod"}`로 실행한다. **끝나면 `git checkout -- .claude/launch.json`으로 원상 복구하고 커밋하지 않는다.**

대상: `/`, `/projects/monibuk`(이미지 4장), `/projects/weseedcon`(이미지 없음), `/projects/nope`(404). 각 360 / 768 / 1280px × 라이트 / 다크.
1. 모든 조합에서 `scrollWidth <= innerWidth`, 긴 제목이 타일 밖으로 넘치지 않음.
2. 띠 교차와 가독성, 다크의 `white` 띠(`#101012`)와 타일 구분이 보이는지 스크린샷으로 확인하고 판단을 서술.
3. 키보드만으로: 본문 바로가기 → 내비 → 토글 → 히어로 버튼 → 타일(전체 포커스 링) → 상세 → 로컬 내비 → 외부 링크 → 이전/다음 → 푸터. 모바일 메뉴 Escape·포커스 복귀.
4. 다크 선택 후 새로고침 시 깜빡임 없음, 원형 테마 전환 동작, 콘솔 오류·hydration 경고 없음(`read_console_messages`).
5. 앵커 이동 후 제목이 고정 내비·로컬 내비에 가려지지 않음(`getBoundingClientRect().top` 수치).
6. 모션: 스크롤 등장·히어로 퇴장·내비 알약·타일 기울기가 동작하고 내용이 투명하게 남지 않음. 움직임 줄이기는 에뮬레이션이 안 되면 "에뮬레이션 불가, CSS 규칙 존재만 확인"으로 보고.
7. 빌드 CSS에 대체 규칙이 들어갔는지: `grep -l "prefers-reduced-transparency" .next/static/chunks/*.css` → 1개 이상.

- [ ] **Step 4: Lighthouse 접근성**

`npx lighthouse http://localhost:<port>/ --only-categories=accessibility --quiet --chrome-flags="--headless" --output=json --output-path=./.git/sdd/lh-home.json` (포트는 preview가 알려준 값). `/projects/monibuk`도 같은 방식. 결과 JSON은 `.git/sdd/`에 쓴다(저장소 트리에 남기지 않는다). Chrome/lighthouse를 쓸 수 없으면 "측정 못 함"으로 보고하고 대신 랜드마크·제목·라벨을 DOM으로 점검한다. 점수를 측정하지 않았으면 점수를 쓰지 않는다.

- [ ] **Step 5: 정리와 보고**

`resize_window` preset "desktop", `preview_stop`, `.claude/launch.json` 복구, `git status --short`에 `portfolio-content-design.md`만 남았는지 확인.

보고: 커밋 목록(`git log --oneline main..redesign/apple-style`), 테스트·빌드 결과, JS 증가량, 접근성 점수(또는 "측정 못 함"), 화면 확인 결과(스크린샷 설명), 발견한 결함(심각도·URL·폭·테마·권장 수정). **push·미리보기 배포·`main` 병합은 하지 않는다.**
