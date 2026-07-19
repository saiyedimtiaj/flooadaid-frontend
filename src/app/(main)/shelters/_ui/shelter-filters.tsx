"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  UtensilsCrossed,
  Droplets,
  Cross,
  Zap,
  Bath,
  X,
  SlidersHorizontal,
  MapPinned,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useDistricts } from "@/lib/hooks/use-locations";
import {
  LocationSearchModal,
  type SelectedLocation,
} from "@/components/map/location-search-modal";

interface ShelterFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedDistrictId: number | null;
  setSelectedDistrictId: (val: number | null) => void;
  facilityFilters: string[];
  setFacilityFilters: (val: string[]) => void;
  capacityFilter: "all" | "available" | "full";
  setCapacityFilter: (val: "all" | "available" | "full") => void;
  totalResults: number;
  locationFilter: SelectedLocation | null;
  setLocationFilter: (loc: SelectedLocation | null) => void;
}

const FACILITIES = [
  { id: "food", label: "Food", icon: UtensilsCrossed },
  { id: "water", label: "Water", icon: Droplets },
  { id: "medical", label: "Medical", icon: Cross },
  { id: "electricity", label: "Power", icon: Zap },
  { id: "toilet", label: "Toilet", icon: Bath },
];

const CAPACITY_MODES = ["all", "available", "full"] as const;

export default function ShelterFilters({
  searchQuery,
  setSearchQuery,
  selectedDistrictId,
  setSelectedDistrictId,
  facilityFilters,
  setFacilityFilters,
  capacityFilter,
  setCapacityFilter,
  totalResults,
  locationFilter,
  setLocationFilter,
}: ShelterFiltersProps) {
  const { data: districts } = useDistricts();
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const toggleFacility = (id: string) => {
    if (facilityFilters.includes(id)) {
      setFacilityFilters(facilityFilters.filter((f) => f !== id));
    } else {
      setFacilityFilters([...facilityFilters, id]);
    }
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedDistrictId !== null ||
    facilityFilters.length > 0 ||
    capacityFilter !== "all" ||
    locationFilter !== null;

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedDistrictId(null);
    setFacilityFilters([]);
    setCapacityFilter("all");
    setLocationFilter(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="rounded-3xl border border-border bg-card p-5 md:p-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex items-center justify-center size-8 rounded-xl bg-primary/10 text-primary">
            <SlidersHorizontal className="size-4" />
          </div>
          <span className="text-sm font-bold text-foreground">
            Find a Safe Shelter
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shelters by name or location..."
              className="pl-10 h-11 rounded-xl text-sm transition-colors focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary"
            />
          </div>
          <Select
            value={selectedDistrictId ? String(selectedDistrictId) : "all"}
            onValueChange={(val) => setSelectedDistrictId(val === "all" ? null : Number(val))}
          >
            <SelectTrigger className="w-full md:w-52 data-[size=default]:h-11 rounded-xl">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-muted-foreground" />
                <SelectValue placeholder="All Districts">
                  {(val: string) =>
                    val === "all" || !val
                      ? "All Districts"
                      : (districts?.find((d) => String(d.id) === val)?.nameEn ??
                        "All Districts")
                  }
                </SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              {districts?.map((district) => (
                <SelectItem key={district.id} value={String(district.id)}>
                  {district.nameEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            onClick={() => setLocationModalOpen(true)}
            className="h-11 rounded-xl gap-2 font-semibold shrink-0 shadow-sm"
          >
            <MapPinned className="size-4" />
            <span className="hidden sm:inline">Find on Map</span>
            <span className="sm:hidden">Map</span>
          </Button>
        </div>

        {/* Active location chip */}
        <AnimatePresence>
          {locationFilter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 pl-3 pr-1.5 py-1.5">
                <MapPinned className="size-3.5 text-primary shrink-0" />
                <span className="text-xs font-semibold text-primary truncate max-w-56">
                  Near: {locationFilter.label?.split(",")[0] ?? "chosen location"}
                </span>
                <button
                  type="button"
                  onClick={() => setLocationFilter(null)}
                  className="flex items-center justify-center size-5 rounded-full hover:bg-primary/20 transition-colors"
                  aria-label="Clear location"
                >
                  <X className="size-3 text-primary" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 pt-4 border-t border-border/60 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none pb-1 xl:pb-0">
            {FACILITIES.map((facility) => {
              const isActive = facilityFilters.includes(facility.id);
              const Icon = facility.icon;
              return (
                <motion.button
                  key={facility.id}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => toggleFacility(facility.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap border",
                    isActive
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-transparent border-border text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-3.5" />
                  <span>{facility.label}</span>
                </motion.button>
              );
            })}
          </div>

          <div className="flex items-center justify-between xl:justify-end gap-4 flex-wrap">
            <div className="relative inline-flex bg-muted rounded-full p-1">
              {CAPACITY_MODES.map((mode) => (
                <button
                  key={mode}
                  onClick={() => setCapacityFilter(mode)}
                  className={cn(
                    "relative z-10 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200 capitalize",
                    capacityFilter === mode
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {capacityFilter === mode && (
                    <motion.span
                      layoutId="capacity-pill"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      className="absolute inset-0 -z-10 rounded-full bg-linear-to-br from-primary to-[color-mix(in_oklch,var(--primary),black_18%)]"
                    />
                  )}
                  {mode}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                Showing
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={totalResults}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                    className="font-semibold text-foreground inline-block"
                  >
                    {totalResults}
                  </motion.span>
                </AnimatePresence>
                shelters
              </div>

              <AnimatePresence>
                {hasActiveFilters && (
                  <motion.div
                    initial={{ opacity: 0, x: 4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 4 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-3 mr-1" />
                      Clear all
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Card>

      <LocationSearchModal
        open={locationModalOpen}
        onOpenChange={setLocationModalOpen}
        onSelect={setLocationFilter}
        title="Find shelters near a location"
        description="Search a place, tap the map, or use your current location to see the nearest shelters."
      />
    </motion.div>
  );
}
