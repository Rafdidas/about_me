export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

export function resolveTheme(stored: string | null, prefersDark: boolean): Theme {
  if (isTheme(stored)) return stored;
  return prefersDark ? "dark" : "light";
}

export function applyTheme(theme: Theme, root: HTMLElement): void {
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // 저장 실패 시 이번 방문 동안만 적용된다.
  }
}

// resolveTheme·applyTheme과 같은 규칙을 첫 렌더 전에 실행하기 위한 인라인 스크립트.
// 규칙을 바꾸면 theme.test.ts의 themeInitScript 테스트가 함께 검증한다.
export const themeInitScript = `(function () {
  var key = ${JSON.stringify(THEME_STORAGE_KEY)};
  var mql = window.matchMedia("(prefers-color-scheme: dark)");
  function stored() {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function apply() {
    var value = stored();
    var theme = value === "light" || value === "dark" ? value : (mql.matches ? "dark" : "light");
    var root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  }
  apply();
  mql.addEventListener("change", function () {
    var value = stored();
    if (value !== "light" && value !== "dark") apply();
  });
})();`;
