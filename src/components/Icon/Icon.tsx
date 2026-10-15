export type IconName = "intro" | "about" | "career" | "projects" | "skills" | "education" | "contact" | "arrow";

const PATHS: Record<IconName, string[]> = {
  intro: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M4 21a8 8 0 0 1 16 0"],
  about: ["M12 3l2.4 5.6L20 11l-5.6 2.4L12 19l-2.4-5.6L4 11l5.6-2.4z"],
  career: [
    "M5 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z",
    "M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2",
    "M3 13h18"
  ],
  projects: ["M4 4h7v7H4z", "M13 4h7v7h-7z", "M4 13h7v7H4z", "M13 13h7v7h-7z"],
  skills: ["M8 8l-5 4 5 4", "M16 8l5 4-5 4", "M14 4l-4 16"],
  education: ["M2 9l10-5 10 5-10 5z", "M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"],
  contact: ["M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z", "M3 7l9 6 9-6"],
  arrow: ["M5 12h14", "M13 6l6 6-6 6"]
};

/** 내비 항목 id → 아이콘 */
export const NAV_ICONS: Record<string, IconName> = {
  about: "intro",
  career: "career",
  projects: "projects",
  skills: "skills",
  education: "education",
  contact: "contact"
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
