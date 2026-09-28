"use client";

import { createContext, useCallback, useContext } from "react";

const ThemeContext = createContext<(() => void) | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const toggle = useCallback(() => {
    const next = document.documentElement.classList.contains("light") ? "dark" : "light";
    localStorage.setItem("theme", next);
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(next);
  }, []);

  return <ThemeContext.Provider value={toggle}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const toggle = useContext(ThemeContext);
  if (!toggle) throw new Error("useTheme must be used within ThemeProvider");
  return { toggle };
}
