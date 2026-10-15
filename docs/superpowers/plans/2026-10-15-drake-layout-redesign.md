# Drake식 3단 레이아웃 재구성 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 애플 스타일 사이트(상단 내비 + 전체 폭 띠)를 Drake식 3단 구조(왼쪽 고정 프로필 카드 · 가운데 콘텐츠 · 오른쪽 아이콘 레일)로 재구성하고, 섹션 머리·경력 타임라인·실무 프로젝트 카드·개인 프로젝트 혼합 격자·CONTACT 섹션을 만든다.

**Architecture:** 색·타이포 토큰과 `Tile`·`PillButton`·`TiltTile`·`MobileMenu`는 그대로 두고, 전체 폭 배경 띠(`Band`)를 섹션 간격만 담당하는 `Section`으로 바꾼다. 셸(`SiteShell`)은 1024px 이상에서 CSS Grid 3단, 미만에서 상단 바 + 한 열이다. `SiteNav`는 `variant`로 상단 바와 아이콘 레일을 각각 그리고(client component 수 유지), 섹션 머리는 `SectionHeader`(알약 라벨 + 큰 제목 + 강조 구절) 하나로 통일한다. 새 컴포넌트를 먼저 만들고 페이지를 단계적으로 갈아 끼운 뒤, 옛 컴포넌트와 쓰지 않는 띠 톤 토큰을 마지막에 지운다.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, SCSS Modules, `motion`(motion/react, motion/react-m), Vitest

**Spec:** `docs/superpowers/specs/2026-10-15-drake-layout-redesign-design.md` (색·타이포·접근성·모션 안전 규칙은 `docs/superpowers/specs/2026-10-14-apple-style-redesign-design.md`가 여전히 기준)

**모든 명령은 저장소 루트 `C:\dev\about-me`, 브랜치 `redesign/apple-style`에서 실행한다.** 셸은 Bash(POSIX 문법). 한글이 들어간 파일을 bash heredoc으로 쓰면 깨질 수 있으니 파일 작성은 Write 도구를 쓴다.

## Global Constraints

- 브랜치 `redesign/apple-style`. push·병합은 사용자가 말하기 전에는 하지 않는다.
- 커밋: 한 커밋 = 한 가지 변경, 한국어 메시지, 타입 접두어 `feat`/`fix`/`content`/`chore`/`style`/`docs`/`test`. **Co-Authored-By 등 트레일러·서명 금지**(저장소 `CLAUDE.md`가 기본 첨부 지침보다 우선).
- 커밋에 넣지 않는 것: `portfolio-content-design.md`, `.claude/`, `.superpowers/`, `*.tsbuildinfo`.
- 매 Task 끝에서 `npm run lint`, `npm test`, `npm run build` 통과.
- 모듈 SCSS에서 색상 값(hex/rgb), `font-size`, 간격 숫자(px/rem)를 직접 쓰지 않는다. `var(--…)` 토큰과 믹스인만. 예외: `0`, `1px` 테두리, `2px` 포커스 링·표시선, 비율·퍼센트, `aspect-ratio`, `em` 단위 글머리 위치, 무차원 값(`scale`, `rotate`).
- 타이포는 `@include text(hero|section|tile|lead|body|body-sm|caption|overline|button|button-sm)`만. 반응형 글자 크기는 토큰 재정의로.
- 모듈 SCSS 첫 줄은 `@use "../../styles/mixins" as *;`(믹스인을 쓸 때).
- 색은 띠 톤 토큰(`--band-bg|fg|sub|mute|link|tile|focus|border`)만. 이번 개편 후 `canvas` 톤만 쓴다. `--band-mute`는 캡션 전용.
- client component는 `ThemeToggle`, `SiteNav`, `MobileMenu`, `TiltTile` 4개뿐. 새 `"use client"` 금지.
- Motion은 `LazyMotion features={domAnimation}` + `import * as m from "motion/react-m"`만. `layoutId`·드래그·`domMax`·`motion` 컴포넌트 금지. 각 client component가 `LazyMotion`과 `MotionConfig reducedMotion="user"`로 감싼다.
- CSS 모션은 `@media (prefers-reduced-motion: no-preference)` 안, 스크롤 연동은 추가로 `@supports (animation-timeline: view())` 안에서만. 키프레임 밖에서 `opacity: 0` 금지(`motion-guard.test.ts`가 검사). 무한 반복·자동 재생·스크롤 가로채기·관성 스크롤 금지. 시간 0.2~0.8초.
- 유리 효과(`glass-bar`)는 상단 바와 모바일 메뉴 패널에만. 프로필 카드·레일은 불투명 카드.
- 콘텐츠·UI 문구는 `src/data/`에만. 이력서 콘텐츠는 바꾸지 않는다(`highlights` 초안과 섹션 제목 문구 추가만). 연락처는 이메일·GitHub만, 전화번호·거주지 금지.
- 접근성: 페이지당 `h1` 하나, 제목 단계 건너뛰지 않기, `:focus-visible` 링, 외부 링크 "(새 창)" 안내, 색만으로 의미 전달 금지, 이미지 `alt` 필수. 같은 이름의 `nav`·같은 토글이 동시에 노출되지 않게(`display: none`으로 숨김).
- 브레이크포인트 `md` 768px, `lg` 1024px. 최소 360px. 가로 스크롤 금지.
- 레이아웃 토큰(Task 1에서 추가): `--profile-width: 20rem`, `--rail-width: 3.75rem`, `--content-max: 47.5rem`, `--shell-gap: var(--space-8)`, `--section-gap: 6rem`(lg 이상 `10rem`), `--avatar-size: 10rem`(lg 이상 `15rem`), `--shell-max: 80rem`.

## 스펙 대비 의도된 차이

1. 레일 폭은 스펙의 `3.5rem` 대신 `3.75rem`(레일 안 40px 링크 + 안쪽 여백 + 테두리가 들어가도록).
2. 프로필 카드에는 저작권 줄을 넣지 않는다. 저작권은 가운데 열 맨 아래 `footer` 한 곳에만 둔다(중복 방지).
3. 레일은 `SiteNav variant="rail"`, 상단 바는 `SiteNav variant="bar"`로 두 번 그린다(시각 순서와 키보드 순서를 맞추려고 레일을 DOM 끝에 둔다). 같은 컴포넌트라 client component 수는 그대로.
4. 개인 프로젝트 혼합 격자는 "전체·절반·절반" 3개 주기(`index % 3 === 0`이 전체 폭)로 일반화한다. 4개일 때 스펙과 같은 배치(전체·절반·절반·전체)가 된다.
5. 원형 배지 문구는 `textLength`로 원둘레에 맞추기 위해 같은 문구를 두 번 이어 쓴다.

## Review Focus

1. **강조 구절이 제목에 없거나 비어 있을 때** 제목이 깨지지 않고 그대로 보여야 한다 → Task 2 `accent.test.ts`
2. **상세·404에서 레일·메뉴 링크가 메인 섹션(`/#id`)으로 가야 한다**(기존 `navHref`), 새 `contact` 항목 포함 → Task 1 데이터 테스트 + Task 6 브라우저 검증
3. **이미지·highlights가 없는 실무 프로젝트**도 카드가 비어 보이지 않고 렌더링돼야 한다 → Task 1 데이터 테스트(실무 4개 highlights 3개 보장) + Task 5 브라우저 검증(이미지 없는 상태)
4. **레일·상단 바, 두 개의 테마 토글이 동시에 노출되지 않고 키보드 순서가 시각 순서와 같아야 한다** → Task 3 브라우저 검증(수치)
5. **1024~1279px에서 3단이 비좁거나 360px에서 긴 한글 제목·이메일이 넘치는 경우** → Task 5·10 브라우저 검증(`scrollWidth`, 가운데 열 폭 수치)

---

### Task 1: 데이터·문구·레이아웃 토큰·아바타

**Files:**
- Modify: `src/data/types.ts`, `src/data/site.ts`, `src/data/projects.ts`, `src/data/data.test.ts`, `src/styles/globals.scss`
- Create: `public/profile/avatar.png` (복사)

**Interfaces:**
- Produces:
  - `type SectionHeading = { label: string; title: string; accent?: string }`
  - `Project.highlights?: string[]`
  - `sectionNav`에 `{ id: "contact", label: "연락" }` 추가(맨 끝)
  - `sectionHeadings: Record<"intro" | "about" | "career" | "projects" | "skills" | "education" | "contact", SectionHeading>`
  - `uiCopy.profileLabel`("프로필"), `uiCopy.contactCta`("연락하기"), `uiCopy.projectsBadge`("PROJECTS · VIEW WORK · "), `uiCopy.avatarAlt`("박현규 프로필 이미지(미모지)")
  - CSS 변수 `--profile-width`, `--rail-width`, `--content-max`, `--shell-gap`, `--section-gap`, `--avatar-size`, `--shell-max`
  - 정적 파일 `/profile/avatar.png`(315×315)

- [ ] **Step 1: 실패하는 테스트 — `src/data/data.test.ts`에 두 테스트 추가**

파일 맨 위 import에서 `import { sectionNav, siteMeta, uiCopy } from "./site";`를 `import { sectionHeadings, sectionNav, siteMeta, uiCopy } from "./site";`로 바꾸고, `allData`에 `sectionHeadings`를 추가한다:

```ts
const allData = {
  profile,
  career,
  projects,
  personalProjectsIntro,
  skills,
  education,
  sectionNav,
  sectionHeadings,
  siteMeta,
  uiCopy
};
```

`describe("데이터 무결성", …)` 블록의 마지막 `it` 뒤에 추가:

