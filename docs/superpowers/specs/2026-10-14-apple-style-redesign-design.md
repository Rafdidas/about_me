# 포트폴리오 애플 스타일 리디자인 설계

작성일: 2026-10-14
상태: 구현 완료(검증 대기)
브랜치: `redesign/apple-style` (`main`에서 분기, 배포 전)
기준 문서: `docs/superpowers/specs/2026-10-02-portfolio-renewal-design.md` (이 설계는 그 문서의 레이아웃·토큰·모션·컴포넌트·규칙 일부를 대체한다)
디자인 참고: 사용자가 제공한 Apple 디자인 시스템 요약(apple.com 마케팅 표면 측정값)

## 1. 목표

- 현재 사이트(모카 팔레트, 왼쪽 유리 사이드바, 원컬럼)가 "너무 단조롭다"는 인상을 줄이고, 애플 웹사이트 스타일(큰 타이포, 전체 폭 섹션 띠의 명암 교차, 파란 알약 버튼, 절제된 모션)로 바꾼다.
- 적당한 인터랙션과 화려함을 더한다. 단, 이력서의 읽기 흐름과 접근성을 해치지 않는다.
- 콘텐츠(이력서 내용, 프로젝트 8개, 캡처 이미지)와 데이터 구조는 바꾸지 않는다.

## 2. 확정 사항 요약

| 항목 | 결정 |
| --- | --- |
| 적용 범위 | 레이아웃까지 애플식 전환 (상단 내비 + 전체 폭 섹션 띠). 사이드바 구조 폐기 |
| 메인 리듬 | 밝음 → 흰색 → 검정 → 밝음 → 검정 → 흰색 띠 교차. 프로젝트는 큰 타일 |
| 색상 | 애플 그대로: 파랑 `#0071e3`, 회색 `#f5f5f7`, 검정 `#000000`. 기존 모카·테라코타 팔레트 폐기 |
| 글꼴 | Pretendard 단일. SF Pro는 웹 사용 라이선스 문제로 쓰지 않는다 |
| 스타일링 | SCSS Modules + CSS 변수 토큰 유지. Tailwind 미사용 |
| 모션 | 혼합: 스크롤 연동·등장·hover는 CSS(서버 컴포넌트 유지), 손맛이 필요한 4곳만 Motion 라이브러리 |
| 의존성 | `motion` 추가 (`LazyMotion` + `domAnimation`, `m` 컴포넌트만 사용) |
| 다크 모드 | 토글 유지. 값만 바꾸는 방식(띠 톤 이름 고정, 모드별 값 연결) |
| 숫자 띠(CountUp) | 제외 |
| 배포 | 브랜치에서 작업, 사용자 확인 후 push·미리보기·`main` 병합 |

## 3. 변경 범위

**유지:** 라우트(`/`, `/projects/[slug]`, 404), `src/data/` 전체(타입·콘텐츠), `public/projects/` 이미지, `src/lib/`의 순수 함수(테마 결정, 기간 포맷, 프로젝트 조회, 활성 섹션 선택, 대비 계산), ThemeToggle의 View Transition 원형 전환, 외부 링크 처리(`TextLink`), 접근성 원칙.

**폐기:** `Sidebar`, `MobileHeader`, `PageShell`, `Backdrop`, 모카·테라코타 색상 토큰, `display`/`heading-1`/`heading-2` 타이포 역할.

**신규·교체:** `SiteNav`(+`MobileMenu`), `Band`, `Hero`, `Tile`, `PillButton`(기존 `ButtonLink` 교체), `SiteFooter`, `TiltTile`, 새 색상·타이포 토큰, 모션 토큰과 CSS 모션.

## 4. 화면 구조

### 4.1 공통

