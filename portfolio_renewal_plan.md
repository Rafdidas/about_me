# 포트폴리오 리뉴얼 기획서 (2주 실행판)

## 0. 전제: 마감 역산

이 문서의 모든 판단 기준은 아래 제약이다.

```text
공고 마감      : 2026-07-20
오늘          : 2026-07-06
지원 목표일    : 2026-07-18 (마감 이틀 전 여유 확보)
실제 제작 기간 : 약 12일 (재직 병행, 퇴근 후·주말)
```

### 3가지 원칙

```text
1. 새로 만드는 것을 최소화하고, 이미 있는 것(깃헙 프로젝트, 경력)을 재활용한다.
   코드 증빙은 기존 깃헙 프로젝트가 담당하고, 포트폴리오는 그것을 정리해 보여주는 관문이다.

2. 완성도보다 완결성. 페이지 수를 줄이더라도 만든 것은 끝까지 다듬어 배포한다.
   절반쯤 만든 Admin Demo보다 완성된 Design System 한 페이지가 낫다.

3. 일정이 밀리면 기한을 미루지 않고 10장의 컷라인으로 범위를 줄인다.
```

---

## 1. 프로젝트 개요

기존 포트폴리오는 경력·프로젝트·기술 스택을 나열하는 개인 소개 사이트에 가까웠다. 리뉴얼 포트폴리오는 **퍼블리셔 경력을 기반으로 UI 품질, 공통 컴포넌트, 디자인 시스템 역량을 증명하는 사이트**로 재구축한다.

핵심 목적:

1. 퍼블리셔 경력의 강점인 UI 구현력, 반응형 대응, 브라우저 호환성 경험을 보여준다.
2. 디자인 시스템 경험을 색상, 타이포그래피, 컴포넌트, 상태 UI 기준으로 시각화한다.
3. 기존 깃헙 프로젝트(React/Next.js)를 큐레이션해 실제 코드 역량의 증빙으로 연결한다.
4. 토스플레이스 Design Platform Team / Frontend UX Engineer 포지션에 맞춰 사용성과 유지보수성을 함께 고민하는 사람임을 증명한다.

### 성공 기준

```text
산출물 : 2026-07-17까지 5페이지 배포 완료, 2026-07-18 지원
품질   : Lighthouse Performance/Accessibility 90 이상, 지원 브라우저에서 레이아웃 깨짐 0건
```

### 타겟 독자

| 독자 | 예상 열람 시간 | 대응 설계 |
| --- | --- | --- |
| 리크루터 (서류 스크리닝) | 30초~1분 | Home Hero + Strength Cards에서 완결 |
| 실무 면접관 (퍼블리셔/FE) | 5~15분 | Design System + 깃헙 프로젝트 코드 |
| 디자이너/PM 면접관 | 3~5분 | Case Studies |

```text
- 메일 링크로 모바일에서 처음 열릴 가능성이 높다. 모바일 첫 화면을 데스크톱과 동일 우선순위로 둔다.
- OG 태그(제목, 설명, 썸네일)는 필수. 링크 공유 시 첫인상이다.
```

---

## 2. 포지셔닝

### 리뉴얼 포지션

```text
사용성과 유지보수성을 함께 고려하는 UI Publisher
```

### 메인 메시지

```text
6년 이상 이커머스와 B2B 업무 시스템의 UI를 구축·운영하며, 반응형 화면 구현과 운영 이슈 대응, 공통 UI 개선, 디자인 시스템 고도화 경험을 쌓아온 퍼블리셔입니다.
```

### 보조 메시지

```text
단순한 화면 구현보다 사용자가 안정적으로 이해하고 사용할 수 있는 UI, 그리고 팀이 유지보수하기 쉬운 구조를 함께 고민합니다.
```

---

## 3. 기술 스택

```text
Framework: Next.js (App Router)
Library: React
Language: TypeScript
Styling: SCSS + BEM
Deployment: Vercel
Version Control: GitHub
콘텐츠: 정적 데이터(data/) 기반
```

### SCSS/BEM 규칙

