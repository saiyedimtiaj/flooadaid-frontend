"use client";

import {
  MapPin,
  UtensilsCrossed,
  Droplets,
  Cross,
  Zap,
  ShowerHead,
  Navigation,
  Phone,
  User,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Shelter } from "@/lib/types/api";
import ShelterMiniMap from "./shelter-mini-map-client";
import { useT } from "@/lib/i18n/use-t";

interface ShelterDetailSheetProps {
  shelter: Shelter | null;
  isOpen: boolean;
  onClose: () => void;
}

const facilityMeta = [
  {
    key: "hasFood" as const,
    label: "Food",
    icon: UtensilsCrossed,
    bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
  },
  {
    key: "hasWater" as const,
    label: "Water",
    icon: Droplets,
    bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
  },
  {
    key: "hasMedical" as const,
    label: "Medical",
    icon: Cross,
    bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
  },
  {
    key: "hasElectricity" as const,
    label: "Power",
    icon: Zap,
    bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
  },
  {
    key: "hasToilet" as const,
    label: "Toilet",
    icon: ShowerHead,
    bg: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20",
  },
];

export default function ShelterDetailSheet({
  shelter,
  isOpen,
  onClose,
}: ShelterDetailSheetProps) {
  const { pick } = useT();
  const occupancyPercent = shelter
    ? Math.round((shelter.currentOccupancy / shelter.capacity) * 100)
    : 0;

  const isLow = occupancyPercent < 50;
  const isMedium = occupancyPercent >= 50 && occupancyPercent <= 80;

  const statusColorClass = isLow
    ? "bg-emerald-500"
    : isMedium
      ? "bg-amber-500"
      : "bg-destructive";

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        {shelter && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-2">
                <span className={cn("size-2 rounded-full shrink-0", statusColorClass)} />
                <SheetTitle className="text-lg">{pick(shelter.name, shelter.nameBn)}</SheetTitle>
              </div>
              <SheetDescription className="flex items-center gap-1">
                <MapPin className="size-3 shrink-0" />
                <span>
                  {shelter.address} · {pick(shelter.district.nameEn, shelter.district.nameBn)}
                </span>
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-5 px-4">
              <ShelterMiniMap latitude={shelter.latitude} longitude={shelter.longitude} />

              <div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Capacity
                  </span>
                  <span className="font-semibold text-foreground tabular-nums">
                    {shelter.currentOccupancy} / {shelter.capacity}
                  </span>
                </div>
                <div className="relative mt-1.5 h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    style={{ width: `${occupancyPercent}%` }}
                    className={cn(
                      "absolute top-0 left-0 h-full rounded-full transition-all duration-500",
                      statusColorClass,
                    )}
                  />
                </div>
                <div className="flex justify-end mt-1">
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {occupancyPercent}% occupied
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Facilities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {facilityMeta.map((facility) => {
                    const available = shelter[facility.key] === true;
                    const Icon = facility.icon;
                    return (
                      <div
                        key={facility.key}
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium",
                          available
                            ? facility.bg
                            : "bg-muted text-muted-foreground/50 line-through",
                        )}
                      >
                        <Icon className="size-3" />
                        <span>{facility.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {(shelter.contactName || shelter.contactPhone) && (
                <div className="flex flex-col gap-1.5 rounded-lg border border-border p-3">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Contact
                  </span>
                  {shelter.contactName && (
                    <div className="flex items-center gap-1.5 text-sm text-foreground">
                      <User className="size-3.5 shrink-0 text-muted-foreground" />
                      <span>{shelter.contactName}</span>
                    </div>
                  )}
                  {shelter.contactPhone && (
                    <div className="flex items-center gap-1.5 text-sm text-foreground">
                      <Phone className="size-3.5 shrink-0 text-muted-foreground" />
                      <span>{shelter.contactPhone}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <SheetFooter className="flex-row gap-2">
              <Button variant="outline" size="sm" className="flex-1 gap-1.5" nativeButton={false} render={<a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.latitude},${shelter.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5" />}>
                  <Navigation className="size-3.5" />
                  Directions
                </Button>
              {shelter.contactPhone && (
                <Button size="sm" className="flex-1 gap-1.5" nativeButton={false} render={<a
                    href={`tel:${shelter.contactPhone}`}
                    className="flex items-center justify-center gap-1.5" />}>
                    <Phone className="size-3.5" />
                    Call
                  </Button>
              )}
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
