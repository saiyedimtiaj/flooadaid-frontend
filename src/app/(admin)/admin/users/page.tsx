"use client";

import { ShieldCheck, Users, LifeBuoy, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { useAllUsers } from "@/lib/hooks/use-users";
import type { AuthUser, Role } from "@/lib/types/auth";

const ROLE_VARIANT: Record<Role, "danger" | "primary" | "success"> = {
  ADMIN: "danger",
  VOLUNTEER: "primary",
  USER: "success",
};

function initialsOf(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export default function AdminUsersPage() {
  const { data: users, isLoading } = useAllUsers();

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
      render: (u) => <Badge variant={ROLE_VARIANT[u.role]}>{u.role}</Badge>,
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
    </div>
  );
}
