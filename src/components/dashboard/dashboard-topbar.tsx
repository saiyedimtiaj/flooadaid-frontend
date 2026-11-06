"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
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
import { SidebarTrigger } from "@/components/ui/sidebar";
import { api } from "@/lib/api-client";
import { useInvalidateCurrentUser } from "@/lib/hooks/use-current-user";
import { NotificationsPopover } from "./notifications-popover";
import { navItemsFor, ROLE_HOME, ROLE_LABEL, ROLE_NOTIFICATIONS } from "./nav-config";
import { initialsOf } from "./dashboard-sidebar";
import type { AuthUser, Role } from "@/lib/types/auth";

const ICON_BUTTON =
  "relative flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-foreground/80 transition-colors hover:bg-muted hover:text-foreground";

function usePageTitle(role: Role) {
  const pathname = usePathname();
  const items = navItemsFor(role);
  const match = [...items]
    .sort((a, b) => b.href.length - a.href.length)
    .find((i) => pathname === i.href || pathname.startsWith(`${i.href}/`));
  return !match || match.href === ROLE_HOME[role] ? "Dashboard" : match.label;
}

export function DashboardTopbar({ user, navRole }: { user: AuthUser; navRole: Role }) {
  const router = useRouter();
  const invalidateCurrentUser = useInvalidateCurrentUser();
  const title = usePageTitle(navRole);
  const home = ROLE_HOME[user.role] ?? "/";

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
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-card/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger className="-ml-1 h-10 w-10 rounded-xl md:hidden" />
        <h1 className="truncate text-2xl font-bold tracking-tight text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-2.5">
        <span className="hidden md:inline-flex h-11 items-center rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground/80">
          {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
        </span>
        <NotificationsPopover href={ROLE_NOTIFICATIONS[user.role]} />
        <Link href={`${home}/settings`} className={`${ICON_BUTTON} hidden sm:flex`} aria-label="Settings">
          <Settings className="h-5 w-5" />
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger className="ml-1 outline-none">
            <Avatar className="h-11 w-11">
              <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
                {initialsOf(user.name)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground">{user.name}</span>
                  <span className="text-xs font-normal text-muted-foreground">{ROLE_LABEL[user.role]}</span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push(`${home}/settings`)}>
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
      </div>
    </header>
  );
}
