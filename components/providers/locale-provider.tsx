"use client";

import { getDictionary } from "@/lib/data";
import type { Dictionary } from "@/lib/schemas";
import { createContext, useContext } from "react";

const LocaleContext = createContext<Dictionary | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  return <LocaleContext.Provider value={getDictionary("en")}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const dict = useContext(LocaleContext);
  if (!dict) throw new Error("useLocale must be used within LocaleProvider");
  return { locale: "en" as const, dict };
}