```text
접두어  l-: layout / p-: page / c-: component / ds-: design system / u-: utility
구조    .block {} .block__element {} .block--modifier {}
```

```scss
.c-button {}
.c-button__icon {}
.c-button--primary {}
.c-button--loading {}

.p-home {}
.p-home__hero {}

.ds-token {}
.ds-token__name {}
.ds-token__preview {}
```

---

## 4. 사이트 구조

12일 안에 완성 가능한 5페이지로 확정한다. Admin UI Demo는 별도 섹션이 아니라 **Design System 페이지 안의 실전 예시 1화면**으로 축소한다.

```text
/
├─ Home
├─ Design System (Admin Table 실전 예시 포함)
├─ Case Studies (2개)
├─ Projects (기존 깃헙 프로젝트 큐레이션)
└─ Career
```

### 페이지 우선순위

```text
1. Design System  ← 이 포트폴리오의 존재 이유
2. Home
3. Case Studies
4. Projects
5. Career
```

---

# 5. 페이지별 기획

## 5-1. Home

### 목적

첫 화면에서 심사자가 30초 안에 이해하게 한다: **"퍼블리셔 경력이 있지만, 단순 마크업이 아니라 UI 품질과 공통 UI 구조를 고민하는 사람이다."**

### 구성

```text
Hero
Strength Cards (3개)
Featured: Design System 미리보기
Featured: 대표 프로젝트 2~3개 카드
CTA (Design System 보기 / GitHub 보기)
하단: 간단 소개 + 연락처 (About 페이지 대체)
```

### Hero 문구

```text
화면을 구현하는 데서 끝나지 않고,
반복되는 UI를 정리합니다.
```

### Strength Cards

```text
1. UI Implementation — 반응형, 브라우저 호환성, 인터랙션을 고려한 화면 구현
2. Design System — 색상 변수, 타이포그래피, 공통 컴포넌트 기준 정리
3. B2B Admin UI — 목록, 조회, 테이블, 상태 처리 등 업무 화면 구현
```

AI 활용은 별도 카드·페이지로 만들지 않고, Case Study나 프로젝트 설명 안에서 "AI 초안 생성 후 직접 검증" 한 줄로만 언급한다.

---

## 5-2. Design System

### 목적

가장 중요한 페이지. 공통 UI를 규칙으로 이해하고, 컴포넌트 상태를 꼼꼼히 본다는 것을 증명한다.

### 구성

```text
Overview
Design Tokens (Color / Typography / Spacing / Radius)
Components (6종 + 상태 3종)
Admin Table 실전 예시
Accessibility Notes
```

### Overview 문구

```text
반복되는 UI를 빠르게 구현하기 위해서는 컴포넌트보다 먼저 기준이 필요합니다. 색상, 타이포그래피, 간격, 상태 표현, 접근성 기본 규칙을 정리하고, 이를 바탕으로 재사용 가능한 UI 컴포넌트를 구성했습니다.
```

### CSS 변수 예시

```scss
:root {
  --color-primary: #2563eb;
  --color-danger: #dc2626;
  --color-surface: #ffffff;
  --color-surface-muted: #f8fafc;
  --color-border: #e5e7eb;

  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 20px;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
}
```

### 컴포넌트 (축소 확정)

```text
Button      variants: primary/secondary/danger, states: default/hover/disabled/loading
Input       states: default/focus/error/disabled, label·에러 메시지 연결
Select
Badge       상태 표현용 (텍스트 + 색상, 색상만으로 의미 전달 금지)
Table       정렬, 상태 배지, 페이지네이션 포함
Pagination

상태 컴포넌트: Loading(Skeleton) / EmptyState / ErrorState
```

Modal, Toast, Tabs, Checkbox, Radio 등은 만들지 않는다(11장 백로그). 6종을 깊게 만드는 것이 12종을 얕게 만드는 것보다 증명력이 높다.

### 표기 형식 (컴포넌트당)

