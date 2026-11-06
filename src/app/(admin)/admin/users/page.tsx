"use client";

import { useMemo, useState } from "react";
import { Check, LifeBuoy, Loader2, Mail, Pencil, Phone, ShieldCheck, UserRound, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { FilterSelect, SearchInput } from "@/components/dashboard/list-toolbar";
import { useAllUsers, useUpdateUserRole } from "@/lib/hooks/use-users";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import type { AuthUser, Role } from "@/lib/types/auth";
import { cn } from "@/lib/utils";

const ROLE_VARIANT: Record<Role, "danger" | "primary" | "success"> = {
  ADMIN: "danger",
  VOLUNTEER: "primary",
  USER: "success",
};

const ROLE_INFO: { role: Role; title: string; text: string; icon: typeof Users }[] = [
  { role: "USER", title: "Member", text: "Can send SOS, track requests and report missing people.", icon: UserRound },
  {
    role: "VOLUNTEER",
    title: "Volunteer",
    text: "Gets rescue and relief tools. Needs a verified profile before SOS assignments.",
    icon: LifeBuoy,
  },
  { role: "ADMIN", title: "Administrator", text: "Full control over alerts, shelters, SOS, relief and users.", icon: ShieldCheck },
];

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function EditUserDialog({ user, onClose }: { user: AuthUser; onClose: () => void }) {
  const updateRole = useUpdateUserRole();
  const [role, setRole] = useState<Role>(user.role);

  const save = () =>
    updateRole.mutate({ id: user.id, role }, { onSuccess: () => onClose() });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>Change what {user.name.split(" ")[0]} can access in FloodAid.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3.5 rounded-2xl border border-border bg-muted/40 p-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary font-bold text-lime">{initialsOf(user.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">{user.name}</p>
              <p className="flex items-center gap-1.5 truncate text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                {user.email}
              </p>
              {user.phone && (
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  {user.phone}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2.5" role="radiogroup" aria-label="Role">
            <p className="text-sm font-semibold text-foreground">Role</p>
            {ROLE_INFO.map((r) => {
              const active = role === r.role;
              return (
                <button
                  key={r.role}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setRole(r.role)}
                  className={cn(
                    "flex items-start gap-3.5 rounded-2xl border p-4 text-left transition-colors",
                    active ? "border-primary bg-accent/50 ring-4 ring-primary/10" : "border-border hover:bg-muted/50",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                      active ? "bg-primary text-lime" : "bg-muted text-muted-foreground",
                    )}
                  >
                    <r.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{r.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{r.text}</p>
                  </div>
                  <span
                    className={cn(
                      "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                      active ? "border-primary bg-primary text-lime" : "border-border",
                    )}
                  >
                    {active && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save} disabled={role === user.role || updateRole.isPending}>
            {updateRole.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminUsersPage() {
  const { data: users, isLoading } = useAllUsers();
  const { data: me } = useCurrentUser();
  const [editing, setEditing] = useState<AuthUser | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [verified, setVerified] = useState("");

  const all = useMemo(() => users ?? [], [users]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return all.filter((u) => {
      if (roleFilter && u.role !== roleFilter) return false;
      if (verified === "yes" && !u.emailVerified) return false;
      if (verified === "no" && u.emailVerified) return false;
      return !q || `${u.name} ${u.email} ${u.phone ?? ""}`.toLowerCase().includes(q);
    });
  }, [all, search, roleFilter, verified]);

  const counts = {
    total: all.length,
    admins: all.filter((u) => u.role === "ADMIN").length,
    volunteers: all.filter((u) => u.role === "VOLUNTEER").length,
    members: all.filter((u) => u.role === "USER").length,
  };

  const columns: Column<AuthUser>[] = [
    {
      key: "name",
      header: "User",
      primary: true,
      render: (u) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">{initialsOf(u.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">
              {u.name}
              {u.id === me?.id && <span className="ml-1.5 text-xs font-medium text-muted-foreground">(you)</span>}
            </p>
            <p className="truncate text-xs text-muted-foreground">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      hideOnMobile: true,
      render: (u) => <span className="text-muted-foreground">{u.phone ?? "—"}</span>,
    },
    { key: "role", header: "Role", render: (u) => <Badge variant={ROLE_VARIANT[u.role]}>{u.role}</Badge> },
    {
      key: "verified",
      header: "Email",
      render: (u) =>
        u.emailVerified ? (
          <Badge variant="success" dot>
            Verified
          </Badge>
        ) : (
          <Badge variant="warning" dot>
            Pending
          </Badge>
        ),
    },
    {
      key: "joined",
      header: "Joined",
      render: (u) => (
        <span className="text-muted-foreground">
          {new Date(u.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Action",
      align: "right",
      render: (u) =>
        u.id === me?.id ? (
          <span className="text-xs text-muted-foreground">Your account</span>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setEditing(u)}>
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
        ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={UserRound} title="User Management" description="All registered FloodAid accounts" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total users" value={counts.total} icon={Users} isLoading={isLoading} highlight />
        <StatCard label="Members" value={counts.members} icon={UserRound} isLoading={isLoading} />
        <StatCard label="Volunteers" value={counts.volunteers} icon={LifeBuoy} isLoading={isLoading} />
        <StatCard label="Admins" value={counts.admins} icon={ShieldCheck} isLoading={isLoading} />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        getRowKey={(u) => u.id}
        resetKey={`${search}|${roleFilter}|${verified}`}
        emptyIcon={Users}
        emptyTitle={search || roleFilter || verified ? "No users match" : "No users yet"}
        emptyDescription={search || roleFilter || verified ? "Try another search or filter." : "Registered accounts will appear here."}
        toolbar={
          <>
            <SearchInput value={search} onChange={setSearch} placeholder="Search name, email or phone…" className="lg:max-w-sm" />
            <FilterSelect
              value={roleFilter}
              onChange={setRoleFilter}
              allLabel="All roles"
              options={[
                { value: "USER", label: "Members" },
                { value: "VOLUNTEER", label: "Volunteers" },
                { value: "ADMIN", label: "Admins" },
              ]}
            />
            <FilterSelect
              value={verified}
              onChange={setVerified}
              allLabel="Any email status"
              options={[
                { value: "yes", label: "Verified" },
                { value: "no", label: "Pending" },
              ]}
            />
          </>
        }
      />

      {editing && <EditUserDialog user={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
