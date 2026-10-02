import { THEME_STORAGE_KEY, resolveTheme, themeInitScript } from "./theme";

describe("resolveTheme", () => {
  it("저장된 값이 유효하면 그대로 쓴다", () => {
    expect(resolveTheme("dark", false)).toBe("dark");
    expect(resolveTheme("light", true)).toBe("light");
  });

  it("저장값이 없거나 잘못되면 OS 설정을 따른다", () => {
    expect(resolveTheme(null, true)).toBe("dark");
    expect(resolveTheme(null, false)).toBe("light");
    expect(resolveTheme("sepia", true)).toBe("dark");
  });
});

type Env = { stored?: string | null; prefersDark?: boolean; storageThrows?: boolean };

function runInitScript({ stored = null, prefersDark = false, storageThrows = false }: Env) {
  const listeners: Array<() => void> = [];
  const mql = {
    matches: prefersDark,
    addEventListener: (_type: string, cb: () => void) => listeners.push(cb)
  };
  const root = { dataset: {} as Record<string, string>, style: {} as Record<string, string> };
  const storage = {
    value: stored,
    getItem(key: string) {
      if (storageThrows) throw new Error("blocked");
      return key === THEME_STORAGE_KEY ? this.value : null;
    }
  };
  new Function("window", "document", "localStorage", themeInitScript)(
    { matchMedia: () => mql },
    { documentElement: root },
    storage
  );
  return { root, mql, listeners, storage };
}

describe("themeInitScript", () => {
  it("저장값을 html에 적용한다", () => {
    const { root } = runInitScript({ stored: "dark" });
    expect(root.dataset.theme).toBe("dark");
    expect(root.style.colorScheme).toBe("dark");
  });

  it("저장값이 없으면 OS 설정을 적용한다", () => {
    expect(runInitScript({ prefersDark: true }).root.dataset.theme).toBe("dark");
    expect(runInitScript({ prefersDark: false }).root.dataset.theme).toBe("light");
  });

  it("저장소 접근이 실패해도 OS 설정으로 동작한다", () => {
    expect(runInitScript({ prefersDark: true, storageThrows: true }).root.dataset.theme).toBe("dark");
  });

  it("저장값이 없을 때만 OS 설정 변경을 따라간다", () => {
    const free = runInitScript({ prefersDark: false });
    free.mql.matches = true;
    free.listeners.forEach((cb) => cb());
    expect(free.root.dataset.theme).toBe("dark");

    const pinned = runInitScript({ stored: "light", prefersDark: false });
    pinned.mql.matches = true;
    pinned.listeners.forEach((cb) => cb());
    expect(pinned.root.dataset.theme).toBe("light");
  });
});
