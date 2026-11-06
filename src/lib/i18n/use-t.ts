"use client";

import { useCallback } from "react";
import { bn, en, type MessageKey } from "./dictionaries";
import { setLang, useLang, type Lang } from "./language-store";

const DIGITS_BN = "০১২৩৪৫৬৭৮৯";

/**
 * `t(key)` for shared UI strings, `tr(en, bn)` for page-local copy,
 * `pick(en, bn)` for API data that carries its own Bangla field
 * (district.nameBn, alert.titleBn …), and `num(n)` for digits.
 */
export function useT() {
  const lang = useLang();

  const t = useCallback(
    (key: MessageKey) => (lang === "bn" ? bn[key] : en[key]),
    [lang],
  );

  const pick = useCallback(
    (english: string, bangla?: string | null) =>
      lang === "bn" && bangla ? bangla : english,
    [lang],
  );

  const tr = useCallback(
    (english: string, bangla: string) => (lang === "bn" ? bangla : english),
    [lang],
  );

  const num = useCallback(
    (value: number | string) => {
      const text = typeof value === "number" ? value.toLocaleString("en-US") : value;
      return lang === "bn" ? text.replace(/\d/g, (d) => DIGITS_BN[Number(d)]) : text;
    },
    [lang],
  );

  return { lang, t, tr, pick, num, setLang: (l: Lang) => setLang(l) };
}

export type { Lang, MessageKey };