```ts
  it("실무 프로젝트는 핵심 담당 작업 3개를 가진다", () => {
    projects
      .filter((project) => project.kind === "work")
      .forEach((project) => {
        expect(project.highlights, project.slug).toHaveLength(3);
        project.highlights?.forEach((highlight) => expect(highlight.trim(), project.slug).not.toBe(""));
      });
  });

  it("섹션 제목이 모든 내비 항목을 덮고, 강조 구절은 제목 안에 있다", () => {
    sectionNav.forEach((item) => expect(sectionHeadings, item.id).toHaveProperty(item.id));
    Object.entries(sectionHeadings).forEach(([key, heading]) => {
      expect(heading.label.trim(), key).not.toBe("");
      expect(heading.title.trim(), key).not.toBe("");
      if (heading.accent) expect(heading.title, key).toContain(heading.accent);
    });
  });
```

- [ ] **Step 2: 실패 확인**

Run: `npx vitest run src/data/data.test.ts`
Expected: FAIL — `sectionHeadings`를 import할 수 없음(또는 undefined)

- [ ] **Step 3: `src/data/types.ts`**

`Project` 타입의 `images?: ProjectImage[];` 줄 아래에 추가:

```ts
  /** 카드에 보여줄 핵심 담당 작업(실무 프로젝트 3개). 이력서 "담당 작업"을 줄인 문장 */
  highlights?: string[];
```

파일 끝에 추가:

```ts
/** 섹션 머리: 알약 라벨 + 큰 제목. accent는 제목 안에 그대로 들어 있는 구절 */
export type SectionHeading = { label: string; title: string; accent?: string };
```

- [ ] **Step 4: `src/data/site.ts`**

맨 위 import를 아래로 바꾼다:

```ts
import { profile } from "./profile";
import type { NavItem, SectionHeading } from "./types";
```

`sectionNav` 배열 맨 끝 항목 뒤에 `{ id: "contact", label: "연락" }`를 추가한다:

```ts
export const sectionNav: NavItem[] = [
  { id: "about", label: "소개" },
  { id: "career", label: "경력" },
  { id: "projects", label: "프로젝트" },
  { id: "skills", label: "기술" },
  { id: "education", label: "학력 · 자격" },
  { id: "contact", label: "연락" }
];
```

`sectionNav` 아래에 추가:

```ts
type SectionHeadingKey = "intro" | "about" | "career" | "projects" | "skills" | "education" | "contact";

export const sectionHeadings: Record<SectionHeadingKey, SectionHeading> = {
  intro: { label: "Introduce", title: profile.headline, accent: "6년 이상" },
  about: { label: "About", title: "업무 화면을 만들고 운영 화면을 다듬습니다", accent: "운영 화면" },
  career: { label: "Career", title: "이커머스에서 B2B 업무 시스템까지", accent: "B2B 업무 시스템" },
  projects: { label: "Projects", title: "실무 프로젝트와 개인 서비스", accent: "개인 서비스" },
  skills: { label: "Skills", title: "주로 다루는 기술", accent: "기술" },
  education: { label: "Education", title: "학력과 자격", accent: "자격" },
  contact: { label: "Contact", title: "함께 이야기 나눠요", accent: "이야기" }
};
```

`uiCopy` 객체의 `skipLink` 줄 아래에 추가:

```ts
  profileLabel: "프로필",
  contactCta: "연락하기",
  projectsBadge: "PROJECTS · VIEW WORK · ",
  avatarAlt: "박현규 프로필 이미지(미모지)",
```

- [ ] **Step 5: `src/data/projects.ts` — 실무 4개에 `highlights`**

각 실무 프로젝트 객체의 `links: [...]` 다음 줄(이미지 필드가 없으므로 `sections` 앞)에 아래를 넣는다. 문장은 그대로 쓴다.

`weseedcon`:
```ts
    highlights: [
      "내비게이션·공통 레이아웃 구현, 목록·조회·상세의 반복 영역 컴포넌트 분리",
      "데이터 그리드 가로·세로 스크롤과 페이지네이션을 개발자와 기준을 맞춰 적용",
      "대시보드 카드 반응형 배치와 별도 시안 기반 모바일 목록·상세·메뉴 구현"
    ],
```

`weseed-crm-design-system`:
```ts
    highlights: [
      "화면에 흩어진 색상 값을 역할별로 분류해 CSS 변수 통합안 작성·조율",
      "타이포그래피를 주요 메뉴에 순차 적용하고 중복 모바일 스타일 정리",
      "기존 선택자와의 충돌을 조회·등록 화면 단위로 검수하고 기준을 문서 초안에 기록"
    ],
```

`construction-logistics-systems`:
```ts
    highlights: [
      "LH 레미콘스마트관리시스템: 타설관리·관제정보 목록, 검색 모달, 대시보드",
      "현대 CSM: 개발 환경·공통 레이아웃부터 참여해 4개 업무 영역 화면 구축",
      "롯데글로벌로지스 CRM: 다단계 탭·보고서·대량 처리·문서 출력 화면 구현"
    ],
```

`ecommerce`:
```ts
    highlights: [
      "메디플러스 세컨드닥터몰·생활공작소 등 8개 쇼핑몰 PC·모바일 신규 구축·오픈",
      "지오다노·안다르·차홍 등 운영몰의 프로모션·상시 운영 요청 반영",
      "JavaScript·jQuery로 메뉴·탭·슬라이드·폼 동작 구현과 브라우저 검수"
    ],
```

- [ ] **Step 6: 통과 확인**

Run: `npx vitest run src/data/data.test.ts`
Expected: PASS (기존 8 + 새 2 = 10)

- [ ] **Step 7: 레이아웃 토큰 — `src/styles/globals.scss`의 `:root` 블록**

`--tile-gap: var(--space-5);` 줄 바로 아래에 추가:

```scss
  --shell-max: 80rem;
  --profile-width: 20rem;
  --rail-width: 3.75rem;
  --content-max: 47.5rem;
  --shell-gap: var(--space-8);
  --section-gap: 6rem;
  --avatar-size: 10rem;
```

같은 `:root` 블록 끝의 `@include up(md) { --band-pad-y: var(--space-24); }` 아래에 추가:

```scss
  @include up(lg) {
    --section-gap: 10rem;
    --avatar-size: 15rem;
  }
```

- [ ] **Step 8: 아바타 복사**

```bash
mkdir -p public/profile
cp .superpowers/assets/avatar.png public/profile/avatar.png
node -e 'const b=require("fs").readFileSync("public/profile/avatar.png");console.log(b.readUInt32BE(16),"x",b.readUInt32BE(20))'
```
Expected: `315 x 315`. 원본이 없으면 BLOCKED로 보고한다.

- [ ] **Step 9: 전체 검증 & Commit**

Run: `npm run lint && npm test && npm run build` → 통과 (테스트 83)

```bash
git add src/data src/styles/globals.scss public/profile/avatar.png
git commit -m "content: 섹션 제목 문구·실무 프로젝트 핵심 담당 작업·연락 내비 항목과 3단 레이아웃 토큰 추가"
```

---

### Task 2: 아이콘·섹션·섹션 머리 컴포넌트

**Files:**
- Create: `src/lib/accent.ts`, `src/lib/accent.test.ts`, `src/components/Icon/Icon.tsx`, `src/components/Section/Section.tsx`, `src/components/Section/Section.module.scss`, `src/components/SectionHeader/SectionHeader.tsx`, `src/components/SectionHeader/SectionHeader.module.scss`

**Interfaces:**
- Consumes: `SectionHeading`(Task 1)
- Produces:
  - `splitAccent(title: string, accent?: string): { before: string; accent: string; after: string } | null`
  - `type IconName = "intro" | "about" | "career" | "projects" | "skills" | "education" | "contact" | "arrow"`, `<Icon name: IconName className?: string />`(장식, `aria-hidden`), `NAV_ICONS: Record<string, IconName>`(내비 id → 아이콘)
  - `<Section id?: string labelledBy?: string className?: string>children</Section>` — `<section>` + 위아래 `calc(var(--section-gap) / 2)` 여백
  - `<SectionHeader headingId: string icon: IconName heading: SectionHeading level?: 1 | 2 />` — 알약 라벨 + `h1`/`h2` 제목, 강조 구절은 `<em>`

- [ ] **Step 1: 실패하는 테스트 `src/lib/accent.test.ts`**

```ts
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
```

- [ ] **Step 2: 실패 확인**

Run: `npx vitest run src/lib/accent.test.ts`
Expected: FAIL — `./accent` 모듈 없음

- [ ] **Step 3: `src/lib/accent.ts`**

```ts
export type AccentParts = { before: string; accent: string; after: string };

export function splitAccent(title: string, accent?: string): AccentParts | null {
  if (!accent) return null;
  const index = title.indexOf(accent);
  if (index === -1) return null;
  return { before: title.slice(0, index), accent, after: title.slice(index + accent.length) };
}
```

- [ ] **Step 4: 통과 확인**

Run: `npx vitest run src/lib/accent.test.ts`
Expected: PASS (5)

- [ ] **Step 5: `src/components/Icon/Icon.tsx`**

```tsx
export type IconName = "intro" | "about" | "career" | "projects" | "skills" | "education" | "contact" | "arrow";

const PATHS: Record<IconName, string[]> = {
  intro: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M4 21a8 8 0 0 1 16 0"],
  about: ["M12 3l2.4 5.6L20 11l-5.6 2.4L12 19l-2.4-5.6L4 11l5.6-2.4z"],
  career: [
    "M5 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z",
    "M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2",
    "M3 13h18"
  ],
  projects: ["M4 4h7v7H4z", "M13 4h7v7h-7z", "M4 13h7v7H4z", "M13 13h7v7h-7z"],
  skills: ["M8 8l-5 4 5 4", "M16 8l5 4-5 4", "M14 4l-4 16"],
  education: ["M2 9l10-5 10 5-10 5z", "M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"],
  contact: ["M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z", "M3 7l9 6 9-6"],
  arrow: ["M5 12h14", "M13 6l6 6-6 6"]
};

/** 내비 항목 id → 아이콘 */
export const NAV_ICONS: Record<string, IconName> = {
  about: "intro",
  career: "career",
  projects: "projects",
  skills: "skills",
  education: "education",
  contact: "contact"
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
```

