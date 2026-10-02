"use client";

import { useSyncExternalStore } from "react";
import { uiCopy } from "@/data/site";
import { applyTheme, saveTheme, type Theme } from "@/lib/theme";
import styles from "./ThemeToggle.module.scss";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function getServerSnapshot(): Theme | null {
  return null;
}

type ThemeToggleProps = { className?: string };

export function ThemeToggle({ className }: ThemeToggleProps) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const next: Theme = theme === "dark" ? "light" : "dark";
  const label =
    theme === null ? uiCopy.themeFallback : next === "dark" ? uiCopy.themeToDark : uiCopy.themeToLight;

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    saveTheme(next);
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!document.startViewTransition || reduceMotion) {
      applyTheme(next, root);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    root.style.setProperty("--vt-x", `${rect.left + rect.width / 2}px`);
    root.style.setProperty("--vt-y", `${rect.top + rect.height / 2}px`);
    document.startViewTransition(() => applyTheme(next, root));
  }

  return (
    <button
      type="button"
      className={[styles.toggle, className].filter(Boolean).join(" ")}
      aria-label={label}
      title={label}
      onClick={handleClick}
    >
      <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        {theme === "dark" ? (
          <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </g>
        ) : (
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"
          />
        )}
      </svg>
    </button>
  );
}
