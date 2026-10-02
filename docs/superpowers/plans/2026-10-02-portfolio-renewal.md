# 포트폴리오 전면 개편 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 범용 이력서(`C:\dev\resume\박현규_범용_.md`)를 웹으로 확장한 포트폴리오(메인 원페이지 + 프로젝트 상세 6개)를 기존 코드 없이 새로 만든다.

**Architecture:** Next.js 16 App Router, Server Component 기본. 콘텐츠는 `src/data/`의 타입 있는 TS 객체, 표현은 SCSS Modules + 전역 CSS 변수 토큰(색상·타이포·간격). client component는 `ThemeToggle`, `SectionNav` 두 개뿐이고, 테마는 `<head>` 인라인 스크립트로 첫 렌더 전에 결정한다.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Sass(SCSS Modules), next/font/local(Pretendard), Vitest 3, ESLint 9(eslint-config-next 16 flat config)

**설계 문서:** `docs/superpowers/specs/2026-10-02-portfolio-renewal-design.md` — 판단이 필요하면 설계 문서가 기준이다.

## Global Constraints

- 작업 브랜치: `renewal` (이미 생성됨). `main`에 직접 커밋하지 않는다. push는 사용자 확인 후에만 한다.
- 커밋: 한 커밋 = 한 가지 변경, 한국어 메시지 허용, 타입 접두어 `feat`/`fix`/`content`/`chore`/`style`/`docs`/`test`. **Co-Authored-By 등 트레일러·서명 금지.**
- 각 Task 끝에서 `npm run lint`, `npm test`, `npm run build`가 모두 통과해야 한다 (배포 가능한 상태 유지).
- 컴포넌트 `.module.scss`에서 색상 값(hex/rgb), `font-size`, 간격 숫자(px/rem)를 직접 쓰지 않는다. 토큰(`var(--…)`)과 믹스인만 쓴다. 예외: `0`, `1px` 테두리 두께, `2px` 포커스 링/표시 막대 두께, `100%`·`50%` 같은 비율.
- 타이포는 반드시 `@include text(<role>)`로 적용. role: `display`, `heading-1`, `heading-2`, `body`, `body-sm`, `caption`, `overline`.
- 컴포넌트 스타일 파일은 첫 줄에 상대 경로로 믹스인을 불러온다: `@use "../../styles/mixins" as *;` (src/components/X/ 기준). `src/app/` 아래는 깊이에 맞춰 상대 경로를 조정한다.
- client component는 `ThemeToggle`, `SectionNav`만. 다른 컴포넌트에 `"use client"` 추가 금지.
- 콘텐츠·UI 문구는 `src/data/`에만 둔다. 컴포넌트에 한국어 문구 하드코딩 금지.
- 연락처는 이메일·GitHub만. 전화번호·거주지를 어떤 파일에도 넣지 않는다.
- 색상 토큰 값 (설계 5.1):
  - 라이트: bg `#F7F0F5`, surface `#FFFFFF`, glass `rgba(247, 240, 245, 0.55)`, glass-border `rgba(255, 255, 255, 0.6)`, border `rgba(67, 54, 51, 0.1)`, text `#433633`, text-sub `#5C5552`, decor `#8F857D`, tint `#DECBB7`, tint-2 `#E9D8E4`, accent `#A0522D`, on-accent `#F7F0F5`
  - 다크: bg `#1C1719`, surface `#262023`, glass `rgba(75, 59, 71, 0.35)`, glass-border `rgba(224, 216, 222, 0.12)`, border `rgba(224, 216, 222, 0.1)`, text `#E0D8DE`, text-sub `#9C9990`, decor `#6A6262`, tint `#4B3B47`, tint-2 `rgba(207, 210, 178, 0.12)`, accent `#E0956B`, on-accent `#1C1719`
- `--color-decor`는 텍스트 색으로 쓰지 않는다.
- 모든 움직임은 `prefers-reduced-motion: reduce`에서 꺼진다.
- 브레이크포인트: `md` 768px, `lg` 1024px (모바일 우선, `min-width`). 최소 지원 폭 360px.

## File Structure

```
eslint.config.mjs            ESLint flat config (Next 16)
vitest.config.ts             @ 별칭, node 환경
next.config.ts               reactStrictMode
src/
  app/
    layout.tsx               html/head(테마 스크립트)/body, 폰트, 메타데이터, SkipLink, Backdrop
    page.tsx                 메인 원페이지
    not-found.tsx            404
    not-found.module.scss
    projects/[slug]/page.tsx 프로젝트 상세 (정적 생성)
  styles/
    _colors.scss             라이트/다크 색상 맵 + emit 믹스인 (토큰 원본)
    _typography.scss         기본값·의미 타이포 토큰
    _mixins.scss             up/down, text, focus-ring, visually-hidden, glass, reveal
    globals.scss             :root 토큰 출력, 테마, reset, 전역 기본, view transition
    colors.test.ts           토큰 대비 4.5:1 검증
  lib/
    contrast.ts(.test.ts)    WCAG 대비 계산, SCSS 맵 파서
    theme.ts(.test.ts)       테마 결정 규칙, 인라인 스크립트, applyTheme
    format.ts(.test.ts)      기간 표기
    projects.ts(.test.ts)    slug 조회, 이전/다음, 상세 목차
  data/
    types.ts                 모든 콘텐츠 타입
    site.ts                  메타, 섹션 내비, UI 문구
    profile.ts career.ts projects.ts skills.ts education.ts
    data.test.ts             데이터 무결성
  components/<Name>/<Name>.tsx + <Name>.module.scss
    SkipLink Backdrop ThemeToggle SectionNav ContactLinks TextLink ButtonLink Tag
    SectionHeading Sidebar MobileHeader PageShell
    AboutSection CareerSection(+CareerItem) ProjectsSection(+ProjectCard) SkillsSection EducationSection
    ProjectHeader ProjectBody ProjectGallery ProjectPager
```

---

### Task 1: 기존 코드 제거와 Next.js 16 골격

