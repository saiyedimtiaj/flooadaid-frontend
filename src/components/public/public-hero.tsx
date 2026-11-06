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
    <section className="relative overflow-hidden bg-night text-white pt-32 pb-24 md:pb-28">
      <div className="absolute inset-0 bg-dots opacity-30" aria-hidden="true" />
      <div className="absolute -top-24 right-[10%] h-96 w-96 rounded-full bg-brand-blue/45 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-40 left-[5%] h-96 w-96 rounded-full bg-brand-cyan/30 blur-3xl" aria-hidden="true" />
      <svg
        className="absolute inset-x-0 -bottom-px h-16 md:h-20 w-full text-background"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path fill="currentColor" opacity="0.35" d="M0 50c150 40 300 50 450 24S750 10 900 26s300 44 300 44v50H0z" />
        <path fill="currentColor" d="M0 80c150-28 300-34 450-14s300 42 450 30 300-36 300-36v60H0z" />
      </svg>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-start"
        >
          <div className="flex items-center gap-1 text-xs font-semibold text-white/60 select-none mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">{breadcrumb ?? eyebrow}</span>
          </div>

          <div className="flex items-center gap-4 mb-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand shadow-[0_12px_32px_-8px_oklch(0.6_0.18_230/0.8)]">
              <Icon className="h-7 w-7" />
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-cyan">
              {eyebrow}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance">
            {title}
          </h1>
          <p className="mt-5 text-base md:text-xl text-white/70 max-w-2xl leading-relaxed">
            {description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
