# AGENTS.md — AI 에이전트 작업 가이드

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