- [ ] **Step 6: `Section`**

```tsx
// src/components/Section/Section.tsx
import type { ReactNode } from "react";
import styles from "./Section.module.scss";

type SectionProps = { id?: string; labelledBy?: string; className?: string; children: ReactNode };

export function Section({ id, labelledBy, className, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={[styles.section, className].filter(Boolean).join(" ")}>
      {children}
    </section>
  );
}
```

```scss
// src/components/Section/Section.module.scss
.section {
  padding-block: calc(var(--section-gap) / 2);
}
```

- [ ] **Step 7: `SectionHeader`**

```tsx
// src/components/SectionHeader/SectionHeader.tsx
import { Icon, type IconName } from "@/components/Icon/Icon";
import type { SectionHeading } from "@/data/types";
import { splitAccent } from "@/lib/accent";
import styles from "./SectionHeader.module.scss";

type SectionHeaderProps = {
  headingId: string;
  icon: IconName;
  heading: SectionHeading;
  level?: 1 | 2;
};

export function SectionHeader({ headingId, icon, heading, level = 2 }: SectionHeaderProps) {
  const Heading = level === 1 ? "h1" : "h2";
  const parts = splitAccent(heading.title, heading.accent);

  return (
    <div className={styles.header}>
      <p className={styles.label}>
        <Icon name={icon} className={styles.labelIcon} />
        {heading.label}
      </p>
      <Heading id={headingId} className={level === 1 ? styles.titleHero : styles.title}>
        {parts ? (
          <>
            {parts.before}
            <em className={styles.accent}>{parts.accent}</em>
            {parts.after}
          </>
        ) : (
          heading.title
        )}
      </Heading>
    </div>
  );
}
```

```scss
// src/components/SectionHeader/SectionHeader.module.scss
@use "../../styles/mixins" as *;

.header {
  display: grid;
  justify-items: start;
  gap: var(--space-5);
  margin-bottom: var(--space-10);
}

.label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-4);
  border: 1px solid var(--band-border);
  border-radius: var(--radius-pill);
  color: var(--band-sub);
  @include text(overline);
}

.labelIcon {
  width: var(--space-4);
  height: var(--space-4);
}

.title {
  @include text(section);
}

.titleHero {
  @include text(hero);
}

// 강조는 장식이다(의미 없음). 기울이지 않고 링크 색으로만 구분한다.
.accent {
  font-style: normal;
  color: var(--band-link);
}
```

- [ ] **Step 8: 전체 검증 & Commit**

Run: `npm run lint && npm test && npm run build` → 통과 (테스트 88). 새 컴포넌트는 아직 어디서도 쓰지 않는다.

```bash
git add src/lib/accent.ts src/lib/accent.test.ts src/components/Icon src/components/Section src/components/SectionHeader
git commit -m "feat: 섹션 머리(알약 라벨·강조 제목)·섹션·인라인 SVG 아이콘 컴포넌트 추가"
```

---

### Task 3: 3단 셸(프로필 카드·아이콘 레일·상단 바·CONTACT)

**Files:**
- Create: `src/components/ProfileCard/ProfileCard.tsx`, `src/components/ProfileCard/ProfileCard.module.scss`, `src/components/ContactSection/ContactSection.tsx`, `src/components/ContactSection/ContactSection.module.scss`, `src/components/SiteShell/SiteShell.module.scss`
- Modify(전체 교체): `src/components/SiteShell/SiteShell.tsx`, `src/components/SiteNav/SiteNav.tsx`, `src/components/SiteNav/SiteNav.module.scss`
- Modify: `src/components/MobileMenu/MobileMenu.module.scss`, `src/styles/globals.scss`, `src/app/not-found.tsx`

**Interfaces:**
- Consumes: `Section`, `SectionHeader`, `Icon`, `NAV_ICONS`(Task 2), `sectionHeadings`, `uiCopy.*`(Task 1), `useActiveSection`, `navHref`, `ContactLinks`, `PillButton`, `ThemeToggle`, `MobileMenu`, `TextLink`
- Produces:
  - `<SiteShell spy: boolean contact?: boolean>children</SiteShell>` — 상단 바(1024 미만) · 프로필 카드 · `main#main` + CONTACT + 저작권 footer · 레일(1024 이상). `contact` 기본 `true`
  - `<SiteNav items label spy variant: "bar" | "rail" />`
  - `<ProfileCard />`, `<ContactSection id: string />`

- [ ] **Step 1: `ProfileCard`**

```tsx
// src/components/ProfileCard/ProfileCard.tsx
import Image from "next/image";
import { ContactLinks } from "@/components/ContactLinks/ContactLinks";
import { PillButton } from "@/components/PillButton/PillButton";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import { profile } from "@/data/profile";
import { uiCopy } from "@/data/site";
import styles from "./ProfileCard.module.scss";

export function ProfileCard() {
  return (
    <aside className={styles.card} aria-label={uiCopy.profileLabel}>
      <div className={styles.avatar}>
        <Image
          src="/profile/avatar.png"
          alt={uiCopy.avatarAlt}
          width={315}
          height={315}
          sizes="(min-width: 1024px) 240px, 160px"
          priority
        />
      </div>
      <div className={styles.identity}>
        <p className={styles.name}>{profile.name}</p>
        <p className={styles.role}>{profile.role}</p>
      </div>
      <ContactLinks className={styles.contacts} />
      <div className={styles.actions}>
        <PillButton href={`mailto:${profile.email}`} size="compact">
          {uiCopy.contactCta}
        </PillButton>
        <span className={styles.toggleSlot}>
          <ThemeToggle />
        </span>
      </div>
    </aside>
  );
}
```

```scss
// src/components/ProfileCard/ProfileCard.module.scss
@use "../../styles/mixins" as *;

.card {
  display: grid;
  justify-items: center;
  gap: var(--space-5);
  margin-block: var(--space-6);
  padding: var(--space-8) var(--space-6);
  border: 1px solid var(--band-border);
  border-radius: var(--radius-tile);
  background: var(--band-tile);
  color: var(--band-fg);
  text-align: center;

  @include up(lg) {
    position: sticky;
    top: var(--space-6);
    max-height: calc(100dvh - var(--space-12));
    margin-block: 0;
    overflow-y: auto;
  }
}

.avatar {
  width: var(--avatar-size);
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: var(--radius-tile);
  background: var(--band-bg);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.identity {
  display: grid;
  gap: var(--space-1);
}

.name {
  @include text(tile);
}

.role {
  color: var(--band-sub);
  @include text(overline);
}

.contacts {
  justify-content: center;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
}

// 1024px 미만에서는 상단 바의 토글을 쓴다(같은 토글이 동시에 노출되지 않게).
.toggleSlot {
  display: none;

  @include up(lg) {
    display: inline-flex;
  }
}
```

- [ ] **Step 2: `ContactSection`**

```tsx
// src/components/ContactSection/ContactSection.tsx
import { Section } from "@/components/Section/Section";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { TextLink } from "@/components/TextLink/TextLink";
import { profile } from "@/data/profile";
import { sectionHeadings } from "@/data/site";
import styles from "./ContactSection.module.scss";

export function ContactSection({ id }: { id: string }) {
  const headingId = `${id}-title`;

  return (
    <Section id={id} labelledBy={headingId}>
      <SectionHeader headingId={headingId} icon="contact" heading={sectionHeadings.contact} />
      <a className={styles.email} href={`mailto:${profile.email}`}>
        {profile.email}
      </a>
      <p className={styles.github}>
        <TextLink href={profile.github}>{profile.github.replace("https://", "")}</TextLink>
      </p>
    </Section>
  );
}
```

```scss
// src/components/ContactSection/ContactSection.module.scss
@use "../../styles/mixins" as *;

.email {
  display: inline-block;
  color: var(--band-link);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.15em;
  @include text(section);

  &:hover {
    text-decoration-thickness: 2px;
  }
}

.github {
  margin-top: var(--space-4);
  @include text(body);
}
```

- [ ] **Step 3: `SiteNav.tsx` 전체 교체**

```tsx
// src/components/SiteNav/SiteNav.tsx
"use client";

import { LazyMotion, MotionConfig, domAnimation, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon, NAV_ICONS } from "@/components/Icon/Icon";
import { MobileMenu } from "@/components/MobileMenu/MobileMenu";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import { profile } from "@/data/profile";
import type { NavItem } from "@/data/types";
import { navHref } from "@/lib/nav";
import { useActiveSection } from "@/lib/useActiveSection";
import styles from "./SiteNav.module.scss";

type SiteNavProps = { items: NavItem[]; label: string; spy: boolean; variant: "bar" | "rail" };
type RailProps = { items: NavItem[]; label: string; spy: boolean; activeId?: string };
type PillRect = { y: number; height: number };

const SPRING = { type: "spring", stiffness: 380, damping: 32 } as const;

function measure(element: Element | null | undefined): PillRect | null {
  if (!(element instanceof HTMLElement)) return null;
  return { y: element.offsetTop, height: element.offsetHeight };
}

function Rail({ items, label, spy, activeId }: RailProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [activeRect, setActiveRect] = useState<PillRect | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const update = () => setActiveRect(measure(list.querySelector('[aria-current="location"]')));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(list);
    return () => observer.disconnect();
  }, [activeId]);

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <nav className={styles.rail} aria-label={label}>
          <div className={styles.railWrap}>
            {activeRect ? (
              <m.span
                aria-hidden="true"
                className={styles.activePill}
                initial={false}
                animate={{ y: activeRect.y, height: activeRect.height }}
                transition={reduceMotion ? { duration: 0 } : SPRING}
              />
            ) : null}
            <ul ref={listRef} className={styles.railList}>
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    className={styles.railLink}
                    href={navHref(item.id, spy)}
                    aria-label={item.label}
                    aria-current={item.id === activeId ? "location" : undefined}
                  >
                    <Icon name={NAV_ICONS[item.id] ?? "intro"} className={styles.railIcon} />
                    <span className={styles.tip} aria-hidden="true">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </MotionConfig>
    </LazyMotion>
  );
}

export function SiteNav({ items, label, spy, variant }: SiteNavProps) {
  const activeId = useActiveSection(
    items.map((item) => item.id),
    spy
  );

  if (variant === "rail") {
    return <Rail items={items} label={label} spy={spy} activeId={activeId} />;
  }

  return (
    <header className={styles.bar}>
      <div className={styles.barInner}>
        <Link className={styles.brand} href="/">
          {profile.name}
        </Link>
        <div className={styles.actions}>
          <ThemeToggle />
          <MobileMenu items={items} label={label} spy={spy} activeId={activeId} />
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: `SiteNav.module.scss` 전체 교체**

```scss
@use "../../styles/mixins" as *;

