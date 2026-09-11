# 박현규 — UI Publisher Portfolio

이 저장소는 이커머스와 B2B 업무 시스템에서 쌓은 UI 구축·운영 경험, 그리고 AI를 활용해 개발·운영하는 개인 프로젝트를 소개하는 포트폴리오입니다.

- 배포: <https://about-me-iota-blond.vercel.app/>
- 직무: UI Publisher

## 포트폴리오에서 보여주는 것

| 페이지 | 확인할 수 있는 내용 |
| --- | --- |
| Home | UI 구축·운영 경력과 AI 활용 개인 프로젝트의 탐색 경로 |
| Case Studies | 실제 업무에서 맡은 범위와 구현한 UI 작업 |
| Design System | 컴포넌트 상태와 테이블 흐름을 확인하는 포트폴리오용 예시 |
| Projects | 모니북을 포함한 개인 프로젝트의 사용 흐름과 개발 경험 |
| Career | 이커머스와 B2B 업무 시스템의 경력 이력 |

## 공개 범위

실제 업무 화면과 내부 자료는 공개하지 않습니다. Case Studies는 실제 수행한 업무의 배경·담당 범위·구현 내용을 정리합니다.

Design System과 Admin Table은 가상 데이터를 사용하는 포트폴리오용 예시입니다. 실제 회사 화면, 내부 소스 코드, 내부 데이터를 재현하거나 공개한 자료가 아닙니다.

## 모니북

[모니북](https://monibuk.com)은 AI를 활용해 개발하고 실제 운영하는 개인 가계부 서비스입니다. `AI 활용 개발`은 제작 방식이며, 서비스 내부에 AI 기능이 있다는 뜻으로 사용하지 않습니다.

## 구현 원칙

- Next.js App Router의 Server Component를 기본으로 사용하고, Admin Table처럼 브라우저 상호작용이 필요한 영역만 Client Component로 구현합니다.
- 문구와 포트폴리오 데이터는 `src/data/`에 분리하고 페이지 컴포넌트는 이를 렌더링합니다.
- 검색·필터·정렬·페이지네이션은 `src/lib/adminTable.ts`의 순수 함수로 처리하고 테스트합니다.
- SCSS는 BEM 접두어(`l-`, `p-`, `c-`, `ds-`, `u-`)를 사용합니다.
- 접근성을 위해 기본 HTML 요소, 연결된 label, `focus-visible`, 텍스트가 있는 상태 배지를 사용합니다.

## 로컬 실행과 검증

```bash
npm install
npm run dev
npm run lint
npm test
npm run build
```

`npm run dev` 실행 후 Home의 `AI 활용 프로젝트 보기`가 `/projects#money-book`으로 이동하는지, Design System의 Admin Table에서 검색·필터·정렬·페이지 이동·상태 전환이 동작하는지 확인합니다.
