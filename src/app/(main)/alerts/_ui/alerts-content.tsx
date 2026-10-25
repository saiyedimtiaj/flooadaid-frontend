"use client";

import { useState, useTransition, useMemo } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Map, List, CloudOff, ChevronRight, Radar, Loader2 } from "lucide-react";
import Link from "next/link";
import { AlertFilters } from "./alert-filters";
import { AlertCard } from "./alert-card";
import { AlertDetailSheet } from "./alert-detail-sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAlerts } from "@/lib/hooks/use-alerts";
import { ALERT_SEVERITIES } from "@/lib/alert-severity-styles";
import type { Alert, AlertSeverity } from "@/lib/types/api";
import type { SelectedLocation } from "@/components/map/location-search-modal";

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const AlertsMap = dynamic(() => import("./alerts-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-87.5 md:h-225 flex flex-col items-center justify-center bg-muted/20 border border-border rounded-xl">
      <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-4">
        Loading map...
      </span>
    </div>
  ),
});

const SEVERITY_WEIGHT: Record<AlertSeverity, number> = {
  CRITICAL: 5,
  DANGER: 4,
  WARNING: 3,
  WATCH: 2,
  NORMAL: 1,
};

export function AlertsContent() {
  // Deep link from the home-page map: /alerts?district=<id>
  const searchParams = useSearchParams();
  const districtParam = Number(searchParams.get("district"));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDivisionId, setSelectedDivisionId] = useState<number | null>(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(
    Number.isInteger(districtParam) && districtParam > 0 ? districtParam : null,
  );
  const [selectedSeverities, setSelectedSeverities] = useState<AlertSeverity[]>([]);
  const [locationFilter, setLocationFilter] = useState<SelectedLocation | null>(null);

  const [activeView, setActiveView] = useState<"map" | "list">("map");
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const [, startTransition] = useTransition();

  const { data, isLoading } = useAlerts({
    limit: 100,
    isActive: true,
    districtId: selectedDistrictId ?? undefined,
    severity: selectedSeverities.length > 0 ? selectedSeverities.join(",") : undefined,
  });
  const alerts = useMemo(() => data?.data ?? [], [data]);

  const handleToggleSeverity = (severity: AlertSeverity) => {
    startTransition(() => {
      setSelectedSeverities((prev) =>
        prev.includes(severity) ? prev.filter((s) => s !== severity) : [...prev, severity],
      );
    });
  };

  const handleClearFilters = () => {
    startTransition(() => {
      setSearchQuery("");
      setSelectedDivisionId(null);
      setSelectedDistrictId(null);
      setSelectedSeverities([]);
      setLocationFilter(null);
    });
  };

  const isFilterActive =
    searchQuery !== "" ||
    selectedDivisionId !== null ||
    selectedDistrictId !== null ||
    selectedSeverities.length > 0 ||
    locationFilter !== null;

  const filteredAlerts = useMemo(() => {
    let list = alerts;

    if (searchQuery !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (alert) =>
          alert.title.toLowerCase().includes(q) ||
          (alert.titleBn ?? "").includes(searchQuery) ||
          alert.district.nameEn.toLowerCase().includes(q) ||
          alert.district.nameBn.includes(searchQuery),
      );
    }

    // Location filter: keep alerts whose district is within ~80km of the point.
    if (locationFilter) {
      list = list.filter((a) => {
        if (a.district.latitude == null || a.district.longitude == null) return false;
        return (
          haversineKm(locationFilter.lat, locationFilter.lng, a.district.latitude, a.district.longitude) <= 80
        );
      });
    }

    return list;
  }, [alerts, searchQuery, locationFilter]);

  const countsBySeverity = useMemo(() => {
    const counts: Record<AlertSeverity, number> = { CRITICAL: 0, DANGER: 0, WARNING: 0, WATCH: 0, NORMAL: 0 };
    filteredAlerts.forEach((a) => {
      counts[a.severity]++;
    });
    return counts;
  }, [filteredAlerts]);

  const sortedAlerts = useMemo(() => {
    // When a location is chosen, sort by nearest district first.
    if (locationFilter) {
      return [...filteredAlerts].sort((a, b) => {
        const da =
          a.district.latitude != null && a.district.longitude != null
            ? haversineKm(locationFilter.lat, locationFilter.lng, a.district.latitude, a.district.longitude)
            : Infinity;
        const db =
          b.district.latitude != null && b.district.longitude != null
            ? haversineKm(locationFilter.lat, locationFilter.lng, b.district.latitude, b.district.longitude)
            : Infinity;
        return da - db;
      });
    }
    return [...filteredAlerts].sort((a, b) => {
      const weightDiff = SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity];
      if (weightDiff !== 0) return weightDiff;
      return a.id.localeCompare(b.id);
    });
  }, [filteredAlerts, locationFilter]);

  const severeCount = alerts.filter((a) => a.severity === "CRITICAL" || a.severity === "DANGER").length;

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-linear-to-br from-destructive/8 via-transparent to-primary/5 px-6 py-8 md:px-8 md:py-10">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_20%_0%,color-mix(in_oklch,var(--color-destructive)_8%,transparent),transparent)] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-start gap-4"
          >
            <div className="hidden sm:flex items-center justify-center h-14 w-14 rounded-2xl bg-linear-to-br from-destructive to-orange-500 text-white shrink-0 shadow-sm">
              <Radar className="h-7 w-7" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground select-none">
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground">Flood Alerts</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                Flood Alerts
              </h1>
              <p className="text-sm text-muted-foreground max-w-md">
                Monitor real-time flood conditions across Bangladesh. Stay
                informed, stay safe.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="flex items-center gap-3 rounded-2xl border border-destructive/20 bg-background/70 backdrop-blur-md px-5 py-4 self-start lg:self-auto select-none"
          >
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
            </span>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold text-destructive tabular-nums leading-none">
                {severeCount}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mt-1">
                Severe Alerts Active
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <AlertFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDivisionId={selectedDivisionId}
        setSelectedDivisionId={setSelectedDivisionId}
        selectedDistrictId={selectedDistrictId}
        setSelectedDistrictId={setSelectedDistrictId}
        selectedSeverities={selectedSeverities}
        toggleSeverity={handleToggleSeverity}
        clearFilters={handleClearFilters}
        isFilterActive={isFilterActive}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
      />

      <div className="flex flex-wrap items-center gap-2 py-1 select-none">
        {ALERT_SEVERITIES.map((severity) => {
          const dotColors: Record<AlertSeverity, string> = {
            CRITICAL: "bg-rose-500",
            DANGER: "bg-orange-500",
            WARNING: "bg-yellow-500",
            WATCH: "bg-blue-500",
            NORMAL: "bg-emerald-500",
          };
          const textColors: Record<AlertSeverity, string> = {
            CRITICAL: "border-rose-500/20 bg-rose-500/8 text-rose-600 dark:text-rose-400",
            DANGER: "border-orange-500/20 bg-orange-500/8 text-orange-600 dark:text-orange-400",
            WARNING: "border-yellow-500/20 bg-yellow-500/8 text-yellow-600 dark:text-yellow-400",
            WATCH: "border-blue-500/20 bg-blue-500/8 text-blue-600 dark:text-blue-400",
            NORMAL: "border-emerald-500/20 bg-emerald-500/8 text-emerald-600 dark:text-emerald-400",
          };
          return (
            <span
              key={severity}
              className={`inline-flex items-center gap-2 text-xs font-semibold border px-3.5 py-1.5 rounded-full capitalize ${textColors[severity]}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${dotColors[severity]}`} />
              {severity.toLowerCase()}
              <strong className="font-mono">{countsBySeverity[severity]}</strong>
            </span>
          );
        })}
      </div>
      <div className="flex items-center justify-between gap-4 pt-2 border-t border-border/40">
        <span className="text-xs font-semibold text-muted-foreground">
          {isLoading ? "Loading alerts..." : `Showing ${filteredAlerts.length} of ${alerts.length} flood alerts`}
        </span>
        <Tabs value={activeView} onValueChange={(val) => startTransition(() => setActiveView(val as "map" | "list"))}>
          <TabsList className="grid w-40 grid-cols-2 h-10 rounded-full bg-muted p-1">
            <TabsTrigger
              value="map"
              className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-full data-active:bg-linear-to-br data-active:from-primary data-active:to-[color-mix(in_oklch,var(--primary),black_18%)] data-active:text-primary-foreground data-active:shadow-sm dark:data-active:border-transparent"
            >
              <Map className="h-3.5 w-3.5" />
              Map
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-full data-active:bg-linear-to-br data-active:from-primary data-active:to-[color-mix(in_oklch,var(--primary),black_18%)] data-active:text-primary-foreground data-active:shadow-sm dark:data-active:border-transparent"
            >
              <List className="h-3.5 w-3.5" />
              List
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="relative min-h-100">
        {isLoading ? (
          <div className="flex items-center justify-center h-87.5 md:h-180 rounded-xl border border-border bg-muted/10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : activeView === "map" ? (
          <div className="animate-fade-in duration-200">
            <AlertsMap alerts={filteredAlerts} onSelectAlert={setSelectedAlert} />
          </div>
        ) : (
          <div className="animate-fade-in duration-200">
            {sortedAlerts.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {sortedAlerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} onClick={() => setSelectedAlert(alert)} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-muted/10 max-w-lg mx-auto mt-8">
                <CloudOff className="h-12 w-12 text-muted-foreground/60 shrink-0" />
                <h3 className="text-base font-bold text-foreground mt-4">
                  No flood alerts found
                </h3>
                <p className="text-xs text-muted-foreground/80 leading-relaxed max-w-xs mt-1">
                  Try clearing the filters or searching a different district.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleClearFilters}
                  className="mt-6 font-bold"
                >
                  Clear Active Filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      <AlertDetailSheet
        alert={selectedAlert}
        isOpen={selectedAlert !== null}
        onClose={() => setSelectedAlert(null)}
      />
    </div>
  );
}
