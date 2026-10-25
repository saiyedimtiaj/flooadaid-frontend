"use client";

import { useSyncExternalStore } from "react";

export type Lang = "en" | "bn";

const STORAGE_KEY = "floodaid:lang";
const listeners = new Set<() => void>();

function read(): Lang {
  try {
    return localStorage.getItem(STORAGE_KEY) === "bn" ? "bn" : "en";
  } catch {
    // Storage blocked (private mode, etc.) — fall back to English.
    return "en";
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => e.key === STORAGE_KEY && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function setLang(lang: Lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Not persisted, but still switch for this page view below.
  }
  memoryLang = lang;
  document.documentElement.lang = lang;
  listeners.forEach((l) => l());
}

// Used when localStorage is unavailable so the toggle still works in-session.
let memoryLang: Lang | null = null;

/** The chosen UI language. Always "en" during SSR and the first client render. */
export function useLang(): Lang {
  return useSyncExternalStore(
    subscribe,
    () => memoryLang ?? read(),
    () => "en",
  );
}
