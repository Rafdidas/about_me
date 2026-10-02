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
