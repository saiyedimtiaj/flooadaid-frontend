"use client";

import Link from "next/link";
import { LifeBuoy, ClipboardList, ArrowUpRight, CheckCircle2, UserRoundPlus, Package, PackagePlus, PhoneCall } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardWelcomeCard } from "@/components/dashboard/welcome-card";
import { SosStatusBadge } from "@/components/dashboard/sos-status-badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { ActionTile } from "@/components/dashboard/action-tile";
import { LiveAlertsPanel } from "@/components/dashboard/live-alerts-panel";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { useMyTasks, useMyVolunteerProfile } from "@/lib/hooks/use-volunteers";

export default function VolunteerDashboardPage() {
  const { data: user } = useCurrentUser();
  const isVolunteer = user?.role === "VOLUNTEER";
  const { data: profile } = useMyVolunteerProfile(isVolunteer);
  const { data: tasks, isLoading } = useMyTasks(isVolunteer);

  if (!isVolunteer) {
    return (
      <div className="flex flex-col gap-6">
        <DashboardWelcomeCard
          icon={LifeBuoy}
          title={`Welcome, ${user?.name?.split(" ")[0] ?? "there"}`}
          description="You're one step away from becoming a FloodAid volunteer."
        />
        <Card className="rounded-3xl p-10 flex flex-col items-center text-center gap-4">
          <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-primary text-lime">
            <UserRoundPlus className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Complete your volunteer profile</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Tell us your skills, district, and availability so we can start assigning you SOS requests.
            </p>
          </div>
          <Button className="font-semibold" nativeButton={false} render={<Link href="/volunteer/profile" />}>Set Up Profile</Button>
        </Card>
      </div>
    );
  }

  const activeTasks = tasks?.filter((t) => t.status === "ASSIGNED" || t.status === "IN_PROGRESS") ?? [];
  const resolvedCount = tasks?.filter((t) => t.status === "RESOLVED").length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <DashboardWelcomeCard
        icon={LifeBuoy}
        title={`Welcome, ${user?.name?.split(" ")[0] ?? "there"}`}
        description="Thank you for volunteering with FloodAid. Here's what needs your attention."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Active tasks" value={activeTasks.length} icon={ClipboardList} tint="primary" isLoading={isLoading} highlight href="/volunteer/tasks" footerLabel="Open my tasks" />
        <StatCard label="Completed" value={resolvedCount} icon={CheckCircle2} tint="success" isLoading={isLoading} href="/volunteer/tasks" footerLabel="Task history" />
        <StatCard label="Lifetime assignments" value={profile?.totalAssignments ?? 0} icon={LifeBuoy} tint="warning" href="/volunteer/profile" footerLabel="My profile" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <ActionTile href="/volunteer/tasks" icon={ClipboardList} tone="blue" title="My tasks" description="Update rescue progress on your SOS assignments." />
        <ActionTile href="/volunteer/manual-sos" icon={PhoneCall} tone="red" title="Manual SOS" description="Record a request for someone without a phone." />
        <ActionTile href="/volunteer/relief" icon={Package} tone="green" title="My relief" description="Deliver the supplies you are holding." />
        <ActionTile href="/volunteer/supply-requests" icon={PackagePlus} tone="amber" title="Supply requests" description="Ask the relief team for shelter supplies." />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <section className="flex flex-col rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lime">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">My active tasks</h3>
              <p className="text-xs text-muted-foreground">{activeTasks.length} waiting for you</p>
            </div>
          </div>
          <Link
            href="/volunteer/tasks"
            className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
          >
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3.5">
                <Skeleton className="h-11 w-11 rounded-full" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        ) : activeTasks.length > 0 ? (
          <ul className="-mx-2 flex flex-col">
            {activeTasks.slice(0, 5).map((task) => (
              <li key={task.id}>
                <Link href="/volunteer/tasks" className="group flex items-center gap-3.5 rounded-xl px-2 py-3 transition-colors hover:bg-muted/60">
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                      task.priority === "CRITICAL"
                        ? "bg-destructive/12 text-destructive"
                        : task.priority === "HIGH"
                          ? "bg-amber-500/15 text-amber-700"
                          : "bg-sky-500/12 text-sky-700",
                    )}
                  >
                    {task.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{task.name}</p>
                    <p className="truncate text-xs capitalize text-muted-foreground">
                      {task.district?.nameEn} · {task.peopleCount} people · {task.helpType.join(", ")}
                    </p>
                  </div>
                  <SosStatusBadge status={task.status} />
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-10 text-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            <p className="mt-3 font-semibold text-foreground">You&apos;re all clear</p>
            <p className="mt-1 text-sm text-muted-foreground">New rescue assignments will show up here.</p>
          </div>
        )}

        <div className="mt-auto pt-5">
          <div className="rounded-xl bg-muted/60 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-foreground">Rescue progress</span>
              <span className="text-muted-foreground">
                {resolvedCount} of {resolvedCount + activeTasks.length} done
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-background">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${resolvedCount + activeTasks.length ? (resolvedCount / (resolvedCount + activeTasks.length)) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </section>
      <LiveAlertsPanel />
      </div>
    </div>
  );
}
