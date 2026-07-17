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
import "leaflet/dist/leaflet.css";

interface DistrictMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  severity: "critical" | "danger" | "warning" | "watch";
  color: string;
  radius: number;
  opacity: number;
  waterLevel: string;
  affected: string;
}

const affectedDistricts: DistrictMarker[] = [
  {
    id: "chattogram",
    name: "Chattogram",
    lat: 22.3569,
    lng: 91.7832,
    severity: "critical",
    color: "#7C2D12",
    radius: 22,
    opacity: 0.85,
    waterLevel: "250cm above danger level",
    affected: "~450,000 people",
  },
  {
    id: "coxsbazar",
    name: "Cox's Bazar",
    lat: 21.4272,
    lng: 92.0058,
    severity: "danger",
    color: "#EF4444",
    radius: 18,
    opacity: 0.75,
    waterLevel: "180cm above danger level",
    affected: "~320,000 people",
  },
  {
    id: "bandarban",
    name: "Bandarban",
    lat: 22.1953,
    lng: 92.2184,
    severity: "danger",
    color: "#EF4444",
    radius: 16,
    opacity: 0.7,
    waterLevel: "150cm above danger level",
    affected: "~120,000 people",
  },
  {
    id: "rangamati",
    name: "Rangamati",
    lat: 22.7324,
    lng: 92.2985,
    severity: "warning",
    color: "#F97316",
    radius: 15,
    opacity: 0.65,
    waterLevel: "85cm above danger level",
    affected: "~95,000 people",
  },
  {
    id: "khagrachhari",
    name: "Khagrachhari",
    lat: 23.1193,
    lng: 91.9847,
    severity: "warning",
    color: "#F97316",
    radius: 14,
    opacity: 0.6,
    waterLevel: "60cm above danger level",
    affected: "~70,000 people",
  },
  {
    id: "moulvibazar",
    name: "Moulvibazar",
    lat: 24.4829,
    lng: 91.7774,
    severity: "watch",
    color: "#EAB308",
    radius: 13,
    opacity: 0.55,
    waterLevel: "Near danger level",
    affected: "~150,000 people",
  },
  {
    id: "habiganj",
    name: "Habiganj",
    lat: 24.374,
    lng: 91.4164,
    severity: "watch",
    color: "#EAB308",
    radius: 12,
    opacity: 0.5,
    waterLevel: "Rising rapidly",
    affected: "~110,000 people",
  },
];

const legendItems = [
  { label: "Critical", className: "bg-[#7C2D12] border-[#521E0F]" },
  { label: "Danger", className: "bg-red-500 border-red-600" },
  { label: "Warning", className: "bg-orange-500 border-orange-600" },
  { label: "Watch", className: "bg-yellow-500 border-yellow-600" },
  { label: "Normal", className: "bg-emerald-500 border-emerald-600" },
];

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
                const isPulsing =
                  district.severity === "critical" ||
                  district.severity === "danger";
                const classNames = isPulsing ? "map-pulse-accent" : "";

                return (
                  <CircleMarker
                    key={district.id}
                    center={[district.lat, district.lng]}
                    radius={district.radius}
                    pathOptions={{
                      fillColor: district.color,
                      color: district.color,
                      weight: isPulsing ? 2 : 1,
                      opacity: district.opacity,
                      fillOpacity: district.opacity - 0.15,
                    }}
                    className={classNames}
                  >
                    <Popup minWidth={200} className="custom-popup">
                      <div className="flex flex-col gap-2 font-sans">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-bold text-sm text-slate-950 dark:text-white leading-none">
                            {district.name}
                          </span>
                          <span
                            className={`
                              px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded-sm leading-none border
                              ${
                                district.severity === "critical"
                                  ? "bg-red-950 text-red-200 border-red-800"
                                  : district.severity === "danger"
                                    ? "bg-red-500/10 text-red-600 border-red-200"
                                    : district.severity === "warning"
                                      ? "bg-orange-500/10 text-orange-600 border-orange-200"
                                      : "bg-yellow-500/10 text-yellow-600 border-yellow-200"
                              }
                            `}
                          >
                            {district.severity}
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
                {legendItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full border shrink-0 ${item.className}`}
                    />
                    <span className="text-xs text-foreground font-medium leading-none">
                      {item.label}
                    </span>
                  </div>
                ))}
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
            <Droplets className="h-4 w-4 text-destructive shrink-0 animate-pulse" />
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
