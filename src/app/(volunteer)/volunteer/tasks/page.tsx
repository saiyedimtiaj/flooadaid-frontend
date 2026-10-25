"use client";

import Link from "next/link";
import { ClipboardList, Phone, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/dashboard/page-header";
import { SosStatusBadge, SosPriorityBadge } from "@/components/dashboard/sos-status-badge";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { useMyTasks } from "@/lib/hooks/use-volunteers";
import { useUpdateSosStatus } from "@/lib/hooks/use-sos";
import type { SosStatus } from "@/lib/types/api";

const STATUS_OPTIONS: SosStatus[] = ["ASSIGNED", "IN_PROGRESS", "RESOLVED", "CANCELLED"];

export default function VolunteerTasksPage() {
  const { data: user } = useCurrentUser();
  const isVolunteer = user?.role === "VOLUNTEER";
  const { data: tasks, isLoading } = useMyTasks(isVolunteer);
  const updateStatus = useUpdateSosStatus();

  if (!isVolunteer) {
    return (
      <Card className="rounded-3xl border border-border bg-card p-12 flex flex-col items-center text-center gap-3">
        <ClipboardList className="h-10 w-10 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">
          Complete your volunteer profile to start receiving tasks.
        </p>
        <Button className="font-semibold" nativeButton={false} render={<Link href="/volunteer/profile" />}>Set Up Profile</Button>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={ClipboardList}
        title="My Tasks"
        description="SOS requests assigned to you. Update the status as you make progress."
      />

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      ) : tasks && tasks.length > 0 ? (
        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <Card key={task.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <SosPriorityBadge priority={task.priority} />
                    <SosStatusBadge status={task.status} />
                    <span className="text-xs text-muted-foreground">
                      {new Date(task.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-foreground">{task.name}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {task.phone}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {task.district?.nameEn}
                      {task.addressText ? ` — ${task.addressText}` : ""}
                    </span>
                    <span>{task.peopleCount} people</span>
                    <span className="capitalize">{task.helpType.join(", ")}</span>
                  </div>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mt-2 italic">&ldquo;{task.description}&rdquo;</p>
                  )}
                </div>

                <Select
                  value={task.status}
                  onValueChange={(status) => updateStatus.mutate({ id: task.id, status: status as SosStatus })}
                >
                  <SelectTrigger className="w-full sm:w-44 data-[size=default]:h-9 rounded-lg shrink-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="rounded-3xl border border-border bg-card p-12 flex flex-col items-center text-center">
          <ClipboardList className="h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground mt-3">No tasks assigned to you yet.</p>
        </Card>
      )}
    </div>
  );
}
