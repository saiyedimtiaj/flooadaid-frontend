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
} from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardWelcomeCard } from "@/components/dashboard/welcome-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { useDashboardStats } from "@/lib/hooks/use-reports";
import { useSosRequests } from "@/lib/hooks/use-sos";
import { SosStatusBadge } from "@/components/dashboard/sos-status-badge";

const QUICK_ACTIONS = [
  { href: "/admin/alerts", icon: Radar, label: "Post Alert" },
  { href: "/admin/shelters", icon: MapPin, label: "Add Shelter" },
  { href: "/admin/sos", icon: Siren, label: "Manage SOS" },
  { href: "/admin/relief", icon: Package, label: "Log Relief" },
];

export default function AdminDashboardPage() {
  const { data: currentUser } = useCurrentUser();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: recentSos, isLoading: sosLoading } = useSosRequests({ limit: 5 });

  return (
    <div className="flex flex-col gap-6">
      <DashboardWelcomeCard
        icon={ShieldCheck}
        title={`Welcome, ${currentUser?.name?.split(" ")[0] ?? "Admin"}`}
        description="Manage FloodAid alerts, shelters, SOS requests, relief, and volunteers."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Alerts" value={stats?.activeAlerts} icon={Radar} tint="destructive" isLoading={statsLoading} />
        <StatCard label="Open Shelters" value={stats?.openShelters} icon={MapPin} tint="primary" isLoading={statsLoading} />
        <StatCard
          label="SOS Resolved"
          value={stats ? `${stats.resolvedSosRequests}/${stats.totalSosRequests}` : undefined}
          icon={Siren}
          tint="success"
          isLoading={statsLoading}
        />
        <StatCard label="Active Volunteers" value={stats?.activeVolunteers} icon={Users} tint="warning" isLoading={statsLoading} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map(({ href, icon: Icon, label }, i) => (
          <motion.div
            key={href}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
          >
            <Link href={href}>
              <Card className="group rounded-2xl border border-border bg-card p-4 flex flex-col items-center justify-center gap-2 text-center hover:border-primary/40 hover:bg-primary/5 transition-all hover:-translate-y-0.5">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-foreground">{label}</span>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

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
