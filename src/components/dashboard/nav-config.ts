import {
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Radar,
  MapPin,
  Siren,
  Package,
  Users,
  BarChart3,
  ClipboardList,
  UserRound,
  Bell,
} from "lucide-react";
import type { Role } from "@/lib/types/auth";

export interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

export const ROLE_HOME: Record<Role, string> = {
  ADMIN: "/admin",
  VOLUNTEER: "/volunteer",
  USER: "/user",
};

export const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Administrator",
  VOLUNTEER: "Volunteer",
  USER: "Member",
};

const ADMIN_NAV: NavItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Alerts", href: "/admin/alerts", icon: Radar },
  { label: "Shelters", href: "/admin/shelters", icon: MapPin },
  { label: "SOS Requests", href: "/admin/sos", icon: Siren },
  { label: "Relief", href: "/admin/relief", icon: Package },
  { label: "Volunteers", href: "/admin/volunteers", icon: Users },
  { label: "Users", href: "/admin/users", icon: UserRound },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const VOLUNTEER_NAV: NavItem[] = [
  { label: "Overview", href: "/volunteer", icon: LayoutDashboard },
  { label: "My Tasks", href: "/volunteer/tasks", icon: ClipboardList },
  { label: "Profile", href: "/volunteer/profile", icon: UserRound },
  { label: "Settings", href: "/volunteer/settings", icon: Settings },
];

const USER_NAV: NavItem[] = [
  { label: "Overview", href: "/user", icon: LayoutDashboard },
  { label: "Safety Guide", href: "/safety", icon: ShieldCheck },
  { label: "Notifications", href: "/user/notifications", icon: Bell },
  { label: "Settings", href: "/user/settings", icon: Settings },
];

export function navItemsFor(role: Role): NavItem[] {
  if (role === "ADMIN") return ADMIN_NAV;
  if (role === "VOLUNTEER") return VOLUNTEER_NAV;
  return USER_NAV;
}
