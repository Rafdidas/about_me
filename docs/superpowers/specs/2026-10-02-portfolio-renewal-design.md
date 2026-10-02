# 포트폴리오 사이트 전면 개편 설계

작성일: 2026-10-02
상태: 설계 확정, 구현 계획 작성 전
콘텐츠 원본: `C:\dev\resume\박현규_범용_.md` (범용 이력서)

## 1. 목표

- 특정 지원처에 맞춘 기존 사이트를 버리고, 범용 이력서를 웹으로 확장한 포트폴리오를 만든다.
- 이력서 링크를 받은 사람이 메인 한 페이지에서 30초 안에 전체 경력을 훑고, 관심 있는 프로젝트만 상세로 들어가게 한다.
- 사이트 코드 자체가 이력서의 핵심 역량(CSS 변수 토큰, 타이포그래피 기준, 접근성, 공통 UI)의 증거가 되게 한다.

기존 `src/` 코드는 참고하지 않고 새로 작성한다. 저장소와 Vercel 프로젝트(URL)는 유지한다.

## 2. 확정 사항 요약

| 항목 | 결정 |
| --- | --- |
| 사이트 성격 | 이력서의 웹 확장판 (이력서 구조를 따르고 프로젝트 상세를 더 깊게) |
| 페이지 구조 | 메인 원페이지 + 프로젝트 상세 `/projects/[slug]` 6개 |
| 스타일링 | SCSS Modules + 전역 토큰(CSS 변수). Tailwind 미사용 |
| 콘텐츠 관리 | 타입이 있는 TS 데이터 파일 (`src/data/`). 맞지 않으면 추후 MDX 전환 검토 |
| 연락처 노출 | 이메일 + GitHub만. 전화번호·거주지는 사이트에 넣지 않는다 |
| 고객사·프로젝트명 | 이력서와 동일하게 실명 사용 |
| 레이아웃 | 데스크톱 좌측 고정 사이드바 + 우측 스크롤, 모바일 1단 + 상단 고정 헤더 |
| 색상 | 라이트: 모카 팔레트 + 테라코타 강조 / 다크: 모브 팔레트 + 블랙 + 밝힌 테라코타 강조 |
| 글래스모피즘 | 약하게. 고정 UI(사이드바·모바일 헤더)에만 적용, 콘텐츠 카드는 불투명 |
| 테마 | OS 설정 자동 감지 + 수동 토글(선택 저장), 첫 렌더 깜빡임 없음 |
| 인터랙션 | 네이티브 CSS·Web API만 사용 (Motion 등 애니메이션 라이브러리 미사용) |
| 개인 프로젝트 이미지 | 사용자가 작업 중간에 제공. 없을 때는 이미지 영역을 렌더링하지 않음 |

## 3. 기술 스택

- Next.js App Router (구현 시점 최신 안정 버전), React, TypeScript
- SCSS Modules (`sass`), `next/font`로 Pretendard 로드
- 테스트: Vitest
- 배포: Vercel (기존 프로젝트)
- 작업 브랜치: `renewal` → 미리보기 배포 확인 후 `main` 병합

## 4. 라우트와 화면 구성

### 4.1 라우트

| 경로 | 내용 |
| --- | --- |
| `/` | 메인 원페이지 |
| `/projects/[slug]` | 프로젝트 상세. `generateStaticParams`로 정적 생성, 존재하지 않는 slug는 `notFound()` |
| `not-found` | 404 페이지 (메인으로 돌아가는 링크 포함) |

slug 목록:

| slug | 이력서 항목 | 구분 |
| --- | --- | --- |
| `weseedcon` | PROJECT 01 위시드콘 레미콘 품질관리 플랫폼 | work |
| `weseed-crm-design-system` | PROJECT 02 WeSeed CRM·Admin 디자인 시스템 개선 | work |
| `construction-logistics-systems` | PROJECT 03 건설·물류 업무 시스템 구축 | work |
| `ecommerce` | PROJECT 04 이커머스 신규 구축·장기 운영 | work |
| `monibuk` | 머니북가계부 | personal |
| `fe-daily-study` | FE Daily Study | personal |

### 4.2 메인 섹션 순서

1. `#about`: 직함 오버라인, `h1` 한 줄 소개(이력서 첫 문장), 소개 문단, 핵심 역량 4개 (`label` + `text`)
2. `#career`: 소프트자이온, 위사 (회사·직함·기간·요약·하이라이트)
3. `#projects`: 대표 실무 프로젝트 4개 → 개인 프로젝트 2개 (개인 프로젝트 영역 상단에 AI 활용 개발 안내 문단)
4. `#skills`: 분야별 기술 (`<dl>`)
5. `#education`: 학력·자격

