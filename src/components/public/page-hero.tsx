"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/use-t";

export interface HeroStat {
  label: string;
  value: string | number | undefined;
  icon: LucideIcon;
  tone?: "default" | "alert";
}

interface PageHeroProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  crumb: string;
  eyebrow?: string;
  tone?: "brand" | "night" | "alert";
  aside?: React.ReactNode;
  stats?: HeroStat[];
  statsTitle?: string;
  className?: string;
}

export function PageHero({
  icon: Icon,
  title,
  description,
  crumb,
  eyebrow,
  aside,
  stats,
  statsTitle = "Live right now",
  className,
}: PageHeroProps) {
  const { t } = useT();
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "grid grid-cols-1 overflow-hidden rounded-[2rem] border border-border bg-card",
        stats && "lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]",
        className,
      )}
    >
      <div className="relative flex flex-col justify-center gap-5 p-6 md:p-10">
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(0.3_0.06_165/0.05)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.3_0.06_165/0.05)_1px,transparent_1px)] bg-size-[36px_36px] mask-[radial-gradient(ellipse_80%_80%_at_0%_0%,#000_30%,transparent_80%)]"
          aria-hidden
        />
        <nav className="relative flex items-center gap-1 text-xs font-semibold text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            {t("nav.home")}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{crumb}</span>
        </nav>
        <div className="relative flex items-start gap-4">
          <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-lime sm:flex">
            <Icon className="h-7 w-7" />
          </div>
          <div className="min-w-0">
            {eyebrow && (
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
                </span>
                {eyebrow}
              </span>
            )}
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">{title}</h1>
            {description && <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>}
          </div>
        </div>
        {aside && <div className="relative">{aside}</div>}
      </div>

      {stats && (
        <div className="relative overflow-hidden bg-primary p-6 text-primary-foreground md:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" aria-hidden />
          <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full border border-white/10" aria-hidden />
          <p className="relative text-xs font-semibold uppercase tracking-[0.14em] text-white/60">{statsTitle}</p>
          <div className="relative mt-4 grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/7 p-4 ring-1 ring-white/10">
                <s.icon className={cn("h-5 w-5", s.tone === "alert" ? "text-[oklch(0.78_0.15_25)]" : "text-lime")} />
                {s.value === undefined ? (
                  <Skeleton className="mt-3 h-8 w-16 bg-white/15" />
                ) : (
                  <p className="mt-3 text-3xl font-bold tabular-nums leading-none">{s.value}</p>
                )}
                <p className="mt-1.5 text-xs text-white/65">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
}
