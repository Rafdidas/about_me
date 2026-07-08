# CLAUDE.md — AI 에이전트 작업 가이드

이 저장소에서 AI 도구로 작업할 때 따르는 규칙이다. 사람이 작업하든 AI가 작업하든
같은 기준(구조·컨벤션·접근성·완료 기준)을 적용해 일관성과 품질을 유지한다.

## 콘텐츠 원칙

- 사이트에 특정 회사를 언급하지 않는다. 도메인 예시는 중립적인 B2B 소재로 유지한다.
- 콘텐츠·문구는 `data/`로 분리한다. 컴포넌트에 하드코딩하지 않는다.

## 범위 규칙

- 페이지 5개 고정: Home / Design System / Case Studies(2개) / Projects / Career
- 공통 컴포넌트는 아래로 한정한다. 임의 추가 금지:
  - Button, Input, Select, Badge, Table, Pagination + Skeleton, EmptyState, ErrorState
- 새 기능·페이지·컴포넌트가 필요하면 즉흥적으로 구현하지 않고 별도로 기록한 뒤 판단한다
- 개인 프로젝트(money_book, poke_dex_next, tmdb-ai-reco)는 문서 보강만 한다. 리팩토링 금지

## 기술 스택 · 컨벤션

- Next.js App Router + React + TypeScript + SCSS(BEM) + Vercel
- BEM 접두어: `l-`(layout) `p-`(page) `c-`(component) `ds-`(design system) `u-`(utility)
- 구조: `.block {}` `.block__element {}` `.block--modifier {}`
- Server Component 기본. client component는 상호작용이 필요한 곳에만
- 이미지 `next/image`, 폰트 `next/font`(Pretendard)

## 접근성 (모든 UI 작업의 기본)

- 클릭 요소는 `button` 태그, input은 `label` 연결(id/htmlFor), 에러는 `aria-describedby`
- `focus-visible` 스타일 필수, 키보드로 주요 인터랙션 접근 가능
- 상태 배지는 색상 + 텍스트 병기 (색상만으로 의미 전달 금지)
- 이미지 `alt` 필수

## 완료 기준 (모든 화면 작업)

- [ ] 모바일(360px~)·데스크톱에서 레이아웃 확인 (테이블은 모바일에서 카드형 전환)
- [ ] loading / empty / error 상태 구현 (데이터를 다루는 화면이면 필수)
- [ ] 위 접근성 항목 적용
- [ ] BEM 규칙·접두어 준수

## 커밋 규칙

- 한 커밋 = 한 가지 변경. 큰 작업은 의미 단위로 쪼갠다 (scaffold 한 방 커밋 금지)
- 메시지는 무엇을 왜 바꿨는지 구체적으로. 뭉뚱그린 요약 금지
  - 나쁜 예: `fix: address review issues`, `chore: update stuff`
  - 좋은 예: `fix: 홈 히어로 제목 개행이 무시되던 문제 수정`, `content: Case 2 타설관리 오타 수정`
- 한국어 메시지 허용 (타입 접두어는 유지: feat/fix/content/chore/style)
- 커밋에 서명·트레일러(Co-Authored-By 등)를 붙이지 않는다
- 배포 가능한 상태를 유지하며 단계 단위로 커밋한다
