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