- 상단 `SiteNav`: 높이 48px, 고정(sticky). 왼쪽 이름, 가운데 섹션 링크(768px 이상), 오른쪽 `ThemeToggle`. 768px 미만은 이름 + 토글 + 메뉴 버튼(`MobileMenu`).
- 유리 효과는 `SiteNav`에만 적용한다 (라이트 `rgba(245,245,247,.8)`, 다크 `rgba(29,29,31,.72)`, `backdrop-filter: blur(20px) saturate(180%)`). 미지원 또는 `prefers-reduced-transparency: reduce`이면 불투명 배경으로 대체한다.
- 본문 바로가기 링크(`SkipLink`) 유지. 랜드마크: `header`(`SiteNav`) / `main` / `footer`(`SiteFooter`).
- `Band`: 전체 폭 배경 띠. prop `tone: "canvas" | "white" | "ink"`. 내용은 가운데 정렬 최대 폭 980px. 위아래 여백 96px(모바일 64px).
- `Tile`: 반경 18px 카드. 핵심 역량·경력·기술·프로젝트에서 공통 사용. 이미지가 있으면 위쪽에 16:10으로 잘라 넣는다(위쪽 기준 `object-position: top`).
- 타일 전체가 링크인 패턴 유지: 제목 링크 하나 + 가상 요소로 카드 전체 클릭 영역. 카드 안에 다른 링크를 두지 않는다.

### 4.2 메인 페이지 (`/`)

위에서 아래로, 모두 `Band` 하나씩.

| 순서 | 섹션 id | 톤 | 내용 |
| --- | --- | --- | --- |
| 1 | `about` | canvas | `Hero`: 직함 오버라인(`profile.role`), `h1`(`profile.headline`), 보조 문장 `lead`(`profile.intro`), 알약 버튼 2개(프로젝트 보기 → `#projects` 주 버튼, 이메일 → 보조 버튼) |
| 2 | `about`의 이어짐 | white | 핵심 역량 `profile.competencies` 4개 타일 (같은 `about` 섹션 안의 두 번째 띠, 내비 항목은 하나) |
| 3 | `career` | ink | 회사 2곳을 큰 타일로, 요약과 하이라이트 목록 |
| 4 | `projects` | canvas | 대표 실무 프로젝트 4개, 2×2 타일(이미지 없음: 라벨·제목·요약·기간·기술 태그) |
| 5 | `projects`의 이어짐 | ink | 개인 프로젝트 4개, 2×2 타일(캡처 이미지 첫 장을 타일 위쪽에) + 소개 문단 `personalProjectsIntro` |
| 6 | `skills` | white | 분야별 기술 타일 (`<dl>`) |
| 7 | `education` | canvas | 학력·자격 |
| — | `SiteFooter` | canvas | 이메일·GitHub 링크, 저작권 문구 |

내비 링크는 기존 `sectionNav`(소개·경력·프로젝트·기술·학력·자격)를 그대로 쓴다. 한 섹션이 띠 둘로 나뉘는 경우 같은 `id`를 첫 띠에만 붙인다.

### 4.3 프로젝트 상세 (`/projects/[slug]`)

- 같은 `SiteNav`.
- 첫 띠(canvas): 라벨, `h1`(제목), 기간·역할, 기술 태그, `note`(있을 때), 링크 알약 버튼(첫 링크 주 버튼, 나머지 보조 버튼).
- 이미지 갤러리: 전체 폭 중앙 열에 16:10 크롭 이미지를 세로로 쌓는다. 이미지가 없으면 렌더링하지 않는다.
- 본문 띠(white): 읽기 열 약 680px, 섹션마다 `h2`.
- 섹션 목차: `SiteNav` 아래에 붙는 얇은 보조 바(로컬 내비). 본문 섹션 `h2`(+확인 자료)로 자동 생성. 기존 `getProjectToc` 재사용.
- 마지막 띠(canvas): 이전/다음 프로젝트 타일(`getAdjacentProjects` 재사용).
- 섹션 목차는 서버 컴포넌트로, 현재 위치 강조가 없는 점프 링크다.
- 모바일에서도 `SiteNav`의 이름 링크와 "← 전체 프로젝트" 링크로 메인에 돌아갈 수 있다.

### 4.4 404

`SiteNav` + canvas 띠에 제목, 안내 문구, 알약 버튼(메인으로).

## 5. 디자인 토큰

규칙: 모듈 SCSS에서 색상 값, `font-size`, 간격 숫자를 직접 쓰지 않는다(`var(--…)`와 믹스인만). 예외: `0`, `1px` 테두리, `2px` 포커스 링·표시, 비율·퍼센트.

### 5.1 띠 톤별 색 토큰

컴포넌트는 자기가 놓인 띠를 몰라도 되도록 `Band`가 `data-tone`으로 아래 변수를 바꿔 준다.