// 1024px 미만: 상단 바
.bar {
  position: sticky;
  top: 0;
  z-index: 50;
  color: var(--band-fg);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    @include glass-bar;
  }

  @include up(lg) {
    display: none;
  }
}

.barInner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--nav-height);
  padding-inline: var(--space-5);

  @include up(md) {
    padding-inline: var(--space-8);
  }
}

.brand {
  @include text(body-sm);
  font-weight: var(--font-weight-semibold);
}

.actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

// 1024px 이상: 오른쪽 아이콘 레일
.rail {
  display: none;

  @include up(lg) {
    position: sticky;
    top: var(--space-6);
    display: block;
  }
}

.railWrap {
  position: relative;
  padding: var(--space-2);
  border: 1px solid var(--band-border);
  border-radius: var(--radius-pill);
  background: var(--band-tile);
}

.railList {
  display: grid;
  gap: var(--space-2);
}

.activePill {
  position: absolute;
  top: 0;
  right: var(--space-2);
  left: var(--space-2);
  z-index: 0;
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--band-link) 14%, transparent);
  pointer-events: none;
}

.railLink {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: var(--space-10);
  height: var(--space-10);
  border-radius: var(--radius-pill);
  color: var(--band-sub);
  transition: color var(--duration-fast) var(--ease-out);

  &:hover,
  &[aria-current="location"] {
    color: var(--band-link);
  }
}

.railIcon {
  width: var(--space-5);
  height: var(--space-5);
}

// 섹션 이름 말풍선: hover·키보드 포커스에서 보인다. 접근 가능한 이름은 링크의 aria-label.
.tip {
  position: absolute;
  top: 50%;
  right: calc(100% + var(--space-3));
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-control);
  background: var(--band-fg);
  color: var(--band-bg);
  white-space: nowrap;
  visibility: hidden;
  pointer-events: none;
  translate: 0 -50%;
  @include text(caption);
}

.railLink:hover .tip,
.railLink:focus-visible .tip {
  visibility: visible;
}
```

- [ ] **Step 5: `MobileMenu.module.scss` — 메뉴 버튼을 1024px 미만에서 쓰도록**

`.root { @include up(md) { display: none; } }`의 `up(md)`를 `up(lg)`로 바꾼다:

```scss
.root {
  @include up(lg) {
    display: none;
  }
}
```

- [ ] **Step 6: `SiteShell` 전체 교체 + 스타일**

```tsx
// src/components/SiteShell/SiteShell.tsx
import type { ReactNode } from "react";
import { ContactSection } from "@/components/ContactSection/ContactSection";
import { ProfileCard } from "@/components/ProfileCard/ProfileCard";
import { SiteNav } from "@/components/SiteNav/SiteNav";
import { sectionNav, uiCopy } from "@/data/site";
import { getNavItem } from "@/lib/nav";
import styles from "./SiteShell.module.scss";

type SiteShellProps = { spy: boolean; contact?: boolean; children: ReactNode };

const contactNav = getNavItem(sectionNav, "contact");

export function SiteShell({ spy, contact = true, children }: SiteShellProps) {
  return (
    <>
      <SiteNav variant="bar" items={sectionNav} label={uiCopy.sectionNavLabel} spy={spy} />
      <div className={styles.shell}>
        <div className={styles.profileSlot}>
          <ProfileCard />
        </div>
        <div className={styles.column}>
          <main id="main" tabIndex={-1} className={styles.main}>
            {children}
            {contact ? <ContactSection id={contactNav.id} /> : null}
          </main>
          <footer className={styles.footer}>
            <p>{uiCopy.footer}</p>
          </footer>
        </div>
        <div className={styles.railSlot}>
          <SiteNav variant="rail" items={sectionNav} label={uiCopy.sectionNavLabel} spy={spy} />
        </div>
      </div>
    </>
  );
}
```

```scss
// src/components/SiteShell/SiteShell.module.scss
@use "../../styles/mixins" as *;

.shell {
  width: 100%;
  max-width: var(--shell-max);
  margin-inline: auto;
  padding-inline: var(--space-5);

  @include up(md) {
    padding-inline: var(--space-8);
  }

  @include up(lg) {
    display: grid;
    grid-template-areas: "profile column rail";
    grid-template-columns: var(--profile-width) minmax(0, 1fr) var(--rail-width);
    align-items: start;
    column-gap: var(--shell-gap);
    padding-block: var(--space-6);
  }
}

.profileSlot {
  grid-area: profile;

  @include up(lg) {
    align-self: stretch;
  }
}

.column {
  grid-area: column;
  min-width: 0;
}

.main {
  max-width: var(--content-max);
  margin-inline: auto;
}

.footer {
  max-width: var(--content-max);
  margin-inline: auto;
  padding-block: var(--space-8);
  border-top: 1px solid var(--band-border);
  color: var(--band-mute);
  @include text(caption);
}

.railSlot {
  grid-area: rail;

  @include up(lg) {
    align-self: stretch;
  }
}
```

`profileSlot`·`railSlot`이 그리드 셀 높이 전체(`stretch`)를 차지해야 그 안의 sticky 카드·레일이 스크롤 내내 붙어 있다.

- [ ] **Step 7: `src/styles/globals.scss` — 앵커 여백**

`html { … }` 블록의 `scroll-padding-top: calc(var(--nav-height) + var(--space-4));` 줄을 아래로 바꾼다:

```scss
  scroll-padding-top: calc(var(--nav-height) + var(--space-4));

  @include up(lg) {
    scroll-padding-top: var(--space-6);
  }
```

- [ ] **Step 8: 404에서 CONTACT 빼기 — `src/app/not-found.tsx`**

`<SiteShell spy={false}>`를 `<SiteShell spy={false} contact={false}>`로 바꾼다.

- [ ] **Step 9: 자동 검증**

Run: `npm run lint && npm test && npm run build` → 통과 (88). 기존 섹션(띠)은 아직 가운데 열 안에서 그려진다(Task 4·5에서 교체) — 정상.

- [ ] **Step 10: 브라우저 검증** (in-app 브라우저가 화면을 그리지 않으면 헤드리스 Chrome + CDP로, 실제 마우스·키보드·스크롤 이벤트 사용; 사용한 방법을 보고)

수치를 기록한다.
1. 1280px: 프로필 카드(왼쪽)·가운데 열·레일(오른쪽) 3단. 1500px 스크롤 후에도 카드와 레일의 `getBoundingClientRect().top`이 24px 근처로 유지. 상단 바 `display: none`.
2. 1024px: 가운데 열 폭(`main.getBoundingClientRect().width`)을 기록. 560px 미만이면 보고서에 "비좁음"으로 남긴다(Task 10에서 판단).
3. 360px·768px: 상단 바 고정, 프로필 카드가 본문 위 첫 블록, 레일 `display: none`, `scrollWidth <= innerWidth`.
4. 노출 중복 없음: 화면 폭마다 보이는 `nav[aria-label="섹션"]`이 1개, 보이는 테마 토글 버튼이 1개(`offsetParent !== null`인 것 개수).
5. 키보드 순서(1280px): 본문 바로가기 → 프로필 카드(이메일·GitHub·연락하기·토글) → 본문 → CONTACT → 레일 아이콘. (360px): 바로가기 → 상단 바(이름·토글·메뉴) → 프로필 카드 → 본문.
6. 레일: 아이콘 hover·Tab 포커스 시 말풍선이 보이고(`visibility: visible`), 스크롤로 섹션이 바뀌면 `aria-current`와 알약(`.activePill`의 `transform`)이 이동, 맨 아래에서 "연락" 활성.
7. CONTACT 섹션: 이메일 링크 `mailto:`, GitHub 새 창. 360px에서 이메일이 넘치지 않음.
8. 404(`/projects/nope`): CONTACT 없음, 저작권 footer 있음.

- [ ] **Step 11: Commit**

```bash
git add src/components src/styles/globals.scss src/app/not-found.tsx
git commit -m "feat: 왼쪽 프로필 카드·오른쪽 아이콘 레일·모바일 상단 바로 구성한 3단 셸과 연락 섹션 추가"
```

---

### Task 4: 히어로·핵심 역량 카드·경력 타임라인

**Files:**
- Create: `src/components/ProjectsBadge/ProjectsBadge.tsx`, `src/components/ProjectsBadge/ProjectsBadge.module.scss`, `src/components/AboutCards/AboutCards.tsx`, `src/components/AboutCards/AboutCards.module.scss`, `src/components/CareerTimeline/CareerTimeline.tsx`, `src/components/CareerTimeline/CareerTimeline.module.scss`
- Modify(전체 교체): `src/components/Hero/Hero.tsx`, `src/components/Hero/Hero.module.scss`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `Section`, `SectionHeader`, `Icon`, `Tile`, `PillButton`, `sectionHeadings`, `profile`, `career`, `formatPeriod`, `uiCopy.projectsBadge`, `uiCopy.heroProjects`, `uiCopy.heroContact`
- Produces: `<Hero id />`(h1 포함), `<AboutCards />`, `<CareerTimeline id />`, `<ProjectsBadge />`

- [ ] **Step 1: `ProjectsBadge`**

```tsx
// src/components/ProjectsBadge/ProjectsBadge.tsx
import { Icon } from "@/components/Icon/Icon";
import { uiCopy } from "@/data/site";
import styles from "./ProjectsBadge.module.scss";

