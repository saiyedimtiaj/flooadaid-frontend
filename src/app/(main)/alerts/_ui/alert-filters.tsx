"use client";

import { motion } from "framer-motion";
import { Search, RotateCcw, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDistricts, useDivisions } from "@/lib/hooks/use-locations";
import { ALERT_SEVERITIES } from "@/lib/alert-severity-styles";
import type { AlertSeverity } from "@/lib/types/api";

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
}: AlertFiltersProps) {
  const { data: divisions } = useDivisions();
  const { data: districts } = useDistricts(selectedDivisionId ?? undefined);

  return (
    <Card>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Filter Alerts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="relative md:col-span-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by district or title..."
              className="pl-10 h-11 rounded-xl w-full focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary"
            />
          </div>

          <div className="md:col-span-3">
            <Select
              value={selectedDivisionId ? String(selectedDivisionId) : "all"}
              onValueChange={(val) => {
                setSelectedDivisionId(val === "all" ? null : Number(val));
                setSelectedDistrictId(null);
              }}
            >
              <SelectTrigger className="w-full data-[size=default]:h-11 rounded-xl">
                <SelectValue placeholder="All Divisions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Divisions</SelectItem>
                {divisions?.map((division) => (
                  <SelectItem key={division.id} value={String(division.id)}>
                    {division.nameEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-3">
            <Select
              value={selectedDistrictId ? String(selectedDistrictId) : "all"}
              onValueChange={(val) => setSelectedDistrictId(val === "all" ? null : Number(val))}
              disabled={!selectedDivisionId}
            >
              <SelectTrigger className="w-full data-[size=default]:h-11 rounded-xl">
                <SelectValue placeholder="All Districts" />
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
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-border/60">
          <div className="flex flex-wrap items-center gap-2">
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
    </Card>
  );
}
