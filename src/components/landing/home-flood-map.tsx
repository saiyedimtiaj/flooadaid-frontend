"use client";

import { useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { ArrowRight, MapPin, Droplets, Clock, Radar } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import "leaflet/dist/leaflet.css";
import { ALERT_SEVERITIES, ALERT_SEVERITY_STYLES } from "@/lib/alert-severity-styles";
import type { AlertSeverity } from "@/lib/types/api";

interface DistrictMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  severity: AlertSeverity;
  waterLevel: string;
  affected: string;
}

const affectedDistricts: DistrictMarker[] = [
  {
    id: "chattogram",
    name: "Chattogram",
    lat: 22.3569,
    lng: 91.7832,
    severity: "CRITICAL",
    waterLevel: "250cm above danger level",
    affected: "~450,000 people",
  },
  {
    id: "coxsbazar",
    name: "Cox's Bazar",
    lat: 21.4272,
    lng: 92.0058,
    severity: "DANGER",
    waterLevel: "180cm above danger level",
    affected: "~320,000 people",
  },
  {
    id: "bandarban",
    name: "Bandarban",
    lat: 22.1953,
    lng: 92.2184,
    severity: "DANGER",
    waterLevel: "150cm above danger level",
    affected: "~120,000 people",
  },
  {
    id: "rangamati",
    name: "Rangamati",
    lat: 22.7324,
    lng: 92.2985,
    severity: "WARNING",
    waterLevel: "85cm above danger level",
    affected: "~95,000 people",
  },
  {
    id: "khagrachhari",
    name: "Khagrachhari",
    lat: 23.1193,
    lng: 91.9847,
    severity: "WARNING",
    waterLevel: "60cm above danger level",
    affected: "~70,000 people",
  },
  {
    id: "moulvibazar",
    name: "Moulvibazar",
    lat: 24.4829,
    lng: 91.7774,
    severity: "WATCH",
    waterLevel: "Near danger level",
    affected: "~150,000 people",
  },
  {
    id: "habiganj",
    name: "Habiganj",
    lat: 24.374,
    lng: 91.4164,
    severity: "WATCH",
    waterLevel: "Rising rapidly",
    affected: "~110,000 people",
  },
];

const SEVERITY_BADGE_CLASS: Record<AlertSeverity, string> = {
  NORMAL: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  WATCH: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  WARNING: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
  DANGER: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  CRITICAL:
    "bg-[#7c2d12]/15 text-[#7c2d12] dark:bg-[#dc2626]/15 dark:text-[#f87171] border-[#7c2d12]/25 dark:border-[#dc2626]/25",
};

function MapScrollControl() {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimeout = useRef<NodeJS.Timeout | null>(null);

  const mapEventHandlers = {
    focus: () => {
      map.scrollWheelZoom.disable();
    },
    mousewheel: (e: { originalEvent: WheelEvent }) => {
      const originalEvent = e.originalEvent;
      if (originalEvent.ctrlKey || originalEvent.metaKey) {
        map.scrollWheelZoom.enable();
      } else {
        map.scrollWheelZoom.disable();
        setShowTooltip(true);
        if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
        tooltipTimeout.current = setTimeout(() => setShowTooltip(false), 2000);
      }
    },
    mouseout: () => {
      setShowTooltip(false);
    },
  } as any;

  const map = useMapEvents(mapEventHandlers);

  return showTooltip ? (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-1000 bg-slate-950/90 text-white text-xs px-3 py-2 rounded-md border border-slate-800 pointer-events-none transition-opacity duration-300">
      Use Ctrl + Scroll to zoom
    </div>
  ) : null;
}

export default function HomeFloodMap() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

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
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                Flood Situation Map
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Real-time flood conditions across Bangladesh
              </p>
            </div>
          </div>
          <Link
            href="/alerts"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline group shrink-0"
          >
            View Full Map
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative rounded-2xl bg-linear-to-br from-primary/15 via-border/40 to-transparent p-px"
        >
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

              <MapScrollControl />

              {affectedDistricts.map((district) => {
                const style = ALERT_SEVERITY_STYLES[district.severity];
                const color = isDark ? style.darkColor : style.color;

                return (
                  <CircleMarker
                    key={district.id}
                    center={[district.lat, district.lng]}
                    radius={style.radius}
                    pathOptions={{
                      fillColor: color,
                      color: color,
                      weight: 2,
                      opacity: 0.9,
                      fillOpacity: style.opacity,
                    }}
                    className="alert-marker-ring"
                  >
                    <Popup minWidth={200}>
                      <div className="flex flex-col gap-2 font-sans">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-bold text-sm text-slate-950 dark:text-white leading-none">
                            {district.name}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded-sm leading-none border ${SEVERITY_BADGE_CLASS[district.severity]}`}
                          >
                            {style.label}
                          </span>
                        </div>

                        <div className="flex flex-col gap-1 text-[11px] text-muted-foreground border-t pt-1.5">
                          <div className="flex justify-between">
                            <span>Water Level:</span>
                            <strong className="text-foreground font-semibold">
                              {district.waterLevel}
                            </strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Impacted:</span>
                            <strong className="text-foreground font-semibold">
                              {district.affected}
                            </strong>
                          </div>
                        </div>

                        <Link
                          href={`/alerts?district=${district.id}`}
                          className="text-[10px] font-bold text-primary hover:underline inline-flex items-center gap-0.5 mt-0.5"
                        >
                          View Details →
                        </Link>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>

            <div className="absolute bottom-3 right-3 z-1000 bg-background/95 backdrop-blur-xs p-3 rounded-lg border border-border flex flex-col gap-2 min-w-30 pointer-events-auto">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground leading-none">
                Severity
              </span>
              <div className="flex flex-col gap-1.5">
                {ALERT_SEVERITIES.slice()
                  .reverse()
                  .map((severity) => {
                    const style = ALERT_SEVERITY_STYLES[severity];
                    const color = isDark ? style.darkColor : style.color;
                    return (
                      <div key={severity} className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full ring-2 ring-background shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-xs text-foreground font-medium leading-none">
                          {style.label}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-1"
        >
          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-muted-foreground/80 shrink-0" />
            <span>7 districts affected</span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-destructive">
            <Droplets className="h-4 w-4 text-destructive shrink-0" />
            <span>Water levels rising</span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-muted-foreground/80 shrink-0" />
            <span>Last updated: 2 hours ago</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
