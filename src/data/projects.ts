import type { Project } from "./types";

export const personalProjectsIntro =
  "AI 코딩 도구를 활용한 개인 프로젝트입니다. 서비스 방향과 요구사항을 정하고 AI와 기획·설계를 논의했습니다. 기술 스택·코딩 방식이 의도와 다르거나 화면에서 문제가 보이면 재검토를 요청하고, 프론트엔드 코드를 읽으며 구현 방향을 조율했습니다.";

export const projects: Project[] = [
  {
    slug: "weseedcon",
    kind: "work",
    label: "Project 01",
    title: "위시드콘 레미콘 품질관리 플랫폼",
    summary: "시공사·감리업체·레미콘사가 타설 데이터를 공유하는 구독형 B2B 플랫폼의 PC·모바일 UI와 공통 컴포넌트를 신규 구축",
    period: { start: "2026.05", end: null },
    stack: ["Next.js", "React", "TypeScript"],
    role: "UI 구현·공통 컴포넌트 담당",
    links: [
      { label: "weseedcon.com", href: "https://weseedcon.com", kind: "service" },
      { label: "con.weseed.co.kr", href: "https://con.weseed.co.kr", kind: "service" }
    ],
    sections: [
      {
        title: "배경",
        paragraphs: [
          "시공사·감리업체·레미콘사가 현장의 타설 데이터를 공유하는 구독형 B2B 플랫폼 신규 구축 프로젝트입니다. PC와 모바일을 모두 제공하며, 요금제와 사용자 권한에 따라 노출되는 메뉴와 기능이 달라지는 구조였습니다. 오픈 후에도 업무 화면이 추가될 예정이어서 목록·조회·상세 화면에서 반복되는 UI를 다시 사용할 수 있어야 했습니다."
        ]
      },
      {
        title: "담당 작업",
        paragraphs: [
          "내비게이션과 공통 레이아웃을 구현하고, 목록·조회·상세 화면에서 반복되는 정보 영역과 UI를 컴포넌트로 분리했습니다. 데이터 그리드의 가로·세로 스크롤과 페이지네이션은 개발자와 동작 기준을 맞춰 각 화면에 적용했습니다.",
          "대시보드에는 데이터 카드의 반응형 배치와 상세 화면으로 이동하는 인터랙션을 구현했습니다. 모바일은 PC 화면을 축소하지 않고 별도 시안을 기준으로 목록·상세·메뉴 구조와 동작을 구현했습니다."
        ]
      },
      {
        title: "적용 및 운영",
        paragraphs: [
          "PC·모바일 서비스를 오픈했으며, 공통 레이아웃과 반복 UI를 추가 업무 화면에서도 사용하고 있습니다. 오픈 후 실제 화면에서 확인된 데이터 그리드 스크롤과 상세 UI 문제를 수정하고, 새로 추가되는 화면은 기존 컴포넌트의 적용 가능 범위를 먼저 확인한 뒤 구현하고 있습니다."
        ]
      }
    ]
  },
  {
    slug: "weseed-crm-design-system",
    kind: "work",
    label: "Project 02",
    title: "WeSeed CRM·Admin 디자인 시스템 개선",
    summary: "장기간 확장된 CRM의 색상을 CSS 변수로 통합하고 타이포그래피·모바일 스타일을 운영 화면에 단계적으로 적용",
    period: { start: "2026.03", end: "2026.06" },
    stack: ["Angular", "SCSS", "CSS Variables"],
    role: "집중 개선 후 운영",
    links: [],
    sections: [
      {
        title: "배경",
        paragraphs: [
          "장기간 확장된 CRM에서 같은 역할의 색상과 타이포그래피가 화면마다 다르게 선언되어 있었고, 모바일 스타일도 각 페이지에 중복되어 있었습니다. 운영 중인 제품이어서 공통 기준을 한 번에 교체하기보다 기존 화면에 미치는 영향을 확인하며 순차적으로 적용해야 했습니다."
        ]
      },
      {
        title: "담당 작업",
        paragraphs: [
          "화면에 직접 선언된 색상 값을 사용 위치와 역할에 따라 분류해 CSS 변수 통합안을 만들고, 디자이너·개발자와 변수명·사용 범위·적용 순서를 조율했습니다. 타이포그래피는 컴포넌트와 페이지 스타일을 구분해 CRM 주요 메뉴에 순차 적용했으며, 화면별로 중복된 모바일 스타일도 함께 정리했습니다.",
          "공통 UI를 적용할 대상과 기존 UI를 유지할 범위를 논의하고, 합의된 색상·타이포그래피·모바일 스타일 기준을 디자인 시스템 문서 초안에 기록했습니다. 공통 스타일 적용 후 기존 페이지 선택자와 충돌해 레이아웃이 달라지는 사례가 있어, 컴포넌트 확인에 그치지 않고 실제 조회·등록 화면 단위로 검수하고 수정했습니다."
        ]
      },
      {
        title: "적용 및 운영",
        paragraphs: [
          "CRM 주요 화면에 타이포그래피 기준을 단계적으로 적용하고, 기존 페이지 스타일과의 충돌을 화면 단위로 검수·개선했습니다. 집중 개선 기간 이후에도 신규 화면에는 정리된 기준을 적용하고, 기존 화면은 영향 범위를 확인하며 순차적으로 보완하고 있습니다."
        ]
      }
    ]
  },
  {
    slug: "construction-logistics-systems",
    kind: "work",
    label: "Project 03",
    title: "건설·물류 업무 시스템 구축",
    summary: "LH 레미콘스마트관리시스템·현대 CSM·롯데글로벌로지스 CRM의 목록·조회·등록·대시보드 화면 구현",
    period: { start: "2025.09", end: "2026.06" },
    stack: ["Next.js", "React", "Angular"],
    note: "사내·고객사 전용 시스템으로 화면을 공개하기 어려워 프로젝트별 담당 화면과 구현 과제를 중심으로 정리했습니다.",
    links: [],
    sections: [
      {
        title: "LH 레미콘스마트관리시스템",
        stack: ["Next.js", "React"],
        paragraphs: [
          "타설관리와 관제정보 등 현장 데이터를 조회·점검하는 목록, 검색 모달, 대시보드 화면을 구현했습니다. 이 프로젝트에서 사용한 공통 UI 구현 방식은 이후 위시드콘 플랫폼의 목록과 조회 화면을 만들 때 다시 활용했습니다."
        ]
      },
      {
        title: "현대 CSM",
        stack: ["Next.js", "React"],
        paragraphs: [
          "개발 환경 설정과 공통 레이아웃 구현부터 참여해 현장관리·비용관리·기성관리·업체선정 등 네 개 업무 영역의 화면을 구축했습니다. 메뉴와 공통 레이아웃을 먼저 구현한 뒤 각 업무 화면을 연결했습니다."
        ]
      },
      {
        title: "롯데글로벌로지스 CRM",
        stack: ["Angular"],
        paragraphs: [
          "고객관리·영업관리 영역의 조회·등록 화면을 구현했습니다. 다단계 탭, 보고서, 대량 처리, 문서 출력처럼 한 화면에 여러 상태와 동작이 포함된 기능을 구현했으며, 오픈 후 추가 요청과 UI 오류를 수정했습니다."
        ]
      }
    ]
  },
  {
    slug: "ecommerce",
    kind: "work",
    label: "Project 04",
    title: "이커머스 신규 구축·장기 운영",
    summary: "브랜드 쇼핑몰의 PC·모바일 신규 구축과 장기 운영, 반응형·브라우저 대응과 UI 인터랙션 구현",
    period: { start: "2019.10", end: "2024.11" },
    stack: ["HTML", "CSS/SCSS", "JavaScript", "jQuery"],
    links: [],
    sections: [
      {
        title: "신규 구축",
        paragraphs: [
          "메디플러스 세컨드닥터몰, 생활공작소, 대현인사이드, 클럽발코니, 크레디아, 밀크코코아 라이즈, 액트플러스, 에스더몰 등의 PC·모바일 화면을 각 브랜드의 디자인 가이드와 쇼핑몰 기능에 맞춰 구현하고 오픈했습니다."
        ]
      },
      {
        title: "운영·유지보수",
        paragraphs: [
          "지오다노, 안다르, 차홍, 탠디몰, IDF몰, 이현 어패럴 등 여러 쇼핑몰의 프로모션과 상시 운영 요청을 반영했습니다. 기존 페이지와 공통 스타일에 미치는 범위를 확인한 뒤 수정했으며, PC·모바일 해상도와 브라우저별로 화면을 점검했습니다."
        ]
      },
      {
        title: "담당 범위",
        paragraphs: [
          "HTML·CSS/SCSS 기반 반응형 마크업, JavaScript·jQuery를 활용한 메뉴·탭·슬라이드·스크롤·입력 폼 동작, 오픈 전 브라우저 검수와 운영 중 UI 오류 대응을 담당했습니다. 짧은 일정의 프로모션 화면부터 여러 해 동안 운영되는 브랜드몰까지 서로 다른 작업 주기와 기존 코드 조건에 맞춰 구현했습니다."
        ]
      }
    ]
  },
  {
    slug: "monibuk",
    kind: "personal",
    label: "Personal Project",
    title: "머니북가계부",
    summary: "수입·지출·고정지출·적금·투자 기록과 월별 분석을 제공하는 개인 재무 웹 서비스를 개발·운영",
    period: "공개 서비스 운영 중",
    stack: ["Next.js", "React", "TypeScript", "Sass", "Supabase", "Chart.js"],
    links: [
      { label: "서비스", href: "https://monibuk.com/", kind: "service" },
      { label: "GitHub", href: "https://github.com/Rafdidas/money_book", kind: "github" },
      {
        label: "로그인·데모·저장 E2E 시나리오",
        href: "https://github.com/Rafdidas/money_book/blob/main/e2e/public-auth-demo.spec.ts",
        kind: "evidence"
      }
    ],
    sections: [
      {
        title: "개요",
        paragraphs: ["수입·지출·고정지출·적금·투자 기록과 월별 분석을 제공하는 가계부를 개발·운영합니다."]
      },
      {
        title: "구현 내용",
        items: [
          {
            label: "금액 구분",
            text: "실제 기록과 예정 금액을 구분해 대시보드에 표시하고, 월별 분석에서 수입·지출·저축·투자 흐름을 비교"
          },
          {
            label: "서비스 체험",
            text: "가입 없이 입력·조회 흐름을 확인할 수 있도록 브라우저 저장 기반 데모를 구성하고 운영 사용자 데이터와 분리"
          },
          {
            label: "데이터 접근",
            text: "Supabase Auth와 PostgreSQL RLS로 사용자별 데이터 접근을 구성하고, 외부 주식 조회는 서버 경로에서 처리"
          },
          {
            label: "회귀 확인 범위",
            text: "비로그인 접근 시 원래 경로를 보존한 로그인 이동, 데모 진입, 입력 저장과 새로고침 후 분류 유지 등을 Playwright 테스트 시나리오로 구성"
          }
        ]
      }
    ]
  },
  {
    slug: "fe-daily-study",
    kind: "personal",
    label: "Personal Project",
    title: "FE Daily Study",
    summary: "학습 브리핑을 저장하고 학습 기록에 따라 다음 복습일을 안내하는 프론트엔드 학습·복습 앱",
    period: "배포된 개인 학습 앱",
    stack: ["React", "TypeScript", "Vite", "TanStack Query", "Zustand", "Supabase", "Zod"],
    links: [
      { label: "서비스", href: "https://devstudy-vert.vercel.app/", kind: "service" },
      { label: "GitHub", href: "https://github.com/Rafdidas/dev_study", kind: "github" },
      {
        label: "입력 파싱·검증 코드",
        href: "https://github.com/Rafdidas/dev_study/blob/main/src/features/briefings/parseBriefingInput.ts",
        kind: "evidence"
      },
      {
        label: "복습 일정 설계 결정",
        href: "https://github.com/Rafdidas/dev_study/blob/main/docs/decisions/0005-review-schedule-on-client.md",
        kind: "evidence"
      }
    ],
    sections: [
      {
        title: "개요",
        paragraphs: [
          "ChatGPT에서 받은 브리핑을 수동으로 가져와 저장하고, 학습 기록에 따라 다음 복습일을 안내하는 앱입니다."
        ]
      },
      {
        title: "구현 내용",
        items: [
          {
            label: "상태 구분",
            text: "브리핑·학습 기록은 TanStack Query, 로그인 세션은 Zustand, 상세 탭·필터는 URL, 작성 중 입력값은 로컬 상태로 관리"
          },
          {
            label: "입력 실패 처리",
            text: "JSON 파싱 실패와 Zod 스키마 오류를 구분해 안내하고, 커리큘럼에 없는 주제는 경고로 표시"
          },
          {
            label: "파생 값 처리",
            text: "학습 기록과 다음 복습일이 어긋나지 않도록 복습일을 별도 컬럼에 저장하지 않고 순수 함수로 계산"
          },
          {
            label: "선택 근거",
            text: "연간 브리핑 약 365개·학습 기록 수천 건을 가정해 프론트엔드 계산을 선택하고, 규모가 커지면 서버 계산을 재검토하도록 결정 기록에 명시"
          },
          { label: "검증 범위", text: "날짜·복습 간격·중복 기록 등 계산 로직에 Vitest 테스트 구성" }
        ]
      }
    ]
  }
];
