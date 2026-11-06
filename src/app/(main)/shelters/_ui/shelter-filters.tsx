"use client";

import { SearchableSelect } from "@/components/ui/searchable-select";
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
import { cn } from "@/lib/utils";
import { useDistricts } from "@/lib/hooks/use-locations";
import {
  LocationSearchModal,
  type SelectedLocation,
} from "@/components/map/location-search-modal";
import { useT } from "@/lib/i18n/use-t";

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
  { id: "food", label: "Food", labelBn: "খাবার", icon: UtensilsCrossed },
  { id: "water", label: "Water", labelBn: "পানি", icon: Droplets },
  { id: "medical", label: "Medical", labelBn: "চিকিৎসা", icon: Cross },
  { id: "electricity", label: "Power", labelBn: "বিদ্যুৎ", icon: Zap },
  { id: "toilet", label: "Toilet", labelBn: "শৌচাগার", icon: Bath },
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
  const { tr, pick, num } = useT();
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
            {tr("Find a Safe Shelter", "নিরাপদ আশ্রয়কেন্দ্র খুঁজুন")}
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tr("Search shelters by name or location...", "নাম বা অবস্থান দিয়ে আশ্রয়কেন্দ্র খুঁজুন...")}
              className="pl-10 h-11 rounded-xl text-sm transition-colors focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary"
            />
          </div>
          <SearchableSelect
            className="w-full md:w-56"
            icon={<MapPin />}
            value={selectedDistrictId ? String(selectedDistrictId) : "all"}
            onValueChange={(val) => setSelectedDistrictId(!val || val === "all" ? null : Number(val))}
            options={[{ value: "all", label: tr("All Districts", "সব জেলা") }, ...(districts ?? []).map((d) => ({ value: String(d.id), label: pick(d.nameEn, d.nameBn), keywords: `${d.nameEn} ${d.nameBn}` }))]}
            searchPlaceholder={tr("Search district…", "জেলা খুঁজুন…")}
          />

          <Button
            type="button"
            onClick={() => setLocationModalOpen(true)}
            className="h-11 rounded-xl gap-2 font-semibold shrink-0 shadow-sm"
          >
            <MapPinned className="size-4" />
            <span className="hidden sm:inline">{tr("Find on Map", "মানচিত্রে খুঁজুন")}</span>
            <span className="sm:hidden">{tr("Map", "মানচিত্র")}</span>
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
                  {tr("Near", "কাছাকাছি")}: {locationFilter.label?.split(",")[0] ?? tr("chosen location", "নির্বাচিত স্থান")}
                </span>
                <button
                  type="button"
                  onClick={() => setLocationFilter(null)}
                  className="flex items-center justify-center size-5 rounded-full hover:bg-primary/20 transition-colors"
                  aria-label={tr("Clear location", "অবস্থান মুছুন")}
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
                  <span>{tr(facility.label, facility.labelBn)}</span>
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
                  {mode === "all"
                    ? tr("All", "সব")
                    : mode === "available"
                      ? tr("Available", "জায়গা আছে")
                      : tr("Full", "পূর্ণ")}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                {tr("Showing", "দেখানো হচ্ছে")}
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={totalResults}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                    className="font-semibold text-foreground inline-block"
                  >
                    {num(totalResults)}
                  </motion.span>
                </AnimatePresence>
                {tr("shelters", "টি আশ্রয়কেন্দ্র")}
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
                      {tr("Clear all", "সব মুছুন")}
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
        title={tr("Find shelters near a location", "কোনো স্থানের কাছের আশ্রয়কেন্দ্র খুঁজুন")}
        description={tr(
          "Search a place, tap the map, or use your current location to see the nearest shelters.",
          "কাছের আশ্রয়কেন্দ্র দেখতে স্থান খুঁজুন, মানচিত্রে চাপুন অথবা বর্তমান অবস্থান ব্যবহার করুন।",
        )}
      />
    </motion.div>
  );
}