라이트 테마

| 토큰 | canvas | white | ink |
| --- | --- | --- | --- |
| `--band-bg` | `#f5f5f7` | `#ffffff` | `#000000` |
| `--band-fg` | `#1d1d1f` | `#1d1d1f` | `#f5f5f7` |
| `--band-sub` | `#515154` | `#515154` | `#a1a1a6` |
| `--band-mute` (캡션 전용) | `#6e6e73` | `#6e6e73` | `#86868b` |
| `--band-link` | `#0066cc` | `#0066cc` | `#2997ff` |
| `--band-tile` | `#ffffff` | `#f5f5f7` | `#1d1d1f` |
| `--band-border` | `rgba(0,0,0,.08)` | `rgba(0,0,0,.08)` | `rgba(255,255,255,.12)` |

다크 테마 (`data-theme="dark"`)

| 토큰 | canvas | white | ink |
| --- | --- | --- | --- |
| `--band-bg` | `#000000` | `#101012` | `#000000` |
| `--band-fg` | `#f5f5f7` | `#f5f5f7` | `#f5f5f7` |
| `--band-sub` | `#a1a1a6` | `#a1a1a6` | `#a1a1a6` |
| `--band-mute` | `#86868b` | `#86868b` | `#86868b` |
| `--band-link` | `#2997ff` | `#2997ff` | `#2997ff` |
| `--band-tile` | `#1d1d1f` | `#1d1d1f` | `#1d1d1f` |
| `--band-border` | `rgba(255,255,255,.12)` | `rgba(255,255,255,.12)` | `rgba(255,255,255,.12)` |

공통 토큰

| 토큰 | 값 | 비고 |
| --- | --- | --- |
| `--color-primary` | `#0071e3` | 주 버튼 배경 |
| `--color-primary-hover` | `#0076df` | |
| `--color-primary-pressed` | `#006edb` | |
| `--color-on-primary` | `#ffffff` | |
| `--color-focus` | `#0071e3` (ink 띠 위에서는 `#2997ff`) | 포커스 링 2px, offset 2px |
| `--glass-bg`, `--glass-border` | 4.1 참조 | `SiteNav`만 사용 |

측정한 글자 대비 (WCAG, 4.5:1 이상 필요)

| 조합 | 대비 |
| --- | --- |
| `#1d1d1f` / `#f5f5f7` · `#ffffff` | 15.46 · 16.83 |
| `#515154` / `#f5f5f7` | 7.26 |
| `#6e6e73` / `#f5f5f7` · `#ffffff` | 4.66 · 5.07 (여유 적음, 캡션 전용) |
| `#0066cc` / `#f5f5f7` · `#ffffff` | 5.11 · 5.57 |
| 흰 글자 / `#0071e3` · hover `#0076df` · pressed `#006edb` | 4.70 · 4.51 · 4.94 (hover가 가장 낮음) |
| `#f5f5f7`·`#a1a1a6`·`#86868b`·`#2997ff` / `#000000` | 19.29 · 8.16 · 5.80 · 6.96 |
| 같은 4색 / `#101012` | 17.46 · 7.39 · 5.25 · 6.30 |
| 같은 4색 / `#1d1d1f` (타일) | 15.46 · 6.54 · 4.65 · 5.58 |
| 포커스 링 `#0071e3` / `#f5f5f7` · `#000000` | 4.31 · 4.47 (비텍스트 3:1 이상) |

대비 테스트: 라이트·다크 × 톤 3종 × (글자 4종 × `--band-bg`·`--band-tile`) 조합이 4.5:1 이상이어야 하고, 주 버튼 3상태의 흰 글자 대비도 검사한다. `--band-mute`는 `caption` 역할과 14px 미만 보조 문구 외에는 쓰지 않는다(규칙으로 문서화, 테스트로는 강제하지 않는다). 위 표의 숫자는 구현 시 테스트가 같은 값을 산출해야 한다.

### 5.2 타이포그래피

기본값(primitive) → 의미(semantic) → `@include text(역할)` 구조 유지. 반응형 글자 크기는 `md`(768px) 미만에서 의미 토큰 값을 재정의해서 처리한다(컴포넌트에 글자 크기용 media query 금지).