### 4.3 레이아웃

데스크톱 (`lg` 1024px 이상):

- 좌측 고정 사이드바 (유리 효과). 우측 콘텐츠만 스크롤
- 메인 사이드바: 이름, 직함, 섹션 내비(`SectionNav`), 연락처(이메일·GitHub), 테마 토글. 한 줄 소개(`headline`)는 사이드바와 중복되지 않도록 `#about`의 `h1`로만 노출한다.
- 상세 사이드바: 이름, "← 전체 프로젝트" 링크, 페이지 내 목차(섹션 제목에서 자동 생성), 테마 토글

모바일 (360px 이상, `lg` 미만):

- 상단 고정 헤더 (유리 효과): 이름, 테마 토글, 가로 스크롤 섹션 링크
- 사이드바에만 있던 연락처(이메일·GitHub)는 `lg` 미만에서 `#about` 섹션 하단에 표시한다 (데스크톱에서는 숨김, 중복 노출 방지)

## 5. 디자인 토큰

규칙: 컴포넌트 `.module.scss`에서는 색상 값, `font-size`, 간격 숫자를 직접 쓰지 않는다. 반드시 토큰(CSS 변수) 또는 믹스인을 사용한다.

### 5.1 색상 (의미 토큰, 모드별 값)

| 토큰 | 라이트 | 다크 | 용도 |
| --- | --- | --- | --- |
| `--color-bg` | `#F7F0F5` | `#1C1719` | 페이지 배경 |
| `--color-surface` | `#FFFFFF` | `#262023` | 카드 (불투명) |
| `--color-glass` | `rgba(247,240,245,.55)` | `rgba(75,59,71,.35)` | 사이드바·모바일 헤더 |
| `--color-glass-border` | `rgba(255,255,255,.6)` | `rgba(224,216,222,.12)` | 유리 테두리 |
| `--color-border` | `rgba(67,54,51,.10)` | `rgba(224,216,222,.10)` | 테두리·구분선 |
| `--color-text` | `#433633` | `#E0D8DE` | 본문 |
| `--color-text-sub` | `#5C5552` | `#9C9990` | 날짜·보조 문구 |
| `--color-decor` | `#8F857D` | `#6A6262` | 아이콘·장식. **텍스트에 사용 금지** |
| `--color-tint` | `#DECBB7` | `#4B3B47` | 태그 배경·배경 빛 번짐 |
| `--color-accent` | `#A0522D` | `#E0956B` | 링크·버튼·현재 메뉴·포커스 링 |
| `--color-on-accent` | `#F7F0F5` | `#1C1719` | 강조색 위 텍스트 |

팔레트 출처:

- 라이트: Lavender Mist `F7F0F5`, Pale Oak `DECBB7`, Grey Olive `8F857D`, Stone Brown `5C5552`, Deep Mocha `433633` + 강조 테라코타 `A0522D`
- 다크: Mauve Shadow `4B3B47`, Dim Grey `6A6262`, Grey Olive `9C9990`, Sand Dune `CFD2B2`, Lavender Blush `E0D8DE` + 블랙 `1C1719` + 강조 `E0956B`
- Sand Dune `CFD2B2`는 다크 배경 빛 번짐의 보조색으로만 사용한다.

대비 기준: 텍스트용 토큰(`--color-text`, `--color-text-sub`, `--color-accent`)과 배경(`--color-bg`, `--color-surface`)의 모든 조합, 그리고 `--color-on-accent` × `--color-accent` 조합은 4.5:1 이상이어야 한다. 라이트·다크 모두 테스트로 검증한다 (10.1). 기준 미달 조합이 나오면 토큰 값을 조정하고 이 표를 갱신한다.

### 5.2 타이포그래피

기본값 토큰 (컴포넌트에서 직접 사용 금지):

```
--font-size-100: 13px   --font-size-200: 15px   --font-size-300: 16px
--font-size-400: 18px   --font-size-500: 22px   --font-size-600: 28px   --font-size-700: 36px
--font-weight-regular: 400   --font-weight-semibold: 600   --font-weight-bold: 700
--line-height-tight: 1.3   --line-height-snug: 1.5   --line-height-body: 1.7
--letter-spacing-tight: -0.02em   --letter-spacing-normal: 0   --letter-spacing-wide: 0.12em
```

