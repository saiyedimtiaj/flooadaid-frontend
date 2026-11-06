"use client";

import { SearchableSelect } from "@/components/ui/searchable-select";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, RotateCcw, SlidersHorizontal, MapPinned, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDistricts, useDivisions } from "@/lib/hooks/use-locations";
import { ALERT_SEVERITIES } from "@/lib/alert-severity-styles";
import type { AlertSeverity } from "@/lib/types/api";
import {
  LocationSearchModal,
  type SelectedLocation,
} from "@/components/map/location-search-modal";

interface AlertFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedDivisionId: number | null;
  setSelectedDivisionId: (val: number | null) => void;
  selectedDistrictId: number | null;
  setSelectedDistrictId: (val: number | null) => void;
  selectedSeverities: AlertSeverity[];
  toggleSeverity: (severity: AlertSeverity) => void;
  clearFilters: () => void;
  isFilterActive: boolean;
  locationFilter: SelectedLocation | null;
  setLocationFilter: (loc: SelectedLocation | null) => void;
}

const severityPillStyles: Record<AlertSeverity, string> = {
  CRITICAL:
    "border-rose-500/30 text-rose-600 dark:text-rose-400 data-[state=active]:bg-rose-500 data-[state=active]:border-rose-500 data-[state=active]:text-white",
  DANGER:
    "border-orange-500/30 text-orange-600 dark:text-orange-400 data-[state=active]:bg-orange-500 data-[state=active]:border-orange-500 data-[state=active]:text-white",
  WARNING:
    "border-yellow-500/30 text-yellow-600 dark:text-yellow-500 data-[state=active]:bg-yellow-500 data-[state=active]:border-yellow-500 data-[state=active]:text-black",
  WATCH:
    "border-blue-500/30 text-blue-600 dark:text-blue-400 data-[state=active]:bg-blue-500 data-[state=active]:border-blue-500 data-[state=active]:text-white",
  NORMAL:
    "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 data-[state=active]:bg-emerald-500 data-[state=active]:border-emerald-500 data-[state=active]:text-white",
};

export function AlertFilters({
  searchQuery,
  setSearchQuery,
  selectedDivisionId,
  setSelectedDivisionId,
  selectedDistrictId,
  setSelectedDistrictId,
  selectedSeverities,
  toggleSeverity,
  clearFilters,
  isFilterActive,
  locationFilter,
  setLocationFilter,
}: AlertFiltersProps) {
  const { data: divisions } = useDivisions();
  const { data: districts } = useDistricts(selectedDivisionId ?? undefined);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  return (
    <Card className="rounded-3xl border border-border bg-card p-5 md:p-6 shadow-sm">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center size-8 rounded-xl bg-primary/10 text-primary">
              <SlidersHorizontal className="size-4" />
            </div>
            <span className="text-sm font-bold text-foreground">
              Find Alerts Near You
            </span>
          </div>
          <Button
            type="button"
            onClick={() => setLocationModalOpen(true)}
            className="h-9 rounded-xl gap-2 font-semibold shadow-sm"
          >
            <MapPinned className="size-4" />
            Find on Map
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
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 pl-3 pr-1.5 py-1.5">
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

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground">Search</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type a district or alert name..."
                className="pl-10 h-11 rounded-xl w-full focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary"
              />
            </div>
          </div>

          <div className="md:col-span-3 flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground">Division</label>
            <SearchableSelect
              value={selectedDivisionId ? String(selectedDivisionId) : "all"}
              onValueChange={(val) => {
                setSelectedDivisionId(!val || val === "all" ? null : Number(val));
                setSelectedDistrictId(null);
              }}
              options={[{ value: "all", label: "All Divisions" }, ...(divisions ?? []).map((d) => ({ value: String(d.id), label: d.nameEn, keywords: d.nameBn }))]}
              searchPlaceholder="Search division…"
            />
          </div>

          <div className="md:col-span-3 flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground">District</label>
            <SearchableSelect
              value={selectedDistrictId ? String(selectedDistrictId) : "all"}
              onValueChange={(val) => setSelectedDistrictId(!val || val === "all" ? null : Number(val))}
              disabled={!selectedDivisionId}
              options={[{ value: "all", label: "All Districts" }, ...(districts ?? []).map((d) => ({ value: String(d.id), label: d.nameEn, keywords: d.nameBn }))]}
              searchPlaceholder="Search district…"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-border/60">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground mr-1 w-full sm:w-auto">
              Severity:
            </span>
            {ALERT_SEVERITIES.map((severity) => {
              const isActive = selectedSeverities.includes(severity);
              return (
                <motion.button
                  key={severity}
                  data-state={isActive ? "active" : "inactive"}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => toggleSeverity(severity)}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold border transition-colors duration-200 capitalize select-none cursor-pointer ${severityPillStyles[severity]}`}
                >
                  {severity.toLowerCase()}
                </motion.button>
              );
            })}
          </div>

          {isFilterActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs font-bold text-muted-foreground hover:text-foreground shrink-0 h-8 self-end sm:self-auto"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      <LocationSearchModal
        open={locationModalOpen}
        onOpenChange={setLocationModalOpen}
        onSelect={setLocationFilter}
        title="Find alerts near a location"
        description="Search a place, tap the map, or use your current location to see the nearest flood alerts."
      />
    </Card>
  );
}