```text
1. 설명 + 사용 상황
2. Variant / State — 컨트롤로 직접 전환해 볼 수 있게 (스크린샷 금지, 실제 렌더링)
3. 접근성 고려
4. 코드 예시 (복사 가능)
```

### Admin Table 실전 예시

토스플레이스 연결점. 별도 데모 사이트 대신, 컴포넌트를 조합한 실전 화면 1개를 Design System 페이지 하단(또는 하위 라우트)에 배치한다.

```text
가상 도메인: 매장·결제 단말기 목록
구성: 검색/상태 필터 + Table + 상태 Badge + Pagination

동작 범위:
- 필터·정렬·페이지네이션은 mock 데이터 기준 클라이언트에서 실제 계산
- 화면 상단에 loading / empty / error 상태 토글 → 면접관이 직접 전환해 확인
- 저장·로그인 등 실제 기능 없음
```

이 한 화면으로 "B2B 업무 화면 + 상태 처리 + 컴포넌트 조합"을 동시에 증명한다.

---

## 5-3. Case Studies

### 목적

경력기술서 내용을 문제 해결 과정으로 보여준다. **2개만** 작성한다.

```text
1. WeSeed Design System 고도화
2. B2B 업무 시스템 공통 UI 구조 구현
```

이커머스 운영, AI 워크플로우 Case는 백로그(11장). 필요 시 Career 페이지의 업무 요약 한 줄로 대체한다.

### 공통 형식

```text
Context → Problem → Role → Action → Result → What I Learned
```

### Result 작성 원칙

```text
- 세어서 확인 가능한 규모(적용 화면 수, 통합한 변수 개수 등)를 함께 적는다
- 전후 비교 형태: "화면마다 다르던 버튼 스타일 N종 → 공통 컴포넌트 1종"
- 숫자를 확보할 수 없으면 억지로 만들지 말고, 개선 판단의 근거를 적는다
```

### 콘텐츠 공개 범위

```text
- 스크린샷·실 데이터는 공개 가능 여부를 확인한 것만 사용, 불가하면 텍스트 + 재구성 예시로 대체
- 사내 기밀 수치(매출, 고객 수 등)는 사용하지 않는다
```

### Case 1. WeSeed Design System 고도화

- **Context**: CRM 화면이 확장되면서 색상, 타이포그래피, 모바일 스타일, 공통 컴포넌트의 일관성 관리가 필요했다.
- **Problem**: 화면별로 스타일 적용 방식이 달라 유지보수 시 수정 범위가 커질 수 있었고, 동일한 UI 요소가 화면마다 다르게 표현될 위험이 있었다.
- **Role**: 색상 변수, 타이포그래피, 모바일 스타일, 공통 컴포넌트 적용 과정에 참여했다.
- **Action**: 흩어져 있던 색상·타이포그래피 기준을 정리하고, 버튼·인풋·셀렉트·알림·배지 등 반복 UI 요소를 디자인 시스템 기준에 맞춰 적용했다.
- **Result**: 화면별 UI 편차를 줄이고, 반복 UI 요소를 공통 기준으로 관리할 수 있는 기반을 마련했다. (작성 시 규모 수치 보강)
- **Learned**: 디자인 시스템은 시각 요소 통일이 아니라, 팀이 같은 기준으로 화면을 만들 수 있게 돕는 구조다.

### Case 2. B2B 업무 시스템 공통 UI 구조

- **Context**: 레미콘 스마트 관리 플랫폼 구축에서 로그인, GNB, LNB, 목록, 조회, 테이블, 페이지네이션 등 반복 화면 구조가 필요했다.
- **Problem**: 데이터 중심 업무 화면은 단순 배치보다 스크롤 영역, 사이드 영역, 페이지네이션, 상태 표시 기준을 함께 맞춰야 했다.
- **Role**: Next.js, React 기반 프로젝트에서 주요 시스템 UI 구조와 PC·모바일 화면 퍼블리싱을 담당했다.
- **Action**: 반복 사용되는 시스템 UI 구조를 구현하고 화면별 재사용성을 고려해 정리했다.
- **Result**: 후속 업무 화면에서 활용할 수 있는 공통 UI 기반을 마련하고, 데이터 중심 화면의 사용성과 일관성을 개선했다. (작성 시 규모 수치 보강)
- **Learned**: 업무 시스템 UI는 화면 하나를 잘 만드는 것보다, 같은 구조를 여러 화면에서 안정적으로 반복할 수 있게 만드는 것이 중요하다.

