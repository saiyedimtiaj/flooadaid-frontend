"use client";

import { useRef, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents } from "react-leaflet";
import type { LeafletEventHandlerFnMap } from "leaflet";
import { ArrowRight, MapPin, Siren, Clock, Radar, Home, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import "leaflet/dist/leaflet.css";
import { ALERT_SEVERITIES, ALERT_SEVERITY_STYLES } from "@/lib/alert-severity-styles";
import { useDistrictOverview } from "@/lib/hooks/use-stats";
import { useT, type MessageKey } from "@/lib/i18n/use-t";
import { timeAgo } from "@/lib/format-time-ago";
import type { AlertSeverity, DistrictOverview } from "@/lib/types/api";

const SEVERITY_BADGE_CLASS: Record<AlertSeverity, string> = {
  NORMAL: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  WATCH: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  WARNING: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
  DANGER: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  CRITICAL:
    "bg-[#7c2d12]/15 text-[#7c2d12] dark:bg-[#dc2626]/15 dark:text-[#f87171] border-[#7c2d12]/25 dark:border-[#dc2626]/25",
};

const SEVERITY_RANK: Record<AlertSeverity, number> = {
  NORMAL: 0,
  WATCH: 1,
  WARNING: 2,
  DANGER: 3,
  CRITICAL: 4,
};

/** A district earns a marker if anything is happening there. */
function isActive(d: DistrictOverview) {
  return !!d.alert || d.openSos > 0 || d.shelters.open > 0 || d.openMissing > 0;
}

/** Sort key: worst alert first, then open SOS, then people sheltered. */
function impact(d: DistrictOverview) {
  return (d.alert ? (SEVERITY_RANK[d.alert.severity] + 1) * 10_000 : 0) + d.openSos * 100 + d.shelters.occupancy / 100;
}

function MapScrollControl({ hint }: { hint: string }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimeout = useRef<NodeJS.Timeout | null>(null);

  // `mousewheel` isn't in Leaflet's typed event map, but Leaflet does fire it.
  const handlers = {
    focus: () => map.scrollWheelZoom.disable(),
    mousewheel: (e: { originalEvent: WheelEvent }) => {
      if (e.originalEvent.ctrlKey || e.originalEvent.metaKey) {
        map.scrollWheelZoom.enable();
      } else {
        map.scrollWheelZoom.disable();
        setShowTooltip(true);
        if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
        tooltipTimeout.current = setTimeout(() => setShowTooltip(false), 2000);
      }
    },
    mouseout: () => setShowTooltip(false),
  } as unknown as LeafletEventHandlerFnMap;

  const map = useMapEvents(handlers);

  return showTooltip ? (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-1000 bg-slate-950/90 text-white text-xs px-3 py-2 rounded-md border border-slate-800 pointer-events-none">
      {hint}
    </div>
  ) : null;
}

export default function HomeFloodMap() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { t, pick, num, lang } = useT();
  const { data, isLoading, isError } = useDistrictOverview();

  const active = (data?.districts ?? [])
    .filter((d) => isActive(d) && d.latitude != null && d.longitude != null)
    .sort((a, b) => impact(a) - impact(b)); // worst drawn last = on top
  const onAlert = active.filter((d) => d.alert && SEVERITY_RANK[d.alert.severity] >= SEVERITY_RANK.WARNING);
  const top = [...active].reverse().filter((d) => d.alert || d.openSos > 0).slice(0, 4);
  const updatedAt = data?.lastAlertUpdate ?? data?.generatedAt;

  return (
    <section className="relative my-16 md:my-20 w-full bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <div className="hidden sm:flex items-center justify-center h-11 w-11 rounded-xl bg-destructive/10 text-destructive shrink-0 mt-0.5">
              <Radar className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{t("map.title")}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t("map.subtitle")}</p>
            </div>
          </div>
          <Link
            href="/alerts"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline group shrink-0"
          >
            {t("map.viewAlerts")}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        <div className="relative rounded-2xl bg-linear-to-br from-primary/15 via-border/40 to-transparent p-px">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card h-95 md:h-130 w-full z-10">
            <MapContainer
              center={[23.685, 90.3563]}
              zoom={7}
              className="h-full w-full"
              scrollWheelZoom={false}
              zoomControl={true}
              attributionControl={false}
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
              <MapScrollControl hint={lang === "bn" ? "জুম করতে Ctrl + স্ক্রল করুন" : "Use Ctrl + Scroll to zoom"} />

              {active.map((d) => {
                const severity = d.alert?.severity ?? "NORMAL";
                const style = ALERT_SEVERITY_STYLES[severity];
                const color = d.alert ? (isDark ? style.darkColor : style.color) : "#64748b";
                return (
                  <CircleMarker
                    key={d.districtId}
                    center={[d.latitude!, d.longitude!]}
                    radius={d.alert ? style.radius : 7}
                    pathOptions={{ fillColor: color, color, weight: 2, opacity: 0.9, fillOpacity: d.alert ? style.opacity : 0.35 }}
                    className={d.alert ? "alert-marker-ring" : undefined}
                  >
                    <Popup minWidth={220}>
                      <div className="flex flex-col gap-2 font-sans">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-bold text-sm text-slate-950 dark:text-white leading-none">
                            {pick(d.nameEn, d.nameBn)}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded-sm leading-none border ${SEVERITY_BADGE_CLASS[severity]}`}
                          >
                            {d.alert ? t(`severity.${severity}` as MessageKey) : t("map.allClear")}
                          </span>
                        </div>
                        {d.alert && (
                          <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
                            {pick(d.alert.title, d.alert.titleBn)}
                          </p>
                        )}
                        <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-muted-foreground border-t pt-1.5">
                          {d.alert?.waterLevelCm != null && (
                            <>
                              <dt>{t("map.waterLevel")}</dt>
                              <dd className="text-right font-semibold text-foreground">{num(d.alert.waterLevelCm)} cm</dd>
                            </>
                          )}
                          <dt>{t("map.openSos")}</dt>
                          <dd className="text-right font-semibold text-foreground">{num(d.openSos)}</dd>
                          <dt>{t("map.shelters")}</dt>
                          <dd className="text-right font-semibold text-foreground">{num(d.shelters.open)}</dd>
                          <dt>{t("map.sheltered")}</dt>
                          <dd className="text-right font-semibold text-foreground">{num(d.shelters.occupancy)}</dd>
                          <dt>{t("map.families")}</dt>
                          <dd className="text-right font-semibold text-foreground">{num(d.relief.familiesServed)}</dd>
                          {d.openMissing > 0 && (
                            <>
                              <dt>{t("map.missing")}</dt>
                              <dd className="text-right font-semibold text-foreground">{num(d.openMissing)}</dd>
                            </>
                          )}
                        </dl>
                        <div className="flex gap-3">
                          <Link
                            href={`/alerts?district=${d.districtId}`}
                            className="text-[10px] font-bold text-primary hover:underline"
                          >
                            {t("map.viewAlerts")} →
                          </Link>
                          <Link href="/shelters" className="text-[10px] font-bold text-primary hover:underline">
                            {t("map.findShelters")} →
                          </Link>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>

            {(isLoading || isError) && (
              <div className="absolute inset-0 z-1000 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
                <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  {isError ? t("map.error") : t("map.loading")}
                </span>
              </div>
            )}

            <div className="absolute bottom-3 right-3 z-1000 bg-background/95 backdrop-blur-xs p-3 rounded-lg border border-border flex flex-col gap-2 min-w-30 pointer-events-auto">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground leading-none">
                {t("map.legend")}
              </span>
              <div className="flex flex-col gap-1.5">
                {ALERT_SEVERITIES.map((severity) => {
                  const style = ALERT_SEVERITY_STYLES[severity];
                  return (
                    <div key={severity} className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full ring-2 ring-background shrink-0"
                        style={{ backgroundColor: isDark ? style.darkColor : style.color }}
                      />
                      <span className="text-xs text-foreground font-medium leading-none">
                        {t(`severity.${severity}` as MessageKey)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {top.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {top.map((d) => (
              <Link
                key={d.districtId}
                href={`/alerts?district=${d.districtId}`}
                className="rounded-xl border border-border bg-card p-3 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-foreground truncate">{pick(d.nameEn, d.nameBn)}</span>
                  {d.alert && (
                    <span
                      className={`px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded-sm border ${SEVERITY_BADGE_CLASS[d.alert.severity]}`}
                    >
                      {t(`severity.${d.alert.severity}` as MessageKey)}
                    </span>
                  )}
                </div>
                <div className="mt-1.5 flex gap-3 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Siren className="size-3" />
                    {num(d.openSos)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Home className="size-3" />
                    {num(d.shelters.occupancy)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-1">
          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-muted-foreground/80 shrink-0" />
            <span>
              {onAlert.length > 0 ? `${num(onAlert.length)} ${t("map.districtsOnAlert")}` : t("map.noAlerts")}
            </span>
          </div>
          {updatedAt && (
            <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-muted-foreground/80 shrink-0" />
              <span>
                {t("map.updated")}:{" "}
                {lang === "bn" ? new Date(updatedAt).toLocaleString("bn-BD") : timeAgo(updatedAt)}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