**Files:**
- Delete: `src/` 전체
- Modify: `package.json`, `eslint.config.mjs`, `vitest.config.ts`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/styles/globals.scss`

**Interfaces:**
- Produces: `@/*` → `src/*` 별칭(Next·Vitest 공통), 폰트 CSS 변수 `--font-pretendard`, 전역 스타일 진입점 `src/styles/globals.scss`

- [ ] **Step 1: Node 버전 확인**

Run: `node -v`
Expected: `v20.9.0` 이상 (Next 16 요구사항)

- [ ] **Step 2: 기존 소스 제거**

```bash
git rm -r -q src
```

- [ ] **Step 3: 의존성 갱신**

```bash
npm uninstall @testing-library/dom @testing-library/react
npm install next@latest react@latest react-dom@latest
npm install -D eslint-config-next@latest @types/react@latest @types/react-dom@latest
```

Expected: `package.json`의 `next`, `eslint-config-next`가 `^16.x`

- [ ] **Step 4: `eslint.config.mjs` 교체**

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "node_modules/**", "next-env.d.ts", ".superpowers/**"])
]);
```

- [ ] **Step 5: `vitest.config.ts` 교체**

```ts
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) }
  },
  test: {
    environment: "node",
    globals: true,
    passWithNoTests: true
  }
});
```

- [ ] **Step 6: 최소 전역 스타일 `src/styles/globals.scss`**

```scss
body {
  margin: 0;
  font-family: var(--font-pretendard), system-ui, -apple-system, sans-serif;
}
```

- [ ] **Step 7: `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.scss";

const pretendard = localFont({
  src: [
    {
      path: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
      weight: "100 900",
      style: "normal"
    }
  ],
  variable: "--font-pretendard",
  display: "swap"
});

export const metadata: Metadata = {
  title: "박현규 — Frontend · UI Engineer"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={pretendard.variable} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 8: `src/app/page.tsx` (임시)**

```tsx
export default function HomePage() {
  return <main id="main">포트폴리오 개편 작업 중</main>;
}
```

- [ ] **Step 9: 검증**

Run: `npm run lint && npm test && npm run build`
Expected: lint 오류 0, Vitest "No test files found" 후 exit 0, build 성공(`/` 정적 생성)

- [ ] **Step 10: Commit**

```bash
git add -A src package.json package-lock.json eslint.config.mjs vitest.config.ts
git commit -m "chore: 기존 사이트 코드를 제거하고 Next.js 16 기반 새 골격 구성"
```

---

### Task 2: 디자인 토큰 (색상·타이포·간격)과 대비 검증

**Files:**
- Create: `src/lib/contrast.ts`, `src/lib/contrast.test.ts`, `src/styles/_colors.scss`, `src/styles/_typography.scss`, `src/styles/_mixins.scss`, `src/styles/colors.test.ts`
- Modify: `src/styles/globals.scss` (전체 교체)

**Interfaces:**
- Produces:
  - `contrastRatio(foreground: string, background: string): number` — `#RRGGBB` 두 개 → WCAG 대비
  - `parseScssColorMap(source: string, mapName: string): Record<string, string>` — `$<mapName>: ( … );` 안의 `key: #RRGGBB` 쌍만 추출 (rgba 값은 무시)
  - SCSS 믹스인: `up($bp)`, `down($bp)`, `text($role)`, `focus-ring`, `visually-hidden`, `glass`, `reveal-keyframes`, `reveal`
  - CSS 변수: `--color-{bg,surface,glass,glass-border,border,text,text-sub,decor,tint,tint-2,accent,on-accent}`, `--text-{role}-{size,weight,line-height,letter-spacing}`, `--space-{1,2,3,4,5,6,8,10,12,16}`, `--radius-{sm,md,lg,pill}`, `--sidebar-width`, `--content-max`, `--duration-fast`, `--duration-base`, `--ease-out`

- [ ] **Step 1: 대비 계산 실패 테스트 `src/lib/contrast.test.ts`**

```ts
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
```

- [ ] **Step 2: 실패 확인**

Run: `npx vitest run src/lib/contrast.test.ts`
Expected: FAIL — `Failed to resolve import "./contrast"`

- [ ] **Step 3: `src/lib/contrast.ts` 구현**

```ts
const HEX = /^#([0-9a-f]{6})$/i;

function channel(value: number): number {
  const s = value / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const match = HEX.exec(hex);
  if (!match) throw new Error(`Invalid hex color: ${hex}`);
  const n = match[1];
  const [r, g, b] = [0, 2, 4].map((i) => channel(parseInt(n.slice(i, i + 2), 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground: string, background: string): number {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export function parseScssColorMap(source: string, mapName: string): Record<string, string> {
  const block = new RegExp(`\\$${mapName}:\\s*\\(([\\s\\S]*?)\\);`).exec(source);
  if (!block) throw new Error(`SCSS map not found: $${mapName}`);
  const result: Record<string, string> = {};
  for (const [, key, value] of block[1].matchAll(/([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\b/g)) {
    result[key] = value;
  }
  return result;
}
```

- [ ] **Step 4: 통과 확인**

Run: `npx vitest run src/lib/contrast.test.ts`
Expected: PASS (5 tests)

- [ ] **Step 5: `src/styles/_colors.scss`**

```scss
// 색상 토큰의 원본. 값 변경 시 colors.test.ts가 대비(4.5:1)를 검증한다.
// 키 이름은 CSS 변수 --color-<key>로 출력된다.

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
```

- [ ] **Step 6: 토큰 대비 테스트 `src/styles/colors.test.ts`**

```ts
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
```

Run: `npx vitest run src/styles/colors.test.ts`
Expected: PASS (14 tests). 계산값 참고 — 라이트 accent/bg 5.01, 다크 text-sub/surface 5.61.

- [ ] **Step 7: `src/styles/_typography.scss`**

```scss
// 기본값(primitive) 토큰은 컴포넌트에서 직접 쓰지 않는다.
// 컴포넌트는 의미(semantic) 토큰을 @include text(<role>)로만 사용한다.

@mixin primitive-tokens {
  --font-size-100: 0.8125rem; // 13px
  --font-size-200: 0.9375rem; // 15px
  --font-size-300: 1rem; // 16px
  --font-size-400: 1.125rem; // 18px
  --font-size-500: 1.375rem; // 22px
  --font-size-600: 1.75rem; // 28px
  --font-size-700: 2.25rem; // 36px

  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-tight: 1.3;
  --line-height-snug: 1.5;
  --line-height-body: 1.7;

  --letter-spacing-tight: -0.02em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.12em;
}

// 모바일 기준값. md 이상에서 display·heading-1만 한 단계 커진다.
@mixin semantic-tokens {
  --text-display-size: var(--font-size-600);
  --text-display-weight: var(--font-weight-bold);
  --text-display-line-height: var(--line-height-tight);
  --text-display-letter-spacing: var(--letter-spacing-tight);

  --text-heading-1-size: var(--font-size-500);
  --text-heading-1-weight: var(--font-weight-bold);
  --text-heading-1-line-height: var(--line-height-tight);
  --text-heading-1-letter-spacing: var(--letter-spacing-tight);

  --text-heading-2-size: var(--font-size-400);
  --text-heading-2-weight: var(--font-weight-semibold);
  --text-heading-2-line-height: var(--line-height-snug);
  --text-heading-2-letter-spacing: var(--letter-spacing-normal);

  --text-body-size: var(--font-size-300);
  --text-body-weight: var(--font-weight-regular);
  --text-body-line-height: var(--line-height-body);
  --text-body-letter-spacing: var(--letter-spacing-normal);

  --text-body-sm-size: var(--font-size-200);
  --text-body-sm-weight: var(--font-weight-regular);
  --text-body-sm-line-height: var(--line-height-snug);
  --text-body-sm-letter-spacing: var(--letter-spacing-normal);

  --text-caption-size: var(--font-size-100);
  --text-caption-weight: var(--font-weight-regular);
  --text-caption-line-height: var(--line-height-snug);
  --text-caption-letter-spacing: var(--letter-spacing-normal);

  --text-overline-size: var(--font-size-100);
  --text-overline-weight: var(--font-weight-semibold);
  --text-overline-line-height: var(--line-height-snug);
  --text-overline-letter-spacing: var(--letter-spacing-wide);
}

@mixin semantic-tokens-md {
  --text-display-size: var(--font-size-700);
  --text-heading-1-size: var(--font-size-600);
}
```

- [ ] **Step 8: `src/styles/_mixins.scss`**

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
  outline: 2px solid var(--color-accent);
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

// 약한 글래스모피즘. 고정 UI(Sidebar, MobileHeader)에만 사용한다.
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

- [ ] **Step 9: `src/styles/globals.scss` 전체 교체**

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

  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-pill: 999px;

  --sidebar-width: 18rem;
  --content-max: 45rem;

  --duration-fast: 200ms;
  --duration-base: 300ms;
  --ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
}

:root,
:root[data-theme="light"] {
  @include colors.emit(colors.$theme-light);
  color-scheme: light;
}

:root[data-theme="dark"] {
  @include colors.emit(colors.$theme-dark);
  color-scheme: dark;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;

  @media (prefers-reduced-motion: no-preference) {
    scroll-behavior: smooth;
  }
}

body {
  margin: 0;
  min-height: 100dvh;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-pretendard), system-ui, -apple-system, sans-serif;
  @include text(body);
  word-break: keep-all;
  overflow-wrap: anywhere;
  -webkit-font-smoothing: antialiased;
}

h1,
h2,
h3,
h4,
p,
ul,
ol,
dl,
dd,
figure {
  margin: 0;
}

ul,
ol {
  padding: 0;
  list-style: none;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  display: block;
  max-width: 100%;
  height: auto;
}

button {
  font: inherit;
  color: inherit;
}

:focus-visible {
  @include focus-ring;
}

:focus:not(:focus-visible) {
  outline: none;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 10: 검증**

Run: `npm run lint && npm test && npm run build`
Expected: 테스트 19개 PASS, build 성공

- [ ] **Step 11: Commit**

```bash
git add src/lib/contrast.ts src/lib/contrast.test.ts src/styles
git commit -m "style: 색상·타이포·간격 토큰과 전역 스타일을 정의하고 텍스트 대비를 테스트로 검증"
```

---

### Task 3: 테마 초기화 스크립트와 ThemeToggle

**Files:**
- Create: `src/lib/theme.ts`, `src/lib/theme.test.ts`, `src/data/site.ts`, `src/data/types.ts`(최소본), `src/components/ThemeToggle/ThemeToggle.tsx`, `src/components/ThemeToggle/ThemeToggle.module.scss`
- Modify: `src/app/layout.tsx`, `src/app/page.tsx`

**Interfaces:**
- Produces:
  - `type Theme = "light" | "dark"`
  - `THEME_STORAGE_KEY = "theme"`
  - `resolveTheme(stored: string | null, prefersDark: boolean): Theme`
  - `applyTheme(theme: Theme, root: HTMLElement): void` — `data-theme`와 `style.colorScheme` 설정
  - `saveTheme(theme: Theme): void` — localStorage 저장, 실패 무시
  - `themeInitScript: string` — `<head>`에 넣을 IIFE. 전역 `window.matchMedia`, `document.documentElement`, `localStorage`만 참조
  - `src/data/site.ts`: `siteMeta`, `sectionNav`, `uiCopy` (이후 Task에서 키 추가)
  - `<ThemeToggle className?: string />` (client)

- [ ] **Step 1: 실패 테스트 `src/lib/theme.test.ts`**

```ts
import { THEME_STORAGE_KEY, resolveTheme, themeInitScript } from "./theme";

describe("resolveTheme", () => {
  it("저장된 값이 유효하면 그대로 쓴다", () => {
    expect(resolveTheme("dark", false)).toBe("dark");
    expect(resolveTheme("light", true)).toBe("light");
  });

  it("저장값이 없거나 잘못되면 OS 설정을 따른다", () => {
    expect(resolveTheme(null, true)).toBe("dark");
    expect(resolveTheme(null, false)).toBe("light");
    expect(resolveTheme("sepia", true)).toBe("dark");
  });
});

type Env = { stored?: string | null; prefersDark?: boolean; storageThrows?: boolean };

function runInitScript({ stored = null, prefersDark = false, storageThrows = false }: Env) {
  const listeners: Array<() => void> = [];
  const mql = {
    matches: prefersDark,
    addEventListener: (_type: string, cb: () => void) => listeners.push(cb)
  };
  const root = { dataset: {} as Record<string, string>, style: {} as Record<string, string> };
  const storage = {
    value: stored,
    getItem(key: string) {
      if (storageThrows) throw new Error("blocked");
      return key === THEME_STORAGE_KEY ? this.value : null;
    }
  };
  new Function("window", "document", "localStorage", themeInitScript)(
    { matchMedia: () => mql },
    { documentElement: root },
    storage
  );
  return { root, mql, listeners, storage };
}

describe("themeInitScript", () => {
  it("저장값을 html에 적용한다", () => {
    const { root } = runInitScript({ stored: "dark" });
    expect(root.dataset.theme).toBe("dark");
    expect(root.style.colorScheme).toBe("dark");
  });

  it("저장값이 없으면 OS 설정을 적용한다", () => {
    expect(runInitScript({ prefersDark: true }).root.dataset.theme).toBe("dark");
    expect(runInitScript({ prefersDark: false }).root.dataset.theme).toBe("light");
  });

  it("저장소 접근이 실패해도 OS 설정으로 동작한다", () => {
    expect(runInitScript({ prefersDark: true, storageThrows: true }).root.dataset.theme).toBe("dark");
  });

  it("저장값이 없을 때만 OS 설정 변경을 따라간다", () => {
    const free = runInitScript({ prefersDark: false });
    free.mql.matches = true;
    free.listeners.forEach((cb) => cb());
    expect(free.root.dataset.theme).toBe("dark");

    const pinned = runInitScript({ stored: "light", prefersDark: false });
    pinned.mql.matches = true;
    pinned.listeners.forEach((cb) => cb());
    expect(pinned.root.dataset.theme).toBe("light");
  });
});
```

- [ ] **Step 2: 실패 확인**

Run: `npx vitest run src/lib/theme.test.ts`
Expected: FAIL — `Failed to resolve import "./theme"`

- [ ] **Step 3: `src/lib/theme.ts` 구현**

```ts
export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

export function resolveTheme(stored: string | null, prefersDark: boolean): Theme {
  if (isTheme(stored)) return stored;
  return prefersDark ? "dark" : "light";
}

export function applyTheme(theme: Theme, root: HTMLElement): void {
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // 저장 실패 시 이번 방문 동안만 적용된다.
  }
}

// resolveTheme·applyTheme과 같은 규칙을 첫 렌더 전에 실행하기 위한 인라인 스크립트.
// 규칙을 바꾸면 theme.test.ts의 themeInitScript 테스트가 함께 검증한다.
export const themeInitScript = `(function () {
  var key = ${JSON.stringify(THEME_STORAGE_KEY)};
  var mql = window.matchMedia("(prefers-color-scheme: dark)");
  function stored() {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function apply() {
    var value = stored();
    var theme = value === "light" || value === "dark" ? value : (mql.matches ? "dark" : "light");
    var root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  }
  apply();
  mql.addEventListener("change", function () {
    var value = stored();
    if (value !== "light" && value !== "dark") apply();
  });
})();`;
```

- [ ] **Step 4: 통과 확인**

Run: `npx vitest run src/lib/theme.test.ts`
Expected: PASS (6 tests)

- [ ] **Step 5: `src/data/site.ts`**

```ts
import type { NavItem } from "./types";

export const siteMeta = {
  title: "박현규 — Frontend · UI Engineer",
  description:
    "이커머스·B2B 서비스의 PC·모바일 UI를 6년 이상 구축·운영한 프론트엔드·UI 엔지니어 박현규의 포트폴리오입니다.",
  url: "https://about-me-iota-blond.vercel.app"
};

export const sectionNav: NavItem[] = [
  { id: "about", label: "소개" },
  { id: "career", label: "경력" },
  { id: "projects", label: "프로젝트" },
  { id: "skills", label: "기술" },
  { id: "education", label: "학력 · 자격" }
];

export const uiCopy = {
  skipLink: "본문 바로가기",
  sectionNavLabel: "섹션",
  tocLabel: "목차",
  backToProjects: "← 전체 프로젝트",
  themeToDark: "다크 모드로 전환",
  themeToLight: "라이트 모드로 전환",
  themeFallback: "테마 전환",
  newWindow: "(새 창)",
  currentPosition: "재직 중",
  competenciesTitle: "핵심 역량",
  workProjectsTitle: "대표 실무 프로젝트",
  personalProjectsTitle: "개인 프로젝트 · AI 활용 개발",
  evidenceTitle: "확인 자료",
  projectLinksLabel: "프로젝트 링크",
  galleryLabel: "프로젝트 화면",
  pagerLabel: "다른 프로젝트",
  prevProject: "이전 프로젝트",
  nextProject: "다음 프로젝트",
  contactLabel: "연락처",
  contactEmail: "이메일",
  contactGithub: "GitHub",
  notFoundTitle: "페이지를 찾을 수 없습니다",
  notFoundBody: "주소가 바뀌었거나 존재하지 않는 페이지입니다.",
  notFoundLink: "메인으로 돌아가기",
  footer: "© 2026 박현규"
};
```

`NavItem` 타입은 Task 4에서 `types.ts`에 정의한다. 이 Task에서는 `src/data/types.ts`를 아래 최소 내용으로 만든다 (Task 4에서 확장):

```ts
export type NavItem = { id: string; label: string };
```

- [ ] **Step 6: `src/components/ThemeToggle/ThemeToggle.tsx`**

```tsx
"use client";

import { useSyncExternalStore } from "react";
import { uiCopy } from "@/data/site";
import { applyTheme, saveTheme, type Theme } from "@/lib/theme";
import styles from "./ThemeToggle.module.scss";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function getServerSnapshot(): Theme | null {
  return null;
}

type ThemeToggleProps = { className?: string };

export function ThemeToggle({ className }: ThemeToggleProps) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const next: Theme = theme === "dark" ? "light" : "dark";
  const label =
    theme === null ? uiCopy.themeFallback : next === "dark" ? uiCopy.themeToDark : uiCopy.themeToLight;

  function handleClick() {
    saveTheme(next);
    applyTheme(next, document.documentElement);
  }

  return (
    <button
      type="button"
      className={[styles.toggle, className].filter(Boolean).join(" ")}
      aria-label={label}
      title={label}
      onClick={handleClick}
    >
      <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        {theme === "dark" ? (
          <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </g>
        ) : (
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"
          />
        )}
      </svg>
    </button>
  );
}
```

- [ ] **Step 7: `src/components/ThemeToggle/ThemeToggle.module.scss`**

```scss
@use "../../styles/mixins" as *;

.toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--space-10);
  height: var(--space-10);
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  transition: border-color var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out);

  &:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
}

.icon {
  width: var(--space-5);
  height: var(--space-5);
}
```

- [ ] **Step 8: `src/app/layout.tsx`에 head 스크립트 연결**

```tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import { siteMeta } from "@/data/site";
import { themeInitScript } from "@/lib/theme";
import "@/styles/globals.scss";

const pretendard = localFont({
  src: [
    {
      path: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
      weight: "100 900",
      style: "normal"
    }
  ],
  variable: "--font-pretendard",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteMeta.url),
  title: { default: siteMeta.title, template: `%s | ${siteMeta.title}` },
  description: siteMeta.description,
  openGraph: { title: siteMeta.title, description: siteMeta.description, type: "website", url: siteMeta.url }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={pretendard.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 9: 임시 확인용 `src/app/page.tsx`**

```tsx
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";

export default function HomePage() {
  return (
    <main id="main">
      <ThemeToggle />
    </main>
  );
}
```

- [ ] **Step 10: 브라우저 확인**

preview_start `{name: "dev"}` 후:
1. 토글 클릭 → `document.documentElement.dataset.theme`이 바뀌고 배경이 `#F7F0F5` ↔ `#1C1719`로 바뀐다 (javascript_tool로 `getComputedStyle(document.body).backgroundColor` 확인)
2. 다크로 바꾼 뒤 새로고침 → 첫 페인트부터 다크 (깜빡임 없음), 콘솔에 hydration 경고 없음 (read_console_messages)
3. `localStorage.removeItem("theme")` 후 resize_window `colorScheme: "dark"` → 새로고침 시 다크

- [ ] **Step 11: 검증 & Commit**

Run: `npm run lint && npm test && npm run build` → 모두 통과

```bash
git add src/lib/theme.ts src/lib/theme.test.ts src/data src/components/ThemeToggle src/app
git commit -m "feat: OS 설정과 저장된 선택으로 첫 렌더 전에 테마를 결정하고 수동 토글 추가"
```

---

### Task 4: 콘텐츠 타입·데이터와 조회 함수

**Files:**
- Modify: `src/data/types.ts` (전체 교체)
- Create: `src/data/profile.ts`, `src/data/career.ts`, `src/data/projects.ts`, `src/data/skills.ts`, `src/data/education.ts`, `src/data/data.test.ts`, `src/lib/format.ts`, `src/lib/format.test.ts`, `src/lib/projects.ts`, `src/lib/projects.test.ts`

**Interfaces:**
- Consumes: `uiCopy.currentPosition`, `uiCopy.evidenceTitle` (Task 3)
- Produces:
  - 타입: `NavItem`, `Highlight`, `ExternalLink`, `ProjectImage`, `Period`, `ProjectSection`, `Project`, `Profile`, `CareerEntry`, `SkillGroup`, `EducationItem`
  - 데이터: `profile: Profile`, `career: CareerEntry[]`, `projects: Project[]`, `personalProjectsIntro: string`, `skills: SkillGroup[]`, `education: EducationItem[]`
  - `formatPeriod(period: Period | string): string` — `"2026.05 – 재직 중"`, `"2019.10 – 2024.11"`, 문자열은 그대로
  - `getProjectBySlug(slug: string): Project | undefined`
  - `getAdjacentProjects(slug: string): { prev?: Project; next?: Project }`
  - `sectionId(index: number): string` — `"section-1"`부터
  - `EVIDENCE_SECTION_ID = "evidence"`
  - `getProjectToc(project: Project): NavItem[]` — 섹션 목차 + evidence 링크가 있으면 `{ id: "evidence", label: "확인 자료" }`
  - `getEvidenceLinks(project: Project): ExternalLink[]`, `getPrimaryLinks(project: Project): ExternalLink[]` (service·github)

- [ ] **Step 1: `src/data/types.ts` 전체 교체**

```ts
export type NavItem = { id: string; label: string };

/** 굵은 라벨 + 본문 패턴. 예: "금액 구분: 실제 기록과…" */
export type Highlight = { label?: string; text: string };