---

## 5-4. Projects (기존 깃헙 프로젝트 큐레이션)

### 목적

새로 만드는 페이지가 아니라 **이미 있는 작업물을 추려서 정리하는 페이지**다. 코드 역량의 실제 증빙은 여기(깃헙)가 담당한다.

### 선정 결과 (2026-07-06 확정)

선정 기준: ① React/Next.js/TypeScript 사용 ② UI 품질(상태 처리, 반응형) ③ README 품질

```text
✅ money_book     — TS+SCSS, Supabase(RLS), 실도메인 배포(monibuk.com), 문제-해결형 README
✅ poke_dex_next  — Next.js 15 App Router, React 19, React Query, Zustand. UI 품질 포인트가 구체적
✅ tmdb-ai-reco   — AI 응답을 JSON Schema로 통제하고 TMDB 데이터로 재검증하는 구조.
                    "AI를 검증하며 쓴다"는 메시지의 실증 사례로 활용
❌ shop-prive     — 제외. Next 아님(CRA+Redux), 마지막 커밋 2025-01, README 구식·오탈자.
                    이커머스 역량은 실무 경력(Case Study·Career)으로 이미 증명됨
```

선정된 3개는 README가 이미 정리되어 있으므로 배포 링크 확인, 오탈자, 스크린샷 정도만 점검한다. **전체 리팩토링 금지.**

### 카드 형식

```text
Summary (한 줄)
UI/UX Point (2~3개)
Tech Point (2~3개)
Links (Demo / GitHub)
```

---

## 5-5. Career

### 목적

리크루터가 연차, 소속, 담당 업무를 1분 안에 확인하게 한다. 저비용으로 만든다.

### 구성

```text
- 타임라인 (회사, 재직 기간, 역할 한 줄 요약)
- 회사별 주요 업무 3~5개 (Case Study가 있는 항목은 링크)
- 기술 스택 요약
```

경력기술서 전체를 옮기지 않는다. 상세는 Case Studies로 위임한다. (PDF 다운로드는 범위 제외 확정 — 리크루터는 이력서를 이미 갖고 있다)

### 배포 리뷰 반영 방침 (2026-07-06, 심사자 관점)

**"Career가 부각되지 않아도 되는가" → 된다. 단 조건이 있다.**

Design System을 전면에 두는 구조는 포지셔닝상 맞다. Career는 "눈에 띄는 페이지"가 아니라 **"리크루터가 찾아 들어왔을 때 1분 안에 완결되는 페이지"**면 충분하다. 현재 배포본은 그 조건에서 아래가 미달이다.

```text
1. Career ↔ Case Studies 상호 링크 없음
   → 소프트자이온 업무에 Case 1 링크, 건설 SI 업무에 Case 2 링크. 깊이가 필요한
     심사자를 Career에서 Case로 흘려보내는 동선이 끊겨 있으면 Career 축소 전략이 실패한다.

2. 위사 5년(2019.10~2024.11)이 한 줄 요약 수준
   → 6년 경력의 5/6이 비어 보이면 "경력 대부분이 설명 불가"로 읽힌다.
     회사별 주요 업무 3~5개 원칙을 위사에도 적용한다 (구축·리뉴얼·운영 건수 등 셀 수 있는 규모 포함).

3. 직급(주임) 표기 → 역할 중심으로
   → 직급은 정보 가치가 없고 연차 대비 해석 여지만 만든다. "퍼블리셔 / UI 퍼블리싱·디자인 시스템" 형태로.

4. 경력 공백(2024.11~2025.09)이 타임라인에 그대로 노출됨
   → 사이트에서 해명하지 않는다(과잉 방어가 더 나쁘다). 다만 그 기간의 사실 기반 활동
     (개인 프로젝트, 학습)이 있으면 타임라인에 항목으로 추가하는 것은 가능.
     면접 답변은 별도로 준비한다.
```

