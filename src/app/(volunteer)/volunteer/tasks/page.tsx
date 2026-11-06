"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, ClipboardList, Clock, MapPin, Navigation, Phone, PlayCircle, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Pagination } from "@/components/dashboard/pagination";
import { SearchInput, usePaged } from "@/components/dashboard/list-toolbar";
import { SosPriorityBadge } from "@/components/dashboard/sos-status-badge";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { useUpdateSosStatus } from "@/lib/hooks/use-sos";
import { useMyTasks } from "@/lib/hooks/use-volunteers";
import { timeAgo } from "@/lib/format-time-ago";
import type { SosRequest, SosStatus } from "@/lib/types/api";
import { cn } from "@/lib/utils";

type Tab = "ACTIVE" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "ALL";

const TABS: { value: Tab; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "ASSIGNED", label: "New" },
  { value: "IN_PROGRESS", label: "On the way" },
  { value: "RESOLVED", label: "Rescued" },
  { value: "ALL", label: "All" },
];

const STEPS: { status: SosStatus; label: string }[] = [
  { status: "ASSIGNED", label: "Assigned" },
  { status: "IN_PROGRESS", label: "On the way" },
  { status: "RESOLVED", label: "Rescued" },
];

const PRIORITY_EDGE: Record<string, string> = {
  CRITICAL: "from-destructive/15",
  HIGH: "from-amber-500/15",
  MEDIUM: "from-sky-500/12",
  LOW: "from-muted",
};

function matches(tab: Tab, s: SosStatus) {
  if (tab === "ALL") return true;
  if (tab === "ACTIVE") return s === "ASSIGNED" || s === "IN_PROGRESS";
  return s === tab;
}

function TaskCard({ task }: { task: SosRequest }) {
  const update = useUpdateSosStatus();
  const stepIndex = Math.max(0, STEPS.findIndex((s) => s.status === task.status));
  const done = task.status === "RESOLVED";
  const cancelled = task.status === "CANCELLED";
  const next = task.status === "ASSIGNED" ? "IN_PROGRESS" : task.status === "IN_PROGRESS" ? "RESOLVED" : null;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className={cn("bg-linear-to-b to-transparent p-5", PRIORITY_EDGE[task.priority])}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <SosPriorityBadge priority={task.priority} />
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {timeAgo(task.createdAt)}
              </span>
            </div>
            <h3 className="mt-2 truncate text-lg font-bold text-foreground">{task.name}</h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {task.district?.nameEn}
                {task.addressText ? ` · ${task.addressText}` : ""}
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" nativeButton={false} render={<a href={`tel:${task.phone}`} />}>
              <Phone className="h-4 w-4" />
              Call
            </Button>
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${task.latitude},${task.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                />
              }
            >
              <Navigation className="h-4 w-4" />
              Directions
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1 font-medium text-foreground ring-1 ring-border">
            <Users className="h-3 w-3" />
            {task.peopleCount} people
          </span>
          {task.helpType.map((h) => (
            <span key={h} className="rounded-full bg-card px-2.5 py-1 font-medium capitalize text-foreground ring-1 ring-border">
              {h}
            </span>
          ))}
        </div>
        {task.description && (
          <p className="mt-3 rounded-xl bg-card/70 px-3 py-2 text-sm italic text-foreground/80 ring-1 ring-border">
            &ldquo;{task.description}&rdquo;
          </p>
        )}
      </div>

      <div className="mt-auto flex flex-col gap-4 border-t border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        {cancelled ? (
          <p className="text-sm font-medium text-muted-foreground">This request was cancelled by the requester.</p>
        ) : (
          <ol className="flex flex-1 items-center">
            {STEPS.map((s, i) => {
              const reached = i <= stepIndex;
              return (
                <li key={s.status} className={cn("flex items-center", i < STEPS.length - 1 && "flex-1")}>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                        reached ? "bg-primary text-lime" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {reached ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                    </span>
                    <span className={cn("hidden text-xs font-semibold sm:inline", reached ? "text-foreground" : "text-muted-foreground")}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <span className={cn("mx-2 h-0.5 flex-1 rounded-full", i < stepIndex ? "bg-primary" : "bg-border")} />
                  )}
                </li>
              );
            })}
          </ol>
        )}
        {next && (
          <Button className="shrink-0" disabled={update.isPending} onClick={() => update.mutate({ id: task.id, status: next })}>
            {next === "IN_PROGRESS" ? <PlayCircle className="h-4 w-4 text-lime" /> : <ShieldCheck className="h-4 w-4 text-lime" />}
            {next === "IN_PROGRESS" ? "Start rescue" : "Mark rescued"}
          </Button>
        )}
        {done && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
            Rescued {task.resolvedAt ? timeAgo(task.resolvedAt) : ""}
          </span>
        )}
      </div>
    </article>
  );
}

export default function VolunteerTasksPage() {
  const { data: user } = useCurrentUser();
  const isVolunteer = user?.role === "VOLUNTEER";
  const { data: tasks, isLoading } = useMyTasks(isVolunteer);
  const [tab, setTab] = useState<Tab>("ACTIVE");
  const [search, setSearch] = useState("");

  const all = useMemo(() => tasks ?? [], [tasks]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return all.filter(
      (t) =>
        matches(tab, t.status) &&
        (!q || `${t.name} ${t.phone} ${t.district?.nameEn ?? ""} ${t.addressText ?? ""}`.toLowerCase().includes(q)),
    );
  }, [all, tab, search]);
  const paged = usePaged(filtered, 6, `${tab}|${search}`);

  if (!isVolunteer) {
    return (
      <div className="rounded-2xl border border-border bg-card">
        <EmptyState
          icon={ClipboardList}
          title="Complete your volunteer profile"
          description="Tell us your skills and district to start receiving rescue tasks."
          action={
            <Button nativeButton={false} render={<Link href="/volunteer/profile" />}>
              Set up profile
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={ClipboardList} title="My Tasks" description="SOS requests assigned to you. Move each one forward as you make progress." />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="inline-flex shrink-0 flex-wrap gap-1 self-start rounded-3xl border border-border bg-card p-1 sm:rounded-full">
          {TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTab(t.value)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                tab === t.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-[11px] tabular-nums",
                  tab === t.value ? "bg-lime text-lime-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {all.filter((x) => matches(t.value, x.status)).length}
              </span>
            </button>
          ))}
        </div>
        <SearchInput value={search} onChange={setSearch} placeholder="Search name, phone or place…" className="lg:max-w-sm" />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : paged.pageItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {paged.pageItems.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card">
          <EmptyState
            icon={ClipboardList}
            title={search ? "No tasks match" : tab === "ACTIVE" ? "No active tasks" : "Nothing here yet"}
            description={
              search ? "Try a different name, phone or place." : "When an admin assigns you an SOS request it will appear here."
            }
          />
        </div>
      )}

      {paged.total > 6 && (
        <Pagination page={paged.page} totalPages={paged.totalPages} total={paged.total} pageSize={6} onChange={paged.setPage} />
      )}
    </div>
  );
}
