"use client";

import { BarChart3, Download, FileText, Siren, Package, MapPinned, Radar, Home, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { useDashboardStats, useReliefSummary, useSosSummary, reportExportUrls } from "@/lib/hooks/use-reports";
import { cn } from "@/lib/utils";

const SOS_STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-destructive",
  ASSIGNED: "bg-amber-500",
  IN_PROGRESS: "bg-info",
  RESOLVED: "bg-emerald-500",
  CANCELLED: "bg-muted-foreground",
};

/** Horizontal bar meter — one row per label, width proportional to `value / max`. */
function BarMeter({
  data,
  colorFor,
  unitFor,
}: {
  data: [string, number][];
  colorFor?: (label: string) => string;
  unitFor?: (label: string) => string;
}) {
  const max = Math.max(1, ...data.map(([, v]) => v));
  return (
    <div className="flex flex-col gap-3">
      {data.map(([label, value]) => (
        <div key={label} className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground capitalize">{label.replace(/_/g, " ").toLowerCase()}</span>
            <span className="font-bold text-foreground tabular-nums">
              {value.toLocaleString()}
              {unitFor ? ` ${unitFor(label)}` : ""}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-500", colorFor?.(label) ?? "bg-primary")}
              style={{ width: `${Math.round((value / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
      {data.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">No data yet.</p>
      )}
    </div>
  );
}

export default function AdminReportsPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: sosSummary, isLoading: sosLoading } = useSosSummary();
  const { data: reliefSummary, isLoading: reliefLoading } = useReliefSummary();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={BarChart3}
        title="Reports & Analytics"
        description="Platform-wide statistics and exportable reports"
        action={
          <div className="flex items-center gap-2">
            <a href={reportExportUrls.csv} download className={cn(buttonVariants({ variant: "outline" }), "gap-2 font-semibold")}>
              <Download className="h-4 w-4" />
              Export CSV
            </a>
            <a href={reportExportUrls.pdf} download className={cn(buttonVariants(), "gap-2 font-semibold")}>
              <FileText className="h-4 w-4" />
              Export PDF
            </a>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Districts Affected" value={stats?.districtsAffected} icon={MapPinned} tint="destructive" isLoading={statsLoading} />
        <StatCard label="Active Alerts" value={stats?.activeAlerts} icon={Radar} tint="warning" isLoading={statsLoading} />
        <StatCard label="Open Shelters" value={stats?.openShelters} icon={Home} tint="primary" isLoading={statsLoading} />
        <StatCard
          label="Shelter Occupancy"
          value={stats ? `${stats.peopleCurrentlySheltered}/${stats.totalShelterCapacity}` : undefined}
          icon={Users}
          tint="teal"
          isLoading={statsLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="rounded-3xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Siren className="h-4 w-4 text-destructive" />
            <h3 className="text-sm font-bold text-foreground">SOS Analytics</h3>
          </div>
          {sosLoading || !sosSummary ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-muted/40 p-4">
                  <span className="text-2xl font-extrabold text-foreground tabular-nums">{sosSummary.resolvedCount}</span>
                  <p className="text-xs font-semibold text-muted-foreground mt-1">Resolved</p>
                </div>
                <div className="rounded-2xl bg-muted/40 p-4">
                  <span className="text-2xl font-extrabold text-foreground tabular-nums">
                    {sosSummary.avgResolutionHours !== null ? `${sosSummary.avgResolutionHours}h` : "—"}
                  </span>
                  <p className="text-xs font-semibold text-muted-foreground mt-1">Avg. Resolution</p>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">By Status</p>
                <BarMeter
                  data={Object.entries(sosSummary.byStatus)}
                  colorFor={(label) => SOS_STATUS_COLOR[label] ?? "bg-primary"}
                />
              </div>
            </div>
          )}
        </Card>

        <Card className="rounded-3xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Package className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Relief Analytics</h3>
          </div>
          {reliefLoading || !reliefSummary ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-muted/40 p-3">
                  <span className="text-xl font-extrabold text-foreground tabular-nums">{reliefSummary.totalDistributions}</span>
                  <p className="text-[11px] font-semibold text-muted-foreground mt-1 leading-tight">Distributions</p>
                </div>
                <div className="rounded-2xl bg-muted/40 p-3">
                  <span className="text-xl font-extrabold text-foreground tabular-nums">{reliefSummary.totalFamiliesServed}</span>
                  <p className="text-[11px] font-semibold text-muted-foreground mt-1 leading-tight">Families</p>
                </div>
                <div className="rounded-2xl bg-muted/40 p-3">
                  <span className="text-xl font-extrabold text-foreground tabular-nums">{reliefSummary.districtsServed}</span>
                  <p className="text-[11px] font-semibold text-muted-foreground mt-1 leading-tight">Districts</p>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Items Distributed</p>
                <BarMeter
                  data={Object.entries(reliefSummary.itemTotals).map(([item, { quantity }]) => [item, quantity])}
                  colorFor={() => "bg-primary"}
                  unitFor={(label) => reliefSummary.itemTotals[label]?.unit ?? ""}
                />
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