const CIRCLE = "M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0";

export function ProjectsBadge() {
  return (
    <a className={styles.badge} href="#projects" aria-label={uiCopy.heroProjects}>
      <svg className={styles.ring} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
        <defs>
          <path id="projects-badge-circle" d={CIRCLE} />
        </defs>
        <text className={styles.ringText}>
          <textPath href="#projects-badge-circle" textLength="288" lengthAdjust="spacing">
            {uiCopy.projectsBadge.repeat(2)}
          </textPath>
        </text>
      </svg>
      <Icon name="arrow" className={styles.arrow} />
    </a>
  );
}
```

```scss
// src/components/ProjectsBadge/ProjectsBadge.module.scss
@use "../../styles/mixins" as *;

.badge {
  position: relative;
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: var(--space-24);
  height: var(--space-24);
  border: 1px solid var(--band-border);
  border-radius: 50%;
  background: var(--band-tile);
  color: var(--band-fg);
  transition: color var(--duration-fast) var(--ease-out);

  &:hover {
    color: var(--band-link);
  }
}

.ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.ringText {
  fill: currentColor;
  @include text(caption);
  letter-spacing: var(--text-overline-letter-spacing);
}

.arrow {
  width: var(--space-6);
  height: var(--space-6);
}
```

- [ ] **Step 2: `Hero` 전체 교체**

```tsx
// src/components/Hero/Hero.tsx
import { PillButton } from "@/components/PillButton/PillButton";
import { ProjectsBadge } from "@/components/ProjectsBadge/ProjectsBadge";
import { Section } from "@/components/Section/Section";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { profile } from "@/data/profile";
import { sectionHeadings, uiCopy } from "@/data/site";
import styles from "./Hero.module.scss";

export function Hero({ id }: { id: string }) {
  const headingId = `${id}-title`;

  return (
    <Section labelledBy={headingId}>
      <SectionHeader headingId={headingId} icon="intro" heading={sectionHeadings.intro} level={1} />
      <p className={styles.lead}>{profile.intro}</p>
      <div className={styles.actions}>
        <PillButton href="#projects">{uiCopy.heroProjects}</PillButton>
        <PillButton href={`mailto:${profile.email}`} variant="secondary">
          {uiCopy.heroContact}
        </PillButton>
        <span className={styles.badgeSlot}>
          <ProjectsBadge />
        </span>
      </div>
    </Section>
  );
}
```

```scss
// src/components/Hero/Hero.module.scss
@use "../../styles/mixins" as *;

.lead {
  max-width: var(--reading-max);
  color: var(--band-sub);
  @include text(lead);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
  margin-top: var(--space-8);
}

.badgeSlot {
  margin-inline-start: auto;
}
```

- [ ] **Step 3: `AboutCards`**

```tsx
// src/components/AboutCards/AboutCards.tsx
import { Section } from "@/components/Section/Section";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { Tile } from "@/components/Tile/Tile";
import { profile } from "@/data/profile";
import { sectionHeadings } from "@/data/site";
import styles from "./AboutCards.module.scss";

const HEADING_ID = "about-cards-title";

export function AboutCards() {
  return (
    <Section labelledBy={HEADING_ID}>
      <SectionHeader headingId={HEADING_ID} icon="about" heading={sectionHeadings.about} />
      <ol className={styles.grid}>
        {profile.competencies.map((item, index) => (
          <li key={item.text}>
            <Tile className={styles.card}>
              <span className={styles.number} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              {item.label ? <h3 className={styles.label}>{item.label}</h3> : null}
              <p className={styles.text}>{item.text}</p>
            </Tile>
          </li>
        ))}
      </ol>
    </Section>
  );
}
```

```scss
// src/components/AboutCards/AboutCards.module.scss
@use "../../styles/mixins" as *;

.grid {
  display: grid;
  gap: var(--tile-gap);

  @include up(md) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  li:nth-child(even) {
    --reveal-shift: 8%;
  }
}

.card {
  transition: border-color var(--duration-fast) var(--ease-out);

  &:hover {
    border-color: var(--band-link);
  }
}

.number {
  color: var(--band-link);
  @include text(section);
}

.label {
  @include text(tile);
}

.text {
  color: var(--band-sub);
  @include text(body-sm);
}
```

- [ ] **Step 4: `CareerTimeline`**

```tsx
// src/components/CareerTimeline/CareerTimeline.tsx
import { Section } from "@/components/Section/Section";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { Tile } from "@/components/Tile/Tile";
import { career } from "@/data/career";
import { sectionHeadings } from "@/data/site";
import { formatPeriod } from "@/lib/format";
import styles from "./CareerTimeline.module.scss";