| 역할 | 데스크톱 | 모바일 (md 미만) | 굵기 | 줄 간격 | 자간 | 사용처 |
| --- | --- | --- | --- | --- | --- | --- |
| `hero` | 56px | 40px | 600 | 60px (모바일 44px) | -0.005em | 메인 히어로 `h1` |
| `section` | 40px | 28px | 600 | 44px (모바일 32px) | 0 | 섹션 제목 `h2` |
| `tile` | 28px | 22px | 600 | 32px (모바일 28px) | +0.007em | 타일 제목 |
| `lead` | 21px | 17px | 400 | 30px (모바일 26px) | -0.01em | 히어로 보조 문장 |
| `body` | 17px | 17px | 400 | 28px | -0.022em | 본문 |
| `body-sm` | 14px | 14px | 400 | 20px | -0.016em | 요약·목록 |
| `caption` | 12px | 12px | 400 | 17px | -0.01em | 날짜·태그·부가 설명 |
| `overline` | 12px | 12px | 600 | 16px | +0.06em | 직함·`PROJECT 01` 라벨 (대문자) |
| `button` | 17px | 17px | 400 | 22px | -0.022em | 알약 버튼(높이 44px) |
| `button-sm` | 14px | 14px | 400 | 18px | -0.016em | 작은 알약 버튼(높이 36px) |

- 애플 원본과의 차이: `tile`은 원본 400 대신 600(Pretendard 400이 28px 한글에서 가늘어 보임), `body` 줄 간격은 원본 25px 대신 28px(한글 단락 가독성), 자간은 px를 em으로 환산했다.
- 전역: `word-break: keep-all`, `overflow-wrap: anywhere`, 폰트 Pretendard 단일.
- 기존 역할 이름은 새 이름으로 일괄 교체한다(`display`→`hero`, `heading-1`→`section`, `heading-2`→`tile`).

### 5.3 모양·간격·시간

- 반경: `--radius-control` 8px, `--radius-tile` 18px, `--radius-pill` 980px.
- 간격: 기존 4px 스케일 유지, 추가로 띠 여백 `--band-pad-y`(96px, md 미만 64px), 콘텐츠 최대 폭 `--content-max` 980px, 읽기 열 `--reading-max` 680px, 타일 간격 `--tile-gap` 20px.
- 그림자 없음(평면). 깊이는 배경 대비와 테두리로 만든다.
- 시간: `--duration-fast` 200ms, `--duration-base` 400ms, `--duration-slow` 800ms(히어로 진입 한정). 이징 `--ease-out`, `--ease-spring`(CSS `linear()` 스프링 근사).
- 브레이크포인트: `md` 768px, `lg` 1024px(모바일 우선).

## 6. 모션

원칙: 스크롤에 따른 큰 연출은 CSS(서버 컴포넌트 유지), 손맛이 필요한 곳만 Motion. 움직이는 속성은 `transform`과 `opacity`뿐(내비 알약의 `width`는 예외). 모션이 실패하거나 꺼져도 내용은 항상 보인다(시작 상태가 `opacity: 0`으로 고정되면 안 된다).

### 6.1 CSS 모션

| 모션 | 구현 | 미지원·줄이기 |
| --- | --- | --- |
| 타일 등장 | `animation-timeline: view()`, 아래에서 떠오르며 나타남. 같은 줄 타일은 `animation-range`를 어긋나게 해 순차 등장처럼 보이게 함 | 처음부터 표시 |
| 히어로 퇴장 | `animation-timeline: scroll()`, 제목·문장이 약간 작아지며 위로 흐려짐 | 변화 없음 |
| 히어로 진입 | 첫 로드에서 오버라인 → 제목 → 문장 → 버튼이 블록 단위로 순차 등장(문장은 쪼개지 않아 스크린리더가 읽는 내용은 그대로) | 즉시 표시 |
| 내비 경계선 | 스크롤 0에서는 투명, 조금 스크롤하면 유리 배경·경계선 나타남 (`animation-timeline: scroll()`) | 항상 유리 배경 |
| 타일 hover | `scale(1.02)`(개별 속성 `scale` 사용, 등장 애니메이션의 transform과 충돌 방지) + 내부 이미지 천천히 확대(`overflow: hidden`), `--ease-spring` | hover 변화 없음 |
| 버튼 | hover 색 변화, 눌림 `scale(.97)` | 색 변화만 |
| 테마 전환 | 기존 View Transition 원형 전환 | 즉시 전환 |

