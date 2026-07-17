"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface PublicHeroProps {
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  description: string;
  /** Breadcrumb label shown after "Home ›". Defaults to the eyebrow. */
  breadcrumb?: string;
}

/**
 * Consistent hero band for the marketing / info public pages
 * (how-it-works, safety, report, privacy, terms). Matches the
 * gradient + eyebrow language of the alerts/shelters page headers.
 */
export function PublicHero({ eyebrow, icon: Icon, title, description, breadcrumb }: PublicHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-linear-to-br from-primary/8 via-transparent to-destructive/5 pt-28 pb-14">
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_20%_0%,color-mix(in_oklch,var(--color-primary)_10%,transparent),transparent)] pointer-events-none"
        aria-hidden="true"
      />
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-start"
        >
          <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground select-none mb-5">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{breadcrumb ?? eyebrow}</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 mb-4">
            <Icon className="h-3.5 w-3.5 text-primary" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">{eyebrow}</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground text-balance">
            {title}
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
