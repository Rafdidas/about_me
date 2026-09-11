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
    "이커머스와 B2B 업무 시스템에서 6년 이상 UI를 구축하고 운영했습니다. 현재는 React·Next.js 환경에서 업무 화면과 공통 UI를 구현합니다. 개인 프로젝트 모니북은 AI를 활용해 개발하고 실제 서비스로 운영하고 있습니다.",
  ctas: [
    { href: "/case-studies", label: "실무 사례 보기", variant: "primary" as const },
    { href: "/projects#money-book", label: "AI 활용 프로젝트 보기", variant: "secondary" as const },
    { href: siteMeta.githubUrl, label: "GitHub 보기", variant: "secondary" as const }
  ]
};

export const homeProofPanel = {
  title: "포트폴리오에서 확인할 수 있는 경험",
  items: [
    {
      label: "실무 경험",
      value: "B2B 업무 화면 구현과 공통 UI 적용",
      href: "/case-studies"
    },
    {
      label: "UI 구현 예시",
      value: "컴포넌트 상태와 Admin Table",
      href: "/design-system#admin-table"
    },
    {
      label: "AI 활용·서비스 운영",
      value: "바이브 코딩으로 개발한 모니북",
      href: "/projects#money-book"
    }
  ]
};

export const homeSections = {
  strengths: {
    title: "Strengths",
    description: "화면을 빠르게 구현하는 것보다, 운영 중에도 안정적으로 유지될 수 있는 UI 구조를 중요하게 생각합니다."
  },
  designSystemPreview: {
    title: "UI 구현 예시",
    description: "컴포넌트 상태와 Admin Table 흐름을 확인할 수 있는 포트폴리오용 예시입니다."
  },
  featuredProjects: {
    title: "Featured Projects",
    description: "개인 프로젝트의 사용 흐름과 개발 경험을 정리했습니다."
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
    description: "디자이너가 정의한 색상·타이포그래피·상태별 디자인을 화면과 반복 UI 요소에 적용했습니다."
  },
  {
    title: "B2B Admin UI",
    description: "CRM, CSM, 레미콘 스마트관리시스템에서 목록, 조회, 대시보드, 테이블, 페이지네이션 중심의 업무 화면을 구현했습니다."
  }
];

export const homeHighlights = [
  {
    title: "공개 UI 예시",
    description: "컴포넌트의 기본 상태와 disabled, loading, empty, error 상태를 확인할 수 있습니다."
  },
  {
    title: "이커머스 운영",
    description: "화면 이슈와 고객 요청사항을 반영하며 UI를 유지보수했습니다."
  },
  {
    title: "B2B 업무 화면",
    description: "목록, 조회, 대시보드와 반복되는 화면 구조를 구현했습니다."
  }
];

export const homeCaseLinks = {
  title: "Case Studies",
  description: "실무에서 맡은 범위와 구현한 내용을 중심으로 정리했습니다.",
  items: [
    {
      category: "Design System",
      title: "WeSeed CRM 공통 UI 구현과 디자인 기준 적용",
      summary: "상태별 디자인을 화면과 반복 UI 요소에 적용한 경험",
      href: "/case-studies#weseed-design-system"
    },
    {
      category: "Admin UI",
      title: "React·Next.js 기반 B2B 업무 화면 구현",
      summary: "목록·조회·대시보드·테이블 중심의 업무 화면 구현 경험",
      href: "/case-studies#b2b-admin-ui"
    }
  ]
};
