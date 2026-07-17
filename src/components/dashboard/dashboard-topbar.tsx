"use client";

import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { api } from "@/lib/api-client";
import { useInvalidateCurrentUser } from "@/lib/hooks/use-current-user";
import { ROLE_HOME, ROLE_LABEL } from "./nav-config";
import type { AuthUser } from "@/lib/types/auth";

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function DashboardTopbar({ user }: { user: AuthUser }) {
  const router = useRouter();
  const invalidateCurrentUser = useInvalidateCurrentUser();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      await invalidateCurrentUser();
      toast.success("Logged out");
      router.push("/");
    }
  };

  return (
    <header className="flex items-center rounded-t-xl
     justify-between gap-3 px-4 sm:px-5 lg:px-8 py-4 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-2 min-w-0">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-5 hidden sm:block" />
        <div className="hidden sm:block text-sm text-muted-foreground truncate">
          Welcome back, <span className="font-semibold text-foreground">{user.name}</span>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
              {initialsOf(user.name)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">{user.name}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {ROLE_LABEL[user.role]}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push(`${ROLE_HOME[user.role]}/settings`)}>
            <UserIcon className="h-4 w-4" />
            Account Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} variant="destructive">
            <LogOut className="h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