export type ExternalLink = {
  label: string;
  href: string;
  kind: "service" | "github" | "evidence";
};

export type ProjectImage = { src: string; alt: string; width: number; height: number };

/** start·end는 "YYYY.MM". end가 null이면 재직·진행 중 */
export type Period = { start: string; end: string | null };

export type ProjectSection = {
  title: string;
  stack?: string[];
  paragraphs?: string[];
  items?: Highlight[];
};

export type Project = {
  slug: string;
  kind: "work" | "personal";
  label: string;
  title: string;
  summary: string;
  period: Period | string;
  stack: string[];
  role?: string;
  note?: string;
  links: ExternalLink[];
  images?: ProjectImage[];
  sections: ProjectSection[];
};

export type Profile = {
  name: string;
  role: string;
  headline: string;
  intro: string;
  email: string;
  github: string;
  competencies: Highlight[];
};

export type CareerEntry = {
  company: string;
  position: string;
  period: Period;
  summary: string;
  highlights: Highlight[];
};

export type SkillGroup = { category: string; items: string[]; note?: string };

export type EducationItem = { title: string; detail?: string };
```

- [ ] **Step 2: `src/data/profile.ts`**

```ts
import type { Profile } from "./types";

export const profile: Profile = {
  name: "박현규",
  role: "Frontend · UI Engineer",
  headline: "이커머스·B2B 서비스의 PC·모바일 UI를 6년 이상 구축·운영했습니다.",
  intro:
    "현재 React·Next.js·Angular 기반 업무 시스템에서 공통 레이아웃·컴포넌트 구현과 기존 화면의 스타일 개선을 담당합니다. 개인 프로젝트에서는 가계부를 배포·운영하고, React 앱에 서버 데이터 관리·입력 검증·인증 흐름을 구현했습니다.",
  email: "yhu930421@naver.com",
  github: "https://github.com/rafdidas",
  competencies: [
    {
      label: "업무 화면 구현",
      text: "React·Next.js·Angular 환경에서 내비게이션·공통 레이아웃·목록·조회·상세·대시보드 UI 구현"
    },
    {
      label: "운영 화면 개선",
      text: "CRM 색상 값을 CSS 변수로 통합하고 타이포그래피·모바일 스타일을 단계적으로 적용, 기존 선택자와의 충돌을 실제 화면에서 검수·수정"
    },
    {
      label: "구축부터 운영까지",
      text: "이커머스 신규 오픈·리뉴얼·장기 유지보수, 반응형·브라우저 호환성 검수와 UI 동작 오류 대응"
    },
    {
      label: "개인 서비스 개발",
      text: "AI 코딩 도구를 활용해 인증·데모·분석 기능을 갖춘 가계부 운영, 학습 앱의 서버 데이터·URL·로컬 상태 분리와 JSON 입력 검증 구현"
    }
  ]
};
```

- [ ] **Step 3: `src/data/career.ts`**

```ts
import type { CareerEntry } from "./types";

export const career: CareerEntry[] = [
  {
    company: "㈜소프트자이온",
    position: "퍼블리셔 · 주임",
    period: { start: "2025.09", end: null },
    summary:
      "건설·물류 도메인의 B2B 업무 시스템과 신규 서비스의 PC·모바일 UI를 담당하고 있습니다. 기획·디자인·백엔드 개발자와 협업해 화면을 구현하고, 프로젝트에서 반복되는 UI와 디자인 기준을 실제 운영 화면에 적용하고 있습니다.",
    highlights: [
      { text: "위시드콘 레미콘 품질관리 플랫폼과 위시드콘 홈페이지의 PC·모바일 UI를 신규 구축해 오픈하고, 이후 추가 화면 구현과 UI 개선 담당" },
      { text: "LH 레미콘스마트관리시스템, 현대 CSM, 롯데글로벌로지스 CRM의 목록·조회·등록·대시보드 등 업무 화면 구현" },
      { text: "WeSeed CRM·Admin에 흩어진 색상 값을 CSS 변수로 통합하고, 타이포그래피와 모바일 스타일을 주요 화면에 순차 적용" },
      { text: "공통 UI의 적용 범위와 사용 기준을 디자이너·개발자와 조율하고, 합의한 내용을 디자인 시스템 문서 초안으로 정리" },
      { text: "공통 스타일 적용 시 기존 페이지 선택자와 충돌하는 화면을 찾아 레이아웃과 스타일 수정" }
    ]
  },
  {
    company: "㈜위사",
    position: "웹 퍼블리셔",
    period: { start: "2019.10", end: "2024.11" },
    summary:
      "웹에이전시 UX 그룹과 GX 그룹에서 이커머스 신규 구축·리뉴얼·운영을 담당했습니다. 별도 프론트엔드 직군이 없는 프로젝트에서는 마크업뿐 아니라 메뉴, 탭, 슬라이드, 폼 등 UI 동작과 오픈 후 화면 이슈도 함께 처리했습니다.",
    highlights: [
      {
        label: "신규 구축·오픈",
        text: "메디플러스 세컨드닥터몰, 생활공작소, 대현인사이드, 클럽발코니, 크레디아, 밀크코코아 라이즈, 액트플러스, 에스더몰"
      },
      {
        label: "리뉴얼·장기 운영",
        text: "대현인사이드, 클럽발코니, 지오다노, 안다르, 차홍, 탠디몰, IDF몰, 이현 어패럴, 생활공작소 등"
      },
      { text: "브랜드별 디자인 가이드와 쇼핑몰 운영 정책을 반영해 PC·모바일 화면을 구현하고, 반응형·크로스브라우징 이슈 대응" },
      { text: "JavaScript·jQuery를 사용해 스크롤, 탭, 슬라이드, 입력 폼 등 사용자 인터랙션을 구현하고 운영 중 발생한 화면 오류 수정" },
      { text: "신규 구축 후 운영팀으로 이관되는 프로젝트와 장기간 유지보수하는 프로젝트를 모두 경험하며 기존 코드 구조와 운영 영향을 확인한 뒤 수정 범위 결정" }
    ]
  }
];
```

- [ ] **Step 4: `src/data/projects.ts`**

카드 요약(`summary`)은 이력서에 없는 사이트용 문구다. 이력서 문장에서 줄였으며 사용자 검토 대상이다.

```ts
import type { Project } from "./types";

export const personalProjectsIntro =
  "AI 코딩 도구를 활용한 개인 프로젝트입니다. 서비스 방향과 요구사항을 정하고 AI와 기획·설계를 논의했습니다. 기술 스택·코딩 방식이 의도와 다르거나 화면에서 문제가 보이면 재검토를 요청하고, 프론트엔드 코드를 읽으며 구현 방향을 조율했습니다.";

export const projects: Project[] = [
  {
    slug: "weseedcon",
    kind: "work",
    label: "Project 01",
    title: "위시드콘 레미콘 품질관리 플랫폼",
    summary: "시공사·감리업체·레미콘사가 타설 데이터를 공유하는 구독형 B2B 플랫폼의 PC·모바일 UI와 공통 컴포넌트를 신규 구축",
    period: { start: "2026.05", end: null },
    stack: ["Next.js", "React", "TypeScript"],
    role: "UI 구현·공통 컴포넌트 담당",
    links: [
      { label: "weseedcon.com", href: "https://weseedcon.com", kind: "service" },
      { label: "con.weseed.co.kr", href: "https://con.weseed.co.kr", kind: "service" }
    ],
    sections: [
      {
        title: "배경",
        paragraphs: [
          "시공사·감리업체·레미콘사가 현장의 타설 데이터를 공유하는 구독형 B2B 플랫폼 신규 구축 프로젝트입니다. PC와 모바일을 모두 제공하며, 요금제와 사용자 권한에 따라 노출되는 메뉴와 기능이 달라지는 구조였습니다. 오픈 후에도 업무 화면이 추가될 예정이어서 목록·조회·상세 화면에서 반복되는 UI를 다시 사용할 수 있어야 했습니다."
        ]
      },
      {
        title: "담당 작업",
        paragraphs: [
          "내비게이션과 공통 레이아웃을 구현하고, 목록·조회·상세 화면에서 반복되는 정보 영역과 UI를 컴포넌트로 분리했습니다. 데이터 그리드의 가로·세로 스크롤과 페이지네이션은 개발자와 동작 기준을 맞춰 각 화면에 적용했습니다.",
          "대시보드에는 데이터 카드의 반응형 배치와 상세 화면으로 이동하는 인터랙션을 구현했습니다. 모바일은 PC 화면을 축소하지 않고 별도 시안을 기준으로 목록·상세·메뉴 구조와 동작을 구현했습니다."
        ]
      },
      {
        title: "적용 및 운영",
        paragraphs: [
          "PC·모바일 서비스를 오픈했으며, 공통 레이아웃과 반복 UI를 추가 업무 화면에서도 사용하고 있습니다. 오픈 후 실제 화면에서 확인된 데이터 그리드 스크롤과 상세 UI 문제를 수정하고, 새로 추가되는 화면은 기존 컴포넌트의 적용 가능 범위를 먼저 확인한 뒤 구현하고 있습니다."
        ]
      }
    ]
  },
  {
    slug: "weseed-crm-design-system",
    kind: "work",
    label: "Project 02",
    title: "WeSeed CRM·Admin 디자인 시스템 개선",
    summary: "장기간 확장된 CRM의 색상을 CSS 변수로 통합하고 타이포그래피·모바일 스타일을 운영 화면에 단계적으로 적용",
    period: { start: "2026.03", end: "2026.06" },
    stack: ["Angular", "SCSS", "CSS Variables"],
    role: "집중 개선 후 운영",
    links: [],
    sections: [
      {
        title: "배경",
        paragraphs: [
          "장기간 확장된 CRM에서 같은 역할의 색상과 타이포그래피가 화면마다 다르게 선언되어 있었고, 모바일 스타일도 각 페이지에 중복되어 있었습니다. 운영 중인 제품이어서 공통 기준을 한 번에 교체하기보다 기존 화면에 미치는 영향을 확인하며 순차적으로 적용해야 했습니다."
        ]
      },
      {
        title: "담당 작업",
        paragraphs: [
          "화면에 직접 선언된 색상 값을 사용 위치와 역할에 따라 분류해 CSS 변수 통합안을 만들고, 디자이너·개발자와 변수명·사용 범위·적용 순서를 조율했습니다. 타이포그래피는 컴포넌트와 페이지 스타일을 구분해 CRM 주요 메뉴에 순차 적용했으며, 화면별로 중복된 모바일 스타일도 함께 정리했습니다.",
          "공통 UI를 적용할 대상과 기존 UI를 유지할 범위를 논의하고, 합의된 색상·타이포그래피·모바일 스타일 기준을 디자인 시스템 문서 초안에 기록했습니다. 공통 스타일 적용 후 기존 페이지 선택자와 충돌해 레이아웃이 달라지는 사례가 있어, 컴포넌트 확인에 그치지 않고 실제 조회·등록 화면 단위로 검수하고 수정했습니다."
        ]
      },
      {
        title: "적용 및 운영",
        paragraphs: [
          "CRM 주요 화면에 타이포그래피 기준을 단계적으로 적용하고, 기존 페이지 스타일과의 충돌을 화면 단위로 검수·개선했습니다. 집중 개선 기간 이후에도 신규 화면에는 정리된 기준을 적용하고, 기존 화면은 영향 범위를 확인하며 순차적으로 보완하고 있습니다."
        ]
      }
    ]
  },
  {
    slug: "construction-logistics-systems",
    kind: "work",
    label: "Project 03",
    title: "건설·물류 업무 시스템 구축",
    summary: "LH 레미콘스마트관리시스템·현대 CSM·롯데글로벌로지스 CRM의 목록·조회·등록·대시보드 화면 구현",
    period: { start: "2025.09", end: "2026.06" },
    stack: ["Next.js", "React", "Angular"],
    note: "사내·고객사 전용 시스템으로 화면을 공개하기 어려워 프로젝트별 담당 화면과 구현 과제를 중심으로 정리했습니다.",
    links: [],
    sections: [
      {
        title: "LH 레미콘스마트관리시스템",
        stack: ["Next.js", "React"],
        paragraphs: [
          "타설관리와 관제정보 등 현장 데이터를 조회·점검하는 목록, 검색 모달, 대시보드 화면을 구현했습니다. 이 프로젝트에서 사용한 공통 UI 구현 방식은 이후 위시드콘 플랫폼의 목록과 조회 화면을 만들 때 다시 활용했습니다."
        ]
      },
      {
        title: "현대 CSM",
        stack: ["Next.js", "React"],
        paragraphs: [
          "개발 환경 설정과 공통 레이아웃 구현부터 참여해 현장관리·비용관리·기성관리·업체선정 등 네 개 업무 영역의 화면을 구축했습니다. 메뉴와 공통 레이아웃을 먼저 구현한 뒤 각 업무 화면을 연결했습니다."
        ]
      },
      {
        title: "롯데글로벌로지스 CRM",
        stack: ["Angular"],
        paragraphs: [
          "고객관리·영업관리 영역의 조회·등록 화면을 구현했습니다. 다단계 탭, 보고서, 대량 처리, 문서 출력처럼 한 화면에 여러 상태와 동작이 포함된 기능을 구현했으며, 오픈 후 추가 요청과 UI 오류를 수정했습니다."
        ]
      }
    ]
  },
  {
    slug: "ecommerce",
    kind: "work",
    label: "Project 04",
    title: "이커머스 신규 구축·장기 운영",
    summary: "브랜드 쇼핑몰의 PC·모바일 신규 구축과 장기 운영, 반응형·브라우저 대응과 UI 인터랙션 구현",
    period: { start: "2019.10", end: "2024.11" },
    stack: ["HTML", "CSS/SCSS", "JavaScript", "jQuery"],
    links: [],
    sections: [
      {
        title: "신규 구축",
        paragraphs: [
          "메디플러스 세컨드닥터몰, 생활공작소, 대현인사이드, 클럽발코니, 크레디아, 밀크코코아 라이즈, 액트플러스, 에스더몰 등의 PC·모바일 화면을 각 브랜드의 디자인 가이드와 쇼핑몰 기능에 맞춰 구현하고 오픈했습니다."
        ]
      },
      {
        title: "운영·유지보수",
        paragraphs: [
          "지오다노, 안다르, 차홍, 탠디몰, IDF몰, 이현 어패럴 등 여러 쇼핑몰의 프로모션과 상시 운영 요청을 반영했습니다. 기존 페이지와 공통 스타일에 미치는 범위를 확인한 뒤 수정했으며, PC·모바일 해상도와 브라우저별로 화면을 점검했습니다."
        ]
      },
      {
        title: "담당 범위",
        paragraphs: [
          "HTML·CSS/SCSS 기반 반응형 마크업, JavaScript·jQuery를 활용한 메뉴·탭·슬라이드·스크롤·입력 폼 동작, 오픈 전 브라우저 검수와 운영 중 UI 오류 대응을 담당했습니다. 짧은 일정의 프로모션 화면부터 여러 해 동안 운영되는 브랜드몰까지 서로 다른 작업 주기와 기존 코드 조건에 맞춰 구현했습니다."
        ]
      }
    ]
  },
  {
    slug: "monibuk",
    kind: "personal",
    label: "Personal Project",
    title: "머니북가계부",
    summary: "수입·지출·고정지출·적금·투자 기록과 월별 분석을 제공하는 개인 재무 웹 서비스를 개발·운영",
    period: "공개 서비스 운영 중",
    stack: ["Next.js", "React", "TypeScript", "Sass", "Supabase", "Chart.js"],
    links: [
      { label: "서비스", href: "https://monibuk.com/", kind: "service" },
      { label: "GitHub", href: "https://github.com/Rafdidas/money_book", kind: "github" },
      {
        label: "로그인·데모·저장 E2E 시나리오",
        href: "https://github.com/Rafdidas/money_book/blob/main/e2e/public-auth-demo.spec.ts",
        kind: "evidence"
      }
    ],
    sections: [
      {
        title: "개요",
        paragraphs: ["수입·지출·고정지출·적금·투자 기록과 월별 분석을 제공하는 가계부를 개발·운영합니다."]
      },
      {
        title: "구현 내용",
        items: [
          {
            label: "금액 구분",
            text: "실제 기록과 예정 금액을 구분해 대시보드에 표시하고, 월별 분석에서 수입·지출·저축·투자 흐름을 비교"
          },
          {
            label: "서비스 체험",
            text: "가입 없이 입력·조회 흐름을 확인할 수 있도록 브라우저 저장 기반 데모를 구성하고 운영 사용자 데이터와 분리"
          },
          {
            label: "데이터 접근",
            text: "Supabase Auth와 PostgreSQL RLS로 사용자별 데이터 접근을 구성하고, 외부 주식 조회는 서버 경로에서 처리"
          },
          {
            label: "회귀 확인 범위",
            text: "비로그인 접근 시 원래 경로를 보존한 로그인 이동, 데모 진입, 입력 저장과 새로고침 후 분류 유지 등을 Playwright 테스트 시나리오로 구성"
          }
        ]
      }
    ]
  },
  {
    slug: "fe-daily-study",
    kind: "personal",
    label: "Personal Project",
    title: "FE Daily Study",
    summary: "학습 브리핑을 저장하고 학습 기록에 따라 다음 복습일을 안내하는 프론트엔드 학습·복습 앱",
    period: "배포된 개인 학습 앱",
    stack: ["React", "TypeScript", "Vite", "TanStack Query", "Zustand", "Supabase", "Zod"],
    links: [
      { label: "서비스", href: "https://devstudy-vert.vercel.app/", kind: "service" },
      { label: "GitHub", href: "https://github.com/Rafdidas/dev_study", kind: "github" },
      {
        label: "입력 파싱·검증 코드",
        href: "https://github.com/Rafdidas/dev_study/blob/main/src/features/briefings/parseBriefingInput.ts",
        kind: "evidence"
      },
      {
        label: "복습 일정 설계 결정",
        href: "https://github.com/Rafdidas/dev_study/blob/main/docs/decisions/0005-review-schedule-on-client.md",
        kind: "evidence"
      }
    ],
    sections: [
      {
        title: "개요",
        paragraphs: [
          "ChatGPT에서 받은 브리핑을 수동으로 가져와 저장하고, 학습 기록에 따라 다음 복습일을 안내하는 앱입니다."
        ]
      },
      {
        title: "구현 내용",
        items: [
          {
            label: "상태 구분",
            text: "브리핑·학습 기록은 TanStack Query, 로그인 세션은 Zustand, 상세 탭·필터는 URL, 작성 중 입력값은 로컬 상태로 관리"
          },
          {
            label: "입력 실패 처리",
            text: "JSON 파싱 실패와 Zod 스키마 오류를 구분해 안내하고, 커리큘럼에 없는 주제는 경고로 표시"
          },
          {
            label: "파생 값 처리",
            text: "학습 기록과 다음 복습일이 어긋나지 않도록 복습일을 별도 컬럼에 저장하지 않고 순수 함수로 계산"
          },
          {
            label: "선택 근거",
            text: "연간 브리핑 약 365개·학습 기록 수천 건을 가정해 프론트엔드 계산을 선택하고, 규모가 커지면 서버 계산을 재검토하도록 결정 기록에 명시"
          },
          { label: "검증 범위", text: "날짜·복습 간격·중복 기록 등 계산 로직에 Vitest 테스트 구성" }
        ]
      }
    ]
  }
];
```

- [ ] **Step 5: `src/data/skills.ts`, `src/data/education.ts`**

```ts
// src/data/skills.ts
import type { SkillGroup } from "./types";

