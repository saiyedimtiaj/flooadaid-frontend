"use client";

import { useMemo, useState } from "react";
import { Bell, BellOff, CheckCheck, Inbox, MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Pagination } from "@/components/dashboard/pagination";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useMyNotifications,
} from "@/lib/hooks/use-notifications";
import type { AppNotification, NotificationType } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import { NOTIFICATION_META, NotificationItem } from "./notification-item";

type Filter = "ALL" | "UNREAD" | NotificationType;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "UNREAD", label: "Unread" },
  { value: "ALERT", label: "Alerts" },
  { value: "SOS_UPDATE", label: "SOS" },
  { value: "ASSIGNMENT", label: "Assignments" },
  { value: "GENERAL", label: "General" },
];

const PAGE_SIZE = 8;

function dayLabel(date: string) {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

function groupByDay(items: AppNotification[]) {
  const groups: { label: string; items: AppNotification[] }[] = [];
  for (const n of items) {
    const label = dayLabel(n.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(n);
    else groups.push({ label, items: [n] });
  }
  return groups;
}

export function NotificationsList() {
  const { data: notifications, isLoading } = useMyNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const [filter, setFilter] = useState<Filter>("ALL");
  const [page, setPage] = useState(1);

  const all = useMemo(() => notifications ?? [], [notifications]);
  const unread = all.filter((n) => !n.isRead).length;
  const filtered = useMemo(
    () =>
      all.filter((n) => (filter === "ALL" ? true : filter === "UNREAD" ? !n.isRead : n.type === filter)),
    [all, filter],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const countFor = (f: Filter) =>
    f === "ALL" ? all.length : f === "UNREAD" ? unread : all.filter((n) => n.type === f).length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={Bell}
        title="Notifications"
        description="Alerts for your district, SOS updates and assignments"
        action={
          <Button variant="outline" disabled={unread === 0 || markAll.isPending} onClick={() => markAll.mutate()}>
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total" value={all.length} icon={Inbox} isLoading={isLoading} highlight />
        <StatCard label="Unread" value={unread} icon={Bell} tint="destructive" isLoading={isLoading} />
        <StatCard label="Flood alerts" value={countFor("ALERT")} icon={NOTIFICATION_META.ALERT.icon} isLoading={isLoading} />
        <StatCard label="SOS & assignments" value={countFor("SOS_UPDATE") + countFor("ASSIGNMENT")} icon={MailOpen} isLoading={isLoading} />
      </div>

      <section className="rounded-2xl border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <div className="inline-flex flex-wrap gap-1 rounded-3xl border border-border bg-background p-1 sm:rounded-full">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => {
                  setFilter(f.value);
                  setPage(1);
                }}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors",
                  filter === f.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {f.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[10px] tabular-nums",
                    filter === f.value ? "bg-lime text-lime-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {countFor(f.value)}
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length === 0 ? 0 : (current - 1) * PAGE_SIZE + 1}–{Math.min(current * PAGE_SIZE, filtered.length)} of{" "}
            {filtered.length}
          </p>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3.5 rounded-2xl border border-border p-4">
                  <Skeleton className="h-11 w-11 rounded-xl" />
                  <div className="flex flex-1 flex-col gap-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3.5 w-3/4" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : pageItems.length > 0 ? (
            <div className="flex flex-col gap-6">
              {groupByDay(pageItems).map((g) => (
                <div key={g.label} className="flex flex-col gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{g.label}</p>
                  {g.items.map((n) => (
                    <NotificationItem key={n.id} notification={n} onRead={(id) => markRead.mutate(id)} />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <BellOff className="h-7 w-7" />
              </div>
              <p className="mt-4 text-base font-semibold text-foreground">Nothing here</p>
              <p className="mt-1 text-sm text-muted-foreground">No notifications match this filter.</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="border-t border-border p-4">
            <Pagination page={current} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </section>
    </div>
  );
}
