"use client";

import Link from "next/link";
import { Popover } from "@base-ui/react/popover";
import { ArrowRight, Bell, CheckCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useMyNotifications,
} from "@/lib/hooks/use-notifications";
import { NotificationItem } from "./notification-item";

export function NotificationsPopover({ href }: { href: string }) {
  const { data: notifications, isLoading } = useMyNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const unread = notifications?.filter((n) => !n.isRead).length ?? 0;
  const recent = notifications?.slice(0, 6) ?? [];

  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label="Notifications"
        className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-foreground/80 outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-4 focus-visible:ring-primary/15 data-popup-open:bg-muted"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white ring-2 ring-card">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="bottom" align="end" sideOffset={10} className="z-50">
          <Popover.Popup className="w-[min(24rem,calc(100vw-1.5rem))] origin-(--transform-origin) overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-xl outline-none transition-[transform,opacity] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5">
              <div>
                <p className="text-base font-bold text-foreground">Notifications</p>
                <p className="text-xs text-muted-foreground">
                  {unread > 0 ? `${unread} unread` : "You're all caught up"}
                </p>
              </div>
              <button
                type="button"
                disabled={unread === 0 || markAll.isPending}
                onClick={() => markAll.mutate()}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all read
              </button>
            </div>

            <div className="max-h-[22rem] overflow-y-auto p-2">
              {isLoading ? (
                <div className="flex flex-col gap-2 p-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex gap-3 px-2 py-2">
                      <Skeleton className="h-9 w-9 rounded-xl" />
                      <div className="flex flex-1 flex-col gap-2">
                        <Skeleton className="h-3.5 w-2/3" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recent.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {recent.map((n) => (
                    <NotificationItem key={n.id} notification={n} onRead={(id) => markRead.mutate(id)} compact />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center px-6 py-10 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                    <Bell className="h-6 w-6" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-foreground">No notifications yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">Alerts and SOS updates will show up here.</p>
                </div>
              )}
            </div>

            <Popover.Close
              render={
                <Link
                  href={href}
                  className="flex items-center justify-center gap-1.5 border-t border-border bg-muted/50 px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                />
              }
            >
              View all notifications
              <ArrowRight className="h-4 w-4" />
            </Popover.Close>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
