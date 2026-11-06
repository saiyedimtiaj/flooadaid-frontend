"use client";

import { Bell, Info, Radar, Siren, UserCheck } from "lucide-react";
import { timeAgo } from "@/lib/format-time-ago";
import type { AppNotification, NotificationType } from "@/lib/types/api";
import { cn } from "@/lib/utils";

export const NOTIFICATION_META: Record<NotificationType, { icon: typeof Bell; label: string; tile: string }> = {
  ALERT: { icon: Radar, label: "Flood alert", tile: "bg-destructive/10 text-destructive" },
  SOS_UPDATE: { icon: Siren, label: "SOS update", tile: "bg-amber-500/12 text-amber-700" },
  ASSIGNMENT: { icon: UserCheck, label: "Assignment", tile: "bg-sky-500/10 text-sky-700" },
  GENERAL: { icon: Info, label: "General", tile: "bg-primary/10 text-primary" },
};

export function NotificationItem({
  notification: n,
  onRead,
  compact = false,
}: {
  notification: AppNotification;
  onRead?: (id: string) => void;
  compact?: boolean;
}) {
  const meta = NOTIFICATION_META[n.type];
  const Icon = meta.icon;
  return (
    <button
      type="button"
      onClick={() => !n.isRead && onRead?.(n.id)}
      className={cn(
        "group relative flex w-full items-start gap-3.5 text-left transition-colors",
        compact ? "rounded-xl px-3 py-3 hover:bg-muted" : "rounded-2xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-lift",
        !n.isRead && (compact ? "bg-accent/60" : "border-primary/25 bg-accent/40"),
      )}
    >
      <div className={cn("flex shrink-0 items-center justify-center rounded-xl", compact ? "h-9 w-9" : "h-11 w-11", meta.tile)}>
        <Icon className={compact ? "h-4 w-4" : "h-5 w-5"} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className={cn("truncate font-semibold text-foreground", compact ? "text-sm" : "text-[15px]")}>{n.title}</p>
          {!compact && (
            <span className="hidden shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground sm:inline">
              {meta.label}
            </span>
          )}
        </div>
        <p className={cn("mt-0.5 text-muted-foreground", compact ? "line-clamp-2 text-xs" : "text-sm")}>{n.message}</p>
        <p className="mt-1.5 text-[11px] font-medium text-muted-foreground/80">{timeAgo(n.createdAt)}</p>
      </div>
      {!n.isRead && <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-lime ring-4 ring-lime/25" />}
    </button>
  );
}
