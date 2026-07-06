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
- DESIGN.md는 로컬 백업 후 공개 저장소에서 제거, .gitignore에 추가
- Home Hero 제목 개행 반영 및 증거 패널 row를 관련 페이지/섹션 링크로 연결
- Design System Overview/Admin Table에 실무 B2B 화면 기준의 재구성 브릿지 문구 추가
- Home에 Case Studies 진입점 추가

## 다음 할 일

> 7/6 3차 리뷰(디폴트 포트폴리오 전환 + 저장소 위생 점검) 반영.
> 2차 리뷰 지적사항은 전부 반영 확인 완료. README/CLAUDE.md/AGENTS.md/기획서는 디폴트 포트폴리오 기준으로 갱신됨.

### P1 — 저장소 위생 (다음 세션 최우선)

1. **DESIGN.md를 저장소에서 제거** (로컬 보관 + .gitignore 추가) 완료.
   공개 저장소에 토스 디자인 시스템 분석 원문(Toss Blue, TDS, 페르소나 등)이 그대로 노출 중.
   어느 회사에 내든 "타사 디자인 복제 기반 + AI 생성 문서" 인상 — 특히 토스 계열 지원 시 치명적.
   적용된 토큰은 이미 중립화되어 있어 삭제해도 사이트에 영향 없음
2. **git 히스토리 정리 (권장)**: 커밋 6개뿐, 협업자 없음, 단일 author → 재작성 비용·위험 낮음.
   `git rebase -i --root`로 (a) 메시지를 구체적으로 reword (b) scaffold 커밋에서 DESIGN.md 제외 후 force push.
   메시지 예시: "chore: address live review issues" → "fix: 푸터 mailto 주소 누락 수정, 외부 링크 새 창 처리"
3. 이후 커밋부터 CLAUDE.md/AGENTS.md의 신규 "커밋 규칙" 적용 (작은 커밋, 구체적 메시지, AI 트레일러 금지)

### P2 — UI 개선 (Hero 및 Projects)

4. Hero 제목의 `\n` 개행이 무시됨 — `.p-home__hero-copy h1`에 `white-space: pre-line` 추가 완료
5. Hero 증거 패널의 각 row를 해당 섹션 링크로 연결 완료.
   "배포 완료" 배지는 "실제 렌더링"으로 교체 완료
6. Projects 카드 대표 스크린샷 3장 추가 (기준: 기획서 5-4 이미지 방침 — 데스크톱 1장, webp, next/image, alt)
7. **DS 실무 연결 브릿지 문구 추가** 완료.
   DS Overview에 "실무 B2B 화면 기준의 재구성" 문구 추가, Admin Table 예시에 "실무 목록·조회 구조의 재현" 문구 + Case 2 링크 연결
8. **Home에 Case Studies 진입점 추가** 완료.
   제목 + 한 줄 요약 링크 2개로 디자이너/PM 심사자의 Home 내 입구 확보
   → **사용자가 이미지 파일을 따로 제공 예정. 다음 작업 전 반드시 이미지 파일을 요청할 것.**

### P3 — QA

7. Design System의 variant/state 전환과 Admin Table 상태 토글이 실제 인터랙션으로 동작하는지 브라우저에서 확인 (기획 기준: 정적 나열 금지) — 마크업에 토글 버튼 존재는 확인됨
8. 모바일/데스크톱 렌더링 QA 및 Lighthouse 확인
9. Design System 코드 예시·접근성 설명 다듬기

## 블로커 / 확인 필요

- Projects 카드 대표 스크린샷 3장 필요. 사용자가 따로 제공 예정이므로 다음 작업 전 반드시 요청.

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
