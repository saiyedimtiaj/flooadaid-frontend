"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Waves, LogOut, Plus } from "lucide-react";
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
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";
import { useInvalidateCurrentUser } from "@/lib/hooks/use-current-user";
import { navItemsFor, ROLE_QUICK_ACTION } from "./nav-config";
import type { Role } from "@/lib/types/auth";

export function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const ITEM_CLASSES = cn(
  "relative h-11 rounded-xl px-3 text-[15px] font-medium text-white/70 transition-colors",
  "hover:bg-white/6 hover:text-white [&_svg]:size-5 [&_svg]:text-white/60 hover:[&_svg]:text-white",
  "data-active:bg-white/6 data-active:text-lime data-active:font-semibold [&_svg]:data-active:text-lime",
  "data-active:hover:text-lime",
  "before:absolute before:-left-2 before:top-1/2 before:h-0 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:bg-lime before:transition-all data-active:before:h-7",
  "group-data-[collapsible=icon]:before:hidden",
);

export function DashboardSidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const router = useRouter();
  const invalidateCurrentUser = useInvalidateCurrentUser();
  const items = navItemsFor(role);
  const quick = ROLE_QUICK_ACTION[role];

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
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-4 px-4 pt-6">
        <Link href="/" className="flex items-center gap-2.5 px-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lime text-lime-foreground">
            <Waves className="h-5 w-5" strokeWidth={2.4} />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-lime group-data-[collapsible=icon]:hidden">
            Flood<span className="text-white">Aid</span>
          </span>
        </Link>

      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">
            Main menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
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
                      className={ITEM_CLASSES}
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

      <SidebarFooter className="gap-2 px-4 pb-5">
        <Link
          href={quick.href}
          className="group flex flex-col items-center gap-3 rounded-2xl border border-dashed border-lime/50 bg-white/4 px-4 py-5 text-center transition-colors hover:bg-white/8 group-data-[collapsible=icon]:hidden"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lime text-lime-foreground transition-transform group-hover:scale-110">
            <Plus className="h-5 w-5" strokeWidth={2.6} />
          </span>
          <span className="text-sm font-semibold text-white">{quick.label}</span>
        </Link>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Log out"
              className="h-10 rounded-xl text-white/60 hover:bg-white/6 hover:text-white"
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
