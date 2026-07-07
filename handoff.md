# HANDOFF — 작업 인수인계 문서

> 집 ↔ 회사 작업 전환 시 컨텍스트 복원용 **임시 문서**.
> ⚠️ **이 문서는 2026-07-17 최종 검수일에 삭제한다.** (하단 폐기 규칙 참고)

## 사용 규칙

```text
작업 종료 시 : "현재 상태 / 다음 할 일 / 블로커"를 갱신하고 커밋·푸시한다
작업 시작 시 : 이 문서를 먼저 읽는다. AI 에이전트에게도 이 문서를 먼저 읽힌다
문서 성격    : 로그가 아니라 스냅샷. 끝난 항목은 지우고 최신 상태만 유지한다
```

---

## 현재 상태

- **마지막 갱신**: 2026-07-07
- **진행 단계**: Next.js 프로젝트 생성 및 5개 고정 페이지 1차 골격 완료
- App Router + TypeScript + SCSS 구조 생성
- Pretendard local font 연결, 디자인 토큰/기본 레이아웃/Header/Footer 구성
- Home / Design System / Case Studies / Projects / Career 라우트 생성
- Design System 페이지에 6개 컴포넌트 + 상태 컴포넌트 3종 + Admin Table 예시 1차 구현
- Admin Table 필터·정렬·페이지네이션 순수 로직 테스트 추가
- DESIGN.md는 원본 Toss 흔적이 드러나지 않도록 포트폴리오용 중립 B2B UI 톤으로 해석해 적용
- GitHub 기본 브랜치 main 사용. 원격 master 삭제 완료
- 첨부 이력 내용을 바탕으로 Career / Case Studies / Home / Projects 데이터 1차 보강
- Vercel 첫 배포 완료: https://about-me-iota-blond.vercel.app/
- PDF 이력서 다운로드는 범위에서 제외하기로 결정
- 7/6 배포본 심사자 관점 리뷰 완료 → 아래 "다음 할 일"에 반영 (상세: 기획서 5-5 배포 리뷰 반영 방침)
- Projects 카드에 poke_dex_next / tmdb-ai-reco 배포 데모 링크 추가
- title·OG title에 이름 반영, 코드 기반 OG 이미지 추가
- Career → Case Studies 링크 연결 및 Case Studies 앵커 추가
- Case Study Result에 셀 수 있는 규모 보강, Career 직급 표기를 역할 중심으로 변경
- 위사 경력 설명을 구축·운영 규모가 보이도록 보강
- Footer 이메일 설정 및 화면 노출 완료: yhu930421@naver.com
- Case 2 도메인 용어 "단설관리" → "타설관리" 수정
- Career의 기존 포트폴리오 외부 링크 제거
- Home Featured Projects 카드에 Demo 링크 노출
- Demo / GitHub 외부 링크는 새 창에서 열리도록 공통 링크 헬퍼 적용
- Home 오른쪽 Hero 카드는 "이 포트폴리오에서 확인할 수 있는 것" 증거 패널로 재정의
- DESIGN.md는 로컬 백업 후 공개 저장소에서 제거, .gitignore에 추가
- Home Hero 제목 개행 반영 및 증거 패널 row를 관련 페이지/섹션 링크로 연결
- Design System Overview/Admin Table에 실무 B2B 화면 기준의 재구성 브릿지 문구 추가
- Home에 Case Studies 진입점 추가
- Projects 카드 대표 스크린샷 3장 추가 완료 (Home Featured Projects / Projects 페이지 공통 데이터 사용)
- 제공된 `Portfolio.dc.html` 디자인 기준으로 전체 5페이지 시각 스타일 이식 완료
  - Header/Footer, Home Hero, Section label, 카드/토큰/프로젝트 썸네일, Case/Career/Page Header 스타일을 원본 톤으로 재정렬
  - 원본 `.thumbnail`과 Home 데스크톱 구현 화면을 직접 비교 확인
