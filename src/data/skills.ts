import type { SkillGroup } from "./types";

export const skills: SkillGroup[] = [
  {
    category: "UI",
    items: ["HTML5", "CSS3", "SCSS", "Tailwind CSS", "Responsive Web", "Web Standards", "Cross-browser 대응"]
  },
  {
    category: "JavaScript / Framework",
    items: ["JavaScript", "TypeScript", "React", "Next.js", "Angular", "jQuery"],
    note: "Angular는 프로젝트 경험"
  },
  {
    category: "UI System",
    items: ["CSS Variables", "Typography 기준 적용", "공통 UI·컴포넌트 구현", "Figma", "디자인 시스템 문서화"]
  },
  {
    category: "State / Data",
    items: ["TanStack Query", "Zustand", "Redux Toolkit", "Context API", "Supabase Auth·PostgreSQL RLS", "Zod"],
    note: "개인 프로젝트 경험 포함"
  },
  {
    category: "Test",
    items: ["Vitest", "Testing Library", "Playwright"],
    note: "개인 프로젝트의 계산 로직·입력·인증·데모 흐름 테스트 구성"
  },
  {
    category: "Workflow",
    items: ["Git", "GitHub", "Figma MCP", "AI 코딩 도구"],
    note: "AI 코딩 도구를 활용한 시안 분석·코드 탐색·구현 초안 검토, 개인 서비스 배포·운영"
  }
];
