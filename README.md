# 박현규 — UI Publisher Portfolio

퍼블리셔 경력을 기반으로 UI 구현 품질, 공통 컴포넌트, 디자인 시스템 이해도를 보여주는 포트폴리오입니다.

- 배포: https://about-me-iota-blond.vercel.app/

## 무엇을 보여주는가

- 색상·타이포그래피·간격을 디자인 토큰으로 정리하고, 이를 적용한 공통 컴포넌트 6종 + 상태 UI 3종
- 컴포넌트를 조합한 B2B Admin Table 실전 예시 — 필터, 정렬, 페이지네이션, loading/empty/error 상태 전환
- 실무 경험을 문제-해결 구조로 정리한 Case Studies
- 실서비스로 배포 중인 개인 프로젝트 (money_book, poke_dex_next, tmdb-ai-reco)

## Pages

- Home
- Design System (Admin Table 실전 예시 포함)
- Case Studies
- Projects
- Career

## Stack

- Next.js App Router / React / TypeScript
- SCSS + BEM (`l-` `p-` `c-` `ds-` `u-` 접두어)
- 콘텐츠·문구는 `src/data/`로 분리 (컴포넌트 하드코딩 없음)
- Vercel

## 품질 기준

- 접근성: `button` 태그 사용, label 연결, `focus-visible`, 상태 배지는 색상 + 텍스트 병기
- 반응형: 360px~, 테이블은 모바일에서 카드형 전환
- 상태 UI: 데이터를 다루는 화면은 loading / empty / error를 기본으로 구현
- 지원 브라우저: Chrome · Edge · Safari 최신 2개 버전, Samsung Internet 최신

## AI 활용 방식

AI는 초안을 빠르게 만드는 도구로 사용하고, 결과물은 디자인 토큰·BEM 규칙·반응형·접근성 기준으로 직접 검증합니다. 에이전트 작업 규칙은 `CLAUDE.md`·`AGENTS.md`에 문서화되어 있습니다.

## Scripts

```bash
npm run dev
npm run lint
npm test
npm run build
```
