"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  type ThemePreference,
  THEME_COOKIE_MAX_AGE,
  THEME_PREFERENCE_COOKIE,
  THEME_PREFERENCE_KEY,
} from "./theme-config";

type ThemeContextValue = {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
};

type ThemeProviderProps = {
  children: ReactNode;
  initialTheme?: ThemePreference;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function applyTheme(value: ThemePreference) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (!root) return;
  if (value === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

function persistTheme(value: ThemePreference) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(THEME_PREFERENCE_KEY, value);
  } catch {
    // ignore storage errors
  }
  document.cookie = `${THEME_PREFERENCE_COOKIE}=${value}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax`;
}

function resolveInitialTheme(preferred?: ThemePreference): ThemePreference {
  if (preferred) {
    return preferred;
  }
  if (typeof window === "undefined") {
    return "light";
  }
  const saved = window.localStorage.getItem(THEME_PREFERENCE_KEY) as ThemePreference | null;
  if (saved === "light" || saved === "dark") {
    return saved;
  }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemePreference>(() => resolveInitialTheme(initialTheme));
  const initialThemeRef = useRef(theme);

  const updateEnvironment = useCallback((value: ThemePreference) => {
    applyTheme(value);
    persistTheme(value);
  }, []);

  useEffect(() => {
    updateEnvironment(initialThemeRef.current);
  }, [updateEnvironment]);

  const setTheme = useCallback(
    (value: ThemePreference) => {
      setThemeState(value);
      updateEnvironment(value);
    },
    [updateEnvironment],
  );

  const value = useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
