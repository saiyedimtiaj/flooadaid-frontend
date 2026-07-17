"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { ROLE_HOME } from "@/components/dashboard/nav-config";

export default function DashboardIndexPage() {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (isLoading) return;
    router.replace(user ? ROLE_HOME[user.role] : "/login");
  }, [isLoading, user, router]);

  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}