export const skills: SkillGroup[] = [
  {
    category: "UI",
    items: ["HTML5", "CSS3", "SCSS", "Tailwind CSS", "Responsive Web", "Web Standards", "Cross-browser 대응"]
  },
  {
    category: "JavaScript / Framework",
    items: ["JavaScript", "TypeScript", "React", "Next.js", "Angular", "jQuery"],
    note: "Angular는 프로젝트 경험"
  },
  {
    category: "UI System",
    items: ["CSS Variables", "Typography 기준 적용", "공통 UI·컴포넌트 구현", "Figma", "디자인 시스템 문서화"]
  },
  {
    category: "State / Data",
    items: ["TanStack Query", "Zustand", "Redux Toolkit", "Context API", "Supabase Auth·PostgreSQL RLS", "Zod"],
    note: "개인 프로젝트 경험 포함"
  },
  {
    category: "Test",
    items: ["Vitest", "Testing Library", "Playwright"],
    note: "개인 프로젝트의 계산 로직·입력·인증·데모 흐름 테스트 구성"
  },
  {
    category: "Workflow",
    items: ["Git", "GitHub", "Figma MCP", "AI 코딩 도구"],
    note: "AI 코딩 도구를 활용한 시안 분석·코드 탐색·구현 초안 검토, 개인 서비스 배포·운영"
  }
];
```

```ts
// src/data/education.ts
import type { EducationItem } from "./types";

export const education: EducationItem[] = [
  { title: "한성대학교 전자정보공학과 졸업" },
  { title: "정보처리기사", detail: "2018.05 · 한국산업인력공단" }
];
```

- [ ] **Step 6: 실패 테스트 `src/lib/format.test.ts`**

```ts
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
```

- [ ] **Step 7: 실패 테스트 `src/lib/projects.test.ts`**

```ts
import { projects } from "@/data/projects";
import {
  EVIDENCE_SECTION_ID,
  getAdjacentProjects,
  getEvidenceLinks,
  getPrimaryLinks,
  getProjectBySlug,
  getProjectToc,
  sectionId
} from "./projects";

describe("projects 조회", () => {
  it("slug로 프로젝트를 찾는다", () => {
    expect(getProjectBySlug("monibuk")?.title).toBe("머니북가계부");
    expect(getProjectBySlug("nope")).toBeUndefined();
  });

  it("배열 순서 기준으로 이전/다음을 반환한다", () => {
    expect(getAdjacentProjects(projects[0].slug)).toEqual({ prev: undefined, next: projects[1] });
    const last = projects[projects.length - 1];
    expect(getAdjacentProjects(last.slug)).toEqual({ prev: projects[projects.length - 2], next: undefined });
  });

  it("sectionId는 1부터 시작한다", () => {
    expect(sectionId(0)).toBe("section-1");
  });

  it("목차는 섹션 + 확인 자료(있을 때만)", () => {
    const monibuk = getProjectBySlug("monibuk")!;
    expect(getProjectToc(monibuk)).toEqual([
      { id: "section-1", label: "개요" },
      { id: "section-2", label: "구현 내용" },
      { id: EVIDENCE_SECTION_ID, label: "확인 자료" }
    ]);
    const crm = getProjectBySlug("weseed-crm-design-system")!;
    expect(getProjectToc(crm).map((item) => item.id)).not.toContain(EVIDENCE_SECTION_ID);
  });

  it("링크를 종류별로 나눈다", () => {
    const monibuk = getProjectBySlug("monibuk")!;
    expect(getPrimaryLinks(monibuk).map((link) => link.kind)).toEqual(["service", "github"]);
    expect(getEvidenceLinks(monibuk)).toHaveLength(1);
  });
});
```

- [ ] **Step 8: 실패 확인**

Run: `npx vitest run src/lib/format.test.ts src/lib/projects.test.ts`
Expected: FAIL — `./format`, `./projects` 모듈 없음

- [ ] **Step 9: `src/lib/format.ts`, `src/lib/projects.ts` 구현**

```ts
// src/lib/format.ts
import { uiCopy } from "@/data/site";
import type { Period } from "@/data/types";

export function formatPeriod(period: Period | string): string {
  if (typeof period === "string") return period;
  return `${period.start} – ${period.end ?? uiCopy.currentPosition}`;
}
```

```ts
// src/lib/projects.ts
import { projects } from "@/data/projects";
import { uiCopy } from "@/data/site";
import type { ExternalLink, NavItem, Project } from "@/data/types";

export const EVIDENCE_SECTION_ID = "evidence";

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getAdjacentProjects(slug: string): { prev?: Project; next?: Project } {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return {};
  return { prev: projects[index - 1], next: projects[index + 1] };
}

export function sectionId(index: number): string {
  return `section-${index + 1}`;
}

export function getEvidenceLinks(project: Project): ExternalLink[] {
  return project.links.filter((link) => link.kind === "evidence");
}

export function getPrimaryLinks(project: Project): ExternalLink[] {
  return project.links.filter((link) => link.kind !== "evidence");
}

export function getProjectToc(project: Project): NavItem[] {
  const items = project.sections.map((section, index) => ({ id: sectionId(index), label: section.title }));
  if (getEvidenceLinks(project).length > 0) {
    items.push({ id: EVIDENCE_SECTION_ID, label: uiCopy.evidenceTitle });
  }
  return items;
}
```

- [ ] **Step 10: 데이터 무결성 테스트 `src/data/data.test.ts`**

```ts
import { career } from "./career";
import { education } from "./education";
import { profile } from "./profile";
import { personalProjectsIntro, projects } from "./projects";
import { sectionNav, siteMeta, uiCopy } from "./site";
import { skills } from "./skills";

const allData = { profile, career, projects, personalProjectsIntro, skills, education, sectionNav, siteMeta, uiCopy };
const PERIOD = /^\d{4}\.\d{2}$/;

