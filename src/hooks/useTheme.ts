"use client";

import { useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark";

interface UseThemeReturn {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  /** False until after hydration — use to avoid SSR mismatch on theme-sensitive UI */
  mounted: boolean;
}

const STORAGE_KEY = "kamal-theme";

function applyTheme(t: Theme) {
  document.documentElement.classList.toggle("dark", t === "dark");
}

function getStoredTheme(): Theme | null {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    return val === "dark" || val === "light" ? val : null;
  } catch {
    return null;
  }
}

function saveTheme(t: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, t);
  } catch {
    /* private browsing — silently skip */
  }
}

export function useTheme(): UseThemeReturn {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Resolve: stored preference → system preference → default light
    const stored = getStoredTheme();
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolved: Theme = stored ?? (prefersDark ? "dark" : "light");

    setTheme(resolved);
    applyTheme(resolved);
    setMounted(true);

    // Keep in sync if the user changes OS-level theme and has no stored pref
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (!getStoredTheme()) {
        const next: Theme = e.matches ? "dark" : "light";
        setTheme(next);
        applyTheme(next);
      }
    };
    mq.addEventListener("change", handleSystemChange);
    return () => mq.removeEventListener("change", handleSystemChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "light" ? "dark" : "light";
      applyTheme(next);
      saveTheme(next);
      return next;
    });
  }, []);

  return { theme, isDark: theme === "dark", toggleTheme, mounted };
}
