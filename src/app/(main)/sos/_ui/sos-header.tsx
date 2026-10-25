"use client";

import Link from "next/link";
import {
  Siren,
  ChevronRight,
  Radio,
  Shield,
  Users,
  Compass,
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useT } from "@/lib/i18n/use-t";

export default function SOSHeader() {
  const { t } = useT();
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 18 },
    },
  };

  return (
    <div className="w-full relative overflow-hidden pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
        aria-hidden="true"
      />

      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-2=50 h-87.5 rounded-full bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.08)_0%,transparent_65%)] blur-[60px] pointer-events-none"
        aria-hidden="true"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto container relative z-10 flex flex-col gap-8"
      >
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between"
        >
          <nav
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/60 border border-border/40 backdrop-blur-xs select-none"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors duration-250"
            >
              {t("nav.home")}
            </Link>
            <ChevronRight className="size-3 text-muted-foreground/60" />
            <span className="text-xs font-bold text-destructive">SOS Desk</span>
          </nav>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <span className="relative flex size-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Live Connection Guard
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <motion.div
            variants={itemVariants}
            className="lg:col-span-8 flex flex-col gap-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-destructive/30 rounded-2xl blur-lg animate-pulse" />
                <div className="relative rounded-2xl bg-linear-to-br from-destructive to-destructive/80 text-destructive-foreground p-3.5 shadow-xl border border-white/10">
                  <Siren className="size-8 animate-bounce" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-[11px] font-extrabold uppercase tracking-widest w-fit mb-1">
                  National Response Grid
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-none">
                  {t("sos.badge")}
                </h1>
              </div>
            </div>

            <p className="text-base text-muted-foreground max-w-3xl leading-relaxed mt-2">{t("sos.headerBody")}</p>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-4 w-full">
            <div className="relative group overflow-hidden rounded-3xl bg-card/40 border border-destructive/25 p-6 backdrop-blur-xl shadow-xl flex flex-col gap-5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-destructive/10 text-destructive">
                    <Radio className="size-5 animate-pulse" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">
                      Dispatch System
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                      Active & Online
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block">
                    Response
                  </span>
                  <span className="text-lg font-black text-destructive">
                    ~23 Min
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-muted/40 border border-border/40 text-center">
                  <Shield className="size-4 text-muted-foreground mb-1" />
                  <span className="text-[10px] font-bold text-foreground">
                    Verified
                  </span>
                  <span className="text-[9px] text-muted-foreground uppercase font-semibold">
                    Security
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-muted/40 border border-border/40 text-center">
                  <Users className="size-4 text-muted-foreground mb-1" />
                  <span className="text-[10px] font-bold text-foreground">
                    1,240+
                  </span>
                  <span className="text-[9px] text-muted-foreground uppercase font-semibold">
                    Rescuers
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-muted/40 border border-border/40 text-center">
                  <Compass className="size-4 text-muted-foreground mb-1" />
                  <span className="text-[10px] font-bold text-foreground">
                    Live GPS
                  </span>
                  <span className="text-[9px] text-muted-foreground uppercase font-semibold">
                    Tracking
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