의미 토큰 (역할별, `--text-{role}-size|weight|line-height|letter-spacing`):

| 역할 | 크기 (데스크톱 / `md` 미만) | 굵기 | 줄 간격 | 자간 | 사용처 |
| --- | --- | --- | --- | --- | --- |
| `display` | 700 / 600 | bold | tight | tight | 메인 이름, 상세 제목 |
| `heading-1` | 600 / 500 | bold | tight | tight | 섹션 제목 |
| `heading-2` | 400 / 400 | semibold | snug | normal | 카드 제목, 회사명, 상세 섹션 제목 |
| `body` | 300 / 300 | regular | body | normal | 본문 문단 |
| `body-sm` | 200 / 200 | regular | snug | normal | 카드 요약, 목록 |
| `caption` | 100 / 100 | regular | snug | normal | 날짜, 태그 |
| `overline` | 100 / 100 | semibold | snug | wide (대문자) | 직함 오버라인, `PROJECT 01` |

- 반응형은 `md`(768px) 미만에서 의미 토큰 값을 재정의하는 방식으로 처리한다. 컴포넌트에 글자 크기용 media query를 두지 않는다.
- 믹스인 `@include text(display)`로 크기·굵기·줄 간격·자간을 한 번에 적용한다.
- 전역: `word-break: keep-all`, `overflow-wrap: anywhere`(긴 URL 대비), 폰트 Pretendard 단일.

### 5.3 간격·모서리·브레이크포인트

- 간격: `--space-1`(4px) ~ `--space-16`(64px), 4px 단위 스케일
- 모서리: `--radius-sm` 8px(버튼), `--radius-md` 12px(카드), `--radius-lg` 16px(사이드바), `--radius-pill` 999px(태그)
- 브레이크포인트 믹스인: `md` 768px, `lg` 1024px (모바일 우선, `min-width`)
- 콘텐츠 최대 폭: 본문 영역 약 720px

## 6. 테마

- `<html data-theme="light|dark">`에 토큰 값을 연결한다. `color-scheme`도 모드에 맞춰 지정한다.
- `<head>` 인라인 스크립트가 첫 렌더 전에 테마를 결정한다: `localStorage`에 저장된 값 → 없으면 `prefers-color-scheme`. `<html>`에 `suppressHydrationWarning`을 둔다.
- 테마 결정 로직은 `src/lib/theme.ts`의 순수 함수로 분리하고, 인라인 스크립트와 토글이 같은 키·같은 규칙을 공유한다.
- `ThemeToggle`(client): `<button>`, `aria-label`은 실행될 동작("다크 모드로 전환" / "라이트 모드로 전환"). 클릭 시 저장하고 `data-theme`를 갱신한다.
- 저장된 선택이 없을 때는 OS 설정 변경(`matchMedia` change)을 따라간다.
- `localStorage` 접근은 try/catch로 감싸 실패해도 OS 설정으로 동작한다.

## 7. 데이터 모델과 컴포넌트

### 7.1 타입 (`src/data/types.ts`)

```ts
type Highlight = { label?: string; text: string };
type ExternalLink = { label: string; href: string; kind: 'service' | 'github' | 'evidence' };
type ProjectImage = { src: string; alt: string; width: number; height: number };
type Period = { start: string; end: string | null }; // end null = '재직 중'

type ProjectSection = {
  title: string;
  stack?: string[];
  paragraphs?: string[];
  items?: Highlight[];
};

type Project = {
  slug: string;
  kind: 'work' | 'personal';
  label: string;            // 'PROJECT 01' | 'SIDE PROJECT'
  title: string;
  summary: string;          // 메인 카드 한 줄 요약
  period: Period | string;  // 개인 프로젝트는 상태 문구
  stack: string[];
  role?: string;
  note?: string;            // PROJECT 03의 '화면 공개가 어려워…' 같은 안내
  links: ExternalLink[];
  images?: ProjectImage[];
  sections: ProjectSection[];
};

type Profile = {
  name: string;
  role: string;             // 'FRONTEND · UI ENGINEER'
  headline: string;         // 사이드바 한 줄 소개
  intro: string;            // 소개 문단
  email: string;
  github: string;
  competencies: Highlight[];
};

type CareerEntry = {
  company: string;
  position: string;
  period: Period;
  summary: string;
  highlights: Highlight[];
};

type SkillGroup = { category: string; items: string[]; note?: string };
type EducationItem = { title: string; detail?: string };
```

