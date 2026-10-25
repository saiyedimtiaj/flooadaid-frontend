"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardTopbar } from "./dashboard-topbar";
import { ROLE_HOME, VOLUNTEER_ONBOARDING_PATHS } from "./nav-config";
import type { Role } from "@/lib/types/auth";

function LoadingScreen() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
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
      <SidebarInset className="min-w-0">
        <DashboardTopbar user={user} />
        <div className="flex-1 min-w-0 max-w-full p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
