"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardTopbar } from "./dashboard-topbar";
import { ROLE_HOME, VOLUNTEER_ONBOARDING_PATHS } from "./nav-config";
import type { Role } from "@/lib/types/auth";

function LoadingScreen() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="hidden w-64 shrink-0 flex-col gap-6 bg-sidebar px-4 py-6 md:flex">
        <div className="flex items-center gap-2.5 px-1">
          <div className="h-9 w-9 rounded-xl bg-lime/80" />
          <div className="h-5 w-24 animate-pulse rounded-md bg-white/15" />
        </div>
        <div className="mt-2 h-3 w-20 rounded bg-white/10" />
        <div className="flex flex-col gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex h-11 items-center gap-3 rounded-xl px-3">
              <div className="h-5 w-5 animate-pulse rounded-md bg-white/12" />
              <div className="h-3.5 animate-pulse rounded bg-white/12" style={{ width: `${55 + ((i * 17) % 40)}%` }} />
            </div>
          ))}
        </div>
        <div className="mt-auto h-28 rounded-2xl border border-dashed border-lime/30" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-border bg-card px-4 py-4 sm:px-6 lg:px-8">
          <Skeleton className="h-7 w-40" />
          <div className="flex items-center gap-2.5">
            <Skeleton className="hidden h-11 w-28 rounded-xl md:block" />
            <Skeleton className="h-11 w-11 rounded-xl" />
            <Skeleton className="h-11 w-11 rounded-full" />
          </div>
        </div>
        <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
          <Skeleton className="h-36 w-full rounded-2xl" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-10 rounded-xl" />
                </div>
                <Skeleton className="h-9 w-16" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Skeleton className="h-72 w-full rounded-2xl" />
            <Skeleton className="h-72 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardShell({
  allowedRoles,
  navRole,
  children,
}: {
  allowedRoles: Role[];
  navRole: Role;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isLoading } = useCurrentUser();
  // A USER inside the volunteer area is mid-signup: only the onboarding
  // pages, with their own (USER) sidebar rather than volunteer tools.
  const isOnboarding = navRole === "VOLUNTEER" && user?.role === "USER";
  const allowed =
    !!user &&
    allowedRoles.includes(user.role) &&
    (!isOnboarding || VOLUNTEER_ONBOARDING_PATHS.includes(pathname));

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!allowed) {
      router.replace(isOnboarding ? "/volunteer/profile" : ROLE_HOME[user.role]);
    }
  }, [isLoading, user, allowed, isOnboarding, router]);

  if (isLoading || !user || !allowed) {
    return <LoadingScreen />;
  }

  return (
    <SidebarProvider>
      <DashboardSidebar role={isOnboarding ? "USER" : navRole} />
      <SidebarInset className="min-w-0 bg-background">
        <DashboardTopbar user={user} navRole={isOnboarding ? "USER" : navRole} />
        <div className="flex-1 min-w-0 w-full p-4 sm:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