데이터 파일: `profile.ts`, `career.ts`, `projects.ts`, `skills.ts`, `education.ts`. 상세 페이지의 이전/다음 순서는 `projects.ts` 배열 순서를 따른다. 사이트 공통 문구(섹션 제목, 버튼 문구 등)도 `src/data/`에 둔다.

이력서 → 섹션 매핑:

- PROJECT 01·02: `배경` / `담당 작업` / `적용 및 운영` (paragraphs)
- PROJECT 03: `note` + 시스템별 섹션 3개(LH 레미콘스마트관리시스템, 현대 CSM, 롯데글로벌로지스 CRM), 각 섹션에 `stack`
- PROJECT 04: `신규 구축` / `운영·유지보수` / `담당 범위`
- 개인 프로젝트: `개요`(paragraphs) / `구현 내용`(items, 굵은 라벨 → `label`) + `확인 자료`는 `links`의 `evidence`

### 7.2 컴포넌트

Server Component가 기본이다. client component는 `ThemeToggle`, `SectionNav` 두 개뿐이다.

| 영역 | 컴포넌트 | 역할 |
| --- | --- | --- |
| 레이아웃 | `SkipLink` | 본문 바로가기 |
| | `Sidebar` | 데스크톱 고정 사이드바 (메인/상세 변형) |
| | `MobileHeader` | 모바일 상단 고정 헤더 |
| | `Backdrop` | 배경 빛 번짐 (장식, `aria-hidden`) |
| 상호작용 | `ThemeToggle` (client) | 테마 전환 |
| | `SectionNav` (client) | `IntersectionObserver`로 현재 섹션 감지, `aria-current` 표시, 활성 표시 이동 |
| 공통 UI | `Tag` | 기술 태그 |
| | `TextLink` | 링크. 외부 링크는 새 창 + `rel="noopener noreferrer"` + 스크린리더용 "새 창" 안내 |
| | `ButtonLink` | 버튼 모양 링크 (서비스·GitHub) |
| | `SectionHeading` | 섹션 제목 (`heading-1`) |
| 메인 | `AboutSection`, `CareerSection`/`CareerItem`, `ProjectsSection`/`ProjectCard`, `SkillsSection`, `EducationSection` | 각 섹션 |
| 상세 | `ProjectHeader`, `ProjectBody`, `ProjectGallery`, `ProjectPager` | 제목·메타, 섹션 본문, 이미지(있을 때만), 이전/다음 |

판단 기준:

- `ProjectCard`는 제목 링크 하나만 갖고, 가상 요소로 클릭 영역을 카드 전체로 확장한다. 카드 안에 다른 링크를 두지 않는다 (중첩 인터랙티브 요소 방지). 외부 링크는 상세 페이지에 둔다.
- 기술 섹션은 `<dl>`로 마크업한다. 모바일 카드 전환이 필요 없다.
- 날짜 표기 형식(`2026.05 – 재직 중`)은 `src/lib/format.ts` 순수 함수 하나로 통일한다.

### 7.3 상태 처리

- 정적 데이터만 사용하므로 loading·error 상태는 없다.
- 이미지가 없으면 `ProjectGallery`를 렌더링하지 않는다 (빈 자리 표시 없음).
- 잘못된 slug는 404 페이지로 보낸다.

## 8. 유리 효과·인터랙션

### 8.1 유리 효과

- `backdrop-filter: blur(14px) saturate(140%)`는 `Sidebar`, `MobileHeader`에만 적용한다.
- `@supports not (backdrop-filter: blur(1px))` 또는 `prefers-reduced-transparency: reduce`이면 `--color-surface` 불투명 배경으로 대체한다.
- `Backdrop`은 `position: fixed` 장식 요소에 `radial-gradient`로 빛 번짐을 그린다 (`filter: blur` 미사용). 라이트는 `--color-tint`, 다크는 `--color-tint` + Sand Dune 저농도.

### 8.2 인터랙션 (라이브러리 없이)

| 인터랙션 | 구현 | 미지원 시 |
| --- | --- | --- |
| 현재 메뉴 표시 이동 | `SectionNav`가 활성 항목 위치를 측정해 CSS 변수로 전달, 표시 요소를 `transform` 전환 | 즉시 이동 |
| 테마 전환 | View Transition API + `clip-path` 원형 확장 (토글 버튼 위치 기준) | 즉시 전환 |
| 스크롤 등장 | CSS `animation-timeline: view()`로 섹션·카드가 살짝 떠오르며 나타남 | 처음부터 표시 |
| hover·focus | 카드 테두리·그림자 변화, 링크 밑줄 | — |

