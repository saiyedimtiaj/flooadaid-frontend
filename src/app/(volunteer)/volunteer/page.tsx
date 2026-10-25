"use client";

import Link from "next/link";
import { LifeBuoy, ClipboardList, ArrowUpRight, CheckCircle2, UserRoundPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardWelcomeCard } from "@/components/dashboard/welcome-card";
import { SosStatusBadge } from "@/components/dashboard/sos-status-badge";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
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
        <Card className="rounded-3xl border border-border bg-card p-8 flex flex-col items-center text-center gap-4">
          <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 text-primary">
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

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-primary/10 text-primary mb-3">
            <ClipboardList className="h-4.5 w-4.5" />
          </div>
          <span className="text-2xl font-extrabold text-foreground tabular-nums">{activeTasks.length}</span>
          <p className="text-xs font-semibold text-muted-foreground mt-1">Active Tasks</p>
        </Card>
        <Card className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 mb-3">
            <CheckCircle2 className="h-4.5 w-4.5" />
          </div>
          <span className="text-2xl font-extrabold text-foreground tabular-nums">{resolvedCount}</span>
          <p className="text-xs font-semibold text-muted-foreground mt-1">Completed</p>
        </Card>
        <Card className="rounded-2xl border border-border bg-card p-5 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-500 mb-3">
            <LifeBuoy className="h-4.5 w-4.5" />
          </div>
          <span className="text-2xl font-extrabold text-foreground tabular-nums">
            {profile?.totalAssignments ?? 0}
          </span>
          <p className="text-xs font-semibold text-muted-foreground mt-1">Lifetime Assignments</p>
        </Card>
      </div>

      <Card className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground">My Active Tasks</h3>
          <Link
            href="/volunteer/tasks"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : activeTasks.length > 0 ? (
          <div className="flex flex-col divide-y divide-border">
            {activeTasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center justify-between py-3 gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{task.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {task.district?.nameEn} · {task.peopleCount} people · {task.helpType.join(", ")}
                  </p>
                </div>
                <SosStatusBadge status={task.status} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No active tasks right now. New assignments will show up here.
          </p>
        )}
      </Card>
    </div>
  );
}
