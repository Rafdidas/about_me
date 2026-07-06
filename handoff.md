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

- **마지막 갱신**: 2026-07-06
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

## 다음 할 일

> 7/6 2차 심사자 리뷰(라이브 재검증)에서 P1·P2 전 항목 반영 확인 완료.
> 아래는 2차 리뷰에서 새로 발견된 항목 + 남은 QA.

### P1 — 완료

1. 푸터 mailto 링크 이메일 설정 및 화면 노출 완료: yhu930421@naver.com

### P2 — 결정 완료

2. Case 2의 "단설관리" 표기 → "타설관리"로 수정 완료
3. Career의 "기존 포트폴리오" 외부 링크 제거 완료
4. Home Featured Projects 카드에도 Demo 링크 노출 완료
5. Demo / GitHub 외부 링크 새 창 열기 적용 완료
6. Home 오른쪽 Hero 카드 목적 재정의 완료 — 구현 범위와 확인 가능한 산출물을 보여주는 증거 패널

### P3 — QA

1. Design System의 variant/state 전환과 Admin Table 상태 토글이 실제 인터랙션으로 동작하는지 브라우저에서 확인 (기획 기준: 정적 나열 금지) — 마크업에 토글 버튼 존재는 확인됨
2. 모바일/데스크톱 렌더링 QA 및 Lighthouse 확인
3. Design System 코드 예시·접근성 설명 다듬기

## 블로커 / 확인 필요

- 없음

## 결정 기록 (뒤집을 때만 수정)

- 2026-07-06: 9주 원안 → 12일 실행판으로 축소. 5페이지, 컴포넌트 6종 + 상태 3종
- 2026-07-06: Admin UI Demo → Design System 내 "Admin Table 실전 예시" 1화면으로 축소
- 2026-07-06: shop-prive 제외 (CRA·구식 README·1.5년 전 커밋, 이커머스는 실무 경력으로 증명)
- 2026-07-06: CLAUDE.md는 AI 활용 증빙으로 저장소에 영구 유지, handoff.md는 7/17 삭제
- 2026-07-06: PDF 이력서 다운로드는 포트폴리오 범위에서 제외
- 2026-07-06: Career는 부각하지 않는 구조 유지 — 대신 "찾아 들어오면 1분 안에 완결" 기준으로 보강 (Case 링크·위사 업무 구체화·역할 중심 표기). 경력 공백(2024.11~2025.09)은 사이트에서 해명하지 않고 면접 답변으로 준비

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
