# 포트폴리오 Drake식 3단 레이아웃 재구성 설계

작성일: 2026-10-15
상태: 구현 완료(검증 대기)
브랜치: `redesign/apple-style` (이어서 작업, 배포 전)
기준 문서: `docs/superpowers/specs/2026-10-14-apple-style-redesign-design.md` — 이 문서는 그 설계의 **레이아웃·섹션 구성·내비게이션·띠 구조**를 대체한다. 색상 값·타이포 토큰·접근성·모션 안전 규칙·테스트 기준은 그대로 유지한다.
레이아웃 참고: Drake One-Page Portfolio 템플릿(https://wpriverthemes.com/HTML/drake/index.html) — 색이 아니라 구조와 스크롤 방식만 참고한다.

## 1. 목표와 배경

- 애플 스타일 개편 후에도 "대표 실무 프로젝트가 너무 간단하다", "퍼블리셔 포트폴리오로서 사이트 전체가 단순하다"는 평가가 나왔다.
- Drake 템플릿의 구조(왼쪽 고정 프로필 카드, 가운데 스크롤 콘텐츠, 오른쪽 아이콘 내비, 섹션마다 알약 라벨과 큰 제목, 넓은 여백, 스크롤 등장)를 가져와 개인 포트폴리오다운 인상과 풍부함을 만든다.
- 실무 프로젝트 소개를 이력서의 "담당 작업"으로 두텁게 하고, 이미지를 받을 수 있는 구조로 만든다.
- 이력서 사실만 쓴다. 만든 숫자·성과·평가(스킬 퍼센트, "182+ 프로젝트" 류)는 넣지 않는다.

## 2. 확정 사항 요약

| 항목 | 결정 |
| --- | --- |
| 구조 | 1024px 이상 3단: 왼쪽 고정 프로필 카드 · 가운데 콘텐츠 · 오른쪽 아이콘 레일. 1024px 미만은 상단 바 + 프로필 카드가 콘텐츠 첫 블록 |
| 배경 | 애플식 띠 교차 폐지. 한 장의 배경 위에 카드 (라이트: 회색 배경 + 흰 카드 / 다크: 검정 배경 + `#1d1d1f` 카드) |
| 색·타이포 | 기존 애플 팔레트와 타이포 토큰 유지 (`canvas` 톤 하나만 사용) |
| 프로필 사진 | 사용자 제공 미모지(315×315 PNG) 사용. 더 큰 원본이 오면 교체 |
| 섹션 머리 | 아이콘 알약 라벨(영문 대문자) + 큰 한국어 제목(한 구절만 강조색) |
| 실무 프로젝트 | 전체 폭 카드 4개. 이미지(있을 때) + 핵심 담당 작업 3개 |
| 개인 프로젝트 | Drake식 혼합 격자(전체 폭 1 + 절반 2 + 전체 폭 1), 캡처 + 기울기 |
| 경력 | 세로 타임라인, 스크롤에 따라 선이 채워짐 |
| 핵심 역량 | 번호(01~04) 카드 2열 |
| 연락 | 마지막 CONTACT 섹션이 푸터를 대체 (폼 없음, 이메일·GitHub) |
| 스크롤 | 기본 스크롤 유지(관성 스크롤 금지). 요소 등장은 CSS |
| 제외 | 히어로 캡처 콜라주, 벤토 그리드, 좌우 번갈이 피처 행, 숫자 띠, 스킬 퍼센트, 추천사·요금표·문의 폼, jQuery·GSAP·Bootstrap |

## 3. 화면 구조

### 3.1 셸 (`SiteShell`)

| 폭 | 구성 |
| --- | --- |
| 1024px 이상 (`lg`) | CSS Grid 3열: `var(--profile-width)` · `minmax(0, 1fr)` · `var(--rail-width)`. 왼쪽 `ProfileCard`는 `position: sticky; top: var(--space-6)`, 높이는 화면 높이 안(넘치면 카드 내부 스크롤). 가운데 `<main>`의 내용 폭은 최대 `var(--content-max)`(약 760px). 오른쪽 아이콘 레일은 sticky로 화면 세로 가운데 근처에 고정 |
| 1024px 미만 | 상단 바(이름 · 테마 토글 · 메뉴 버튼, 유리 효과) + 한 열. `ProfileCard`가 `<main>` 앞 첫 블록으로 쌓인다(같은 요소 하나, 그리드 배치만 바뀜) |

- 레이아웃 토큰 추가: `--profile-width`(20rem), `--rail-width`(3.5rem), `--content-max`(47.5rem), `--shell-gap`(`--space-8`), `--section-gap`(데스크톱 10rem, 모바일 6rem).
- 1024~1279px에서는 가운데 열이 줄어든다(1024px에서 실측 약 501px). 대표 실무 프로젝트의 핵심 작업 칸은 컨테이너 쿼리로 카드 폭이 40rem 미만이면 1열, 이상이면 3열이다. 가로 스크롤은 없어야 한다.
- 랜드마크: 상단 바·레일을 포함한 `header`, 프로필 카드는 `aside`(aria-label "프로필"), 본문 `main`, CONTACT 섹션 뒤 짧은 저작권 줄은 `footer`.
- 본문 바로가기(`SkipLink`)와 `#main` 포커스 대상 유지.

### 3.2 프로필 카드 (`ProfileCard`, Server Component)

위에서 아래로: 미모지(카드 폭에 맞춘 정사각, 둥근 모서리, `alt`는 "박현규 프로필 이미지(미모지)"), 이름(`tile` 역할), 직함(`overline`), 이메일 링크, GitHub 링크, "연락하기" 알약 버튼(`mailto:`), 테마 토글(1024px 이상에서만 보임 — 미만에서는 상단 바의 토글 사용), 저작권 한 줄(`caption`).
전화번호·거주지는 넣지 않는다(`data.test.ts`가 계속 검사).

### 3.3 아이콘 레일과 상단 바 (`SiteNav`, client — 하나의 컴포넌트)

- `SiteNav`가 두 가지 표시를 함께 그리고 화면 폭에 따라 하나만 보인다(숨겨진 쪽은 `display: none`이라 접근성 트리에서 빠진다). client component 수는 그대로 4개(`ThemeToggle`, `SiteNav`, `MobileMenu`, `TiltTile`).
- **아이콘 레일(1024px 이상):** 세로 알약 안에 섹션 아이콘 링크. 각 링크의 접근 가능한 이름은 섹션 이름 텍스트. hover·`:focus-visible` 시 왼쪽에 이름 말풍선(툴팁)이 나타난다. 현재 섹션은 `aria-current="location"` + 색 + 굵기(말풍선 없을 때는 아이콘 강조) + 세로로 미끄러지는 알약 표시(Motion, 기존 가로 알약을 세로 `y`·`height`로).
- **상단 바(1024px 미만):** 이름 · 테마 토글 · `MobileMenu` 버튼. 유리 효과(`glass-bar`).
- 섹션 감지는 기존 `useActiveSection` + id 래퍼 방식을 그대로 쓴다.
- 내비 항목: `sectionNav`에 `contact`(연락)를 추가한다 → 소개 · 경력 · 프로젝트 · 기술 · 학력·자격 · 연락.

### 3.4 메인 페이지 섹션

모든 섹션은 `SectionHeader`(알약 라벨 + 큰 제목)로 시작하고 섹션 간 여백은 `var(--section-gap)`(데스크톱 약 160px, 모바일 약 96px)이다.

| 순서 | id | 라벨 | 내용 |
| --- | --- | --- | --- |
| 1 | `about`(래퍼 시작) | INTRODUCE | 히어로: 라벨, `h1`(= `profile.headline`, 강조 구절 "6년 이상"), 소개 문장, 알약 버튼 2개(프로젝트 보기 / 이메일 보내기), 원형 "PROJECTS" 배지(§5) |
| 2 | (`about` 래퍼 안) | ABOUT | 핵심 역량 4개: 번호(01~04) + 라벨 + 설명 카드, 768px 이상 2열 |
| 3 | `career` | CAREER | 경력 세로 타임라인(§3.5) |
| 4 | `projects` | PROJECTS | 대표 실무 프로젝트 → 개인 프로젝트(§3.6) |
| 5 | `skills` | SKILLS | 분야별 기술 카드(현재 내용 그대로, 2열) |
| 6 | `education` | EDUCATION | 학력·자격 |
| 7 | `contact` | CONTACT | 큰 제목 + 이메일(크게) + GitHub 링크. 폼 없음 |

섹션 제목 문구(초안, `src/data/site.ts`의 `sectionHeadings`에 둔다. 구현 전 사용자 확인):

| id | 라벨 | 제목 | 강조 구절 |
| --- | --- | --- | --- |
| about(히어로) | INTRODUCE | `profile.headline` | 6년 이상 |
| about(역량) | ABOUT | 업무 화면을 만들고 운영 화면을 다듬습니다 | 운영 화면 |
| career | CAREER | 이커머스에서 B2B 업무 시스템까지 | B2B 업무 시스템 |
| projects | PROJECTS | 실무 프로젝트와 개인 서비스 | 개인 서비스 |
| skills | SKILLS | 주로 다루는 기술 | 기술 |
| education | EDUCATION | 학력과 자격 | 자격 |
| contact | CONTACT | 함께 이야기 나눠요 | 이야기 |

- 강조 구절은 제목 안에 그대로 들어 있는 문자열이어야 한다(테스트로 검사). 강조는 `<em>`(기울임 없음, `--band-link` 색 + 굵기)로 그리며 색만으로 의미를 전달하지 않는다(장식이며 의미 없음).
- 알약 라벨의 아이콘은 레일 아이콘과 같은 것을 쓴다(장식, `aria-hidden`).

### 3.5 경력 타임라인 (`CareerTimeline`)

- 왼쪽 세로선과 회사별 점, 각 항목은 기간(`caption`) · 회사(`tile`) · 직함 · 요약 · 하이라이트 목록.
- 세로선 위에 채움선이 겹쳐 있어 스크롤로 항목을 지날수록 위에서부터 채워진다(§5).

### 3.6 프로젝트

- **대표 실무 프로젝트(`ProjectCard`, 4개, 전체 폭):** 이미지가 있으면 카드 위쪽에 16:10(위쪽 기준 크롭), 아래에 라벨 · 제목 · 기간·역할 · 핵심 담당 작업 3개(목록) · 기술 태그. 이미지가 없으면 글만(담당 작업 목록은 768px 이상에서 3열). 카드 전체가 상세 링크(제목 링크 하나 + 카드 전체 클릭 영역, 기존 패턴).
- **개인 프로젝트(4개, 혼합 격자):** 768px 이상에서 1번 전체 폭, 2·3번 절반, 4번 전체 폭. 캡처 이미지 + 라벨 · 제목 · 요약 · 기간 · 태그. `TiltTile` 기울기 유지. 그룹 위에 기존 소개 문단(`personalProjectsIntro`).
- 그룹 제목("대표 실무 프로젝트", "개인 프로젝트 · AI 활용 개발")은 `h3`, 카드 제목은 `h4`.

핵심 담당 작업 초안(`Project.highlights`, 이력서 "담당 작업" 문장을 줄인 것, 구현 전 사용자 확인):

| slug | highlights |
| --- | --- |
| weseedcon | 내비게이션·공통 레이아웃 구현, 목록·조회·상세의 반복 영역 컴포넌트 분리 / 데이터 그리드 가로·세로 스크롤과 페이지네이션을 개발자와 기준을 맞춰 적용 / 대시보드 카드 반응형 배치와 별도 시안 기반 모바일 목록·상세·메뉴 구현 |
| weseed-crm-design-system | 화면에 흩어진 색상 값을 역할별로 분류해 CSS 변수 통합안 작성·조율 / 타이포그래피를 주요 메뉴에 순차 적용하고 중복 모바일 스타일 정리 / 기존 선택자와의 충돌을 조회·등록 화면 단위로 검수하고 기준을 문서 초안에 기록 |
| construction-logistics-systems | LH 레미콘스마트관리시스템: 타설관리·관제정보 목록, 검색 모달, 대시보드 / 현대 CSM: 개발 환경·공통 레이아웃부터 참여해 4개 업무 영역 화면 구축 / 롯데글로벌로지스 CRM: 다단계 탭·보고서·대량 처리·문서 출력 화면 구현 |
| ecommerce | 메디플러스 세컨드닥터몰·생활공작소 등 8개 쇼핑몰 PC·모바일 신규 구축·오픈 / 지오다노·안다르·차홍 등 운영몰의 프로모션·상시 운영 요청 반영 / JavaScript·jQuery로 메뉴·탭·슬라이드·폼 동작 구현과 브라우저 검수 |

### 3.7 상세 페이지·404

- 같은 셸(프로필 카드 · 레일/상단 바). 레일 링크는 메인 섹션(`/#id`)으로 이동한다(기존 `navHref` 규칙).
- 상세 본문: 프로젝트 머리(라벨 · 제목 · 기간·역할 · 태그 · 링크 버튼) → 섹션 목차(`LocalNav`) → 이미지 갤러리 → 본문 섹션 → 이전/다음 카드 → CONTACT. `LocalNav`는 1024px 이상에서 `top: 0`, 미만에서 상단 바 아래(`top: var(--nav-height)`)에 고정. 본문 섹션의 `scroll-margin-top`을 이에 맞춘다.
- 404: 섹션 머리 + 안내 + 메인으로 버튼 + CONTACT 없이 저작권 줄.

## 4. 데이터·문구 변경

| 위치 | 변경 |
| --- | --- |
| `src/data/types.ts` | `Project.highlights?: string[]`, `SectionHeading = { label: string; title: string; accent?: string }` |
| `src/data/projects.ts` | 실무 4개에 `highlights` 3개씩(§3.6 표) |
| `src/data/site.ts` | `sectionNav`에 `{ id: "contact", label: "연락" }` 추가, `sectionHeadings`(§3.4 표), `uiCopy`에 `profileLabel`("프로필"), `contactCta`("연락하기"), `projectsBadge`("PROJECTS · VIEW WORK · ", 원형 배지에 둘러 쓰는 문구), `avatarAlt` |
| `public/profile/avatar.png` | 사용자 제공 미모지 |
| 이미지 | 실무 프로젝트 이미지는 받는 대로 `public/projects/<slug>-N`에 넣고 `images`에 추가(별도 `content` 커밋) |

## 5. 모션

원칙은 기존과 같다: CSS 위주, `transform`·`opacity`, `prefers-reduced-motion: reduce`에서 끔, 스크롤 연동은 `@supports (animation-timeline: view())` 안에서만, 시간 0.2~0.8초, 무한 반복·자동 재생·스크롤 가로채기 금지.

| 모션 | 구현 |
| --- | --- |
| 섹션·카드·타임라인 항목 등장 | 기존 `reveal`(view 타임라인) 확대 적용 |
| 원형 PROJECTS 배지 회전 | `animation-timeline: scroll()`로 스크롤할 때만 회전(무한 회전 아님) |
| 타임라인 채움선 | 타임라인 컨테이너의 `view()`에 맞춰 채움선 `scale: 1 0 → 1 1`(위 기준) |
| 레일 현재 알약 | Motion `m.span` 세로 이동(`y`, `height`) + 감소 모드에서 `duration: 0` |
| 레일 말풍선 | CSS hover·focus-visible로 나타남(transform·opacity) |
| 카드 hover | 기존 `scale` + 이미지 확대, 핵심 역량 카드는 테두리 강조 |
| 개인 프로젝트 기울기 | 기존 `TiltTile` |
| 히어로 퇴장 | 삭제 |

## 6. 컴포넌트 변경

| 구분 | 컴포넌트 |
| --- | --- |
| 새로 만듦 | `ProfileCard`, `SectionHeader`, `Icon`(인라인 SVG 아이콘 세트: 소개·역량·경력·프로젝트·기술·학력·연락·화살표), `CareerTimeline`, `ProjectCard`, `PersonalProjectGrid`, `ContactSection`, `ProjectsBadge` |
| 크게 수정 | `SiteShell`(3단 그리드), `SiteNav`(상단 바 + 아이콘 레일), `Hero`, `CompetenciesBand`→역량 카드, `ProjectsBands`→실무 카드 + 개인 격자, `SkillsBand`, `EducationBand`, `ProjectHeader`·`ProjectBody`·`ProjectGallery`·`ProjectPager`·`LocalNav`(배경 띠 제거, 카드화) |
| 대체·삭제 | `Band`(전체 폭 배경 띠) → 섹션 간격만 담당하는 `Section`으로 교체, `SectionTitle` → `SectionHeader`, `SiteFooter` → `ContactSection` + 저작권 줄, `CareerBand` → `CareerTimeline`, `ProjectTile` → `ProjectCard`·개인 격자 카드로 정리, 히어로 퇴장 스타일 |
| 유지 | `ThemeToggle`, `MobileMenu`, `TiltTile`, `PillButton`, `TextLink`, `Tag`, `SkipLink`, `ContactLinks`, `Tile`(카드 기본형) |

- 토큰: `canvas` 톤만 사용. `white`·`ink` 띠 맵과 해당 대비 테스트는 정리 단계에서 삭제하고 `canvas`(라이트·다크)와 주 버튼 대비 테스트는 유지한다.
- 유리 효과는 상단 바·모바일 메뉴 패널에만. 프로필 카드와 레일은 불투명 카드(`--band-tile`)다.

## 7. 접근성

- 페이지당 `h1` 하나(히어로 제목 / 상세 제목 / 404 제목). 섹션 제목 `h2`, 그룹·회사 `h3`, 카드 제목 `h4`.
- 레일 링크는 텍스트 이름을 가지며(아이콘은 `aria-hidden`), 말풍선은 hover와 키보드 포커스 모두에서 보인다. 현재 위치는 색 + 굵기 + 알약 표시.
- 같은 이름의 `nav`가 두 개(레일·모바일 메뉴) 있어도 동시에 노출되지 않는다.
- 프로필 카드의 테마 토글과 상단 바의 테마 토글도 동시에 노출되지 않는다.
- 키보드 순서: 본문 바로가기 → (1024px 이상) 프로필 카드 링크 → 본문 → 레일 / (미만) 상단 바 → 프로필 카드 → 본문. 순서가 자연스럽지 않으면 DOM 순서를 조정한다(시각 순서와 일치).
- 대비 4.5:1 테스트(`canvas` 라이트·다크) 유지, 모션 안전장치 테스트 유지.

## 8. 검증

자동(Vitest)
- 데이터: 실무 프로젝트마다 `highlights` 3개, 비어 있지 않음. `sectionHeadings`가 `sectionNav`의 모든 id(+ 역량 섹션)를 덮고, `accent`는 `title`의 부분 문자열(히어로는 `profile.headline`). 연락처에 전화번호·거주지 없음(기존).
- 기존 테스트(대비, 모션 안전장치, 테마, 기간 포맷, 프로젝트 조회, 활성 섹션, 기울기) 유지.
- `npm run lint`, `npm test`, `npm run build` 통과.

화면(브라우저, 헤드리스 Chrome CDP 가능)
- 360 / 768 / 1024 / 1280px × 라이트 / 다크: 3단·한 열 전환, 가로 스크롤 없음, 프로필 카드 sticky, 레일 위치.
- 레일: 섹션마다 `aria-current`가 맞는지(스크롤 위·아래, 바로 이동, 새로고침), 말풍선 hover·포커스, 알약 이동.
- 키보드 순서·포커스 링·모바일 메뉴(Escape, 포커스 이탈 시 닫힘).
- 배지 회전·타임라인 채움·등장 모션, 움직임 줄이기에서 정지.
- **성능:** 프로덕션 빌드에서 Lighthouse 성능(모바일·데스크톱) 3회 측정 중앙값, LCP·CLS·TBT 기록. Pretendard 가변 폰트(약 2MB)와 Motion 청크의 영향을 함께 보고한다(개선은 측정 결과를 보고 별도 판단).
- Lighthouse 접근성 100 유지.

## 9. 범위 밖

문의 폼, 추천사, 요금표, 스킬 퍼센트·만든 숫자, 관성 스크롤, jQuery·GSAP·Bootstrap, 새 페이지, 이력서 콘텐츠 변경(UI 문구·`highlights` 초안 추가만), 실무 프로젝트 이미지 제작(사용자가 제공).

## 10. 위험과 대응

| 위험 | 대응 |
| --- | --- |
| 1024~1279px에서 3단이 비좁음 | 가운데 열 최소 폭 확인, 필요하면 레일을 1280px부터 표시하고 그 아래는 상단 바 사용(구현 중 측정으로 결정) |
| 아바타 해상도 부족(315px) | 표시 크기 240px 이하로 제한, 큰 원본 받으면 교체 |
| 문구 초안이 과장되거나 어색함 | `sectionHeadings`·`highlights`는 구현 전 사용자 확인 |
| 구조 변경 폭이 큼(셸·섹션 전부) | 새 컴포넌트를 먼저 만들고 한 번에 전환, 옛 컴포넌트는 마지막에 삭제(지난 개편과 같은 순서) |
| 레일·상단 바 이중 렌더링으로 포커스 순서 혼란 | 숨김은 `display: none`, 키보드 순서 수치 검증 |

## 11. 구현 시 의도된 차이

1. 레일 폭은 스펙의 `3.5rem` 대신 `3.75rem`(레일 안 40px 링크 + 안쪽 여백 + 테두리가 들어가도록).
2. 프로필 카드에는 저작권 줄을 넣지 않는다. 저작권은 가운데 열 맨 아래 `footer` 한 곳에만 둔다(중복 방지).
3. 레일은 `SiteNav variant="rail"`, 상단 바는 `SiteNav variant="bar"`로 두 번 그린다(시각 순서와 키보드 순서를 맞추려고 레일을 DOM 끝에 둔다). 같은 컴포넌트라 client component 수는 그대로.
4. 개인 프로젝트 혼합 격자는 "전체·절반·절반" 3개 주기(`index % 3 === 0`이 전체 폭)로 일반화한다. 4개일 때 스펙과 같은 배치(전체·절반·절반·전체)가 된다.
5. 원형 배지는 viewBox를 실제 크기(`0 0 96 96`, 반지름 37, 둘레 232)에 맞춰 글자가 12px로 그려지게 했다. 문구를 두 번 이어 쓰면 자연 길이(약 315)가 둘레를 넘어 겹치므로 한 번만 두르고 `textLength="232"`로 글자 간격을 늘려 맞춘다. SVG는 테두리 1px 때문에 94px가 되지 않도록 `inset: -1px`로 배지 전체에 맞춘다.
6. D1: 실무 프로젝트 핵심 작업 칸은 뷰포트 media query 대신 컨테이너 쿼리(카드 폭 40rem 기준 1열/3열)를 쓴다. 1024~1279px에서 가운데 열이 좁아져 3열 칸이 142px까지 줄던 문제 때문이다.
7. 상세·404 페이지는 1024px 미만에서 프로필 카드를 본문 뒤에 둔다(`SiteShell`의 `profile="after"`). 카드가 제목을 화면 아래로 밀어내고 키보드 순서와 시각 순서도 어긋나기 때문이다. 1024px 이상은 grid 영역 배치라 왼쪽 그대로이고 메인 페이지는 기존대로 카드가 앞이다.
8. 레일의 현재 섹션 알약은 투명 14% 대신 `--band-link` 단색으로 하고 아이콘은 `--band-bg`로 그린다(배경 대비 확보, hover와 구분). 레일의 `nav`는 `header`로 감싸 1024px 이상에서 배너 랜드마크를 맡고, 이 header가 슬롯 안에서 100dvh 높이로 sticky 처리돼 뷰포트 세로 중앙에 머문다.
