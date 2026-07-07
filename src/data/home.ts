import { siteMeta } from "./site";

export type HeroTitleSegment = {
  text: string;
  nowrap?: boolean;
  accent?: boolean;
};

export const homeHero = {
  badge: "UI Publisher · 6+ years",
  titleLines: [
    [{ text: "화면을 구현하는 데서", nowrap: true }],
    [{ text: "끝나지 않고," }],
    [{ text: "반복되는 UI", accent: true }, { text: "의 기준을" }],
    [{ text: "정리합니다." }]
  ] as HeroTitleSegment[][],
  description:
    "이커머스와 B2B 업무 시스템에서 6년 이상 UI 구축·운영을 경험했습니다. 반응형 화면 구현, 운영 이슈 대응, 공통 UI 개선, 디자인 시스템 고도화 참여 경험을 바탕으로 사용성과 유지보수성을 함께 고려합니다.",
  ctas: [
    { href: "/design-system", label: "Design System 보기", variant: "primary" as const },
    { href: "/case-studies", label: "Case Studies 보기", variant: "secondary" as const },
    { href: siteMeta.githubUrl, label: "GitHub 보기", variant: "secondary" as const }
  ]
};

export const homeProofPanel = {
  title: "이 포트폴리오에서 보여주고 싶은 것",
  items: [
    {
      label: "Design System",
      value: "토큰 / 타이포그래피 / 상태 UI / 컴포넌트 기준",
      href: "/design-system"
    },
    {
      label: "Admin UI",
      value: "목록 / 조회 / 필터 / 테이블 / 페이지네이션",
      href: "/design-system#admin-table"
    },
    {
      label: "Case Studies",
      value: "디자인 시스템 고도화 / B2B 업무 화면 구조화",
      href: "/case-studies"
    }
  ]
};

export const homeSections = {
  strengths: {
    title: "Strengths",
    description: "화면을 빠르게 구현하는 것보다, 운영 중에도 안정적으로 유지될 수 있는 UI 구조를 중요하게 생각합니다."
  },
  designSystemPreview: {
    title: "Design System Preview",
    description: "색상, 타이포그래피, 컴포넌트 상태를 실제 화면 예시로 정리했습니다."
  },
  featuredProjects: {
    title: "Featured Projects",
    description: "개인 프로젝트는 구현 기능보다 UI 흐름, 상태 처리, 데이터 연동 경험을 중심으로 정리했습니다."
  }
};

export const strengths = [
  {
    title: "UI Implementation",
    description:
      "HTML, CSS, JavaScript 기반 화면 구현과 UI 인터랙션을 수행해왔으며, React·Next.js 기반 업무 시스템 화면까지 경험을 확장했습니다."
  },
  {
    title: "Design System",
    description: "색상 변수, 타이포그래피, 모바일 스타일, 반복 UI 요소를 디자인 시스템 기준에 맞춰 정리하고 적용했습니다."
  },
  {
    title: "B2B Admin UI",
    description: "CRM, CSM, 레미콘 스마트관리시스템에서 목록, 조회, 대시보드, 테이블, 페이지네이션 중심의 업무 화면을 구현했습니다."
  }
];

export const homeHighlights = [
  "컴포넌트의 기본 상태뿐 아니라 disabled, loading, empty, error 상태까지 함께 확인합니다.",
  "운영 중 발생하는 화면 이슈와 고객 요청사항을 반영하며 실제 서비스 환경에서 UI 품질을 관리했습니다.",
  "AI로 만든 초안은 Figma 시안과의 간격·컬러·폰트 일치 여부, 반응형 동작, 기존 컴포넌트 사용 기준으로 직접 검증합니다."
];

export const homeCaseLinks = {
  title: "Case Studies",
  description: "실무에서 반복 UI 기준과 업무 화면 구조를 어떻게 정리했는지 문제-해결-결과 흐름으로 정리했습니다.",
  items: [
    {
      category: "Design System",
      title: "WeSeed Design System 고도화",
      summary: "색상·타이포그래피·반복 UI 요소를 공통 기준으로 정리한 경험",
      href: "/case-studies#weseed-design-system"
    },
    {
      category: "Admin UI",
      title: "B2B 업무 시스템 공통 UI 구조",
      summary: "목록·조회·대시보드·테이블 중심의 업무 화면 구조화 경험",
      href: "/case-studies#b2b-admin-ui"
    }
  ]
};
