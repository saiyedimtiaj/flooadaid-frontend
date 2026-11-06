"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Radar,
  MapPin,
  Siren,
  Package,
  Users,
  ArrowUpRight,
  Home,
  Boxes,
  Building2,
  Clock,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardWelcomeCard } from "@/components/dashboard/welcome-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { useDashboardStats, useSosSummary } from "@/lib/hooks/use-reports";
import { useSosRequests } from "@/lib/hooks/use-sos";
import { SosStatusBadge } from "@/components/dashboard/sos-status-badge";

const QUICK_ACTIONS = [
  { href: "/admin/alerts", icon: Radar, label: "Post Alert", tint: "text-destructive bg-destructive/10" },
  { href: "/admin/shelters", icon: MapPin, label: "Add Shelter", tint: "text-primary bg-primary/10" },
  { href: "/admin/sos", icon: Siren, label: "Manage SOS", tint: "text-amber-600 dark:text-amber-500 bg-amber-500/10" },
  { href: "/admin/relief", icon: Package, label: "Relief", tint: "text-accent-teal bg-accent-teal/10" },
  { href: "/admin/volunteers", icon: Users, label: "Volunteers", tint: "text-violet-600 dark:text-violet-400 bg-violet-500/10" },
  { href: "/admin/reports", icon: Boxes, label: "Reports", tint: "text-sky-600 dark:text-sky-400 bg-sky-500/10" },
];

const SOS_STATUS_META: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "bg-amber-500" },
  ASSIGNED: { label: "Assigned", color: "bg-sky-500" },
  IN_PROGRESS: { label: "In Progress", color: "bg-violet-500" },
  RESOLVED: { label: "Resolved", color: "bg-emerald-500" },
  CANCELLED: { label: "Cancelled", color: "bg-muted-foreground" },
};

