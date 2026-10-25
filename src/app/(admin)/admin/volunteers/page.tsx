"use client";

import { useMemo, useState } from "react";
import { Users, ShieldCheck, UserCheck, CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ConfirmDialog } from "@/components/ui/alert-dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { useVerifyVolunteer, useVolunteers } from "@/lib/hooks/use-volunteers";
import type { VolunteerProfile } from "@/lib/types/api";

function initialsOf(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function AdminVolunteersPage() {
  const { data: volunteers, isLoading } = useVolunteers();
  const verify = useVerifyVolunteer();
  const [toVerify, setToVerify] = useState<VolunteerProfile | null>(null);

  const stats = useMemo(() => {
    const list = volunteers ?? [];
    return {
      total: list.length,
      verified: list.filter((v) => v.verified).length,
      available: list.filter((v) => v.isAvailable).length,
    };
  }, [volunteers]);

  const columns: Column<VolunteerProfile>[] = [
    {
      key: "name",
      header: "Volunteer",
      primary: true,
      render: (v) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-border shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {initialsOf(v.user?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-semibold text-foreground truncate">{v.user?.name}</p>
            <p className="text-xs text-muted-foreground truncate break-all">{v.user?.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      hideOnMobile: true,
      render: (v) => <span className="text-muted-foreground">{v.user?.phone ?? "—"}</span>,
    },
    { key: "district", header: "District", render: (v) => v.district?.nameEn ?? "—" },
    {
      key: "skills",
      header: "Skills",
      render: (v) => (
        <div className="flex flex-wrap gap-1 sm:max-w-52">
          {v.skills.length > 0 ? (
            v.skills.slice(0, 3).map((s) => (
              <span
                key={s}
                className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground capitalize"
              >
                {s.replace(/_/g, " ")}
              </span>
            ))
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
          {v.skills.length > 3 && (
            <span className="text-[11px] text-muted-foreground">+{v.skills.length - 3}</span>
          )}
        </div>
      ),
    },
    {
      key: "availability",
      header: "Availability",
      render: (v) => (
        <Badge variant={v.isAvailable ? "success" : "neutral"} dot={v.isAvailable}>
          {v.isAvailable ? "Available" : "Unavailable"}
        </Badge>
      ),
    },
    {
      key: "assignments",
      header: "Tasks",
      align: "right",
      render: (v) => <span className="font-semibold tabular-nums">{v.totalAssignments}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (v) => (
        <Badge variant={v.verified ? "success" : "warning"} dot>
          {v.verified ? "Verified" : "Pending"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (v) =>
        !v.verified ? (
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setToVerify(v)}>
            <ShieldCheck className="h-3.5 w-3.5" />
            Verify
          </Button>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className="gap-1.5 text-muted-foreground hover:text-destructive"
            onClick={() => setToVerify(v)}
          >
            <CircleCheck className="size-3.5 text-emerald-600 dark:text-emerald-500" />
            Revoke
          </Button>
        ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={Users}
        title="Volunteers"
        description="Verify registered volunteers and review their assignment history"
      />

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Volunteers" value={stats.total} icon={Users} tint="primary" isLoading={isLoading} />
        <StatCard label="Verified" value={stats.verified} icon={UserCheck} tint="success" isLoading={isLoading} />
        <StatCard label="Available Now" value={stats.available} icon={CircleCheck} tint="teal" isLoading={isLoading} />
      </div>

      <DataTable
        columns={columns}
        data={volunteers}
        isLoading={isLoading}
        getRowKey={(v) => v.id}
        emptyIcon={Users}
        emptyTitle="No volunteers registered yet"
        emptyDescription="Volunteers who sign up will appear here for verification."
      />

      <ConfirmDialog
        open={toVerify !== null}
        onOpenChange={(open) => !open && setToVerify(null)}
        title={toVerify?.verified ? "Remove verification?" : "Verify this volunteer?"}
        description={
          toVerify
            ? toVerify.verified
              ? `${toVerify.user?.name} will no longer be offered for new SOS assignments until verified again.`
              : `${toVerify.user?.name} will be marked as a verified volunteer and can be assigned to SOS requests.`
            : undefined
        }
        confirmLabel={toVerify?.verified ? "Remove Verification" : "Verify Volunteer"}
        isLoading={verify.isPending}
        onConfirm={() => {
          if (toVerify) {
            verify.mutate(
              { id: toVerify.id, verified: !toVerify.verified },
              { onSuccess: () => setToVerify(null) },
            );
          }
        }}
      />
    </div>
  );
}
