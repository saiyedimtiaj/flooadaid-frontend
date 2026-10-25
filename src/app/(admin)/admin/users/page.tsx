"use client";

import { useState } from "react";
import { ShieldCheck, Users, LifeBuoy, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/alert-dialog";
import { useAllUsers, useUpdateUserRole } from "@/lib/hooks/use-users";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import type { AuthUser, Role } from "@/lib/types/auth";

const ROLE_VARIANT: Record<Role, "danger" | "primary" | "success"> = {
  ADMIN: "danger",
  VOLUNTEER: "primary",
  USER: "success",
};

function initialsOf(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

const ROLES: Role[] = ["USER", "VOLUNTEER", "ADMIN"];

export default function AdminUsersPage() {
  const { data: users, isLoading } = useAllUsers();
  const { data: me } = useCurrentUser();
  const updateRole = useUpdateUserRole();
  const [pending, setPending] = useState<{ user: AuthUser; role: Role } | null>(null);

  const counts = {
    total: users?.length ?? 0,
    admins: users?.filter((u) => u.role === "ADMIN").length ?? 0,
    volunteers: users?.filter((u) => u.role === "VOLUNTEER").length ?? 0,
  };

  const columns: Column<AuthUser>[] = [
    {
      key: "name",
      header: "Name",
      primary: true,
      render: (u) => (
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8 border border-border shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-[11px]">
              {initialsOf(u.name)}
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold text-foreground">{u.name}</span>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (u) => <span className="text-muted-foreground break-all">{u.email}</span>,
    },
    {
      key: "role",
      header: "Role",
      render: (u) =>
        u.id === me?.id ? (
          <Badge variant={ROLE_VARIANT[u.role]}>{u.role} (you)</Badge>
        ) : (
          <Select
            value={u.role}
            onValueChange={(role) => role && role !== u.role && setPending({ user: u, role: role as Role })}
          >
            <SelectTrigger size="sm" className="w-32 rounded-lg" aria-label={`Role for ${u.name}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ),
    },
    {
      key: "verified",
      header: "Verified",
      render: (u) =>
        u.emailVerified ? (
          <Badge variant="success" dot>Verified</Badge>
        ) : (
          <Badge variant="warning" dot>Pending</Badge>
        ),
    },
    {
      key: "joined",
      header: "Joined",
      render: (u) => (
        <span className="text-muted-foreground">
          {new Date(u.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={UserRound}
        title="User Management"
        description="All registered FloodAid accounts"
      />

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Users" value={counts.total} icon={Users} tint="primary" isLoading={isLoading} />
        <StatCard label="Admins" value={counts.admins} icon={ShieldCheck} tint="destructive" isLoading={isLoading} />
        <StatCard label="Volunteers" value={counts.volunteers} icon={LifeBuoy} tint="teal" isLoading={isLoading} />
      </div>

      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        getRowKey={(u) => u.id}
        emptyIcon={Users}
        emptyTitle="No users yet"
        emptyDescription="Registered accounts will appear here."
      />

      <ConfirmDialog
        open={pending !== null}
        onOpenChange={(open) => !open && setPending(null)}
        title="Change role?"
        description={
          pending
            ? `${pending.user.name} will become ${pending.role}. ${
                pending.role === "ADMIN"
                  ? "Admins can manage every alert, shelter, SOS and user."
                  : pending.role === "VOLUNTEER"
                    ? "They still need a volunteer profile and verification before SOS assignments."
                    : "They lose access to volunteer and admin tools immediately."
              }`
            : undefined
        }
        confirmLabel="Change Role"
        isLoading={updateRole.isPending}
        onConfirm={() => {
          if (pending) {
            updateRole.mutate(
              { id: pending.user.id, role: pending.role },
              { onSettled: () => setPending(null) },
            );
          }
        }}
      />
    </div>
  );
}
