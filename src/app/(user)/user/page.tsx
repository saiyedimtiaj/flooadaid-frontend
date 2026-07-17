"use client";

import Link from "next/link";
import { Home, MapPin, Radar, Siren } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { DashboardWelcomeCard } from "@/components/dashboard/welcome-card";

const QUICK_LINKS = [
  {
    href: "/shelters",
    icon: MapPin,
    label: "Find a Shelter",
    description: "Locate open shelters near you",
  },
  {
    href: "/alerts",
    icon: Radar,
    label: "Flood Alerts",
    description: "Check real-time conditions in your area",
  },
  {
    href: "/sos",
    icon: Siren,
    label: "Emergency SOS",
    description: "Request urgent rescue assistance",
  },
];

export default function UserDashboardPage() {
  const { data: user } = useCurrentUser();

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <DashboardWelcomeCard
        icon={Home}
        title={`Welcome, ${user?.name?.split(" ")[0] ?? "there"}`}
        description="Everything you need during a flood emergency, in one place."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {QUICK_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href}>
              <Card className="rounded-2xl border border-border bg-card p-5 h-full transition-colors hover:border-primary/30">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 text-primary mb-3">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-foreground">{link.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">{link.description}</p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