CSS 모션은 `@media (prefers-reduced-motion: no-preference)`와 `@supports (animation-timeline: view())` 안에서만 선언한다. 기존 `reveal` 믹스인 방식(키프레임은 모듈 단위로 포함)을 따른다.

### 6.2 Motion 라이브러리 모션 (client component 한정)

| 컴포넌트 | 모션 |
| --- | --- |
| `SiteNav` | 현재 섹션 알약 표시와 hover 배경 알약이 항목 사이를 스프링으로 이동. 위치·폭을 측정해 `m.div`의 `animate={{ x, width }}`로 구동 (아래 주의 참조) |
| `MobileMenu` | 768px 미만에서 메뉴가 스프링으로 펼쳐지고 항목이 순서대로 나타남 (`AnimatePresence`) |
| `TiltTile` | 개인 프로젝트 타일에서 포인터를 따라 ±4° 기울고 빛이 번짐. `(hover: hover)`이고 움직임 줄이기가 꺼져 있을 때만 동작 |

- `LazyMotion features={domAnimation}`과 `import * as m from "motion/react-m"`만 사용한다(초기 약 4.6KB). 공식 문서 기준 `layoutId` 같은 레이아웃 애니메이션은 `domAnimation`이 아니라 `domMax`가 필요하므로 이 설계에서는 `layoutId`를 쓰지 않고 위치·폭 측정 방식으로 구현한다.
- 앱 전체를 `MotionConfig reducedMotion="user"`로 감싼다(변환·레이아웃 애니메이션 자동 비활성). 전역 CSS에도 `prefers-reduced-motion: reduce`에서 애니메이션·전환을 끄는 규칙을 둔다.
- 목표: 추가되는 클라이언트 JavaScript가 gzip 기준 약 20KB 이하. 빌드 결과로 실측해 보고한다(초과하면 이유와 함께 보고).
- 금지: 스크롤 가로채기(scroll hijacking), 자동 재생·무한 반복(marquee 등), 시간 800ms 초과 모션.

### 6.3 client component 목록

`ThemeToggle`, `SiteNav`, `MobileMenu`, `TiltTile` 4개만. 늘리려면 이유를 기록한다. 나머지는 모두 Server Component.

## 7. 반응형·접근성

- 360px부터 지원. 타일 격자는 768px 미만 1열, 이상 2열. 가로 스크롤 없음.
- 랜드마크, 페이지당 `h1` 하나, 제목 단계 건너뛰지 않기, 본문 바로가기 유지.
- 현재 내비 항목은 색 + 굵기 + 알약 표시로 구분(색만 아님), `aria-current="location"`.
- 모든 인터랙티브 요소에 `:focus-visible` 포커스 링(2px, offset 2px, `--color-focus`). 키보드만으로 내비·타일·링크·토글·모바일 메뉴 접근 가능. 모바일 메뉴는 `aria-expanded`/`aria-controls`, Escape로 닫기, 닫을 때 포커스를 메뉴 버튼으로 복귀.
- 외부 링크는 새 창 + "(새 창)" 안내(`TextLink`, `PillButton`).
- `TiltTile`은 링크 바깥을 감싸는 장식 래퍼로 접근성 트리를 바꾸지 않는다. 이미지 `alt` 필수(타입으로 강제, 기존 유지).

## 8. 검증

자동(Vitest)
- 대비 테스트를 띠 톤 구조에 맞게 재작성(5.1).
- 데이터 무결성, 테마 결정, 날짜 포맷, 프로젝트 조회, 활성 섹션 선택(`pickActiveId`) 기존 테스트 유지.
- 신규 순수 함수 테스트: `TiltTile`의 기울기 각도 계산·제한.
- `npm run lint`, `npm test`, `npm run build` 통과. 정적 생성 라우트(`/`, `/projects/*` 8개, `/icon`, `/opengraph-image`) 유지.

