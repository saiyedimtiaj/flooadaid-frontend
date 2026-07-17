"use client";

import { Bell, Radar, Siren, UserCheck, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/dashboard/page-header";
import { useMarkNotificationRead, useMyNotifications } from "@/lib/hooks/use-notifications";
import type { NotificationType } from "@/lib/types/api";
import { cn } from "@/lib/utils";

const TYPE_ICON: Record<NotificationType, typeof Bell> = {
  ALERT: Radar,
  SOS_UPDATE: Siren,
  ASSIGNMENT: UserCheck,
  GENERAL: Info,
};

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useMyNotifications();
  const markRead = useMarkNotificationRead();

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <PageHeader
        icon={Bell}
        title="Notifications"
        description="Updates on your SOS requests and assignments"
      />

      <Card className="rounded-3xl border border-border bg-card p-4">
        {isLoading ? (
          <div className="space-y-2 p-2">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : notifications && notifications.length > 0 ? (
          <div className="flex flex-col divide-y divide-border">
            {notifications.map((n) => {
              const Icon = TYPE_ICON[n.type];
              return (
                <button
                  key={n.id}
                  onClick={() => !n.isRead && markRead.mutate(n.id)}
                  className={cn(
                    "flex items-start gap-3 py-3.5 px-2 text-left w-full hover:bg-muted/40 rounded-xl transition-colors",
                    !n.isRead && "bg-primary/5",
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center h-9 w-9 rounded-xl shrink-0",
                      n.isRead ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                    <p className="text-[11px] text-muted-foreground/70 mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!n.isRead && <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5 ml-auto" />}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bell className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground mt-3">No notifications yet.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
