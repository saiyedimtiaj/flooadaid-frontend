"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardTopbar } from "./dashboard-topbar";
import { ROLE_HOME } from "./nav-config";
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
  const { data: user, isLoading } = useCurrentUser();
  const allowed = !!user && allowedRoles.includes(user.role);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!allowed) {
      router.replace(ROLE_HOME[user.role]);
    }
  }, [isLoading, user, allowed, router]);

  if (isLoading || !user || !allowed) {
    return <LoadingScreen />;
  }

  return (
    <SidebarProvider>
      <DashboardSidebar role={navRole} />
      <SidebarInset>
        <DashboardTopbar user={user} />
        <div className="flex-1 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