화면(브라우저)
- 360 / 768 / 1280px × 라이트 / 다크: 레이아웃, 가로 스크롤 없음, 띠 교차와 가독성.
- 키보드 탐색 순서와 포커스 링, 모바일 메뉴 열기·닫기·Escape.
- 테마 전환 후 새로고침 시 깜빡임 없음, 원형 전환 동작.
- 스크롤 연동 모션과 hover·기울기 동작 확인. 움직임 줄이기는 에뮬레이션이 안 되면 CSS 규칙 존재만 확인하고 그렇게 보고한다.
- Lighthouse 접근성 100 재측정, 추가 JavaScript 크기 실측.

## 9. 작업 순서 (`redesign/apple-style`, 각 커밋에서 빌드 통과 유지)

1. `chore`: `motion` 의존성 추가
2. `style`: 새 토큰(띠 톤 색, 새 타이포 역할, 모양·간격·시간)을 기존 토큰을 지우지 않고 추가, 대비 테스트 확장
3. `feat`: `Band`, `Hero`, `Tile`, `PillButton`, `SiteFooter`
4. `feat`: `SiteNav`와 `MobileMenu` (Motion 없이 CSS만으로 먼저 동작하는 버전)
5. `feat`: 메인 페이지를 새 구조로 전환
6. `feat`: 프로젝트 상세·404를 새 구조로 전환
7. `feat`: CSS 모션(등장, 히어로, hover, 내비 경계선)
8. `feat`: Motion 모션(`SiteNav` 알약, `MobileMenu`, `TiltTile`)과 `MotionConfig`
9. `chore`: 옛 컴포넌트(`Sidebar`, `MobileHeader`, `PageShell`, `Backdrop`, `ButtonLink`)와 옛 토큰 삭제
10. `docs`: `CLAUDE.md`·`AGENTS.md`·`README.md`·이전 설계 문서의 대체된 부분을 새 규칙으로 갱신, 아이콘(`icon.tsx`)과 OG 이미지(`opengraph-image.tsx`)를 새 팔레트(`#0071e3`, `#f5f5f7`, `#1d1d1f`)로 교체

## 10. 규칙 변경 (`CLAUDE.md`·`AGENTS.md`)

- "범위 밖"에서 "애니메이션 라이브러리" 삭제. 대신 "Motion은 `LazyMotion`·`m`·`domAnimation`만, `layoutId`·드래그 금지(`domMax` 필요)" 추가.
- "client component는 `ThemeToggle`, `SectionNav`뿐" → "`ThemeToggle`, `SiteNav`, `MobileMenu`, `TiltTile`뿐".
- 타이포 역할 목록을 5.2의 이름으로, 글래스는 `SiteNav` 한 곳으로, 움직임 시간 규칙을 "0.2~0.8초, `prefers-reduced-motion`에서 끔"으로 갱신.
- 색 규칙: `--band-mute`는 캡션 전용, 띠 톤 토큰(`data-tone`)만 쓰고 컴포넌트에서 색 값 직접 사용 금지.
- 그 밖의 규칙(커밋 규칙, 접근성, 완료 기준, 콘텐츠 원칙)은 유지한다.

## 11. 범위 밖

SF Pro 글꼴, Tailwind, 숫자 띠(`CountUp`), marquee·자동 재생·무한 반복 모션, 스크롤 가로채기·pin 고정 연출, 새 페이지·기능·콘텐츠, 이력서·콘텐츠 문구 수정.

## 12. 위험과 대응

| 위험 | 대응 |
| --- | --- |
| 한글에 애플의 좁은 줄 간격·자간을 그대로 쓰면 답답함 | 본문 줄 간격과 `tile` 굵기를 한글에 맞게 조정(5.2). 구현 후 화면으로 확인하고 필요하면 토큰만 조정 |
| 대비 여유가 적은 조합(`#6e6e73`, hover 버튼 4.51) | 캡션 전용 규칙과 대비 테스트로 고정 |
| `layoutId` 사용 시 번들 증가 | `layoutId` 금지, 측정 기반 `animate` 사용 |
| 스크롤 연동 CSS 미지원 브라우저 | 지원 감지 안에서만 선언, 미지원이면 정적 표시 |
| 다크 테마 `white` 띠(`#101012`)와 타일(`#1d1d1f`)의 구분이 약함 | 타일 테두리(`--band-border`)로 보강, 화면 확인 후 값 미세 조정 |