describe("데이터 무결성", () => {
  it("프로젝트 slug는 중복되지 않고 URL에 안전하다", () => {
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    slugs.forEach((slug) => expect(slug).toMatch(/^[a-z0-9-]+$/));
  });

  it("설계 문서의 slug 6개가 순서대로 있다", () => {
    expect(projects.map((project) => project.slug)).toEqual([
      "weseedcon",
      "weseed-crm-design-system",
      "construction-logistics-systems",
      "ecommerce",
      "monibuk",
      "fe-daily-study"
    ]);
  });

  it("모든 프로젝트는 제목·요약·기술·섹션을 갖고, 섹션은 본문을 갖는다", () => {
    projects.forEach((project) => {
      expect(project.title.trim()).not.toBe("");
      expect(project.summary.trim()).not.toBe("");
      expect(project.stack.length).toBeGreaterThan(0);
      expect(project.sections.length).toBeGreaterThan(0);
      project.sections.forEach((section) => {
        const bodyCount = (section.paragraphs?.length ?? 0) + (section.items?.length ?? 0);
        expect(bodyCount, `${project.slug} / ${section.title}`).toBeGreaterThan(0);
      });
    });
  });

  it("기간 형식은 YYYY.MM", () => {
    const periods = [...career.map((entry) => entry.period), ...projects.map((project) => project.period)];
    periods.forEach((period) => {
      if (typeof period === "string") return;
      expect(period.start).toMatch(PERIOD);
      if (period.end !== null) expect(period.end).toMatch(PERIOD);
    });
  });

  it("외부 링크는 모두 https", () => {
    const hrefs = [profile.github, ...projects.flatMap((project) => project.links.map((link) => link.href))];
    hrefs.forEach((href) => expect(href).toMatch(/^https:\/\//));
  });

  it("이미지가 있으면 alt가 비어 있지 않다", () => {
    projects.forEach((project) =>
      project.images?.forEach((image) => expect(image.alt.trim(), project.slug).not.toBe(""))
    );
  });

  it("전화번호·거주지를 포함하지 않는다", () => {
    const text = JSON.stringify(allData);
    expect(text).not.toMatch(/01[016789][-.\s]?\d{3,4}[-.\s]?\d{4}/);
    expect(text).not.toMatch(/영등포/);
  });

  it("섹션 내비 id는 중복되지 않는다", () => {
    const ids = sectionNav.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
```

- [ ] **Step 11: 통과 확인**

Run: `npm test`
Expected: 모든 테스트 PASS (contrast 5 + colors 14 + theme 6 + format 3 + projects 5 + data 8)

- [ ] **Step 12: 검증 & Commit**

Run: `npm run lint && npm run build` → 통과

```bash
git add src/data src/lib/format.ts src/lib/format.test.ts src/lib/projects.ts src/lib/projects.test.ts
git commit -m "content: 범용 이력서의 경력·프로젝트·기술 콘텐츠를 타입 있는 데이터로 입력"
```

---

### Task 5: 레이아웃 셸 (사이드바·모바일 헤더·배경·내비)

**Files:**
- Create: `src/components/SkipLink/SkipLink.tsx(.module.scss)`, `src/components/Backdrop/Backdrop.tsx(.module.scss)`, `src/components/TextLink/TextLink.tsx(.module.scss)`, `src/components/ContactLinks/ContactLinks.tsx(.module.scss)`, `src/components/SectionNav/SectionNav.tsx(.module.scss)`, `src/components/Sidebar/Sidebar.tsx(.module.scss)`, `src/components/MobileHeader/MobileHeader.tsx(.module.scss)`, `src/components/PageShell/PageShell.tsx(.module.scss)`
- Modify: `src/app/layout.tsx`, `src/app/page.tsx`

**Interfaces:**
- Consumes: `ThemeToggle`, `uiCopy`, `sectionNav`, `profile`, `NavItem`
- Produces:
  - `<TextLink href: string, className?: string, children>` — `http`로 시작하면 새 창 + `rel="noopener noreferrer"` + 숨김 텍스트 "(새 창)", 아니면 `next/link`
  - `<ContactLinks className?: string />`
  - `<SectionNav items: NavItem[], label: string, orientation: "vertical" | "horizontal" />` (client) — 현재 섹션 링크에 `aria-current="location"`
  - `<PageShell navItems: NavItem[], navLabel: string, sidebarExtra?: ReactNode, children>` — `<main id="main" tabIndex={-1}>`를 렌더링
  - `<SkipLink />`, `<Backdrop />`

- [ ] **Step 1: `SkipLink`**

```tsx
// src/components/SkipLink/SkipLink.tsx
import { uiCopy } from "@/data/site";
import styles from "./SkipLink.module.scss";

export function SkipLink() {
  return (
    <a className={styles.skipLink} href="#main">
      {uiCopy.skipLink}
    </a>
  );
}
```

```scss
// src/components/SkipLink/SkipLink.module.scss
@use "../../styles/mixins" as *;

.skipLink {
  position: fixed;
  top: var(--space-2);
  left: var(--space-2);
  z-index: 100;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-sm);
  background: var(--color-accent);
  color: var(--color-on-accent);
  @include text(body-sm);
  transform: translateY(-200%);

  &:focus-visible {
    transform: none;
  }
}
```

- [ ] **Step 2: `Backdrop`**

```tsx
// src/components/Backdrop/Backdrop.tsx
import styles from "./Backdrop.module.scss";

export function Backdrop() {
  return <div className={styles.backdrop} aria-hidden="true" />;
}
```

```scss
// src/components/Backdrop/Backdrop.module.scss
.backdrop {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(40rem 30rem at 0% 0%, var(--color-tint), transparent 70%),
    radial-gradient(30rem 24rem at 30% 100%, var(--color-tint-2), transparent 70%);
  opacity: 0.7;
}
```

- [ ] **Step 3: `TextLink`**

```tsx
// src/components/TextLink/TextLink.tsx
import Link from "next/link";
import type { ReactNode } from "react";
import { uiCopy } from "@/data/site";
import styles from "./TextLink.module.scss";

type TextLinkProps = { href: string; className?: string; children: ReactNode };

export function TextLink({ href, className, children }: TextLinkProps) {
  const classes = [styles.link, className].filter(Boolean).join(" ");

  if (href.startsWith("http")) {
    return (
      <a className={classes} href={href} target="_blank" rel="noopener noreferrer">
        {children}
        <span className={styles.hidden}>{uiCopy.newWindow}</span>
      </a>
    );
  }

  return (
    <Link className={classes} href={href}>
      {children}
    </Link>
  );
}
```

```scss
// src/components/TextLink/TextLink.module.scss
@use "../../styles/mixins" as *;

.link {
  color: var(--color-accent);
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

`mailto:` 링크는 `http`로 시작하지 않으므로 `next/link`로 렌더링된다. `next/link`는 `mailto:`를 일반 `<a>`로 처리한다.

- [ ] **Step 4: `ContactLinks`**

```tsx
// src/components/ContactLinks/ContactLinks.tsx
import { TextLink } from "@/components/TextLink/TextLink";
import { profile } from "@/data/profile";
import { uiCopy } from "@/data/site";
import styles from "./ContactLinks.module.scss";

export function ContactLinks({ className }: { className?: string }) {
  return (
    <dl className={[styles.list, className].filter(Boolean).join(" ")} aria-label={uiCopy.contactLabel}>
      <div className={styles.row}>
        <dt className={styles.term}>{uiCopy.contactEmail}</dt>
        <dd>
          <TextLink href={`mailto:${profile.email}`}>{profile.email}</TextLink>
        </dd>
      </div>
      <div className={styles.row}>
        <dt className={styles.term}>{uiCopy.contactGithub}</dt>
        <dd>
          <TextLink href={profile.github}>{profile.github.replace("https://", "")}</TextLink>
        </dd>
      </div>
    </dl>
  );
}
```

```scss
// src/components/ContactLinks/ContactLinks.module.scss
@use "../../styles/mixins" as *;

.list {
  display: grid;
  gap: var(--space-2);
  @include text(body-sm);
}

.row {
  display: grid;
  gap: var(--space-1);
}

.term {
  color: var(--color-text-sub);
  @include text(caption);
}
```

- [ ] **Step 5: `SectionNav` (client, 활성 표시 이동은 Task 8)**

```tsx
// src/components/SectionNav/SectionNav.tsx
"use client";

import { useEffect, useState } from "react";
import type { NavItem } from "@/data/types";
import styles from "./SectionNav.module.scss";

type SectionNavProps = {
  items: NavItem[];
  label: string;
  orientation: "vertical" | "horizontal";
};

export function SectionNav({ items, label, orientation }: SectionNavProps) {
  const [activeId, setActiveId] = useState(items[0]?.id);

  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className={`${styles.nav} ${styles[orientation]}`} aria-label={label}>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id}>
            <a
              className={styles.link}
              href={`#${item.id}`}
              aria-current={item.id === activeId ? "location" : undefined}
            >
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
// src/components/SectionNav/SectionNav.module.scss
@use "../../styles/mixins" as *;

.list {
  position: relative;
  display: flex;
}

.link {
  display: block;
  color: var(--color-text-sub);
  @include text(body-sm);
  transition: color var(--duration-fast) var(--ease-out);

  &:hover {
    color: var(--color-text);
  }

  &[aria-current="location"] {
    color: var(--color-accent);
    font-weight: var(--font-weight-semibold);
  }
}

.vertical {
  .list {
    flex-direction: column;
    gap: var(--space-1);
    border-left: 1px solid var(--color-border);
  }

  .link {
    padding: var(--space-1) var(--space-4);
    border-left: 2px solid transparent;
    margin-left: -1px;

    &[aria-current="location"] {
      border-left-color: var(--color-accent);
    }
  }
}

.horizontal {
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  .list {
    gap: var(--space-4);
    white-space: nowrap;
  }

  .link {
    padding: var(--space-2) 0;
    border-bottom: 2px solid transparent;

    &[aria-current="location"] {
      border-bottom-color: var(--color-accent);
    }
  }
}
```

- [ ] **Step 6: `Sidebar`**

```tsx
// src/components/Sidebar/Sidebar.tsx
import Link from "next/link";
import type { ReactNode } from "react";
import { ContactLinks } from "@/components/ContactLinks/ContactLinks";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import { profile } from "@/data/profile";
import styles from "./Sidebar.module.scss";

type SidebarProps = { nav: ReactNode; extra?: ReactNode };

export function Sidebar({ nav, extra }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <Link className={styles.brand} href="/">
        <span className={styles.name}>{profile.name}</span>
        <span className={styles.role}>{profile.role}</span>
      </Link>
      {extra ? <div className={styles.extra}>{extra}</div> : null}
      <div className={styles.nav}>{nav}</div>
      <div className={styles.footer}>
        <ContactLinks />
        <ThemeToggle />
      </div>
    </aside>
  );
}
```

```scss
// src/components/Sidebar/Sidebar.module.scss
@use "../../styles/mixins" as *;

.sidebar {
  display: none;

  @include up(lg) {
    position: sticky;
    top: var(--space-6);
    align-self: start;
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
    height: calc(100dvh - var(--space-12));
    padding: var(--space-8) var(--space-6);
    border-radius: var(--radius-lg);
    @include glass;
  }
}

.brand {
  display: grid;
  gap: var(--space-1);
}

.name {
  @include text(heading-1);
}

.role {
  color: var(--color-text-sub);
  @include text(overline);
}

.nav {
  flex: 1;
  overflow-y: auto;
}

.footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-4);
}
```

- [ ] **Step 7: `MobileHeader`**

```tsx
// src/components/MobileHeader/MobileHeader.tsx
import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import { profile } from "@/data/profile";
import styles from "./MobileHeader.module.scss";

export function MobileHeader({ nav }: { nav: ReactNode }) {
  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <Link className={styles.brand} href="/">
          {profile.name}
        </Link>
        <ThemeToggle />
      </div>
      {nav}
    </header>
  );
}
```

```scss
// src/components/MobileHeader/MobileHeader.module.scss
@use "../../styles/mixins" as *;

.header {
  // glass가 사방에 테두리를 그리므로 믹스인을 먼저 쓰고 border-width로 아래쪽만 남긴다.
  @include glass;
  position: sticky;
  top: 0;
  z-index: 10;
  display: grid;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4) 0;
  border-width: 0 0 1px;

  @include up(lg) {
    display: none;
  }
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  @include text(heading-2);
}
```

- [ ] **Step 8: `PageShell`**

```tsx
// src/components/PageShell/PageShell.tsx
import type { ReactNode } from "react";
import { MobileHeader } from "@/components/MobileHeader/MobileHeader";
import { SectionNav } from "@/components/SectionNav/SectionNav";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { uiCopy } from "@/data/site";
import type { NavItem } from "@/data/types";
import styles from "./PageShell.module.scss";

type PageShellProps = {
  navItems: NavItem[];
  navLabel: string;
  sidebarExtra?: ReactNode;
  children: ReactNode;
};

export function PageShell({ navItems, navLabel, sidebarExtra, children }: PageShellProps) {
  return (
    <>
      <MobileHeader nav={<SectionNav items={navItems} label={navLabel} orientation="horizontal" />} />
      <div className={styles.shell}>
        <Sidebar nav={<SectionNav items={navItems} label={navLabel} orientation="vertical" />} extra={sidebarExtra} />
        <div className={styles.column}>
          <main id="main" tabIndex={-1} className={styles.main}>
            {children}
          </main>
          <footer className={styles.footer}>{uiCopy.footer}</footer>
        </div>
      </div>
    </>
  );
}
```

```scss
// src/components/PageShell/PageShell.module.scss
@use "../../styles/mixins" as *;

.shell {
  width: 100%;
  max-width: 75rem;
  margin: 0 auto;
  padding: var(--space-6) var(--space-4);

  @include up(md) {
    padding: var(--space-8) var(--space-8);
  }

  @include up(lg) {
    display: grid;
    grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
    gap: var(--space-12);
    padding: var(--space-6) var(--space-8);
  }
}

.column {
  min-width: 0;
  max-width: var(--content-max);
}

.main {
  display: grid;
  gap: var(--space-16);

  &:focus {
    outline: none;
  }
}

.footer {
  margin-top: var(--space-16);
  padding: var(--space-6) 0;
  border-top: 1px solid var(--color-border);
  color: var(--color-text-sub);
  @include text(caption);
}
```

- [ ] **Step 9: `src/app/layout.tsx` body 수정**

`<body>{children}</body>`를 아래로 교체하고 import 추가:

```tsx
import { Backdrop } from "@/components/Backdrop/Backdrop";
import { SkipLink } from "@/components/SkipLink/SkipLink";
// ...
      <body>
        <SkipLink />
        <Backdrop />
        {children}
      </body>
```

- [ ] **Step 10: 임시 `src/app/page.tsx` (Task 6에서 교체)**

```tsx
import { PageShell } from "@/components/PageShell/PageShell";
import { sectionNav, uiCopy } from "@/data/site";

export default function HomePage() {
  return (
    <PageShell navItems={sectionNav} navLabel={uiCopy.sectionNavLabel}>
      {sectionNav.map((item) => (
        <section key={item.id} id={item.id} style={{ minHeight: "80vh" }}>
          <h2>{item.label}</h2>
        </section>
      ))}
    </PageShell>
  );
}
```

- [ ] **Step 11: 브라우저 확인**

preview_start `{name: "dev"}` 후:
1. 1280px: 좌측 유리 사이드바 고정, 스크롤 시 사이드바 유지, 현재 섹션 링크가 강조색 + 왼쪽 막대
2. resize_window `mobile`(375px) + 360px: 사이드바 숨김, 상단 유리 헤더 고정, 섹션 링크 가로 스크롤
3. Tab 첫 입력 시 "본문 바로가기" 표시, Enter로 `#main` 이동
4. 다크 모드에서 유리·배경 빛 번짐 확인 (screenshot)

- [ ] **Step 12: 검증 & Commit**

Run: `npm run lint && npm test && npm run build` → 통과

```bash
git add src/components src/app
git commit -m "feat: 유리 사이드바·모바일 헤더·섹션 내비로 구성한 페이지 레이아웃 추가"
```

---

### Task 6: 메인 페이지 섹션

**Files:**
- Create: `src/components/Tag/Tag.tsx(.module.scss)`, `src/components/SectionHeading/SectionHeading.tsx(.module.scss)`, `src/components/AboutSection/AboutSection.tsx(.module.scss)`, `src/components/CareerSection/CareerSection.tsx`, `src/components/CareerSection/CareerItem.tsx`, `src/components/CareerSection/CareerSection.module.scss`, `src/components/ProjectsSection/ProjectsSection.tsx`, `src/components/ProjectsSection/ProjectCard.tsx`, `src/components/ProjectsSection/ProjectsSection.module.scss`, `src/components/SkillsSection/SkillsSection.tsx(.module.scss)`, `src/components/EducationSection/EducationSection.tsx(.module.scss)`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `profile`, `career`, `projects`, `personalProjectsIntro`, `skills`, `education`, `sectionNav`, `uiCopy`, `formatPeriod`, `ContactLinks`, `PageShell`
- Produces:
  - `<TagList items: string[], className?: string />`
  - `<SectionHeading id: string, children />` — `<h2 id={id}>`
  - 섹션 컴포넌트들은 `<section id={…} aria-labelledby={…}>`로 렌더링. `id`는 `sectionNav`의 id와 같다.
  - 제목 단계: `h1`(About 헤드라인) → `h2`(섹션) → `h3`(카드·회사)

- [ ] **Step 1: `Tag`**

```tsx
// src/components/Tag/Tag.tsx
import styles from "./Tag.module.scss";

export function TagList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={[styles.list, className].filter(Boolean).join(" ")}>
      {items.map((item) => (
        <li key={item} className={styles.tag}>
          {item}
        </li>
      ))}
    </ul>
  );
}
```

```scss
// src/components/Tag/Tag.module.scss
@use "../../styles/mixins" as *;

.list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.tag {
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--color-tint) 55%, transparent);
  color: var(--color-text);
  @include text(caption);
}
```

- [ ] **Step 2: `SectionHeading`**

```tsx
// src/components/SectionHeading/SectionHeading.tsx
import type { ReactNode } from "react";
import styles from "./SectionHeading.module.scss";

export function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className={styles.heading}>
      {children}
    </h2>
  );
}
```

```scss
// src/components/SectionHeading/SectionHeading.module.scss
@use "../../styles/mixins" as *;

.heading {
  margin-bottom: var(--space-6);
  @include text(heading-1);
}
```

- [ ] **Step 3: `AboutSection`**

```tsx
// src/components/AboutSection/AboutSection.tsx
import { ContactLinks } from "@/components/ContactLinks/ContactLinks";
import { profile } from "@/data/profile";
import { uiCopy } from "@/data/site";
import styles from "./AboutSection.module.scss";

export function AboutSection({ id }: { id: string }) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <p className={styles.role}>{profile.role}</p>
      <h1 id={`${id}-title`} className={styles.headline}>
        {profile.headline}
      </h1>
      <p className={styles.intro}>{profile.intro}</p>
      <ContactLinks className={styles.contacts} />
      <h2 className={styles.subTitle}>{uiCopy.competenciesTitle}</h2>
      <ul className={styles.competencies}>
        {profile.competencies.map((item) => (
          <li key={item.label} className={styles.competency}>
            <strong className={styles.label}>{item.label}</strong>
            <span className={styles.text}>{item.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```scss
// src/components/AboutSection/AboutSection.module.scss
@use "../../styles/mixins" as *;

.section {
  display: grid;
  gap: var(--space-4);
  scroll-margin-top: var(--space-16);
}

.role {
  color: var(--color-accent);
  @include text(overline);
}

.headline {
  @include text(display);
}

.intro {
  color: var(--color-text-sub);
}

.contacts {
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);

  @include up(lg) {
    display: none;
  }
}

