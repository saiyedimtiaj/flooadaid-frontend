"use client";

import type { LucideIcon } from "lucide-react";
import { PublicHero } from "@/components/public/public-hero";
import { useT } from "@/lib/i18n/use-t";

export interface LegalSection {
  id: string;
  heading: string;
  body: React.ReactNode;
}

interface LegalLayoutProps {
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
}

/**
 * Shared readable layout for legal documents (privacy, terms):
 * a hero, a sticky section-nav on desktop, and prose sections.
 */
export function LegalLayout({
  eyebrow,
  icon,
  title,
  description,
  lastUpdated,
  sections,
}: LegalLayoutProps) {
  const { tr, num, lang } = useT();
  return (
    <div className="bg-background">
      <PublicHero eyebrow={eyebrow} breadcrumb={eyebrow} icon={icon} title={title} description={description} />

      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-8">
            {tr("Last updated", "সর্বশেষ হালনাগাদ")}: {lastUpdated}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">
            {/* Sticky section nav (desktop) */}
            <nav className="hidden lg:block">
              <div className="sticky top-24 flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-3 mb-1">
                  {tr("On this page", "এই পৃষ্ঠায়")}
                </span>
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    {s.heading}
                  </a>
                ))}
              </div>
            </nav>

            {/* Content */}
            <div className="flex flex-col gap-10 min-w-0">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-24">
                  <h2 className="text-lg md:text-xl font-bold text-foreground flex items-baseline gap-2">
                    <span className="text-sm font-mono text-primary">
                      {lang === "bn" ? `০${num(i + 1)}` : String(i + 1).padStart(2, "0")}
                    </span>
                    {s.heading}
                  </h2>
                  <div className="mt-3 text-sm text-muted-foreground leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:text-primary [&_a]:font-medium [&_strong]:text-foreground [&_strong]:font-semibold">
                    {s.body}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