const fade: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export default function AdminDashboardPage() {
  const { data: currentUser } = useCurrentUser();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: sosSummary, isLoading: summaryLoading } = useSosSummary();
  const { data: recentSos, isLoading: sosLoading } = useSosRequests({ limit: 5 });

  const capacityRate =
    stats && stats.totalShelterCapacity > 0
      ? Math.round((stats.peopleCurrentlySheltered / stats.totalShelterCapacity) * 100)
      : 0;

  const statusEntries = sosSummary
    ? Object.entries(SOS_STATUS_META).map(([key, meta]) => ({
        key,
        ...meta,
        count: sosSummary.byStatus[key] ?? 0,
      }))
    : [];
  const statusTotal = statusEntries.reduce((s, e) => s + e.count, 0);

  return (
    <div className="flex flex-col gap-6">
      <DashboardWelcomeCard
        icon={ShieldCheck}
        title={`Welcome, ${currentUser?.name?.split(" ")[0] ?? "Admin"}`}
        description="Manage FloodAid alerts, shelters, SOS requests, relief, and volunteers."
      />

      {/* Primary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Alerts" value={stats?.activeAlerts} icon={Radar} tint="destructive" isLoading={statsLoading} href="/admin/alerts" footerLabel="Manage alerts" />
        <StatCard label="Open Shelters" value={stats?.openShelters} icon={MapPin} tint="primary" isLoading={statsLoading} href="/admin/shelters" footerLabel="View shelters" />
        <StatCard
          label="SOS Resolved"
          value={stats ? `${stats.resolvedSosRequests}/${stats.totalSosRequests}` : undefined}
          icon={Siren}
          tint="success"
          isLoading={statsLoading}
          highlight
          href="/admin/sos"
          footerLabel="Open SOS queue"
        />
        <StatCard label="Active Volunteers" value={stats?.activeVolunteers} icon={Users} tint="warning" isLoading={statsLoading} href="/admin/volunteers" footerLabel="View volunteers" />
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Districts Affected" value={stats?.districtsAffected} icon={Building2} tint="info" isLoading={statsLoading} />
        <StatCard label="People Sheltered" value={stats?.peopleCurrentlySheltered} icon={Home} tint="teal" isLoading={statsLoading} />
        <StatCard label="Shelter Capacity" value={stats?.totalShelterCapacity} icon={Boxes} tint="primary" isLoading={statsLoading} />
        <StatCard label="Relief Distributions" value={stats?.reliefDistributions} icon={Package} tint="success" isLoading={statsLoading} />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {QUICK_ACTIONS.map(({ href, icon: Icon, label, tint }, i) => (
          <motion.div
            key={href}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 + i * 0.05 }}
          >
            <Link href={href}>
              <Card className="group rounded-2xl border border-border bg-card p-4 flex flex-col items-center justify-center gap-2 text-center hover:border-primary/40 hover:bg-primary/5 transition-all hover:-translate-y-0.5">
                <div className={`flex items-center justify-center h-10 w-10 rounded-xl transition-transform group-hover:scale-105 ${tint}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-foreground">{label}</span>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SOS status breakdown */}
        <motion.div variants={fade} initial="hidden" animate="visible">
          <Card className="rounded-3xl border border-border bg-card p-6 h-full">
            <h3 className="text-sm font-bold text-foreground mb-4">SOS by Status</h3>
            {summaryLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : statusTotal === 0 ? (
              <EmptyState icon={Siren} title="No SOS data yet" />
            ) : (
              <div className="flex flex-col gap-3.5">
                {statusEntries.map((e) => {
                  const pct = statusTotal > 0 ? Math.round((e.count / statusTotal) * 100) : 0;
                  return (
                    <div key={e.key} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-foreground">{e.label}</span>
                        <span className="text-muted-foreground">{e.count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${e.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.7, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  );
                })}
                {sosSummary?.avgResolutionHours != null && (
                  <div className="flex items-center gap-2 mt-2 pt-3 border-t border-border text-xs text-muted-foreground">
                    <Clock className="size-3.5" />
                    Avg. resolution:{" "}
                    <span className="font-semibold text-foreground">
                      {sosSummary.avgResolutionHours.toFixed(1)} hrs
                    </span>
                  </div>
                )}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Shelter capacity gauge */}
        <motion.div variants={fade} initial="hidden" animate="visible" transition={{ delay: 0.08 }}>
          <Card className="rounded-3xl border border-border bg-card p-6 h-full flex flex-col">
            <h3 className="text-sm font-bold text-foreground mb-4">Shelter Occupancy</h3>
            {statsLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="relative size-40">
                  <svg viewBox="0 0 120 120" className="size-full -rotate-90">
                    <circle cx="60" cy="60" r="52" fill="none" strokeWidth="12" className="stroke-muted" />
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      strokeWidth="12"
                      strokeLinecap="round"
                      className="stroke-primary"
                      strokeDasharray={2 * Math.PI * 52}
                      initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - capacityRate / 100) }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-foreground">{capacityRate}%</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Occupied
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  <span className="font-semibold text-foreground">
                    {stats?.peopleCurrentlySheltered ?? 0}
                  </span>{" "}
                  sheltered of{" "}
                  <span className="font-semibold text-foreground">
                    {stats?.totalShelterCapacity ?? 0}
                  </span>{" "}
                  total capacity
                </p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Recent SOS */}
      <Card className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground">Recent SOS Requests</h3>
          <Link
            href="/admin/sos"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {sosLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : recentSos && recentSos.data.length > 0 ? (
          <div className="flex flex-col divide-y divide-border">
            {recentSos.data.map((sos) => (
              <div key={sos.id} className="flex items-center justify-between py-3 gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{sos.name}</p>
                  <p className="text-xs text-muted-foreground truncate capitalize">
                    {sos.district?.nameEn} · {sos.peopleCount} people · {sos.helpType.join(", ")}
                  </p>
                </div>
                <SosStatusBadge status={sos.status} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={Siren} title="No SOS requests yet" description="New rescue requests will show up here." />
        )}
      </Card>
    </div>
  );
}
