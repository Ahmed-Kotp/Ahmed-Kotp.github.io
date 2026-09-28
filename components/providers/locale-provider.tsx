"use client";

import { getDictionary } from "@/lib/data";
import type { Dictionary, Locale } from "@/lib/schemas";
import { createContext, useContext, useSyncExternalStore } from "react";

const LOCALE_EVENT = "portfolio-locale";

function subscribe(onStoreChange: () => void) {
  window.addEventListener(LOCALE_EVENT, onStoreChange);
  return () => window.removeEventListener(LOCALE_EVENT, onStoreChange);
}

function getLocaleSnapshot(): Locale {
  return document.documentElement.dir === "rtl" ? "ar" : "en";
}

function applyLocale(locale: Locale) {
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  localStorage.setItem("locale", locale);
  window.dispatchEvent(new Event(LOCALE_EVENT));
}

const LocaleContext = createContext<{
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
  toggle: () => void;
} | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getLocaleSnapshot, (): Locale => "en");

  function setLocale(next: Locale) {
    applyLocale(next);
  }

  return (
    <LocaleContext.Provider
      value={{
        locale,
        dict: getDictionary(locale),
        setLocale,
        toggle: () => setLocale(getLocaleSnapshot() === "en" ? "ar" : "en"),
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("useLocale must be used within LocaleProvider");
  return value;
}