- **전체 페이지 문구 정리본 반영 완료** (Home/DS/Case/Projects/Career/Admin 예시):
  - 톤 기준 적용: "운영해본"·"실제 렌더링"·"새 리팩토링" 등 방어적 표현 제거, "React·Next.js" 표기 통일
  - Home 히어로 CTA 3개(DS/Case/GitHub)로 확장, 증거 패널을 "보여주고 싶은 것"으로 재정의(배지 제거)
  - 하드코딩돼 있던 섹션 설명 문구를 전부 data/로 이동
  - 고유명사 교정: 대현인사이드·크레디아·탠디몰, Skills에 TypeScript 추가
  - 정리본에서 조정한 것: Case 2 Result에 "7개" 수치 유지(기획서 Result 원칙·테스트),
    위사 신규 구축에 "10여 개 브랜드" 규모 유지, Career→Case 링크 유지
- 7/7 배포본 + 코드 전체 리뷰 진행 → 보완 항목 파악, P1·P2·P4 수정·검증·**커밋 완료**.
  `.claude/launch.json` 신규 생성(dev 서버 프리뷰용, autoPort) — 향후 세션에서도 재사용 가능
  - P1: `npm test` 실패 수정(`designSystemOverview.description`에 "실무"·"재구성" 문구 복원), 파비콘 추가
  - P2: Home 히어로 h1을 `homeHero.titleLines`(세그먼트 배열) 기반으로 통일, 케이스 카테고리·페이지 eyebrow data 이동,
    AdminTableExample 중복 문구 통합, 미사용 `thumb*`/`.p-project-thumb`/`@fontsource/pretendard` 제거
  - P4: 증거 패널 낡은 `aria-label` 제거, `Skeleton`에 `role="status"`, 서브페이지 `metadata.title` 추가,
    DS Pagination 예시를 `PaginationDemo`(client)로 교체해 실제 클릭 동작하도록 수정
- **P3 완료 (SCSS 병합 패스, 커밋 완료)**: `main.scss` 1,625줄 → 1,412줄. 2개 커밋으로 분리.
  - 42개 중복 선택자(`.l-header`/`.c-button`/`.c-table`/`.ds-token-grid`/`.p-home__hero` 등)를 각각 단일 규칙으로 병합.
    원본/병합본을 컴파일해 선택자·미디어스코프별 최종 유효 속성을 전수 비교하는 스크립트로 검증(캐스케이드 100% 동일 확인).
    이 과정에서 "첫 발생 위치에 병합" 방식이 사이에 다른 규칙이 끼어있으면 순서를 깨는 버그 2건을 발견해
    "마지막 발생 위치에 병합" 방식으로 교정
  - 모바일 미디어쿼리 2벌(767px/768px) → 같은 767px로 통일. 단, 물리적으로 한 블록에 합치면 그 사이 무조건부
    규칙과의 캐스케이드 순서가 깨지는 회귀를 브라우저 검증 중 발견(`.l-header__brand-copy`가 모바일에서 안 숨겨짐) →
    두 블록은 원래 위치 유지, 두 번째 블록의 조건문(768→767)만 치환하는 방식으로 안전하게 수정.
    **알려진 의도적 동작 변화**: 기존 767/768 어긋남으로 정확히 뷰포트 768px에서 모바일 오버라이드가 일부만
    적용되던 게, 통일 후 768px에서 완전한 데스크톱 레이아웃으로 렌더링됨(일관성 있는 동작이 되어 사실상 개선)
  - 반복 raw hex 토큰화: 신규 `--color-border-card`/`--color-hairline`/`--color-text-secondary` 추가 +
    기존 토큰과 값이 일치하는 raw hex 재사용 치환. 전부 기존 값 그대로라 렌더링 변화 없음(픽셀 단위 확인)
- **P5 QA 완료**:
  - Admin Table 검색·상태 필터·정렬(asc/desc)·페이지네이션·loading/empty/error 토글 전부 브라우저에서 실제
    DOM 인터랙션으로 재확인(마크업 존재 확인 수준이 아니라 클릭·입력 이벤트 발생 후 실제 반영 확인)
  - Lighthouse를 로컬 프로덕션 서버에 직접 실행(개발 서버는 성능 점수가 왜곡되어 미참고).
    발견 후 **수정·재검사까지 완료·커밋**: 헤더 브랜드 링크 aria-label이 화면 텍스트를 가리던 문제,
    히어로 증거 패널 제목이 h1→h3로 heading-order를 건너뛰던 문제, Home 프로젝트 카드 "자세히 보기" 링크
    3개가 서로 다른 프로젝트인데 텍스트가 동일하던 문제(link-text) — 접근성 98→100, SEO 82→91.
    SEO의 meta-description 미검출은 curl로 태그가 실제로는 정상 렌더링됨을 확인한 dev/스트리밍 관련
    false positive로 판단(프로덕션 배포본엔 영향 없음)