.subTitle {
  margin-top: var(--space-6);
  @include text(heading-2);
}

.competencies {
  display: grid;
  gap: var(--space-3);

  @include up(md) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.competency {
  display: grid;
  gap: var(--space-1);
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
}

.label {
  @include text(body);
  font-weight: var(--font-weight-semibold);
}

.text {
  color: var(--color-text-sub);
  @include text(body-sm);
}
```

`scroll-margin-top`은 모바일 고정 헤더에 섹션 제목이 가려지지 않게 한다. 다른 섹션도 같은 값을 쓴다.

- [ ] **Step 4: `CareerSection` + `CareerItem`**

```tsx
// src/components/CareerSection/CareerItem.tsx
import type { CareerEntry } from "@/data/types";
import { formatPeriod } from "@/lib/format";
import styles from "./CareerSection.module.scss";

export function CareerItem({ entry }: { entry: CareerEntry }) {
  return (
    <article className={styles.item}>
      <header className={styles.header}>
        <h3 className={styles.company}>{entry.company}</h3>
        <p className={styles.meta}>
          {entry.position} · {formatPeriod(entry.period)}
        </p>
      </header>
      <p className={styles.summary}>{entry.summary}</p>
      <ul className={styles.highlights}>
        {entry.highlights.map((highlight) => (
          <li key={highlight.text} className={styles.highlight}>
            {highlight.label ? <strong>{highlight.label}: </strong> : null}
            {highlight.text}
          </li>
        ))}
      </ul>
    </article>
  );
}
```

```tsx
// src/components/CareerSection/CareerSection.tsx
import { SectionHeading } from "@/components/SectionHeading/SectionHeading";
import { career } from "@/data/career";
import { CareerItem } from "./CareerItem";
import styles from "./CareerSection.module.scss";

export function CareerSection({ id, title }: { id: string; title: string }) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <SectionHeading id={`${id}-title`}>{title}</SectionHeading>
      <div className={styles.list}>
        {career.map((entry) => (
          <CareerItem key={entry.company} entry={entry} />
        ))}
      </div>
    </section>
  );
}
```

```scss
// src/components/CareerSection/CareerSection.module.scss
@use "../../styles/mixins" as *;

.section {
  scroll-margin-top: var(--space-16);
}

.list {
  display: grid;
  gap: var(--space-8);
}

.item {
  display: grid;
  gap: var(--space-3);
  padding-left: var(--space-5);
  border-left: 2px solid var(--color-border);
}

.header {
  display: grid;
  gap: var(--space-1);
}

.company {
  @include text(heading-2);
}

.meta {
  color: var(--color-text-sub);
  @include text(caption);
}

.summary {
  color: var(--color-text-sub);
}

.highlights {
  display: grid;
  gap: var(--space-2);
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
    background: var(--color-decor);
  }
}
```

- [ ] **Step 5: `ProjectsSection` + `ProjectCard`**

```tsx
// src/components/ProjectsSection/ProjectCard.tsx
import Link from "next/link";
import { TagList } from "@/components/Tag/Tag";
import type { Project } from "@/data/types";
import { formatPeriod } from "@/lib/format";
import styles from "./ProjectsSection.module.scss";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={styles.card}>
      <p className={styles.label}>{project.label}</p>
      <h4 className={styles.title}>
        <Link className={styles.link} href={`/projects/${project.slug}`}>
          {project.title}
        </Link>
      </h4>
      <p className={styles.summary}>{project.summary}</p>
      <p className={styles.period}>{formatPeriod(project.period)}</p>
      <TagList items={project.stack} />
    </article>
  );
}
```

```tsx
// src/components/ProjectsSection/ProjectsSection.tsx
import { SectionHeading } from "@/components/SectionHeading/SectionHeading";
import { personalProjectsIntro, projects } from "@/data/projects";
import { uiCopy } from "@/data/site";
import { ProjectCard } from "./ProjectCard";
import styles from "./ProjectsSection.module.scss";

