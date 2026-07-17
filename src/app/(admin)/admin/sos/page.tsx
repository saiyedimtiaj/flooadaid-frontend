"use client";

import { useState } from "react";
import { Siren, Phone, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { SosStatusBadge, SosPriorityBadge } from "@/components/dashboard/sos-status-badge";
import { useAssignSos, useSosRequests, useUpdateSosStatus } from "@/lib/hooks/use-sos";
import { useAllUsers } from "@/lib/hooks/use-users";
import type { SosStatus } from "@/lib/types/api";

const STATUS_TABS: { value: SosStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CANCELLED", label: "Cancelled" },
];

const STATUS_OPTIONS: SosStatus[] = ["PENDING", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "CANCELLED"];

export default function AdminSosPage() {
  const [statusFilter, setStatusFilter] = useState<SosStatus | "ALL">("ALL");
  const { data, isLoading } = useSosRequests({
    limit: 50,
    status: statusFilter === "ALL" ? undefined : statusFilter,
  });
  const { data: users } = useAllUsers();
  const volunteers = users?.filter((u) => u.role === "VOLUNTEER") ?? [];
  const updateStatus = useUpdateSosStatus();
  const assignSos = useAssignSos();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={Siren}
        title="SOS Requests"
        description="Live rescue queue — sorted by priority. Auto-refreshes every 15s."
      />

      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as SosStatus | "ALL")}>
        <TabsList className="flex-wrap h-auto">
          {STATUS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="text-xs font-semibold">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      ) : data && data.data.length > 0 ? (
        <div className="flex flex-col gap-3">
          {data.data.map((sos) => (
            <Card key={sos.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <SosPriorityBadge priority={sos.priority} />
                    <SosStatusBadge status={sos.status} />
                    <span className="text-xs text-muted-foreground">
                      {new Date(sos.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-foreground">{sos.name}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {sos.phone}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {sos.district?.nameEn}
                      {sos.addressText ? ` — ${sos.addressText}` : ""}
                    </span>
                    <span>{sos.peopleCount} people</span>
                    <span className="capitalize">{sos.helpType.join(", ")}</span>
                  </div>
                  {sos.description && (
                    <p className="text-xs text-muted-foreground mt-2 italic">&ldquo;{sos.description}&rdquo;</p>
                  )}
                  {sos.assignedTo && (
                    <p className="text-xs font-semibold text-primary mt-2">
                      Assigned to: {sos.assignedTo.name}
                      {sos.assignedTo.phone ? ` (${sos.assignedTo.phone})` : ""}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                  <Select
                    value={sos.status}
                    onValueChange={(status) => updateStatus.mutate({ id: sos.id, status: status as SosStatus })}
                  >
                    <SelectTrigger className="w-full sm:w-40 data-[size=default]:h-9 rounded-lg">
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

                  <Select
                    value={sos.assignedToId ?? ""}
                    onValueChange={(volunteerId) => assignSos.mutate({ id: sos.id, volunteerId: volunteerId as string })}
                  >
                    <SelectTrigger className="w-full sm:w-44 data-[size=default]:h-9 rounded-lg">
                      <SelectValue placeholder="Assign volunteer...">
                        {(value: string) => volunteers.find((v) => v.id === value)?.name || "Assign volunteer..."}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {volunteers.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="rounded-3xl border border-border bg-card">
          <EmptyState
            icon={Siren}
            title="No SOS requests here"
            description="Requests in this category will appear as they come in."
          />
        </Card>
      )}
    </div>
  );
}
