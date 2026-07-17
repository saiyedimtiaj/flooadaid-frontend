"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Waves, LogOut } from "lucide-react";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";
import { useCurrentUser, useInvalidateCurrentUser } from "@/lib/hooks/use-current-user";
import { navItemsFor, ROLE_LABEL } from "./nav-config";
import type { Role } from "@/lib/types/auth";

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Vivid active-state classes. The shadcn default paints active with
 * `bg-sidebar-accent` which is ~1.5% off the sidebar surface — invisible.
 * We override with a brand primary tint + a left accent bar + tinted icon,
 * kept clearly distinct from the muted hover state.
 */
const ACTIVE_CLASSES = cn(
  "relative transition-colors",
  // active: brand tint, bold, primary text + icon
  "data-active:bg-primary/12 data-active:font-semibold data-active:text-primary",
  "data-active:hover:bg-primary/16 data-active:hover:text-primary",
  "dark:data-active:bg-primary/20 dark:data-active:text-primary-foreground",
  "[&_svg]:data-active:text-primary dark:[&_svg]:data-active:text-primary-foreground",
  // left accent bar (only when active)
  "before:absolute before:left-0 before:top-1/2 before:h-0 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:bg-primary before:transition-all before:duration-200 data-active:before:h-5",
  "dark:data-active:before:bg-primary-foreground",
);

export function DashboardSidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const invalidateCurrentUser = useInvalidateCurrentUser();
  const items = navItemsFor(role);

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
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/" />}
              className="data-[slot=sidebar-menu-button]:hover:bg-transparent"
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-linear-to-br from-destructive to-orange-500 text-white shadow-sm shrink-0">
                <Waves className="h-4 w-4" />
              </div>
              <div className="flex flex-col gap-0 leading-none">
                <span className="text-sm font-extrabold tracking-tight">
                  <span className="text-destructive">Flood</span>
                  <span className="text-foreground">Aid</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {ROLE_LABEL[role]}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive =
                  item.href === `/${role.toLowerCase()}`
                    ? pathname === item.href
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive}
                      tooltip={item.label}
                      className={ACTIVE_CLASSES}
                    >
                      <Icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator className="mb-1" />
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
              <Avatar className="h-8 w-8 border border-border shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  {user ? initialsOf(user.name) : "··"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0 leading-none group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-semibold text-foreground truncate">
                  {user?.name ?? "Loading…"}
                </span>
                <span className="text-[11px] text-muted-foreground truncate">
                  {user?.email ?? ""}
                </span>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Log out"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
