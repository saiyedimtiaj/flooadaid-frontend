"use client";

import { MapPin, Droplets, ArrowRight, CloudOff } from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAlerts } from "@/lib/hooks/use-alerts";
import { timeAgo } from "@/lib/format-time-ago";
import type { AlertSeverity } from "@/lib/types/api";
import { useT } from "@/lib/i18n/use-t";

const severityStyles: Record<AlertSeverity, { bar: string; badge: string }> = {
  CRITICAL: {
    bar: "bg-destructive",
    badge: "text-destructive bg-destructive/10 border-destructive/20",
  },
  DANGER: {
    bar: "bg-destructive",
    badge: "text-destructive bg-destructive/10 border-destructive/20",
  },
  WARNING: {
    bar: "bg-amber-500",
    badge:
      "text-amber-700 dark:text-amber-500 bg-amber-500/10 border-amber-500/20",
  },
  WATCH: {
    bar: "bg-yellow-500",
    badge:
      "text-yellow-700 dark:text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  },
  NORMAL: {
    bar: "bg-emerald-500",
    badge:
      "text-emerald-700 dark:text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  },
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function LatestAlerts() {
  const { t, pick } = useT();
  const { data, isLoading } = useAlerts({ limit: 5, isActive: true });
  const alerts = data?.data ?? [];

  return (
    <section className="relative my-16 md:my-20 w-full bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
        <div className="flex flex-row items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Latest Alerts
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Most recent flood updates
            </p>
          </div>
          <Link
            href="/alerts"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline group shrink-0"
          >
            View All Alerts
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="rounded-xl overflow-hidden border border-border bg-card flex flex-col gap-px p-1">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : alerts.length > 0 ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
            className="rounded-xl overflow-hidden border border-border bg-card flex flex-col"
          >
            {alerts.map((alert, index) => {
              const style = severityStyles[alert.severity];
              return (
                <motion.div key={alert.id} variants={rowVariants}>
                  <div className="relative flex items-stretch py-4 px-5 hover:bg-muted/40 transition-colors duration-150 cursor-pointer first:pt-5 last:pb-5 group">
                    <div className={`w-0.75 shrink-0 rounded-full ${style.bar}`} />

                    <div className="flex-1 ml-4 flex flex-col justify-between">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-extrabold tracking-wider rounded-sm border leading-none select-none ${style.badge}`}
                          >
                            {t(`severity.${alert.severity}`)}
                          </span>
                          <span className="text-muted-foreground text-xs leading-none select-none">
                            ·
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-foreground leading-none">
                            {pick(alert.district.nameEn, alert.district.nameBn)}
                          </span>
                        </div>
                        <span className="hidden sm:inline text-xs font-semibold text-muted-foreground shrink-0 tabular-nums">
                          {timeAgo(alert.createdAt)}
                        </span>
                      </div>

                      <h3 className="text-sm md:text-base font-semibold text-foreground leading-snug mt-1.5 pr-2 group-hover:text-primary transition-colors duration-150">
                        {pick(alert.title, alert.titleBn)}
                      </h3>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                          <div className="inline-flex items-center gap-1 text-xs text-muted-foreground font-medium">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span>{alert.district.nameBn}</span>
                          </div>
                          {alert.waterLevelCm !== null && (
                            <div className="inline-flex items-center gap-1 text-xs text-muted-foreground font-medium">
                              <Droplets className="h-3.5 w-3.5 shrink-0" />
                              <span>{alert.waterLevelCm}cm</span>
                            </div>
                          )}
                        </div>

                        <span className="inline sm:hidden text-xs font-semibold text-muted-foreground tabular-nums leading-none">
                          {timeAgo(alert.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {index < alerts.length - 1 && (
                    <Separator className="bg-border" />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-muted/10">
            <CloudOff className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground mt-3">No active flood alerts right now.</p>
          </div>
        )}
      </div>
    </section>
  );
}
