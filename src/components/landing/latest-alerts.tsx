"use client";

import { MapPin, Droplets, ArrowRight, CloudOff } from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useAlerts } from "@/lib/hooks/use-alerts";
import { timeAgo } from "@/lib/format-time-ago";
import type { AlertSeverity } from "@/lib/types/api";
import { useT } from "@/lib/i18n/use-t";

const severityStyles: Record<AlertSeverity, { dot: string; badge: string; glow: string }> = {
  CRITICAL: {
    dot: "bg-[oklch(0.55_0.2_30)]",
    badge: "bg-[oklch(0.55_0.2_30/0.25)] text-[oklch(0.85_0.1_30)] ring-[oklch(0.6_0.2_30/0.5)]",
    glow: "from-[oklch(0.55_0.2_30/0.35)]",
  },
  DANGER: {
    dot: "bg-[oklch(0.64_0.22_22)]",
    badge: "bg-[oklch(0.64_0.22_22/0.22)] text-[oklch(0.85_0.1_22)] ring-[oklch(0.64_0.22_22/0.5)]",
    glow: "from-[oklch(0.64_0.22_22/0.3)]",
  },
  WARNING: {
    dot: "bg-[oklch(0.74_0.17_55)]",
    badge: "bg-[oklch(0.74_0.17_55/0.2)] text-[oklch(0.88_0.1_60)] ring-[oklch(0.74_0.17_55/0.5)]",
    glow: "from-[oklch(0.74_0.17_55/0.28)]",
  },
  WATCH: {
    dot: "bg-[oklch(0.85_0.16_95)]",
    badge: "bg-[oklch(0.85_0.16_95/0.18)] text-[oklch(0.92_0.1_95)] ring-[oklch(0.85_0.16_95/0.45)]",
    glow: "from-[oklch(0.85_0.16_95/0.22)]",
  },
  NORMAL: {
    dot: "bg-[oklch(0.72_0.16_155)]",
    badge: "bg-[oklch(0.72_0.16_155/0.2)] text-[oklch(0.88_0.1_155)] ring-[oklch(0.72_0.16_155/0.45)]",
    glow: "from-[oklch(0.72_0.16_155/0.22)]",
  },
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function LatestAlerts() {
  const { t, pick } = useT();
  const { data, isLoading } = useAlerts({ limit: 6, isActive: true });
  const alerts = data?.data ?? [];
  const maxLevel = Math.max(400, ...alerts.map((a) => a.waterLevelCm ?? 0));

  return (
    <section className="relative my-6 md:my-20 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-night px-5 py-10 sm:px-10 md:py-14 text-white shadow-lift">
          <div className="absolute inset-0 bg-dots opacity-30" aria-hidden />
          <div className="absolute -top-32 left-1/4 h-80 w-80 rounded-full bg-brand-blue/40 blur-3xl" aria-hidden />
          <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-brand-cyan/25 blur-3xl" aria-hidden />

          <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-cyan">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.64_0.22_22)] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[oklch(0.64_0.22_22)]" />
                </span>
                Live monitor
              </span>
              <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">Latest Alerts</h2>
              <p className="text-sm md:text-base text-white/65 mt-2">
                Most recent flood updates from river gauges across Bangladesh
              </p>
            </div>
            <Link
              href="/alerts"
              className="group inline-flex items-center gap-2 self-start sm:self-auto rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[oklch(0.25_0.08_265)] shadow-lg transition hover:bg-white/90"
            >
              View All Alerts
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-3xl bg-white/10" />
              ))}
            </div>
          ) : alerts.length > 0 ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={containerVariants}
              className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {alerts.map((alert) => {
                const style = severityStyles[alert.severity];
                const pct = alert.waterLevelCm ? Math.min(100, (alert.waterLevelCm / maxLevel) * 100) : 0;
                return (
                  <motion.div key={alert.id} variants={rowVariants}>
                    <Link
                      href={`/alerts?district=${alert.districtId}`}
                      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white/[0.06] bg-linear-to-br to-transparent p-5 ring-1 ring-white/10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.1] hover:ring-white/25 ${style.glow}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ring-1 ${style.badge}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                          {t(`severity.${alert.severity}`)}
                        </span>
                        <span className="text-xs font-semibold text-white/55 tabular-nums">{timeAgo(alert.createdAt)}</span>
                      </div>

                      <h3 className="mt-4 text-base md:text-lg font-bold leading-snug text-white group-hover:text-brand-cyan transition-colors">
                        {pick(alert.title, alert.titleBn)}
                      </h3>
                      <div className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-white/60">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        {pick(alert.district.nameEn, alert.district.nameBn)}
                      </div>

                      <div className="mt-auto pt-5">
                        <div className="flex items-center justify-between text-xs text-white/60">
                          <span className="inline-flex items-center gap-1.5">
                            <Droplets className="h-3.5 w-3.5" />
                            Water level
                          </span>
                          <span className="font-bold text-white tabular-nums">
                            {alert.waterLevelCm !== null ? `${alert.waterLevelCm} cm` : "—"}
                          </span>
                        </div>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                          <div className={`h-full rounded-full ${style.dot}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="relative flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-dashed border-white/20">
              <CloudOff className="h-10 w-10 text-white/40" />
              <p className="text-sm text-white/60 mt-3">No active flood alerts right now.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
