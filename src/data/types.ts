export type NavItem = { id: string; label: string };

/** 굵은 라벨 + 본문 패턴. 예: "금액 구분: 실제 기록과…" */
export type Highlight = { label?: string; text: string };

export type ExternalLink = {
  label: string;
  href: string;
  kind: "service" | "github" | "evidence";
};

export type ProjectImage = { src: string; alt: string; width: number; height: number };

/** start·end는 "YYYY.MM". end가 null이면 재직·진행 중 */
export type Period = { start: string; end: string | null };

export type ProjectSection = {
  title: string;
  stack?: string[];
  paragraphs?: string[];
  items?: Highlight[];
};

export type Project = {
  slug: string;
  kind: "work" | "personal";
  label: string;
  title: string;
  summary: string;
  period: Period | string;
  stack: string[];
  role?: string;
  note?: string;
  links: ExternalLink[];
  images?: ProjectImage[];
  /** 카드에 보여줄 핵심 담당 작업(실무 프로젝트 3개). 이력서 "담당 작업"을 줄인 문장 */
  highlights?: string[];
  sections: ProjectSection[];
};

export type Profile = {
  name: string;
  role: string;
  headline: string;
  intro: string;
  email: string;
  github: string;
  competencies: Highlight[];
};

export type CareerEntry = {
  company: string;
  position: string;
  period: Period;
  summary: string;
  highlights: Highlight[];
};

export type SkillGroup = { category: string; items: string[]; note?: string };

export type EducationItem = { title: string; detail?: string };

/** 섹션 머리: 알약 라벨 + 큰 제목. accent는 제목 안에 그대로 들어 있는 구절 */
export type SectionHeading = { label: string; title: string; accent?: string };
