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
  PhoneCall,
  Inbox,
  UserSearch,
  PackagePlus,
  HeartHandshake,
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
  { label: "Manual SOS", href: "/admin/manual-sos", icon: PhoneCall },
  { label: "Relief", href: "/admin/relief", icon: Package },
  { label: "Missing Persons", href: "/admin/missing-persons", icon: UserSearch },
  { label: "Volunteers", href: "/admin/volunteers", icon: Users },
  { label: "Users", href: "/admin/users", icon: UserRound },
  { label: "Feedback", href: "/admin/feedback", icon: Inbox },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const VOLUNTEER_NAV: NavItem[] = [
  { label: "Overview", href: "/volunteer", icon: LayoutDashboard },
  { label: "My Tasks", href: "/volunteer/tasks", icon: ClipboardList },
  { label: "Manual SOS", href: "/volunteer/manual-sos", icon: PhoneCall },
  { label: "My Relief", href: "/volunteer/relief", icon: Package },
  { label: "Supply Requests", href: "/volunteer/supply-requests", icon: PackagePlus },
  { label: "Missing Persons", href: "/missing-persons", icon: UserSearch },
  { label: "Notifications", href: "/volunteer/notifications", icon: Bell },
  { label: "Profile", href: "/volunteer/profile", icon: UserRound },
  { label: "Settings", href: "/volunteer/settings", icon: Settings },
];

const USER_NAV: NavItem[] = [
  { label: "Overview", href: "/user", icon: LayoutDashboard },
  { label: "Safety Guide", href: "/safety", icon: ShieldCheck },
  { label: "Missing Persons", href: "/missing-persons", icon: UserSearch },
  { label: "Notifications", href: "/user/notifications", icon: Bell },
  { label: "Become a Volunteer", href: "/volunteer/profile", icon: HeartHandshake },
  { label: "Settings", href: "/user/settings", icon: Settings },
];

/**
 * Pages under /volunteer that a plain USER may open — the sign-up flow.
 * Everything else there needs the VOLUNTEER role on the backend.
 */
export const VOLUNTEER_ONBOARDING_PATHS = ["/volunteer", "/volunteer/profile"];

export function navItemsFor(role: Role): NavItem[] {
  if (role === "ADMIN") return ADMIN_NAV;
  if (role === "VOLUNTEER") return VOLUNTEER_NAV;
  return USER_NAV;
}
