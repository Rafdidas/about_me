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