- **git 히스토리 정리 진행 중** (사용자 확인 후 시작): `filter-branch`로 커밋 메시지 5건(모호했던 영어/일반화 메시지)을
  구체적인 한국어로 reword + DESIGN.md를 전체 히스토리에서 제거. 진행 상황은 아래 "다음 할 일" 참고

## 다음 할 일

### P0 — git 히스토리 재작성 마무리 (진행 중)

1. `filter-branch`로 메시지 reword + DESIGN.md 히스토리 제거 실행 → 결과 확인(로그·DESIGN.md 부재·빌드) → force push
2. force push 후 원격이 재작성된 히스토리로 정상 갱신됐는지, Vercel 배포가 깨지지 않는지 확인

### P1 — 향후 계속 유지

3. Design System 코드 예시·접근성 설명 다듬기 (여유 있을 때, 우선순위 낮음)
4. 이후 커밋부터 CLAUDE.md/AGENTS.md의 "커밋 규칙" 계속 적용 (작은 커밋, 구체적 메시지, AI 트레일러 금지)

## 블로커 / 확인 필요

- 현재 작업 진행상 즉시 막는 블로커 없음.

## 결정 기록 (뒤집을 때만 수정)

- 2026-07-06: 9주 원안 → 12일 실행판으로 축소. 5페이지, 컴포넌트 6종 + 상태 3종
- 2026-07-06: Admin UI Demo → Design System 내 "Admin Table 실전 예시" 1화면으로 축소
- 2026-07-06: shop-prive 제외 (CRA·구식 README·1.5년 전 커밋, 이커머스는 실무 경력으로 증명)
- 2026-07-06: CLAUDE.md는 AI 활용 증빙으로 저장소에 영구 유지, handoff.md는 7/17 삭제
- 2026-07-06: PDF 이력서 다운로드는 포트폴리오 범위에서 제외
- 2026-07-06: Career는 부각하지 않는 구조 유지 — 대신 "찾아 들어오면 1분 안에 완결" 기준으로 보강 (Case 링크·위사 업무 구체화·역할 중심 표기). 경력 공백(2024.11~2025.09)은 사이트에서 해명하지 않고 면접 답변으로 준비
- 2026-07-06: **토스플레이스 전용 → 디폴트 포트폴리오로 전환.** 사이트에 특정 회사 언급 금지, 지원처 대응은 data 문구 교체로만. README/CLAUDE.md/AGENTS.md/기획서 갱신 완료
- 2026-07-06: DESIGN.md(토스 디자인 분석 원문)는 공개 저장소에서 제거하기로 결정 (로컬 보관)
- 2026-07-06: Projects 카드에 대표 스크린샷 1장씩 추가하기로 결정
- 2026-07-06: 커밋 규칙 신설 (CLAUDE.md/AGENTS.md) — 작은 커밋, 구체적 메시지, AI 트레일러 금지. 기존 6개 커밋은 rebase reword 권장
- 2026-07-06: **DS 주력 + Case/Career 후순위 구성 재검토 후 유지 확정.** 근거: 실무 산출물이 전부 비공개라 보여줄 실물은 DS뿐이며, DS(증거)→Case(맥락)→Career(사실) 순서가 심사 동선과 일치. 단 두 조건 필수 — ① DS에 실무 연결 브릿지 문구 ② Home에 Case 진입점 (P2-7·8)

---

## 폐기 규칙 (7/17)

이 파일은 최종 검수일(7/17)에 삭제하고 커밋한다.

```text
이유:
- 인수인계 문서는 개발 중 임시 산출물이다. 제출 시점 저장소의 문서(README 등)도
  심사 대상이므로, 작업 메모가 완성본에 남아 있으면 문서 관리가 안 되는 인상을 준다.
- 남길 가치가 있는 내용(결정 기록)은 삭제 전에 README 또는 기획서로 옮긴다.

절차:
1. 결정 기록 중 저장소에 남길 항목을 README로 이관
2. handoff.md 삭제 → "chore: remove handoff doc" 커밋
```