export function ProjectsSection({ id, title }: { id: string; title: string }) {
  const work = projects.filter((project) => project.kind === "work");
  const personal = projects.filter((project) => project.kind === "personal");

  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <SectionHeading id={`${id}-title`}>{title}</SectionHeading>

      <div className={styles.group}>
        <h3 className={styles.groupTitle}>{uiCopy.workProjectsTitle}</h3>
        <div className={styles.grid}>
          {work.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <h3 className={styles.groupTitle}>{uiCopy.personalProjectsTitle}</h3>
        <p className={styles.groupIntro}>{personalProjectsIntro}</p>
        <div className={styles.grid}>
          {personal.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

카드 제목은 그룹 제목(`h3`) 아래이므로 `h4`다.

```scss
// src/components/ProjectsSection/ProjectsSection.module.scss
@use "../../styles/mixins" as *;

.section {
  display: grid;
  gap: var(--space-10);
  scroll-margin-top: var(--space-16);
}

.group {
  display: grid;
  gap: var(--space-4);
}

.groupTitle {
  @include text(heading-2);
}

.groupIntro {
  color: var(--color-text-sub);
  @include text(body-sm);
}

.grid {
  display: grid;
  gap: var(--space-4);

  @include up(md) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  transition:
    border-color var(--duration-fast) var(--ease-out),
    transform var(--duration-fast) var(--ease-out);

  &:hover {
    border-color: var(--color-accent);
    transform: translateY(calc(var(--space-1) * -1));
  }

  &:has(.link:focus-visible) {
    @include focus-ring;
  }
}

.label {
  color: var(--color-accent);
  @include text(overline);
}

.title {
  @include text(heading-2);
}

.link {
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
  }

  &:focus-visible {
    outline: none;
  }
}

.summary {
  flex: 1;
  color: var(--color-text-sub);
  @include text(body-sm);
}

.period {
  color: var(--color-text-sub);
  @include text(caption);
}
```

- [ ] **Step 6: `SkillsSection`**

```tsx
// src/components/SkillsSection/SkillsSection.tsx
import { SectionHeading } from "@/components/SectionHeading/SectionHeading";
import { TagList } from "@/components/Tag/Tag";
import { skills } from "@/data/skills";
import styles from "./SkillsSection.module.scss";

export function SkillsSection({ id, title }: { id: string; title: string }) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <SectionHeading id={`${id}-title`}>{title}</SectionHeading>
      <dl className={styles.list}>
        {skills.map((group) => (
          <div key={group.category} className={styles.row}>
            <dt className={styles.category}>{group.category}</dt>
            <dd className={styles.items}>
              <TagList items={group.items} />
              {group.note ? <p className={styles.note}>{group.note}</p> : null}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

```scss
// src/components/SkillsSection/SkillsSection.module.scss
@use "../../styles/mixins" as *;

.section {
  scroll-margin-top: var(--space-16);
}

.list {
  display: grid;
}

.row {
  display: grid;
  gap: var(--space-2);
  padding: var(--space-4) 0;
  border-top: 1px solid var(--color-border);

  @include up(md) {
    grid-template-columns: 11rem minmax(0, 1fr);
    gap: var(--space-6);
  }
}

.category {
  @include text(body-sm);
  font-weight: var(--font-weight-semibold);
}

.items {
  display: grid;
  gap: var(--space-2);
}

.note {
  color: var(--color-text-sub);
  @include text(caption);
}
```

- [ ] **Step 7: `EducationSection`**

```tsx
// src/components/EducationSection/EducationSection.tsx
import { SectionHeading } from "@/components/SectionHeading/SectionHeading";
import { education } from "@/data/education";
import styles from "./EducationSection.module.scss";

export function EducationSection({ id, title }: { id: string; title: string }) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <SectionHeading id={`${id}-title`}>{title}</SectionHeading>
      <ul className={styles.list}>
        {education.map((item) => (
          <li key={item.title} className={styles.item}>
            <span>{item.title}</span>
            {item.detail ? <span className={styles.detail}>{item.detail}</span> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```scss
// src/components/EducationSection/EducationSection.module.scss
@use "../../styles/mixins" as *;

.section {
  scroll-margin-top: var(--space-16);
}

.list {
  display: grid;
  gap: var(--space-3);
}

.item {
  display: grid;
  gap: var(--space-1);
}

.detail {
  color: var(--color-text-sub);
  @include text(caption);
}
```

- [ ] **Step 8: `src/app/page.tsx` 최종본**

```tsx
import { AboutSection } from "@/components/AboutSection/AboutSection";
import { CareerSection } from "@/components/CareerSection/CareerSection";
import { EducationSection } from "@/components/EducationSection/EducationSection";
import { PageShell } from "@/components/PageShell/PageShell";
import { ProjectsSection } from "@/components/ProjectsSection/ProjectsSection";
import { SkillsSection } from "@/components/SkillsSection/SkillsSection";
import { sectionNav, uiCopy } from "@/data/site";

const [about, careerNav, projectsNav, skillsNav, educationNav] = sectionNav;

export default function HomePage() {
  return (
    <PageShell navItems={sectionNav} navLabel={uiCopy.sectionNavLabel}>
      <AboutSection id={about.id} />
      <CareerSection id={careerNav.id} title={careerNav.label} />
      <ProjectsSection id={projectsNav.id} title={projectsNav.label} />
      <SkillsSection id={skillsNav.id} title={skillsNav.label} />
      <EducationSection id={educationNav.id} title={educationNav.label} />
    </PageShell>
  );
}
```

- [ ] **Step 9: 브라우저 확인**

1. 360px / 768px / 1280px × 라이트/다크 screenshot — 가로 스크롤 없음 (`document.documentElement.scrollWidth <= innerWidth`를 javascript_tool로 확인)
2. 카드 아무 곳 클릭 → `/projects/<slug>` 이동 (아직 404여도 URL 확인)
3. Tab 순서: 본문 바로가기 → 헤더/사이드바 링크 → 연락처 → 카드 제목 링크(카드 전체에 포커스 링)
4. read_page로 제목 구조 확인: h1 1개, h2(핵심 역량·경력·프로젝트·기술·학력), h3, h4 순서
5. 스크롤하면 사이드바 현재 섹션이 바뀐다

- [ ] **Step 10: 검증 & Commit**

Run: `npm run lint && npm test && npm run build` → 통과

```bash
git add src/components src/app/page.tsx
git commit -m "feat: 소개·경력·프로젝트·기술·학력 섹션으로 메인 원페이지 구성"
```

---

### Task 7: 프로젝트 상세 페이지와 404

**Files:**
- Create: `src/components/ButtonLink/ButtonLink.tsx(.module.scss)`, `src/components/ProjectHeader/ProjectHeader.tsx(.module.scss)`, `src/components/ProjectBody/ProjectBody.tsx(.module.scss)`, `src/components/ProjectGallery/ProjectGallery.tsx(.module.scss)`, `src/components/ProjectPager/ProjectPager.tsx(.module.scss)`, `src/app/projects/[slug]/page.tsx`, `src/app/not-found.tsx`, `src/app/not-found.module.scss`

**Interfaces:**
- Consumes: `getProjectBySlug`, `getAdjacentProjects`, `getProjectToc`, `getPrimaryLinks`, `getEvidenceLinks`, `sectionId`, `EVIDENCE_SECTION_ID`, `formatPeriod`, `PageShell`, `TagList`, `TextLink`, `uiCopy`, `projects`
- Produces:
  - `<ButtonLink href: string, variant?: "primary" | "secondary", children />`
  - `/projects/[slug]` 6개 정적 생성, `dynamicParams = false`

- [ ] **Step 1: `ButtonLink`**

```tsx
// src/components/ButtonLink/ButtonLink.tsx
import Link from "next/link";
import type { ReactNode } from "react";
import { uiCopy } from "@/data/site";
import styles from "./ButtonLink.module.scss";

type ButtonLinkProps = { href: string; variant?: "primary" | "secondary"; children: ReactNode };

export function ButtonLink({ href, variant = "primary", children }: ButtonLinkProps) {
  const className = `${styles.button} ${styles[variant]}`;

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
// src/components/ButtonLink/ButtonLink.module.scss
@use "../../styles/mixins" as *;

.button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  min-height: var(--space-10);
  padding: var(--space-2) var(--space-4);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  @include text(body-sm);
  font-weight: var(--font-weight-semibold);
  transition:
    background-color var(--duration-fast) var(--ease-out),
    border-color var(--duration-fast) var(--ease-out),
    color var(--duration-fast) var(--ease-out);
}

.primary {
  background: var(--color-accent);
  color: var(--color-on-accent);

  &:hover {
    background: color-mix(in srgb, var(--color-accent) 85%, var(--color-text));
  }
}

.secondary {
  border-color: var(--color-text);
  color: var(--color-text);

  &:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
}

.hidden {
  @include visually-hidden;
}
```

- [ ] **Step 2: `ProjectHeader`**

```tsx
// src/components/ProjectHeader/ProjectHeader.tsx
import { ButtonLink } from "@/components/ButtonLink/ButtonLink";
import { TagList } from "@/components/Tag/Tag";
import { uiCopy } from "@/data/site";
import type { Project } from "@/data/types";
import { formatPeriod } from "@/lib/format";
import { getPrimaryLinks } from "@/lib/projects";
import styles from "./ProjectHeader.module.scss";

export function ProjectHeader({ project }: { project: Project }) {
  const links = getPrimaryLinks(project);

  return (
    <header className={styles.header}>
      <p className={styles.label}>{project.label}</p>
      <h1 className={styles.title}>{project.title}</h1>
      <p className={styles.meta}>
        {formatPeriod(project.period)}
        {project.role ? ` · ${project.role}` : null}
      </p>
      <TagList items={project.stack} />
      {project.note ? <p className={styles.note}>{project.note}</p> : null}
      {links.length > 0 ? (
        <ul className={styles.links} aria-label={uiCopy.projectLinksLabel}>
          {links.map((link, index) => (
            <li key={link.href}>
              <ButtonLink href={link.href} variant={index === 0 ? "primary" : "secondary"}>
                {link.label}
              </ButtonLink>
            </li>
          ))}
        </ul>
      ) : null}
    </header>
  );
}
```

```scss
// src/components/ProjectHeader/ProjectHeader.module.scss
@use "../../styles/mixins" as *;

.header {
  display: grid;
  gap: var(--space-4);
}

.label {
  color: var(--color-accent);
  @include text(overline);
}

.title {
  @include text(display);
}

.meta {
  color: var(--color-text-sub);
  @include text(body-sm);
}

.note {
  padding: var(--space-4);
  border-left: 2px solid var(--color-accent);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  background: var(--color-surface);
  color: var(--color-text-sub);
  @include text(body-sm);
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}
```

- [ ] **Step 3: `ProjectGallery`**

```tsx
// src/components/ProjectGallery/ProjectGallery.tsx
import Image from "next/image";
import { uiCopy } from "@/data/site";
import type { ProjectImage } from "@/data/types";
import styles from "./ProjectGallery.module.scss";

export function ProjectGallery({ images }: { images?: ProjectImage[] }) {
  if (!images || images.length === 0) return null;

  return (
    <ul className={styles.gallery} aria-label={uiCopy.galleryLabel}>
      {images.map((image, index) => (
        <li key={image.src} className={styles.item}>
          <Image
            className={styles.image}
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(min-width: 1024px) 720px, 100vw"
            priority={index === 0}
          />
        </li>
      ))}
    </ul>
  );
}
```

```scss
// src/components/ProjectGallery/ProjectGallery.module.scss
.gallery {
  display: grid;
  gap: var(--space-4);
}

.item {
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
}

.image {
  width: 100%;
  height: auto;
}
```

- [ ] **Step 4: `ProjectBody`**

```tsx
// src/components/ProjectBody/ProjectBody.tsx
import { TagList } from "@/components/Tag/Tag";
import { TextLink } from "@/components/TextLink/TextLink";
import { uiCopy } from "@/data/site";
import type { Project } from "@/data/types";
import { EVIDENCE_SECTION_ID, getEvidenceLinks, sectionId } from "@/lib/projects";
import styles from "./ProjectBody.module.scss";

export function ProjectBody({ project }: { project: Project }) {
  const evidence = getEvidenceLinks(project);

  return (
    <div className={styles.body}>
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
                  <li key={item.text} className={styles.item}>
                    {item.label ? <strong className={styles.itemLabel}>{item.label}</strong> : null}
                    <span>{item.text}</span>
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
  );
}
```

```scss
// src/components/ProjectBody/ProjectBody.module.scss
@use "../../styles/mixins" as *;

.body {
  display: grid;
  gap: var(--space-12);
}

.section {
  display: grid;
  gap: var(--space-4);
  scroll-margin-top: var(--space-16);
}

.title {
  @include text(heading-1);
}

.paragraph {
  @include text(body);
}

.items {
  display: grid;
  gap: var(--space-3);
}

.item {
  display: grid;
  gap: var(--space-1);
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  @include text(body-sm);
}

.itemLabel {
  @include text(body);
  font-weight: var(--font-weight-semibold);
}

.evidence {
  display: grid;
  gap: var(--space-2);
}
```

- [ ] **Step 5: `ProjectPager`**

```tsx
// src/components/ProjectPager/ProjectPager.tsx
import Link from "next/link";
import { uiCopy } from "@/data/site";
import type { Project } from "@/data/types";
import styles from "./ProjectPager.module.scss";

type ProjectPagerProps = { prev?: Project; next?: Project };

export function ProjectPager({ prev, next }: ProjectPagerProps) {
  if (!prev && !next) return null;

  return (
    <nav className={styles.pager} aria-label={uiCopy.pagerLabel}>
      {prev ? (
        <Link className={`${styles.link} ${styles.prev}`} href={`/projects/${prev.slug}`}>
          <span className={styles.direction}>{uiCopy.prevProject}</span>
          <span className={styles.title}>{prev.title}</span>
        </Link>
      ) : null}
      {next ? (
        <Link className={`${styles.link} ${styles.next}`} href={`/projects/${next.slug}`}>
          <span className={styles.direction}>{uiCopy.nextProject}</span>
          <span className={styles.title}>{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
```

```scss
// src/components/ProjectPager/ProjectPager.module.scss
@use "../../styles/mixins" as *;

.pager {
  display: grid;
  gap: var(--space-3);
  padding-top: var(--space-8);
  border-top: 1px solid var(--color-border);

  @include up(md) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.link {
  display: grid;
  gap: var(--space-1);
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  transition: border-color var(--duration-fast) var(--ease-out);

  &:hover {
    border-color: var(--color-accent);
  }
}

.next {
  text-align: right;

  @include up(md) {
    grid-column: 2;
  }
}

.direction {
  color: var(--color-text-sub);
  @include text(caption);
}

.title {
  @include text(body-sm);
  font-weight: var(--font-weight-semibold);
}
```

- [ ] **Step 6: `src/app/projects/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell/PageShell";
import { ProjectBody } from "@/components/ProjectBody/ProjectBody";
import { ProjectGallery } from "@/components/ProjectGallery/ProjectGallery";
import { ProjectHeader } from "@/components/ProjectHeader/ProjectHeader";
import { ProjectPager } from "@/components/ProjectPager/ProjectPager";
import { TextLink } from "@/components/TextLink/TextLink";
import { projects } from "@/data/projects";
import { uiCopy } from "@/data/site";
import { getAdjacentProjects, getProjectBySlug, getProjectToc } from "@/lib/projects";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return { title: project.title, description: project.summary };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const { prev, next } = getAdjacentProjects(slug);

  return (
    <PageShell
      navItems={getProjectToc(project)}
      navLabel={uiCopy.tocLabel}
      sidebarExtra={<TextLink href="/#projects">{uiCopy.backToProjects}</TextLink>}
    >
      <ProjectHeader project={project} />
      <ProjectGallery images={project.images} />
      <ProjectBody project={project} />
      <ProjectPager prev={prev} next={next} />
    </PageShell>
  );
}
```

모바일에서는 사이드바가 숨겨지므로 "← 전체 프로젝트"가 보이지 않는다. 모바일 헤더의 이름 링크(`/`)가 메인으로 가는 경로다. 추가로 `ProjectHeader` 위에 모바일 전용 뒤로가기를 두지 않는다 (YAGNI — 브라우저 뒤로가기와 이전/다음 페이저가 있음).

- [ ] **Step 7: 404 `src/app/not-found.tsx`**

```tsx
import { ButtonLink } from "@/components/ButtonLink/ButtonLink";
import { PageShell } from "@/components/PageShell/PageShell";
import { uiCopy } from "@/data/site";
import styles from "./not-found.module.scss";

export default function NotFound() {
  return (
    <PageShell navItems={[]} navLabel={uiCopy.sectionNavLabel}>
      <section className={styles.section}>
        <h1 className={styles.title}>{uiCopy.notFoundTitle}</h1>
        <p className={styles.body}>{uiCopy.notFoundBody}</p>
        <div>
          <ButtonLink href="/">{uiCopy.notFoundLink}</ButtonLink>
        </div>
      </section>
    </PageShell>
  );
}
```

```scss
// src/app/not-found.module.scss
@use "../styles/mixins" as *;

.section {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-16) 0;
}

.title {
  @include text(display);
}

.body {
  color: var(--color-text-sub);
}
```

- [ ] **Step 8: 빌드로 정적 생성 확인**

Run: `npm run build`
Expected: 출력의 라우트 목록에 `● /projects/[slug]` 아래 6개 경로(`/projects/weseedcon` … `/projects/fe-daily-study`)가 SSG로 표시

- [ ] **Step 9: 브라우저 확인**

1. `/projects/weseedcon`: 서비스 링크 2개(첫 번째 primary), 섹션 3개, 사이드바 목차 3개, 다음 프로젝트만 있음
2. `/projects/construction-logistics-systems`: note 박스, 섹션별 기술 태그
3. `/projects/monibuk`: 목차에 "확인 자료" 포함, 외부 링크 새 창
4. `/projects/fe-daily-study`: 이전만 있음
5. `/projects/nope`: 404 화면, "메인으로 돌아가기" 동작
6. 360px에서 제목·버튼 줄바꿈 깨짐 없음, 라이트/다크 screenshot

- [ ] **Step 10: 검증 & Commit**

Run: `npm run lint && npm test && npm run build` → 통과

```bash
git add src/components src/app
git commit -m "feat: 프로젝트 상세 페이지 6개를 정적 생성하고 404 페이지 추가"
```

---

### Task 8: 인터랙션 (활성 표시 이동·테마 전환·스크롤 등장)

**Files:**
- Modify: `src/components/SectionNav/SectionNav.tsx`, `src/components/SectionNav/SectionNav.module.scss`, `src/components/ThemeToggle/ThemeToggle.tsx`, `src/styles/globals.scss`, `src/components/CareerSection/CareerSection.module.scss`, `src/components/ProjectsSection/ProjectsSection.module.scss`

**Interfaces:**
- Consumes: `reveal-keyframes`, `reveal` 믹스인 (Task 2), `applyTheme`, `saveTheme`
- Produces: CSS 변수 `--indicator-offset`, `--indicator-size` (SectionNav 내부), `--vt-x`, `--vt-y` (html, 테마 전환 원점)

- [ ] **Step 1: `SectionNav.tsx` 전체 교체 — 활성 표시 위치를 CSS 변수로 전달**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import type { NavItem } from "@/data/types";
import styles from "./SectionNav.module.scss";

type SectionNavProps = {
  items: NavItem[];
  label: string;
  orientation: "vertical" | "horizontal";
};

export function SectionNav({ items, label, orientation }: SectionNavProps) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!list || !active) return;

    function place() {
      if (!list || !active) return;
      const vertical = orientation === "vertical";
      list.style.setProperty("--indicator-offset", `${vertical ? active.offsetTop : active.offsetLeft}px`);
      list.style.setProperty("--indicator-size", `${vertical ? active.offsetHeight : active.offsetWidth}px`);
      if (!vertical) active.scrollIntoView({ block: "nearest", inline: "nearest" });
    }

    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [activeId, orientation]);

  if (items.length === 0) return null;

  return (
    <nav className={`${styles.nav} ${styles[orientation]}`} aria-label={label}>
      <ul ref={listRef} className={styles.list}>
        {items.map((item) => (
          <li key={item.id}>
            <a
              className={styles.link}
              href={`#${item.id}`}
              aria-current={item.id === activeId ? "location" : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
        <li className={styles.indicator} aria-hidden="true" />
      </ul>
    </nav>
  );
}
```

가로 내비에서 `scrollIntoView`는 내비 목록만 가로로 스크롤해야 한다. 페이지가 세로로 튀면 `active.parentElement?.parentElement?.scrollTo({ left: active.offsetLeft - 16 })` 방식으로 교체한다 (브라우저 확인 Step 6에서 판단).

- [ ] **Step 2: `SectionNav.module.scss` 전체 교체 — 링크별 막대 대신 이동하는 표시 요소**

```scss
@use "../../styles/mixins" as *;

.list {
  position: relative;
  display: flex;
}

.link {
  display: block;
  color: var(--color-text-sub);
  @include text(body-sm);
  transition: color var(--duration-fast) var(--ease-out);

  &:hover {
    color: var(--color-text);
  }

  &[aria-current="location"] {
    color: var(--color-accent);
    font-weight: var(--font-weight-semibold);
  }
}

.indicator {
  position: absolute;
  background: var(--color-accent);
  pointer-events: none;
  transition:
    transform var(--duration-base) var(--ease-out),
    width var(--duration-base) var(--ease-out),
    height var(--duration-base) var(--ease-out);
}

.vertical {
  .list {
    flex-direction: column;
    gap: var(--space-1);
    border-left: 1px solid var(--color-border);
  }

  .link {
    padding: var(--space-1) var(--space-4);
  }

  .indicator {
    top: 0;
    left: -1px;
    width: 2px;
    height: var(--indicator-size, 0);
    transform: translateY(var(--indicator-offset, 0));
  }
}

.horizontal {
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  .list {
    gap: var(--space-4);
    padding-bottom: 2px;
    white-space: nowrap;
  }

  .link {
    padding: var(--space-2) 0;
  }

  .indicator {
    bottom: 0;
    left: 0;
    width: var(--indicator-size, 0);
    height: 2px;
    transform: translateX(var(--indicator-offset, 0));
  }
}
```

현재 항목은 색(강조색) + 굵기 + 표시 막대로 구분된다 (색만으로 전달하지 않음).

- [ ] **Step 3: `ThemeToggle.tsx`의 `handleClick` 교체 — View Transition 원형 전환**

`handleClick` 함수를 아래로 교체한다 (나머지 파일 동일):

```tsx
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    saveTheme(next);
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!document.startViewTransition || reduceMotion) {
      applyTheme(next, root);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    root.style.setProperty("--vt-x", `${rect.left + rect.width / 2}px`);
    root.style.setProperty("--vt-y", `${rect.top + rect.height / 2}px`);
    document.startViewTransition(() => applyTheme(next, root));
  }
```

`document.startViewTransition`의 타입이 TS lib에 없다는 오류가 나면 `tsconfig.json`의 `lib`이 `dom`을 포함하는지 확인한다 (TS 5.6+ 에 포함). TS 버전이 낮으면 `npm install -D typescript@latest`.

- [ ] **Step 4: `globals.scss` 끝에 View Transition 규칙 추가**

```scss
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

@media (prefers-reduced-motion: no-preference) {
  ::view-transition-new(root) {
    animation: theme-reveal 400ms var(--ease-out);
  }
}

@keyframes theme-reveal {
  from {
    clip-path: circle(0 at var(--vt-x, 50%) var(--vt-y, 0));
  }
  to {
    clip-path: circle(150vmax at var(--vt-x, 50%) var(--vt-y, 0));
  }
}
```

- [ ] **Step 5: 스크롤 등장 적용**

`src/components/CareerSection/CareerSection.module.scss` — 첫 줄 `@use` 바로 아래에 `@include reveal-keyframes;` 추가, `.item` 블록 안 마지막 줄에 `@include reveal;` 추가.

`src/components/ProjectsSection/ProjectsSection.module.scss` — 첫 줄 `@use` 바로 아래에 `@include reveal-keyframes;` 추가, `.card` 블록 안 `transition` 선언 다음 줄에 `@include reveal;` 추가.

예 (CareerSection):

```scss
@use "../../styles/mixins" as *;
@include reveal-keyframes;

// …
.item {
  display: grid;
  gap: var(--space-3);
  padding-left: var(--space-5);
  border-left: 2px solid var(--color-border);
  @include reveal;
}
```

카드 hover의 `transform`과 reveal 애니메이션의 `transform`이 겹친다. reveal은 `entry` 구간에서만 진행되고 이후 `both`로 `transform: none`을 유지하므로 hover `translateY`가 덮인다. 이를 피하려고 `.card` hover는 `translate` 속성을 쓴다:

```scss
  &:hover {
    border-color: var(--color-accent);
    translate: 0 calc(var(--space-1) * -1);
  }
```

그리고 `.card`의 `transition`에서 `transform`을 `translate`로 바꾼다.

- [ ] **Step 6: 브라우저 확인**

1. 1280px 스크롤: 사이드바 표시 막대가 항목 사이로 미끄러지듯 이동
2. 375px 스크롤: 헤더 하단 표시가 이동하고, 활성 링크가 내비 안에서 보이게 가로 스크롤 — 페이지가 세로로 튀지 않는지 확인 (튀면 Step 1 주석의 `scrollTo` 방식으로 교체)
3. 토글 클릭: 버튼 위치에서 원형으로 테마가 퍼짐 (Chrome)
4. 경력 항목·프로젝트 카드가 스크롤 진입 시 떠오름, 이미 화면에 있는 요소는 처음부터 보임
5. resize_window/에뮬레이션으로 `prefers-reduced-motion: reduce` 상태에서 모든 움직임이 즉시 처리됨 (javascript_tool: `matchMedia('(prefers-reduced-motion: reduce)').matches` 확인 후 동작 관찰. 에뮬레이션이 안 되면 OS 설정 없이 CSS 규칙 존재만 확인하고 보고)
6. 카드 hover 시 위로 살짝 이동

- [ ] **Step 7: 검증 & Commit**

Run: `npm run lint && npm test && npm run build` → 통과

```bash
git add src/components src/styles/globals.scss
git commit -m "style: 섹션 내비 활성 표시 이동·원형 테마 전환·스크롤 등장 인터랙션 추가"
```

---

### Task 9: 작업 규칙 문서 갱신

**Files:**
- Modify: `CLAUDE.md`, `AGENTS.md` (같은 내용), `README.md` (전체 교체)

- [ ] **Step 1: `CLAUDE.md`와 `AGENTS.md`를 아래 내용으로 교체 (첫 줄 제목만 파일명에 맞춤)**

```markdown
# CLAUDE.md — AI 에이전트 작업 가이드

이 저장소에서 AI 도구로 작업할 때 따르는 규칙이다. 사람이 작업하든 AI가 작업하든
같은 기준(구조·컨벤션·접근성·완료 기준)을 적용해 일관성과 품질을 유지한다.
설계 기준 문서: `docs/superpowers/specs/2026-10-02-portfolio-renewal-design.md`

## 콘텐츠 원칙

- 사이트는 범용 이력서의 웹 확장판이다. 특정 지원처를 언급하지 않는다. 경력상의 회사·고객사는 실명을 쓴다.
- 콘텐츠·UI 문구는 `src/data/`에만 둔다. 컴포넌트에 문구를 하드코딩하지 않는다.
- 연락처는 이메일·GitHub만 노출한다. 전화번호·거주지는 넣지 않는다 (`data.test.ts`가 검사).
- 개인 프로젝트 저장소(money_book, dev_study 등)는 이 저장소에서 수정하지 않는다.

## 범위

- 라우트: `/`(메인 원페이지), `/projects/[slug]`(상세, 정적 생성), 404
- 새 페이지·기능·의존성은 즉흥적으로 추가하지 않고 기록한 뒤 판단한다.
- 범위 밖: 블로그·MDX·CMS, 다국어, 애니메이션 라이브러리, Tailwind, 분석 도구, 문의 폼

## 기술 스택 · 컨벤션

- Next.js App Router + React + TypeScript + SCSS Modules + Vercel
- 컴포넌트: `src/components/<Name>/<Name>.tsx` + `<Name>.module.scss`
- Server Component 기본. client component는 `ThemeToggle`, `SectionNav`뿐이다. 늘리려면 이유를 기록한다.
- 이미지 `next/image`(alt 필수), 폰트 `next/font/local`(Pretendard)

## 스타일 규칙

- 토큰 원본: `src/styles/_colors.scss`(색상), `_typography.scss`(타이포), `globals.scss`(간격·모서리·시간)
- 모듈 SCSS에서 색상 값, `font-size`, 간격 숫자를 직접 쓰지 않는다. `var(--…)` 토큰과 믹스인만 쓴다.
  (예외: `0`, `1px` 테두리, `2px` 포커스 링·표시 막대, 비율 값)
- 타이포는 `@include text(display|heading-1|heading-2|body|body-sm|caption|overline)`로만 적용한다.
- 반응형 글자 크기는 토큰 값 재정의로 처리한다. 컴포넌트에 글자 크기용 media query를 두지 않는다.
- 브레이크포인트 믹스인 `up(md|lg)` / `down(md|lg)` — md 768px, lg 1024px, 모바일 우선
- `--color-decor`는 텍스트에 쓰지 않는다. 색상 토큰을 바꾸면 `npm test`의 대비 테스트(4.5:1)를 통과해야 한다.
- 글래스 효과(`@include glass`)는 고정 UI(Sidebar, MobileHeader)에만 쓴다.
- 움직임은 0.2~0.4초, `prefers-reduced-motion: reduce`에서 꺼진다.

## 접근성 (모든 UI 작업의 기본)

- 랜드마크(`header`/`nav`/`main`/`footer`), 페이지당 `h1` 하나, 제목 단계 건너뛰지 않기
- 클릭 요소는 `button` 또는 `a`. 링크 안에 다른 인터랙티브 요소를 넣지 않는다.
- `:focus-visible` 포커스 링 필수, 키보드만으로 모든 링크·토글 접근 가능
- 외부 링크는 새 창 + 스크린리더용 "(새 창)" 안내 (`TextLink`, `ButtonLink` 사용)
- 색상만으로 의미를 전달하지 않는다 (현재 메뉴: 색 + 굵기 + 표시 막대)

## 완료 기준 (모든 화면 작업)

- [ ] 360px · 768px · 1280px × 라이트 · 다크에서 레이아웃 확인, 가로 스크롤 없음
- [ ] 키보드 탐색 순서와 포커스 링 확인
- [ ] 위 스타일 규칙·접근성 항목 준수
- [ ] `npm run lint`, `npm test`, `npm run build` 통과

## 커밋 규칙

- 한 커밋 = 한 가지 변경. 큰 작업은 의미 단위로 쪼갠다.
- 메시지는 무엇을 왜 바꿨는지 구체적으로. 뭉뚱그린 요약 금지
  - 나쁜 예: `fix: address review issues`, `chore: update stuff`
  - 좋은 예: `fix: 모바일 헤더에 섹션 제목이 가려지던 문제 수정`, `content: 위시드콘 카드 요약 문구 수정`
- 한국어 메시지 허용. 타입 접두어: feat/fix/content/chore/style/docs/test
- 커밋에 서명·트레일러(Co-Authored-By 등)를 붙이지 않는다
- 배포 가능한 상태를 유지하며 단계 단위로 커밋한다
```

`AGENTS.md`는 첫 줄만 `# AGENTS.md — AI 에이전트 작업 가이드`로 바꾸고 나머지는 동일하다.

- [ ] **Step 2: `README.md` 전체 교체**

```markdown
# 박현규 — Frontend · UI Engineer Portfolio

이커머스·B2B 서비스의 PC·모바일 UI를 6년 이상 구축·운영한 경력과, AI 코딩 도구를 활용해 개발·운영하는 개인 프로젝트를 소개하는 포트폴리오입니다.

- 배포: <https://about-me-iota-blond.vercel.app/>

## 구성

| 경로 | 내용 |
| --- | --- |
| `/` | 소개·핵심 역량, 경력, 대표 실무 프로젝트·개인 프로젝트, 기술, 학력·자격 |
| `/projects/[slug]` | 프로젝트별 배경·담당 작업·적용 및 운영, 확인 자료 |

실무 프로젝트는 사내·고객사 전용 시스템이 많아 화면 대신 담당 범위와 구현 과제를 글로 정리했습니다.

## 구현 원칙

- Next.js App Router의 Server Component를 기본으로 하고, 테마 토글과 섹션 내비만 Client Component로 구현했습니다.
- 콘텐츠는 `src/data/`의 타입 있는 데이터로 분리하고, 컴포넌트는 이를 렌더링만 합니다.
- 색상·타이포그래피·간격을 CSS 변수 토큰으로 정의하고, 컴포넌트 스타일(SCSS Modules)은 토큰과 믹스인만 사용합니다.
- 라이트·다크 테마는 같은 의미 토큰에 모드별 값을 연결하며, 텍스트 대비 4.5:1 이상을 테스트로 검증합니다.
- 인터랙션은 라이브러리 없이 CSS와 브라우저 기본 API(View Transition, scroll-driven animation, IntersectionObserver)로 구현하고, 움직임 줄이기 설정을 따릅니다.

## 로컬 실행과 검증

```bash
npm install
npm run dev
npm run lint
npm test
npm run build
```
```

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md AGENTS.md README.md
git commit -m "docs: 개편 구조에 맞춰 에이전트 작업 규칙과 README를 SCSS Modules·토큰 기준으로 갱신"
```

---

### Task 10: 최종 검증

**Files:** 없음 (문제 발견 시 해당 Task의 파일을 `fix:` 커밋으로 수정)

- [ ] **Step 1: 전체 자동 검증**

Run: `npm run lint && npm test && npm run build`
Expected: lint 0, 테스트 41개 PASS, `/`와 `/projects/*` 6개 정적 생성

- [ ] **Step 2: 프로덕션 빌드로 화면 검증**

`npm run start`는 preview 도구로 실행한다 (`.claude/launch.json`에 `"name": "prod", "runtimeExecutable": "npm", "runtimeArgs": ["run", "start"], "port": 3000` 구성 추가 — 이 파일은 커밋하지 않는다).

체크리스트 (각 항목 screenshot 또는 javascript_tool 결과로 근거 남김):
1. `/`, `/projects/weseedcon`, `/projects/monibuk`, `/projects/nope` × 360px / 768px / 1280px × 라이트 / 다크
2. 모든 조합에서 `document.documentElement.scrollWidth <= window.innerWidth`
3. 다크 선택 후 새로고침 → 깜빡임 없음, 콘솔 오류·hydration 경고 없음
4. 키보드만으로: 본문 바로가기 → 내비 → 연락처 → 카드 → 상세 → 외부 링크 → 이전/다음 → 토글
5. 유리 대체 스타일: 브라우저에서 투명도 감소 설정을 에뮬레이션할 수 없으므로, 빌드 CSS에 대체 규칙이 들어갔는지 확인한다. Run: `grep -l "prefers-reduced-transparency" .next/static/css/*.css` → 1개 이상 파일 출력

- [ ] **Step 3: Lighthouse 접근성**

Run: `npx lighthouse http://localhost:3000 --only-categories=accessibility --quiet --chrome-flags="--headless" --output=json --output-path=./.superpowers/lh-home.json`
같은 명령을 `/projects/monibuk`에도 실행.
Expected: `categories.accessibility.score` = 1 (100). 미달 항목은 수정 후 `fix:` 커밋.

- [ ] **Step 4: 사용자에게 보고**

보고 내용: 커밋 목록(`git log --oneline main..renewal`), 테스트 결과, 스크린샷, Lighthouse 점수, 알려진 한계. push·미리보기 배포·main 병합은 사용자 확인 후 진행한다.