---

# 6. 폴더 구조

```text
src/
  app/
    page.tsx                  # Home
    design-system/page.tsx
    case-studies/page.tsx
    projects/page.tsx
    career/page.tsx

  components/
    common/                   # Button, Input, Select, Badge, Table, Pagination,
                              # Skeleton, EmptyState, ErrorState
    layout/                   # Header, Footer, Container, Section
    design-system/            # TokenCard, ComponentPreview, StateGrid
    admin-example/            # FilterBar, StatusBadge (Table 실전 예시용)

  data/
    career.ts
    projects.ts
    caseStudies.ts
    designTokens.ts
    adminMock.ts

  styles/
    abstracts/  _variables.scss  _mixins.scss
    base/       _reset.scss  _typography.scss  _global.scss
    main.scss
```

콘텐츠는 컴포넌트에 하드코딩하지 않고 data/로 분리한다. 토스플레이스 특화 문구(Admin 예시 도메인 등)도 data로 분리해, 다른 회사 지원 시 교체 가능하게 한다.

---

# 7. UI 톤앤매너

문서형 + 제품형. 차분하고 명확하게, B2B 업무 시스템 느낌.

```text
컬러       Base #ffffff / Surface #f8fafc / Text #0f172a / Muted #64748b
          Border #e2e8f0 / Primary #2563eb 계열 / Success #16a34a / Warning #f59e0b / Danger #dc2626
Typography Pretendard, Title 40~56px, Section 28~36px, Body 15~17px, line-height 1.5~1.7
Layout     Max width 1120~1200px, Section spacing 96px, Card radius 16~24px
반응형     Mobile 360~767 / Tablet 768~1023 / Desktop 1024+ (모바일 1열, 태블릿 2열, 데스크톱 3열)
          테이블은 모바일에서 카드형 리스트로 전환
```

### 지원 브라우저

```text
Chrome / Edge 최신 2개 버전, Safari 최신 2개 버전(macOS·iOS), Samsung Internet 최신
```

---

# 8. 접근성 · 품질 기준

```text
button은 button 태그 사용
input은 label과 연결, 에러 메시지는 aria-describedby
focus-visible 스타일 제공
상태 배지는 색상 + 텍스트
키보드로 주요 인터랙션 접근 가능
이미지 alt 제공
```

```text
검증: axe DevTools(또는 Lighthouse Accessibility) + 키보드만으로 전체 탐색 1회
성능: Lighthouse 90+, next/image, next/font, client component 최소화
측정: Vercel Analytics, OG 태그(제목·설명·썸네일), 파비콘, meta description
```

---

# 9. 12일 일정 (7/6 ~ 7/18)

매일 배포 가능한 상태를 유지한다. 1단계 완료 즉시 Vercel에 올리고 이후 계속 갱신한다.

```text
7/6 ~ 7/7   (2일) 세팅: Next.js + TS + SCSS 구조, 디자인 토큰, 기본 레이아웃, Vercel 배포
7/8 ~ 7/10  (3일) 공통 컴포넌트 6종 + 상태 3종
7/11 ~ 7/12 (2일) Design System 페이지 (토큰, 컴포넌트 문서, 접근성 노트)
7/13        (1일) Admin Table 실전 예시 (필터 + 테이블 + 상태 토글)
7/14 ~ 7/15 (2일) Case Studies 2개 + Career + Projects 큐레이션(README 점검 포함)
7/16        (1일) Home 완성, OG 태그, README
7/17        (1일) 최종 검수: 반응형, 브라우저, 접근성, Lighthouse, 오탈자, 링크, 제3자 5분 리뷰
            + handoff.md 삭제 (아래 작업 운영 참고)
7/18        지원 제출
```

## 작업 운영 (집 ↔ 회사 병행)