export function CareerTimeline({ id }: { id: string }) {
  const headingId = `${id}-title`;

  return (
    <Section id={id} labelledBy={headingId}>
      <SectionHeader headingId={headingId} icon="career" heading={sectionHeadings.career} />
      <div className={styles.timeline}>
        <span className={styles.track} aria-hidden="true">
          <span className={styles.fill} />
        </span>
        <ol className={styles.list}>
          {career.map((entry) => (
            <li key={entry.company} className={styles.item}>
              <span className={styles.dot} aria-hidden="true" />
              <Tile as="article">
                <p className={styles.period}>{formatPeriod(entry.period)}</p>
                <h3 className={styles.company}>{entry.company}</h3>
                <p className={styles.position}>{entry.position}</p>
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
        </ol>
      </div>
    </Section>
  );
}
```

```scss
// src/components/CareerTimeline/CareerTimeline.module.scss
@use "../../styles/mixins" as *;

.timeline {
  position: relative;
  padding-left: var(--space-8);
}

// 세로선(배경)과 채움선. 채움선은 기본으로 꽉 차 있고, 스크롤 연동 모션이 있을 때만 채워지며 나타난다.
.track {
  position: absolute;
  top: 0;
  bottom: 0;
  left: var(--space-2);
  width: 2px;
  background: var(--band-border);
}

.fill {
  position: absolute;
  inset: 0;
  background: var(--band-link);
  transform-origin: top;
}

.list {
  display: grid;
  gap: var(--space-8);
}

.item {
  position: relative;
}

.dot {
  position: absolute;
  top: var(--space-6);
  left: calc(var(--space-8) * -1 + var(--space-2) + 1px - var(--space-3) / 2);
  width: var(--space-3);
  height: var(--space-3);
  border: 2px solid var(--band-link);
  border-radius: 50%;
  background: var(--band-bg);
}

.period {
  color: var(--band-link);
  @include text(overline);
}

.company {
  @include text(tile);
}

.position {
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

- [ ] **Step 5: `src/app/page.tsx` — 앞쪽 섹션 교체**

import에서 `CareerBand`, `CompetenciesBand`를 지우고 `AboutCards`, `CareerTimeline`을 추가한다. 반환부의 앞쪽을 바꾼다(프로젝트·기술·학력은 Task 5에서 교체):

```tsx
import { AboutCards } from "@/components/AboutCards/AboutCards";
import { CareerTimeline } from "@/components/CareerTimeline/CareerTimeline";
// (EducationBand, Hero, ProjectsBands, SiteShell, SkillsBand, sectionNav, getNavItem import는 유지)
```

```tsx
    <SiteShell spy>
      <div id={about.id}>
        <Hero id={about.id} />
        <AboutCards />
      </div>
      <CareerTimeline id={career.id} />
      <ProjectsBands id={projects.id} title={projects.label} />
      <SkillsBand id={skills.id} title={skills.label} />
      <EducationBand id={education.id} title={education.label} />
    </SiteShell>
```

- [ ] **Step 6: 자동 검증**

Run: `npm run lint && npm test && npm run build` → 통과 (88)

- [ ] **Step 7: 브라우저 검증** (CDP 가능)
1. 1280px·360px × 라이트·다크: 히어로에 알약 라벨 "INTRODUCE"와 `h1`(강조 구절 "6년 이상"이 링크 색), 문장, 버튼 2개, 원형 배지(문구가 원을 한 바퀴 채움). 360px에서 배지가 버튼 아래로 줄바꿈되어도 넘치지 않음.
2. 핵심 역량 카드 4개(번호 01~04), 768px 이상 2열, hover 시 테두리 강조.
3. 경력 타임라인: 세로선·점·카드 2개, 점이 선 위에 정렬(점 중심 x ≈ 선 x).
4. `h1` 1개, `h2`(ABOUT·CAREER 제목 등), `h3`(역량 라벨·회사) 순서.
5. 스크린샷 3장(히어로 1280 라이트, 역량 360 다크, 타임라인 1280 다크)을 저장하고 설명.

- [ ] **Step 8: Commit**

```bash
git add src/components src/app/page.tsx
git commit -m "feat: 알약 라벨 히어로·원형 프로젝트 배지·번호 역량 카드·경력 세로 타임라인 추가"
```

---

### Task 5: 프로젝트(실무 카드·개인 혼합 격자)·기술·학력 섹션과 메인 전환 완료

**Files:**
- Create: `src/components/ProjectCard/ProjectCard.tsx`, `src/components/ProjectCard/ProjectCard.module.scss`, `src/components/ProjectsSection/ProjectsSection.tsx`, `src/components/ProjectsSection/ProjectsSection.module.scss`, `src/components/SkillsSection/SkillsSection.tsx`, `src/components/SkillsSection/SkillsSection.module.scss`, `src/components/EducationSection/EducationSection.tsx`, `src/components/EducationSection/EducationSection.module.scss`
- Modify: `src/components/ProjectTile/ProjectTile.tsx`(이미지 `sizes`만), `src/app/page.tsx`

**Interfaces:**
- Consumes: `Section`, `SectionHeader`, `Tile`, `ProjectTile`, `TiltTile`, `TagList`, `formatPeriod`, `projects`, `personalProjectsIntro`, `skills`, `education`, `sectionHeadings`, `uiCopy.workProjectsTitle`, `uiCopy.personalProjectsTitle`
- Produces: `<ProjectCard project: Project />`(실무 전체 폭), `<ProjectsSection id />`, `<SkillsSection id />`, `<EducationSection id />`

- [ ] **Step 1: `ProjectCard`**

```tsx
// src/components/ProjectCard/ProjectCard.tsx
import Image from "next/image";
import Link from "next/link";
import { TagList } from "@/components/Tag/Tag";
import { Tile } from "@/components/Tile/Tile";
import type { Project } from "@/data/types";
import { formatPeriod } from "@/lib/format";
import styles from "./ProjectCard.module.scss";

export function ProjectCard({ project }: { project: Project }) {
  const image = project.images?.[0];

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
            sizes="(min-width: 1024px) 760px, 100vw"
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
      <p className={styles.meta}>
        {formatPeriod(project.period)}
        {project.role ? ` · ${project.role}` : null}
      </p>
      <p className={styles.summary}>{project.summary}</p>
      {project.highlights && project.highlights.length > 0 ? (
        <ul className={styles.highlights}>
          {project.highlights.map((highlight) => (
            <li key={highlight} className={styles.highlight}>
              {highlight}
            </li>
          ))}
        </ul>
      ) : null}
      <TagList items={project.stack} />
    </Tile>
  );
}
```

```scss
// src/components/ProjectCard/ProjectCard.module.scss
@use "../../styles/mixins" as *;

.label {
  color: var(--band-sub);
  @include text(overline);
}

.title {
  @include text(tile);
}

// 제목 링크 하나로 카드 전체를 클릭 영역으로 만든다. 포커스 링은 Tile이 그린다.
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
  gap: var(--space-3);
  margin-block: var(--space-2);

  @include up(md) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.highlight {
  padding: var(--space-4);
  border-radius: var(--radius-control);
  background: var(--band-bg);
  @include text(body-sm);
}
```

- [ ] **Step 2: `ProjectTile.tsx` 이미지 크기 힌트** — `sizes="(min-width: 768px) 480px, 100vw"`를 `sizes="(min-width: 1024px) 760px, 100vw"`로 바꾼다(혼합 격자의 전체 폭 카드 대비).

- [ ] **Step 3: `ProjectsSection`**

```tsx
// src/components/ProjectsSection/ProjectsSection.tsx
import { ProjectCard } from "@/components/ProjectCard/ProjectCard";
import { ProjectTile } from "@/components/ProjectTile/ProjectTile";
import { Section } from "@/components/Section/Section";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { TiltTile } from "@/components/TiltTile/TiltTile";
import { personalProjectsIntro, projects } from "@/data/projects";
import { sectionHeadings, uiCopy } from "@/data/site";
import styles from "./ProjectsSection.module.scss";

export function ProjectsSection({ id }: { id: string }) {
  const headingId = `${id}-title`;
  const work = projects.filter((project) => project.kind === "work");
  const personal = projects.filter((project) => project.kind === "personal");

  return (
    <Section id={id} labelledBy={headingId}>
      <SectionHeader headingId={headingId} icon="projects" heading={sectionHeadings.projects} />

      <h3 className={styles.groupTitle}>{uiCopy.workProjectsTitle}</h3>
      <ul className={styles.workList}>
        {work.map((project) => (
          <li key={project.slug}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>

      <h3 className={styles.groupTitle}>{uiCopy.personalProjectsTitle}</h3>
      <p className={styles.intro}>{personalProjectsIntro}</p>
      <ul className={styles.grid}>
        {personal.map((project, index) => (
          <li key={project.slug} className={index % 3 === 0 ? styles.wide : undefined}>
            <TiltTile>
              <ProjectTile project={project} withImage />
            </TiltTile>
          </li>
        ))}
      </ul>
    </Section>
  );
}
```

```scss
// src/components/ProjectsSection/ProjectsSection.module.scss
@use "../../styles/mixins" as *;

.groupTitle {
  margin-bottom: var(--space-6);
  @include text(tile);

  &:not(:first-of-type) {
    margin-top: var(--space-16);
  }
}

.workList {
  display: grid;
  gap: var(--tile-gap);
}

.intro {
  max-width: var(--reading-max);
  margin-bottom: var(--space-8);
  color: var(--band-sub);
  @include text(body-sm);
}

// 개인 프로젝트: 전체 폭 → 절반 → 절반 주기.
.grid {
  display: grid;
  gap: var(--tile-gap);

  @include up(md) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  li:nth-child(even) {
    --reveal-shift: 8%;
  }
}

.wide {
  @include up(md) {
    grid-column: 1 / -1;
  }
}
```

- [ ] **Step 4: `SkillsSection`**

```tsx
// src/components/SkillsSection/SkillsSection.tsx
import { Section } from "@/components/Section/Section";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { TagList } from "@/components/Tag/Tag";
import { Tile } from "@/components/Tile/Tile";
import { sectionHeadings } from "@/data/site";
import { skills } from "@/data/skills";
import styles from "./SkillsSection.module.scss";

export function SkillsSection({ id }: { id: string }) {
  const headingId = `${id}-title`;

  return (
    <Section id={id} labelledBy={headingId}>
      <SectionHeader headingId={headingId} icon="skills" heading={sectionHeadings.skills} />
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
    </Section>
  );
}
```

```scss
// src/components/SkillsSection/SkillsSection.module.scss
@use "../../styles/mixins" as *;

.grid {
  display: grid;
  gap: var(--tile-gap);

  @include up(md) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  li:nth-child(even) {
    --reveal-shift: 8%;
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

- [ ] **Step 5: `EducationSection`**

```tsx
// src/components/EducationSection/EducationSection.tsx
import { Section } from "@/components/Section/Section";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { Tile } from "@/components/Tile/Tile";
import { education } from "@/data/education";
import { sectionHeadings } from "@/data/site";
import styles from "./EducationSection.module.scss";

export function EducationSection({ id }: { id: string }) {
  const headingId = `${id}-title`;

  return (
    <Section id={id} labelledBy={headingId}>
      <SectionHeader headingId={headingId} icon="education" heading={sectionHeadings.education} />
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
    </Section>
  );
}
```

```scss
// src/components/EducationSection/EducationSection.module.scss
@use "../../styles/mixins" as *;

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

- [ ] **Step 6: `src/app/page.tsx` 최종본**

```tsx
import { AboutCards } from "@/components/AboutCards/AboutCards";
import { CareerTimeline } from "@/components/CareerTimeline/CareerTimeline";
import { EducationSection } from "@/components/EducationSection/EducationSection";
import { Hero } from "@/components/Hero/Hero";
import { ProjectsSection } from "@/components/ProjectsSection/ProjectsSection";
import { SiteShell } from "@/components/SiteShell/SiteShell";
import { SkillsSection } from "@/components/SkillsSection/SkillsSection";
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
      <div id={about.id}>
        <Hero id={about.id} />
        <AboutCards />
      </div>
      <CareerTimeline id={career.id} />
      <ProjectsSection id={projects.id} />
      <SkillsSection id={skills.id} />
      <EducationSection id={education.id} />
    </SiteShell>
  );
}
```

- [ ] **Step 7: 자동 검증**

Run: `npm run lint && npm test && npm run build` → 통과 (88)

- [ ] **Step 8: 브라우저 검증** (CDP 가능)
1. 실무 프로젝트 카드 4개가 전체 폭, 핵심 담당 작업 3개가 768px 이상에서 3칸, 360px에서 1칸. 이미지가 없어서 글만 있는 상태에서도 카드가 비어 보이지 않음(스크린샷으로 판단 서술).
2. 개인 프로젝트: 768px 이상에서 1번 전체 폭, 2·3번 절반, 4번 전체 폭(`getBoundingClientRect().width` 수치). 기울기·클릭 이동 동작.
3. 카드 전체 클릭 → 상세 이동, Tab 시 카드 전체 포커스 링.
4. 360 / 768 / 1024 / 1280px × 라이트·다크: `scrollWidth <= innerWidth`, 360px에서 긴 제목("WeSeed CRM·Admin 디자인 시스템 개선")과 highlights가 카드 밖으로 넘치지 않음(`tile.scrollWidth <= tile.clientWidth`).
5. 레일 `aria-current`: 소개(히어로·역량 모두) → 경력 → 프로젝트(실무·개인 모두, 개인 구간으로 바로 이동·새로고침 포함) → 기술 → 학력·자격 → 연락(맨 아래).
6. 제목 구조: `h1` 1, `h2` 7(역량·경력·프로젝트·기술·학력·연락 + 히어로는 h1), `h3`, `h4` 순서 건너뜀 없음.
7. 스크린샷: 프로젝트 섹션 1280 라이트·360 다크, 기술·학력 1280 다크.

- [ ] **Step 9: Commit**

```bash
git add src/components src/app/page.tsx
git commit -m "feat: 실무 프로젝트 전체 폭 카드·개인 프로젝트 혼합 격자·기술·학력 섹션으로 메인 전환 완료"
```

---

### Task 6: 프로젝트 상세·404를 섹션 구조로 전환

**Files:**
- Modify(전체 교체): `src/components/ProjectHeader/ProjectHeader.tsx`, `src/components/ProjectHeader/ProjectHeader.module.scss`, `src/components/ProjectGallery/ProjectGallery.tsx`, `src/components/ProjectBody/ProjectBody.tsx`, `src/components/ProjectPager/ProjectPager.tsx`, `src/components/LocalNav/LocalNav.module.scss`, `src/app/not-found.tsx`, `src/app/not-found.module.scss`
- Modify: `src/components/ProjectBody/ProjectBody.module.scss`(`.reading` 정렬만)

**Interfaces:**
- Consumes: `Section`, `SectionHeader`, `SiteShell`(`contact` prop), 기존 프로젝트 lib 함수들
- Produces: 시그니처가 같은 `ProjectHeader`/`ProjectGallery`/`ProjectBody`/`ProjectPager`(배경 띠 없이 `Section` 사용)

- [ ] **Step 1: `ProjectHeader` 교체**

```tsx
// src/components/ProjectHeader/ProjectHeader.tsx
import { PillButton } from "@/components/PillButton/PillButton";
import { Section } from "@/components/Section/Section";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
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
    <Section labelledBy="project-title">
      <p className={styles.back}>
        <TextLink href="/#projects">{uiCopy.backToProjects}</TextLink>
      </p>
      <SectionHeader
        headingId="project-title"
        icon="projects"
        heading={{ label: project.label, title: project.title }}
        level={1}
      />
      <div className={styles.content}>
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
                <PillButton href={link.href} variant={index === 0 ? "primary" : "secondary"}>
                  {link.label}
                </PillButton>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Section>
  );
}
```

```scss
// src/components/ProjectHeader/ProjectHeader.module.scss
@use "../../styles/mixins" as *;

.back {
  margin-bottom: var(--space-6);
  @include text(body-sm);
}

.content {
  display: grid;
  justify-items: start;
  gap: var(--space-4);
  margin-top: calc(var(--space-6) * -1);
}

.meta {
  color: var(--band-sub);
  @include text(body-sm);
}

.note {
  padding: var(--space-4);
  border: 1px solid var(--band-border);
  border-radius: var(--radius-tile);
  background: var(--band-tile);
  color: var(--band-sub);
  @include text(body-sm);
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-2);
}
```

- [ ] **Step 2: `ProjectGallery`의 `Band` → `Section`**

`import { Band } from "@/components/Band/Band";`를 `import { Section } from "@/components/Section/Section";`로 바꾸고, `<Band tone="white">`·`</Band>`를 `<Section>`·`</Section>`으로 바꾼다. 이미지 `sizes`를 `"(min-width: 1024px) 760px, 100vw"`로 바꾼다.

- [ ] **Step 3: `ProjectBody`의 `Band` → `Section`**

`import { Band } from "@/components/Band/Band";`를 `import { Section } from "@/components/Section/Section";`로, `<Band tone="canvas">`·`</Band>`를 `<Section>`·`</Section>`으로 바꾼다. `ProjectBody.module.scss`의 `.reading`에서 `margin-inline: auto;` 줄을 지운다(가운데 열 안에서 왼쪽 정렬).

- [ ] **Step 4: `ProjectPager`의 `Band` → `Section`**

`import { Band } from "@/components/Band/Band";`를 `import { Section } from "@/components/Section/Section";`로, `<Band tone="white">`·`</Band>`를 `<Section>`·`</Section>`으로 바꾼다.

- [ ] **Step 5: `LocalNav.module.scss` 전체 교체** (가운데 열 폭, 1024px 이상에서는 화면 맨 위에 고정)

```scss
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

  @include up(lg) {
    top: 0;
  }
}

.list {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  height: var(--local-nav-height);
  padding-inline: var(--space-1);
  white-space: nowrap;
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

- [ ] **Step 6: 404 교체**

```tsx
// src/app/not-found.tsx
import type { Metadata } from "next";
import { PillButton } from "@/components/PillButton/PillButton";
import { Section } from "@/components/Section/Section";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { SiteShell } from "@/components/SiteShell/SiteShell";
import { uiCopy } from "@/data/site";
import styles from "./not-found.module.scss";

export const metadata: Metadata = { title: uiCopy.notFoundTitle };

export default function NotFound() {
  return (
    <SiteShell spy={false} contact={false}>
      <Section labelledBy="not-found-title">
        <SectionHeader
          headingId="not-found-title"
          icon="intro"
          heading={{ label: "404", title: uiCopy.notFoundTitle }}
          level={1}
        />
        <p className={styles.body}>{uiCopy.notFoundBody}</p>
        <div className={styles.action}>
          <PillButton href="/">{uiCopy.notFoundLink}</PillButton>
        </div>
      </Section>
    </SiteShell>
  );
}
```

```scss
// src/app/not-found.module.scss
@use "../styles/mixins" as *;

.body {
  color: var(--band-sub);
  @include text(lead);
}

.action {
  margin-top: var(--space-8);
}
```

- [ ] **Step 7: 자동 검증**

Run: `npm run lint && npm test && npm run build` → 통과 (88), 정적 라우트 `/projects/*` 8개·404

- [ ] **Step 8: 브라우저 검증** (CDP 가능; 라우트가 정적 생성이므로 dev 서버를 새로 시작)
1. `/projects/weseedcon`(이미지 없음), `/projects/monibuk`(이미지 4장·확인 자료), `/projects/construction-logistics-systems`(`note`), `/projects/fe-daily-study`(이전만), `/projects/nope`(404) × 1280·360 × 라이트·다크: `scrollWidth <= innerWidth`, `h1` 1개.
2. 레일·메뉴의 "경력" 등 링크가 `/#career`로 이동(메인), "연락"은 `/#contact`.
3. 로컬 내비: 1280px에서 스크롤 시 화면 맨 위(top 0)에, 360px에서 상단 바 아래(top 48px)에 고정. 항목 클릭 후 해당 `h2`의 top이 고정 요소 아래(1280: ≥ 48, 360: ≥ 96).
4. 상세 끝에 CONTACT 섹션, 404에는 없음.
5. 스크린샷: `/projects/monibuk` 1280 라이트·360 다크, 404 1280 다크.

- [ ] **Step 9: Commit**

```bash
git add src/components src/app
git commit -m "feat: 프로젝트 상세·404를 섹션 머리와 3단 셸 구조로 전환"
```

---

### Task 7: CSS 모션(섹션 머리 등장·배지 회전·타임라인 채움·히어로 진입)

**Files:**
- Modify: `src/components/SectionHeader/SectionHeader.module.scss`, `src/components/ProjectsBadge/ProjectsBadge.module.scss`, `src/components/CareerTimeline/CareerTimeline.module.scss`, `src/components/Hero/Hero.module.scss`

**Interfaces:**
- Consumes: `reveal-keyframes`, `reveal` 믹스인, `motion-guard.test.ts`(기존)

- [ ] **Step 1: `SectionHeader.module.scss` — 등장**

파일의 `@use` 줄 바로 아래에 `@include reveal-keyframes;`를 추가하고, `.header` 블록 안 마지막 줄에 `@include reveal;`을 추가한다.

- [ ] **Step 2: `ProjectsBadge.module.scss` — 스크롤할 때만 회전** (파일 끝에 추가)

```scss
@keyframes badge-spin {
  from {
    rotate: 0turn;
  }

  to {
    rotate: 2turn;
  }
}

@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .ring {
      animation: badge-spin linear both;
      animation-timeline: scroll();
    }
  }
}
```

- [ ] **Step 3: `CareerTimeline.module.scss` — 채움선** (파일 끝에 추가)

```scss
@keyframes timeline-fill {
  from {
    scale: 1 0;
  }

  to {
    scale: 1 1;
  }
}

@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .fill {
      animation: timeline-fill linear both;
      animation-timeline: view();
      animation-range: cover 20% cover 70%;
    }
  }
}
```

- [ ] **Step 4: `Hero.module.scss` — 문장·버튼 순차 진입** (파일 끝에 추가)

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

@media (prefers-reduced-motion: no-preference) {
  .lead,
  .actions {
    animation: hero-in var(--duration-slow) var(--ease-out) both;
  }

  .lead {
    animation-delay: 120ms;
  }

  .actions {
    animation-delay: 240ms;
  }
}
```

- [ ] **Step 5: 검증**

Run: `npx vitest run src/styles/motion-guard.test.ts` → PASS(조건 안에 선언되었는지), 이어서 `npm run lint && npm test && npm run build` → 통과

브라우저(CDP): 섹션 머리가 스크롤로 들어올 때 떠오름(`animationTimeline`), 배지 `rotate`가 scrollY 0과 2000에서 다름, 타임라인 채움선 `scale`이 스크롤에 따라 0→1, 히어로 문장·버튼이 1초 안에 `opacity: 1`. 움직임 줄이기 에뮬레이션(CDP `Emulation.setEmulatedMedia`)에서 모두 정지하고 내용이 보임.

- [ ] **Step 6: Commit**

```bash
git add src/components
git commit -m "feat: 섹션 머리 등장·스크롤 연동 배지 회전·타임라인 채움·히어로 진입 모션 추가"
```

---

### Task 8: 옛 띠 컴포넌트와 쓰지 않는 톤 토큰 삭제

**Files:**
- Delete: `src/components/Band/`, `src/components/SectionTitle/`, `src/components/SiteFooter/`, `src/components/CompetenciesBand/`, `src/components/CareerBand/`, `src/components/ProjectsBands/`, `src/components/SkillsBand/`, `src/components/EducationBand/`
- Modify: `src/styles/_colors.scss`, `src/styles/globals.scss`, `src/styles/colors.test.ts`, `src/data/site.ts`

- [ ] **Step 1: 참조 확인**

```bash
grep -rnE "components/(Band|SectionTitle|SiteFooter|CompetenciesBand|CareerBand|ProjectsBands|SkillsBand|EducationBand)/" src --include=*.ts --include=*.tsx | grep -vE "^src/components/(Band|SectionTitle|SiteFooter|CompetenciesBand|CareerBand|ProjectsBands|SkillsBand|EducationBand)/"
```
Expected: 출력 없음. 있으면 해당 파일을 새 컴포넌트로 바꾸고 보고.

- [ ] **Step 2: 삭제**

```bash
git rm -r -q src/components/Band src/components/SectionTitle src/components/SiteFooter src/components/CompetenciesBand src/components/CareerBand src/components/ProjectsBands src/components/SkillsBand src/components/EducationBand
```

- [ ] **Step 3: 톤 토큰 정리**

`src/styles/_colors.scss`에서 `$band-light-white`, `$band-light-ink`, `$band-dark-white`, `$band-dark-ink` 맵 4개를 지운다(`$band-light-canvas`, `$band-dark-canvas`, `$primary`, `$glass-*`, 믹스인은 유지).

`src/styles/globals.scss`의 `:root, :root[data-theme="light"]` 블록과 `:root[data-theme="dark"]` 블록에서 `[data-tone="white"] { … }`와 `[data-tone="ink"] { … }` 블록을 지운다(`[data-tone="canvas"]` 블록은 유지). 같은 파일 `:root`에서 `--band-pad-y: var(--space-16);`, `--band-max: 61.25rem;` 줄과 `@include up(md) { --band-pad-y: var(--space-24); }` 블록을 지운다.

`src/styles/colors.test.ts`의 `BANDS` 배열을 아래로 바꾼다:

```ts
const BANDS = ["band-light-canvas", "band-dark-canvas"];
```

`src/data/site.ts`의 `uiCopy`에서 쓰지 않게 된 `competenciesTitle` 줄을 지운다.

- [ ] **Step 4: 남은 참조 확인**

```bash
grep -rnE "var\(--band-pad-y\)|var\(--band-max\)|data-tone=\"(white|ink)\"|tone=\"(white|ink)\"|band-(light|dark)-(white|ink)|competenciesTitle" src || echo "옛 참조 없음"
```
Expected: `옛 참조 없음`. 출력이 있으면 새 토큰으로 고치고 보고.

- [ ] **Step 5: 전체 검증 & Commit**

Run: `npm run lint && npm test && npm run build` → 통과 (테스트 88 − 20 = 68: 띠 맵 4개 × 5개 대비 테스트 삭제)

```bash
git add -A src
git commit -m "chore: 전체 폭 띠 구조의 옛 컴포넌트와 쓰지 않는 white·ink 톤 토큰 삭제"
```

---

### Task 9: 작업 규칙·문서 갱신

**Files:**
- Modify: `CLAUDE.md`, `AGENTS.md`(같은 수정), `README.md`, `docs/superpowers/specs/2026-10-15-drake-layout-redesign-design.md`, `docs/superpowers/specs/2026-10-14-apple-style-redesign-design.md`

- [ ] **Step 1: `CLAUDE.md`와 `AGENTS.md`를 같은 방식으로 수정**

1. `설계 기준 문서:` 줄을 `설계 기준 문서: \`docs/superpowers/specs/2026-10-15-drake-layout-redesign-design.md\` (색·타이포·모션 안전 규칙은 \`2026-10-14-apple-style-redesign-design.md\`)`로 바꾼다.
2. "## 스타일 규칙"의 색 규칙 줄을 아래로 바꾼다:
   `- 색은 톤 토큰(\`--band-bg|fg|sub|mute|link|tile|focus|border\`)만 쓴다. 톤은 \`canvas\` 하나이며 라이트·다크 값이 \`globals.scss\`에서 연결된다. 컴포넌트에서 색 값을 직접 쓰지 않는다.`
3. 유리 효과 줄을 아래로 바꾼다:
   `- 유리 효과(\`@include glass-bar\`)는 1024px 미만 상단 바와 \`MobileMenu\` 패널에만 쓴다. 프로필 카드·아이콘 레일은 불투명 카드다. 그림자는 쓰지 않는다.`
4. "## 범위"에 한 줄 추가:
   `- 레이아웃: 1024px 이상 3단(왼쪽 \`ProfileCard\` · 가운데 콘텐츠 · 오른쪽 아이콘 레일), 미만은 상단 바 + 한 열. 섹션은 \`Section\` + \`SectionHeader\`(알약 라벨·큰 제목)로 시작한다.`
5. "## 모션 규칙"의 첫 줄을 아래로 바꾼다:
   `- 스크롤 연동·등장·hover·배지 회전·타임라인 채움은 CSS로, 아이콘 레일 알약·모바일 메뉴·타일 기울기만 Motion 라이브러리로 구현한다.`

- [ ] **Step 2: `README.md`의 "구현 원칙" 셋째 줄 교체**

`- 전체 폭 "띠"가 밝음·흰색·검정으로 …`로 시작하는 줄을 아래로 바꾼다:

```markdown
- 1024px 이상에서 왼쪽 프로필 카드·가운데 콘텐츠·오른쪽 아이콘 레일의 3단 구조이며, 섹션은 알약 라벨과 큰 제목으로 시작합니다. 색상은 톤 단위 CSS 변수 토큰으로, 타이포는 의미 토큰과 믹스인으로 정의하고 컴포넌트 스타일(SCSS Modules)은 토큰과 믹스인만 사용합니다.
```

같은 목록의 모션 줄에서 `내비 알약`을 `아이콘 레일 알약`으로 바꾼다.

- [ ] **Step 3: 설계 문서 갱신**

`docs/superpowers/specs/2026-10-15-drake-layout-redesign-design.md`: 상태 줄을 `상태: 구현 완료(검증 대기)`로 바꾸고, 문서 끝에 "## 11. 구현 시 의도된 차이" 절을 추가해 계획서 상단 "스펙 대비 의도된 차이" 5개를 그대로 옮긴다.

`docs/superpowers/specs/2026-10-14-apple-style-redesign-design.md`: 상태 줄 아래에 한 줄 추가:
`> 2026-10-15: 레이아웃·섹션 구성·내비게이션·띠 구조는 Drake식 3단 레이아웃 설계(2026-10-15-drake-layout-redesign-design.md)로 대체되었다. 색 값·타이포 토큰·접근성·모션 안전 규칙은 유효하다.`

- [ ] **Step 4: 검증 & Commit**

```bash
diff <(tail -n +2 CLAUDE.md) <(tail -n +2 AGENTS.md) && echo "CLAUDE/AGENTS 동일"
grep -n "띠 톤\|data-tone=\"canvas|white|ink\"\|SiteNav\`와" CLAUDE.md README.md || echo "옛 서술 없음"
npm run lint && npm test && npm run build
```
Expected: `CLAUDE/AGENTS 동일`, `옛 서술 없음`(남아 있으면 고치고 보고), 빌드 통과

```bash
git add CLAUDE.md AGENTS.md README.md docs/superpowers/specs
git commit -m "docs: Drake식 3단 구조에 맞춰 작업 규칙·README·설계 문서를 갱신"
```

---

### Task 10: 최종 검증과 성능 측정 (코드 변경 없음)

**Files:** 없음 (결함은 보고만)

- [ ] **Step 1: 자동 검증**

Run: `npm run lint && npm test && npm run build`
Expected: 통과(테스트 68), 라우트 `/`, `/projects/*` 8개, `/icon`, `/opengraph-image`, 404

- [ ] **Step 2: 화면 검증** (`npm run start -- -p 3100` 백그라운드 + 헤드리스 Chrome CDP; 스크립트는 저장소 밖(스크래치패드)에 두고, 끝나면 서버 종료)

대상: `/`, `/projects/monibuk`, `/projects/weseedcon`, `/projects/nope` × 360 / 768 / 1024 / 1280px × 라이트 / 다크
1. 모든 조합 `scrollWidth <= innerWidth`, 긴 제목·이메일 넘침 없음.
2. 1024px 가운데 열 폭 수치. 560px 미만이면 "비좁음 — 레일을 1280px부터 표시하는 대안 필요"로 보고(수정은 하지 않음).
3. 노출 중복 없음(보이는 섹션 `nav` 1개, 보이는 테마 토글 1개).
4. 키보드 순서(1280·360), 모바일 메뉴(Escape·포커스 이탈), 레일 말풍선.
5. 레일 `aria-current`가 섹션마다 맞음(스크롤 위·아래, 바로 이동, 새로고침).
6. 다크 새로고침 깜빡임 없음, 콘솔 오류·hydration 경고 없음.
7. 스크린샷(저장 후 설명): `/` 1280 라이트 맨 위·프로젝트·경력, 1280 다크 기술, 1024 라이트 맨 위, 360 라이트 맨 위·메뉴 열림, `/projects/monibuk` 1280 라이트.

- [ ] **Step 3: 접근성·성능 측정**

```bash
npx lighthouse http://localhost:3100/ --only-categories=accessibility,performance --quiet --chrome-flags="--headless" --output=json --output-path=<스크래치패드 경로>/lh-home-mobile.json
npx lighthouse http://localhost:3100/ --preset=desktop --only-categories=accessibility,performance --quiet --chrome-flags="--headless" --output=json --output-path=<스크래치패드 경로>/lh-home-desktop.json
```
성능은 모바일·데스크톱 각 3회 실행해 중앙값을 쓴다. `/projects/monibuk`도 모바일 1회. 보고: 접근성 점수, 성능 점수, LCP, CLS, TBT, LCP 요소, 전송량 상위 3개 리소스(폰트·JS·이미지 중 무엇인지). 측정하지 못했으면 "측정 못 함"이라고 쓰고 점수를 만들지 않는다.

- [ ] **Step 4: 정리와 보고**

서버 종료, `git status --short`에 `portfolio-content-design.md`만 남았는지 확인. 보고: 커밋 목록, 테스트·빌드 결과, 1024px 판단, 접근성·성능 수치, 스크린샷 설명, 결함 목록(심각도·URL·폭·테마·권장 수정). push·병합은 하지 않는다.
