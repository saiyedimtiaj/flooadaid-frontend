"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Building2,
  UtensilsCrossed,
  Droplets,
  Cross,
  Zap,
  ShowerHead,
  CheckCircle,
  Navigation,
  Phone,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Shelter } from "@/lib/types/api";
import { useT } from "@/lib/i18n/use-t";

interface ShelterCardProps {
  shelter: Shelter;
  isSelected: boolean;
  onSelect: (shelter: Shelter) => void;
  index: number;
}

function statusThemeFor(occupancyPercent: number) {
  if (occupancyPercent > 80) {
    return {
      dot: "bg-destructive",
      bar: "bg-destructive",
      text: "text-destructive",
      tint: "bg-destructive/8",
      badge: "text-destructive bg-background/80",
      label: "Near Capacity",
      pulse: true,
    };
  }
  if (occupancyPercent >= 50) {
    return {
      dot: "bg-amber-500",
      bar: "bg-amber-500",
      text: "text-amber-600 dark:text-amber-500",
      tint: "bg-amber-500/8",
      badge: "text-amber-600 dark:text-amber-500 bg-background/80",
      label: "Filling Fast",
      pulse: false,
    };
  }
  return {
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-500",
    tint: "bg-emerald-500/8",
    badge: "text-emerald-600 dark:text-emerald-500 bg-background/80",
    label: "Open",
    pulse: false,
  };
}

const facilityMeta = [
  { key: "hasFood" as const, label: "Food", icon: UtensilsCrossed },
  { key: "hasWater" as const, label: "Water", icon: Droplets },
  { key: "hasMedical" as const, label: "Medical", icon: Cross },
  { key: "hasElectricity" as const, label: "Power", icon: Zap },
  { key: "hasToilet" as const, label: "Toilet", icon: ShowerHead },
];

export default function ShelterCard({
  shelter,
  isSelected,
  onSelect,
  index,
}: ShelterCardProps) {
  const { pick } = useT();
  const occupancyPercent = Math.round(
    (shelter.currentOccupancy / shelter.capacity) * 100,
  );

  const status = statusThemeFor(occupancyPercent);
  const availableFacilities = facilityMeta.filter((f) => shelter[f.key]);
  const allFacilitiesAvailable = availableFacilities.length === facilityMeta.length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.985 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 24,
        delay: index * 0.06,
      }}
      onClick={() => onSelect(shelter)}
      className="cursor-pointer group"
    >
      <Card
        className={cn(
          "relative flex flex-col rounded-3xl border bg-card transition-colors duration-200 h-full overflow-hidden",
          isSelected ? "border-primary/50" : "border-border hover:border-primary/25",
        )}
      >
        <div className={cn("relative overflow-hidden px-5 pt-5 pb-7", status.tint)}>
          <Building2
            className={cn(
              "absolute -right-4 -top-4 h-28 w-28 rotate-[-8deg] pointer-events-none opacity-8 transition-transform duration-500 group-hover:rotate-0 group-hover:scale-105",
              status.text,
            )}
            strokeWidth={1.5}
          />

          <div className="relative flex items-start justify-between gap-2">
            <div
              className={cn(
                "flex items-center justify-center h-11 w-11 rounded-2xl shrink-0 bg-background/80",
                status.text,
              )}
            >
              <Building2 className="h-5 w-5" />
            </div>

            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide shrink-0 backdrop-blur-xs",
                status.badge,
              )}
            >
              {status.pulse ? (
                <motion.span
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className={cn("size-1.5 rounded-full", status.dot)}
                />
              ) : (
                <span className={cn("size-1.5 rounded-full", status.dot)} />
              )}
              {status.label}
            </span>
          </div>

          <h3
            onClick={(e) => {
              e.stopPropagation();
              onSelect(shelter);
            }}
            className="relative text-base font-bold text-foreground leading-snug mt-3.5 hover:text-primary transition-colors"
          >
            {pick(shelter.name, shelter.nameBn)}
          </h3>
          <div className="relative flex items-center gap-1 mt-1 text-muted-foreground">
            <MapPin className="size-3 shrink-0" />
            <span className="text-xs truncate">{shelter.address}</span>
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4 p-5">
          <div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Capacity
              </span>
              <span className="font-semibold text-foreground tabular-nums">
                {shelter.currentOccupancy} / {shelter.capacity}
                <span className="text-muted-foreground font-medium ml-1">
                  ({occupancyPercent}%)
                </span>
              </span>
            </div>

            <div className="relative mt-1.5 h-2 w-full rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${occupancyPercent}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={cn("absolute top-0 left-0 h-full rounded-full", status.bar)}
              />
            </div>
          </div>

          {allFacilitiesAvailable ? (
            <div className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">
              <CheckCircle className="size-3" />
              <span>All Facilities Available</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {availableFacilities.map((facility) => {
                const Icon = facility.icon;
                return (
                  <div
                    key={facility.key}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-muted border border-border text-muted-foreground"
                  >
                    <Icon className={cn("size-3", status.text)} />
                    <span>{facility.label}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div
            className="mt-auto pt-3.5 border-t border-border flex gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Button className="flex-1 gap-1.5" nativeButton={false} render={<a
                href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.latitude},${shelter.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5" />}>
                <Navigation className="size-3.5" />
                Directions
              </Button>

            {shelter.contactPhone && (
              <Button variant="outline" className="flex-1 gap-1.5" nativeButton={false} render={<a
                  href={`tel:${shelter.contactPhone}`}
                  className="flex items-center justify-center gap-1.5" />}>
                  <Phone className="size-3.5" />
                  Call
                </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