```text
handoff.md  : 작업 전환용 인수인계 문서. 세션 종료 시 갱신 → 커밋·푸시, 시작 시 먼저 읽는다.
              개발 중 임시 산출물이므로 7/17 최종 검수 때 삭제한다.
              (제출 시점의 저장소 문서도 심사 대상이며, 남길 가치가 있는 결정 사항은
              삭제 전에 README로 옮긴다)

CLAUDE.md   : AI 에이전트 작업 가이드. 범위 규칙, 컨벤션, 완료 기준을 담아
              어느 환경(집/회사)에서든 AI가 같은 기준으로 작업하게 한다.
              이 파일은 삭제하지 않는다 — "AI를 규칙 기반으로 활용한다"는 증빙으로
              저장소에 남기고 README에서 한 줄로 언급한다.
```

---

# 10. 컷라인 (일정 지연 시 제거 순서)

하루 이상 밀리면 아래 순서대로 즉시 잘라낸다. 기한은 절대 미루지 않는다.

```text
1. Admin Table 실전 예시 → Design System의 Table 컴포넌트 문서로 대체
2. Case Study 2개 → 1개 (WeSeed Design System)
3. Career 페이지 → PDF 이력서 링크만
4. Design System 컴포넌트 6종 → 4종 (Button, Input, Badge, Table)
```

어떤 경우에도 지키는 것: **Design System 페이지, 상태 처리(loading/empty/error), 모바일 화면, 7/18 지원.**

---

# 11. 백로그 (지원 후 고도화)

지금은 만들지 않는다. 지원 후 면접 준비 기간에 여유가 있으면 추가한다.

```text
Admin UI Demo 확장 (Dashboard, Device Detail, Issue Modal)
AI Workflow 페이지 (검증 체크리스트 문서화)
Case Study 3 (이커머스 운영), Case 4 (AI 워크플로우)
Modal, Toast, Tabs, Checkbox, Radio 컴포넌트
About 페이지, Storybook, 다크모드, Motion 고도화
```

---

# 12. 최종 체크리스트

## 콘텐츠

```text
30초 안에 "상태와 구조를 고민하는 퍼블리셔"가 전달되는가
Design System 경험이 과장 없이 구체적으로 보이는가
Case Study에 문제-해결-성과 구조가 있고, Result에 셀 수 있는 규모가 1개 이상 있는가
선정한 깃헙 프로젝트의 README가 정리되어 있는가
Projects 카드에 GitHub + 배포 데모 링크가 모두 있는가 (배포가 있는 프로젝트는 필수)
Career에서 Case Studies로 이동하는 링크가 있는가
title·OG에 이름이 들어가고 og:image 썸네일이 있는가
연락 수단이 실제로 동작하는가 (mailto에 주소가 있는가, 화면에 이메일 텍스트가 보이는가)
도메인 용어·고유명사 오탈자 확인 (심사자 중 도메인을 아는 사람이 있다)
```

## UI

```text
모바일 첫 화면이 완성되어 있는가 (심사자의 첫 진입 경로)
컴포넌트 상태가 default/hover/disabled/loading/error로 구분되는가
focus-visible이 보이고, 상태 배지가 색상만으로 의미를 전달하지 않는가
테이블이 모바일에서 카드형으로 전환되는가
```

## 코드

```text
컴포넌트가 재사용 가능한 단위로 분리되어 있는가
SCSS가 BEM 규칙을 따르는가
데이터가 data/로 분리되어 있는가
README가 포트폴리오의 목적과 구조를 설명하는가
```

---

# 13. 결론

12일이라는 제약에서 증명 포인트는 3개로 압축한다.

```text
1. 디자인 시스템을 색상/타이포/상태/사용 규칙으로 이해하고 있는가 → Design System 페이지
2. 로딩·빈 상태·에러 상태를 고려하는가 → 컴포넌트 상태 문서 + Admin Table 예시
3. 실제 코드를 쓸 수 있는가 → 큐레이션된 깃헙 프로젝트
```

많이 만드는 것이 아니라, 만든 것이 전부 완성되어 있는 상태로 7/18에 지원하는 것이 이 프로젝트의 성공이다.