- 모든 움직임은 0.2~0.4초 이내.
- `prefers-reduced-motion: reduce`에서는 모든 움직임을 끈다 (View Transition 포함).
- 콘텐츠는 애니메이션 없이도 항상 읽을 수 있어야 한다 (등장 애니메이션 전 상태가 `opacity: 0`으로 고정되는 경우 금지).

## 9. 접근성

- 랜드마크: `header`/`nav`/`main`/`footer`, 페이지당 `h1` 하나, 제목 단계 건너뛰지 않음
- 본문 바로가기 링크
- 모든 인터랙티브 요소에 `:focus-visible` 포커스 링 (`--color-accent`, 2px, offset 2px)
- 키보드만으로 내비·카드·링크·토글 전부 접근 가능
- 이미지 `alt` 필수 (타입으로 강제)
- 색만으로 의미를 전달하지 않는다 (현재 메뉴는 색 + 굵기 + 표시 막대)
- 텍스트 대비 4.5:1 이상 (5.1)

## 10. 검증

### 10.1 자동 검증 (Vitest)

- 데이터 무결성: slug 중복 없음, 필수 필드 존재, 모든 이미지 `alt` 비어 있지 않음, 모든 외부 링크 `https://`, 프로필·데이터 전체에 전화번호 패턴 없음
- 테마 결정 로직: 저장값 우선, 저장값 없으면 OS 설정, 저장소 접근 실패 시 OS 설정
- 날짜 포맷 함수
- 색 대비: 토큰 정의에서 텍스트/배경 조합을 계산해 4.5:1 이상인지 확인 (라이트·다크 모두)

### 10.2 빌드·정적 검사

- `npm run lint`, `npm run build` 통과
- 빌드 결과에 상세 페이지 6개가 정적 생성됨

### 10.3 화면 검증 (브라우저 미리보기)

- 360px / 768px / 1280px × 라이트 / 다크 레이아웃
- 키보드 탐색 순서와 포커스 링
- 테마 전환 후 새로고침 시 깜빡임 없음
- 유리 효과 미지원·투명도 감소 설정에서 대체 배경
- 최종 Lighthouse 접근성 100 목표

## 11. 작업 순서와 커밋 단위 (`renewal` 브랜치)

각 단계 끝에서 빌드가 통과하는 상태를 유지한다.

1. `chore`: 기존 `src/` 제거, 새 앱 골격과 SCSS 설정
2. `style`: 색상·타이포·간격 토큰과 전역 스타일, 믹스인
3. `feat`: 테마 초기화 스크립트와 `ThemeToggle`
4. `content`: 데이터 타입과 이력서 콘텐츠 입력 (+ 데이터 무결성 테스트)
5. `feat`: `Sidebar`·`MobileHeader`·`Backdrop` 레이아웃
6. `feat`: 메인 섹션
7. `feat`: 프로젝트 상세 페이지와 404
8. `style`: 인터랙션 (메뉴 표시 이동, 테마 전환, 스크롤 등장)
9. `docs`: `CLAUDE.md`·`AGENTS.md`·`README.md`를 새 구조와 규칙으로 갱신

개인 프로젝트 이미지는 제공받는 시점에 별도 `content` 커밋으로 추가한다.

## 12. 기존 문서 처리

- `CLAUDE.md`·`AGENTS.md`의 기존 범위 규칙(페이지 5개 고정, 공통 컴포넌트 목록 제한, BEM 접두어)은 폐기하고 이 설계의 규칙(SCSS Modules, 토큰 사용 강제, client component 최소화, 접근성·완료 기준)으로 대체한다.
- "사이트에 특정 회사를 언급하지 않는다"는 원칙은 **지원처**를 언급하지 않는다는 의미로 유지한다. 경력상의 회사·고객사 실명은 사용한다.
- `docs/superpowers/`의 이전 설계·계획 문서는 이력으로 보존한다.

## 13. 범위 밖

- 블로그·MDX·CMS
- 다국어
- 실무 업무 화면 데모 또는 캡처
- 이력서 PDF 다운로드
- 애니메이션 라이브러리(Motion 등), Tailwind
- 분석 도구·문의 폼
