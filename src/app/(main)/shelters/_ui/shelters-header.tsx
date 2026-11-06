"use client";

import { AlertTriangle, CheckCircle2, Home, TrendingUp, Users } from "lucide-react";
import { PageHero } from "@/components/public/page-hero";
import { useShelters } from "@/lib/hooks/use-shelters";

export default function SheltersHeader() {
  const { data } = useShelters({ limit: 100 });
  const shelters = data?.data;
  const rate = (s: { currentOccupancy: number; capacity: number }) => (s.capacity ? s.currentOccupancy / s.capacity : 0);
  const sheltered = shelters?.reduce((n, s) => n + s.currentOccupancy, 0);
  const capacity = shelters?.reduce((n, s) => n + s.capacity, 0);

  return (
    <PageHero
      icon={Home}
      crumb="Shelters"
      eyebrow="Live capacity"
      title="Shelter Finder"
      description="Find emergency shelters near you with real-time capacity, facilities and turn-by-turn directions."
      aside={
        shelters && (
          <p className="inline-flex items-center gap-2 rounded-xl bg-muted/70 px-3.5 py-2 text-sm text-foreground">
            <Users className="h-4 w-4 text-primary" />
            <span>
              <strong className="tabular-nums">{sheltered?.toLocaleString()}</strong> people sheltered of{" "}
              <strong className="tabular-nums">{capacity?.toLocaleString()}</strong> spaces
            </span>
          </p>
        )
      }
      stats={[
        { label: "Open shelters", value: shelters?.length, icon: Home },
        { label: "Plenty of space", value: shelters?.filter((s) => rate(s) < 0.5).length, icon: CheckCircle2 },
        { label: "Filling fast", value: shelters?.filter((s) => rate(s) >= 0.5 && rate(s) < 0.8).length, icon: TrendingUp },
        { label: "Near capacity", value: shelters?.filter((s) => rate(s) >= 0.8).length, icon: AlertTriangle, tone: "alert" },
      ]}
    />
  );
}
