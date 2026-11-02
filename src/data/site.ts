import { profile } from "./profile";
import type { NavItem, SectionHeading } from "./types";

export const siteMeta = {
  title: "박현규 — Full-stack Developer",
  description:
    "이커머스·B2B 서비스의 PC·모바일 화면 구축·운영 경험을 바탕으로 React·Next.js·Angular와 Java·Spring·MySQL로 업무 흐름을 구현하는 풀스택 개발자 박현규의 포트폴리오입니다.",
  url: "https://about-me-iota-blond.vercel.app"
};

export const sectionNav: NavItem[] = [
  { id: "about", label: "소개" },
  { id: "career", label: "경력" },
  { id: "projects", label: "프로젝트" },
  { id: "skills", label: "기술" },
  { id: "education", label: "학력 · 자격" },
  { id: "contact", label: "연락" }
];

type SectionHeadingKey = "intro" | "about" | "career" | "projects" | "skills" | "education" | "contact";

export const sectionHeadings: Record<SectionHeadingKey, SectionHeading> = {
  intro: { label: "Introduce", title: profile.headline, accent: "화면부터 서버까지" },
  about: { label: "About", title: "사용자 화면과 서버의 데이터 처리를 연결합니다", accent: "데이터 처리" },
  career: { label: "Career", title: "이커머스에서 B2B 업무 시스템까지", accent: "B2B 업무 시스템" },
  projects: { label: "Projects", title: "실무 프로젝트와 개인 서비스", accent: "개인 서비스" },
  skills: { label: "Skills", title: "주로 다루는 기술", accent: "기술" },
  education: { label: "Education", title: "학력 · 자격" },
  contact: { label: "Contact", title: "Contact" }
};

export const uiCopy = {
  skipLink: "본문 바로가기",
  profileLabel: "프로필",
  contactCta: "연락하기",
  projectsBadge: "PROJECTS · VIEW WORK · ",
  projectsBadgeLabel: "PROJECTS VIEW WORK 프로젝트 보기",
  avatarAlt: "박현규 프로필 이미지(미모지)",
  heroProjects: "프로젝트 보기",
  heroContact: "이메일 보내기",
  menuOpen: "메뉴 열기",
  menuClose: "메뉴 닫기",
  sectionNavLabel: "섹션",
  tocLabel: "목차",
  backToProjects: "← 전체 프로젝트",
  themeToDark: "다크 모드로 전환",
  themeToLight: "라이트 모드로 전환",
  themeFallback: "테마 전환",
  newWindow: "(새 창)",
  currentPosition: "재직 중",
  workProjectsTitle: "대표 실무 프로젝트",
  personalProjectsTitle: "개인 프로젝트 · AI 활용 개발",
  evidenceTitle: "확인 자료",
  projectLinksLabel: "프로젝트 링크",
  galleryLabel: "프로젝트 화면",
  pagerLabel: "다른 프로젝트",
  prevProject: "이전 프로젝트",
  nextProject: "다음 프로젝트",
  contactLabel: "연락처",
  contactEmail: "이메일",
  contactGithub: "GitHub",
  notFoundLabel: "404",
  notFoundTitle: "페이지를 찾을 수 없습니다",
  notFoundBody: "주소가 바뀌었거나 존재하지 않는 페이지입니다.",
  notFoundLink: "메인으로 돌아가기",
  footer: "© 2026 박현규"
};
