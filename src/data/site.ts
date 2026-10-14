import type { NavItem } from "./types";

export const siteMeta = {
  title: "박현규 — Frontend · UI Engineer",
  description:
    "이커머스·B2B 서비스의 PC·모바일 UI를 6년 이상 구축·운영한 프론트엔드·UI 엔지니어 박현규의 포트폴리오입니다.",
  url: "https://about-me-iota-blond.vercel.app"
};

export const sectionNav: NavItem[] = [
  { id: "about", label: "소개" },
  { id: "career", label: "경력" },
  { id: "projects", label: "프로젝트" },
  { id: "skills", label: "기술" },
  { id: "education", label: "학력 · 자격" }
];

export const uiCopy = {
  skipLink: "본문 바로가기",
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
  competenciesTitle: "핵심 역량",
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
  notFoundTitle: "페이지를 찾을 수 없습니다",
  notFoundBody: "주소가 바뀌었거나 존재하지 않는 페이지입니다.",
  notFoundLink: "메인으로 돌아가기",
  footer: "© 2026 박현규"
};
