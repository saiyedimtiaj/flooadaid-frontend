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
}: ShelterFiltersProps) {
  const { data: districts } = useDistricts();

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
    capacityFilter !== "all";

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedDistrictId(null);
    setFacilityFilters([]);
    setCapacityFilter("all");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="size-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Find a Shelter
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
                <SelectValue placeholder="All Districts" />
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
        </div>

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
    </motion.div>
  );
}
