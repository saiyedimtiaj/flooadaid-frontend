"use client";

import { useEffect } from "react";
import { Languages } from "lucide-react";
import { useT } from "@/lib/i18n/use-t";
import { cn } from "@/lib/utils";

/** EN ⇄ বাংলা switch for the public pages. */
export function LanguageToggle({ className }: { className?: string }) {
  const { lang, t, setLang } = useT();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <button
      type="button"
      onClick={() => setLang(lang === "en" ? "bn" : "en")}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors",
        className,
      )}
      aria-label={lang === "en" ? "বাংলায় দেখুন" : "Switch to English"}
    >
      <Languages className="size-4" />
      {t("nav.language")}
    </button>
  );
}
