"use client";

import { useState, useTransition, useMemo } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Map, List, CloudOff, Radar, AlertOctagon, MapPinned, Droplets } from "lucide-react";
import { AlertFilters } from "./alert-filters";
import { AlertCard } from "./alert-card";
import { AlertDetailSheet } from "./alert-detail-sheet";
import { PageHero } from "@/components/public/page-hero";
import { MapSkeleton } from "@/components/ui/map-skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAlerts } from "@/lib/hooks/use-alerts";
import { ALERT_SEVERITIES } from "@/lib/alert-severity-styles";
import type { Alert, AlertSeverity } from "@/lib/types/api";
import type { SelectedLocation } from "@/components/map/location-search-modal";
import { useT } from "@/lib/i18n/use-t";

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
    <div className="h-87.5 w-full overflow-hidden rounded-xl border border-border md:h-225">
      <MapSkeleton />
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
  const { t, tr, num } = useT();
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
      <PageHero
        icon={Radar}
        crumb={tr("Flood Alerts", "বন্যা সতর্কতা")}
        eyebrow={tr("Real-time monitoring", "রিয়েল-টাইম পর্যবেক্ষণ")}
        title={tr("Flood Alerts", "বন্যা সতর্কতা")}
        description={tr(
          "Water levels and flood warnings for every district in Bangladesh — updated as river gauges report.",
          "বাংলাদেশের প্রতিটি জেলার পানির উচ্চতা ও বন্যা সতর্কতা—নদীর পরিমাপক কেন্দ্রের তথ্য অনুযায়ী হালনাগাদ।",
        )}
        statsTitle={tr("Across Bangladesh", "সারা বাংলাদেশে")}
        stats={[
          { label: tr("Active alerts", "সক্রিয় সতর্কতা"), value: isLoading ? undefined : num(alerts.length), icon: Radar },
          { label: tr("Danger & critical", "বিপদ ও চরম বিপদ"), value: isLoading ? undefined : num(severeCount), icon: AlertOctagon, tone: "alert" },
          { label: tr("Districts on alert", "সতর্কতায় জেলা"), value: isLoading ? undefined : num(new Set(alerts.map((a) => a.districtId)).size), icon: MapPinned },
          {
            label: tr("Highest water level", "সর্বোচ্চ পানির উচ্চতা"),
            value: isLoading ? undefined : `${num(alerts.reduce((m, a) => Math.max(m, a.waterLevelCm ?? 0), 0))} ${tr("cm", "সেমি")}`,
            icon: Droplets,
          },
        ]}
      />

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
              {t(`severity.${severity}`)}
              <strong className="font-mono">{num(countsBySeverity[severity])}</strong>
            </span>
          );
        })}
      </div>
      <div className="flex items-center justify-between gap-4 pt-2 border-t border-border/40">
        <span className="text-xs font-semibold text-muted-foreground">
          {isLoading
            ? tr("Loading alerts...", "সতর্কতা লোড হচ্ছে...")
            : tr(
                `Showing ${filteredAlerts.length} of ${alerts.length} flood alerts`,
                `${num(alerts.length)}টির মধ্যে ${num(filteredAlerts.length)}টি বন্যা সতর্কতা দেখানো হচ্ছে`,
              )}
        </span>
        <Tabs value={activeView} onValueChange={(val) => startTransition(() => setActiveView(val as "map" | "list"))}>
          <TabsList className="grid w-40 grid-cols-2 h-10 rounded-full bg-muted p-1">
            <TabsTrigger
              value="map"
              className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-full data-active:bg-linear-to-br data-active:from-primary data-active:to-[color-mix(in_oklch,var(--primary),black_18%)] data-active:text-primary-foreground data-active:shadow-sm dark:data-active:border-transparent"
            >
              <Map className="h-3.5 w-3.5" />
              {tr("Map", "মানচিত্র")}
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-full data-active:bg-linear-to-br data-active:from-primary data-active:to-[color-mix(in_oklch,var(--primary),black_18%)] data-active:text-primary-foreground data-active:shadow-sm dark:data-active:border-transparent"
            >
              <List className="h-3.5 w-3.5" />
              {tr("List", "তালিকা")}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="relative min-h-100">
        {isLoading ? (
          <div className="h-87.5 overflow-hidden rounded-xl border border-border md:h-180">
            <MapSkeleton label={tr("Loading flood alerts…", "বন্যা সতর্কতা লোড হচ্ছে…")} />
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
                  {tr("No flood alerts found", "কোনো বন্যা সতর্কতা পাওয়া যায়নি")}
                </h3>
                <p className="text-xs text-muted-foreground/80 leading-relaxed max-w-xs mt-1">
                  {tr(
                    "Try clearing the filters or searching a different district.",
                    "ফিল্টার মুছে বা অন্য জেলা খুঁজে চেষ্টা করুন।",
                  )}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleClearFilters}
                  className="mt-6 font-bold"
                >
                  {tr("Clear Active Filters", "সক্রিয় ফিল্টার মুছুন")}
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
