# CLAUDE.md — AI 에이전트 작업 가이드

토스플레이스 지원용 포트폴리오 프로젝트. 어느 환경(집/회사)에서 어떤 AI 도구를 쓰든
이 문서의 규칙을 기준으로 작업한다.

## 세션 시작 시

1. `handoff.md`를 먼저 읽고 현재 상태와 다음 할 일을 파악한다 (7/17 삭제 예정 문서)
2. 범위·일정 판단이 필요하면 `portfolio_renewal_plan.md`(2주 실행판)를 기준으로 한다

## 프로젝트 컨텍스트

- 공고 마감 2026-07-20, **지원 목표 7/18**, 최종 검수 7/17
- 재직 병행 12일 프로젝트. 완성도보다 완결성 — 만든 것은 전부 끝까지 다듬는다

## 범위 규칙 (절대 준수)

- 페이지 5개 고정: Home / Design System / Case Studies(2개) / Projects / Career
- 컴포넌트는 아래만 만든다. 추가 금지:
  - Button, Input, Select, Badge, Table, Pagination + Skeleton, EmptyState, ErrorState
- 새 기능·페이지·컴포넌트가 필요해 보이면 **구현하지 말고** 기획서 11장 백로그에 추가만 한다
- 일정이 밀리면 기획서 10장 컷라인 순서로 범위를 줄인다. **기한 연장 제안 금지**
- 기존 깃헙 프로젝트(money_book, poke_dex_next, tmdb-ai-reco)는 README 보강만. 리팩토링 금지

## 기술 스택 · 컨벤션

- Next.js App Router + React + TypeScript + SCSS(BEM) + Vercel
- BEM 접두어: `l-`(layout) `p-`(page) `c-`(component) `ds-`(design system) `u-`(utility)
- 구조: `.block {}` `.block__element {}` `.block--modifier {}`
- 콘텐츠·문구는 `data/`로 분리한다. 컴포넌트에 하드코딩 금지
  (토스플레이스 특화 문구도 data로 — 다른 회사 지원 시 교체 가능해야 함)
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

## 세션 종료 시

- `handoff.md`의 "현재 상태 / 다음 할 일 / 블로커"를 갱신하고 커밋·푸시한다
- 커밋은 단계 단위로 의미 있게 나눈다 (배포 가능한 상태 유지)

## 이 문서 자체에 대해

이 파일은 삭제하지 않는다. "AI를 규칙 기반으로 활용한다"는 증빙으로 저장소에 남기며,
README에서 한 줄로 언급한다. handoff.md와 달리 영구 유지 대상이다.
