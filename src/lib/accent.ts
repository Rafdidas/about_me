export type AccentParts = { before: string; accent: string; after: string };

export function splitAccent(title: string, accent?: string): AccentParts | null {
  if (!accent) return null;
  const index = title.indexOf(accent);
  if (index === -1) return null;
  return { before: title.slice(0, index), accent, after: title.slice(index + accent.length) };
}
