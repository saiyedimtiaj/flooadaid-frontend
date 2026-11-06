"use client";

import Link from "next/link";
import { ArrowUpRight, Droplets, Radar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAlerts } from "@/lib/hooks/use-alerts";
import { timeAgo } from "@/lib/format-time-ago";
import type { AlertSeverity } from "@/lib/types/api";
import { cn } from "@/lib/utils";

const SEVERITY: Record<AlertSeverity, { dot: string; chip: string; label: string; rank: number }> = {
  CRITICAL: { dot: "bg-alert-critical", chip: "bg-alert-critical/12 text-alert-critical", label: "Critical", rank: 5 },
  DANGER: { dot: "bg-alert-danger", chip: "bg-alert-danger/12 text-alert-danger", label: "Danger", rank: 4 },
  WARNING: { dot: "bg-alert-warning", chip: "bg-alert-warning/14 text-alert-warning", label: "Warning", rank: 3 },
  WATCH: { dot: "bg-alert-watch", chip: "bg-alert-watch/16 text-[oklch(0.6_0.13_85)]", label: "Watch", rank: 2 },
  NORMAL: { dot: "bg-alert-normal", chip: "bg-alert-normal/14 text-[oklch(0.55_0.15_150)]", label: "Normal", rank: 1 },
};

export function LiveAlertsPanel({ limit = 5 }: { limit?: number }) {
  const { data, isLoading } = useAlerts({ isActive: true, limit: 50 });
  const alerts = [...(data?.data ?? [])]
    .sort((a, b) => SEVERITY[b.severity].rank - SEVERITY[a.severity].rank)
    .slice(0, limit);
  const maxLevel = Math.max(400, ...alerts.map((a) => a.waterLevelCm ?? 0));

  return (
    <section className="h-full rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lime">
            <Radar className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Live flood alerts</h3>
            <p className="text-xs text-muted-foreground">Most severe first</p>
          </div>
        </div>
        <Link
          href="/alerts"
          className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
        >
          View all <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3.5">
              <Skeleton className="h-11 w-11 rounded-xl" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="hidden h-8 w-20 rounded-lg sm:block" />
            </div>
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No active alerts — all districts are calm.</p>
      ) : (
        <ul className="-mx-2 flex flex-col">
          {alerts.map((alert) => {
            const s = SEVERITY[alert.severity];
            const pct = alert.waterLevelCm ? Math.min(100, (alert.waterLevelCm / maxLevel) * 100) : 0;
            return (
              <li key={alert.id}>
                <Link
                  href={`/alerts?district=${alert.districtId}`}
                  className="group flex items-center gap-3.5 rounded-xl px-2 py-3 transition-colors hover:bg-muted/60"
                >
                  <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", s.chip)}>
                    <Droplets className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{alert.title}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className={cn("font-semibold", s.chip.split(" ").find((c) => c.startsWith("text-")))}>{s.label}</span>
                      <span>·</span>
                      <span className="truncate">{alert.district.nameEn}</span>
                      <span>·</span>
                      <span className="shrink-0">{timeAgo(alert.updatedAt)}</span>
                    </p>
                  </div>
                  <div className="hidden w-24 shrink-0 text-right sm:block">
                    <p className="text-sm font-bold tabular-nums text-foreground">
                      {alert.waterLevelCm ?? "—"}
                      <span className="ml-0.5 text-xs font-medium text-muted-foreground">cm</span>
                    </p>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div className={cn("h-full rounded-full", s.dot)} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
