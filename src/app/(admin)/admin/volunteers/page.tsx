"use client";

import { useState } from "react";
import { Users, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/alert-dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { useVerifyVolunteer, useVolunteers } from "@/lib/hooks/use-volunteers";
import type { VolunteerProfile } from "@/lib/types/api";

export default function AdminVolunteersPage() {
  const { data: volunteers, isLoading } = useVolunteers();
  const verify = useVerifyVolunteer();
  const [toVerify, setToVerify] = useState<VolunteerProfile | null>(null);

  const columns: Column<VolunteerProfile>[] = [
    {
      key: "name",
      header: "Name",
      primary: true,
      render: (v) => (
        <div className="flex items-center justify-between gap-2 sm:block">
          <span className="font-semibold text-foreground">{v.user?.name}</span>
          <div className="sm:hidden">
            <Badge variant={v.verified ? "success" : "warning"} dot>
              {v.verified ? "Verified" : "Pending"}
            </Badge>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      render: (v) => (
        <span className="text-muted-foreground break-all">
          {v.user?.email}
          {v.user?.phone ? ` · ${v.user.phone}` : ""}
        </span>
      ),
    },
    { key: "district", header: "District", render: (v) => v.district?.nameEn ?? "—" },
    {
      key: "skills",
      header: "Skills",
      render: (v) => (
        <span className="capitalize sm:max-w-40 sm:truncate block">
          {v.skills.join(", ").replace(/_/g, " ")}
        </span>
      ),
    },
    {
      key: "availability",
      header: "Availability",
      render: (v) => (
        <Badge variant={v.isAvailable ? "success" : "neutral"}>
          {v.isAvailable ? "Available" : "Unavailable"}
        </Badge>
      ),
    },
    { key: "assignments", header: "Assignments", render: (v) => v.totalAssignments },
    {
      key: "status",
      header: "Status",
      hideOnMobile: true,
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
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() => setToVerify(v)}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Verify
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
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
        title="Verify this volunteer?"
        description={
          toVerify
            ? `${toVerify.user?.name} will be marked as a verified volunteer and can be assigned to SOS requests.`
            : undefined
        }
        confirmLabel="Verify Volunteer"
        isLoading={verify.isPending}
        onConfirm={() => {
          if (toVerify) verify.mutate(toVerify.id);
        }}
      />
    </div>
  );
}
