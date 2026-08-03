"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "next-themes";
import { AlertTriangle } from "lucide-react";
import { ALERT_SEVERITY_STYLES, ALERT_SEVERITIES, BANGLADESH_CENTER } from "@/lib/alert-severity-styles";
import { timeAgo } from "@/lib/format-time-ago";
import type { Alert, AlertSeverity } from "@/lib/types/api";

const SEVERITY_BADGE_CLASS: Record<AlertSeverity, string> = {
  NORMAL: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  WATCH: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  WARNING: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  DANGER: "bg-red-500/10 text-red-700 dark:text-red-400",
  CRITICAL: "bg-[#7c2d12]/15 text-[#7c2d12] dark:bg-[#dc2626]/15 dark:text-[#f87171]",
};

function positionOf(alert: Alert): [number, number] {
  if (alert.district.latitude !== null && alert.district.longitude !== null) {
    return [alert.district.latitude, alert.district.longitude];
  }
  return BANGLADESH_CENTER;
}

function MapController({ alerts }: { alerts: Alert[] }) {
  const map = useMap();

  useEffect(() => {
    if (alerts.length === 0) return;
    const bounds = L.latLngBounds(alerts.map(positionOf));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 9 });
  }, [alerts, map]);

  return null;
}

interface AlertsMapProps {
  alerts: Alert[];
  onSelectAlert: (alert: Alert) => void;
}

export default function AlertsMap({ alerts, onSelectAlert }: AlertsMapProps) {
  // Ensure the Leaflet container is created only once, after mount, so its
  // internal panes exist before children (TileLayer) attach — avoids the
  // "Cannot read properties of undefined (reading 'appendChild')" crash on
  // React 19 double-invoke / container reuse.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Defer one frame so the container is fully in the DOM before Leaflet
    // initialises its panes (avoids the TileLayer appendChild crash).
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  if (!mounted) {
    return (
      <div className="w-full h-87.5 md:h-180 rounded-xl border border-border bg-muted/20 flex items-center justify-center">
        <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
          Loading map...
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-87.5 md:h-180 rounded-2xl overflow-hidden border border-border shadow-sm z-10">
      <MapContainer center={BANGLADESH_CENTER} zoom={7} className="w-full h-full">
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

        {alerts.map((alert) => {
          const style = ALERT_SEVERITY_STYLES[alert.severity];
          const color = isDark ? style.darkColor : style.color;
          return (
            <CircleMarker
              key={alert.id}
              center={positionOf(alert)}
              radius={style.radius}
              pathOptions={{
                fillColor: color,
                color: color,
                weight: 2,
                opacity: 0.9,
                fillOpacity: style.opacity,
              }}
              className="alert-marker-ring"
              eventHandlers={{ click: () => onSelectAlert(alert) }}
            >
              <Popup minWidth={220}>
                <div className="p-1 space-y-2 min-w-50">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${SEVERITY_BADGE_CLASS[alert.severity]}`}
                    >
                      <AlertTriangle className="h-2.5 w-2.5" />
                      {style.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {timeAgo(alert.createdAt)}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-foreground leading-tight m-0">{alert.title}</h4>
                  <p className="text-[11px] text-muted-foreground m-0">
                    District: <strong className="text-foreground">{alert.district.nameEn}</strong>
                  </p>
                  {alert.waterLevelCm !== null && (
                    <p className="text-[11px] text-muted-foreground m-0">
                      Water:{" "}
                      <span className="font-mono font-bold text-primary">{alert.waterLevelCm} cm</span>
                    </p>
                  )}
                  <button
                    onClick={() => onSelectAlert(alert)}
                    className="w-full mt-2 text-center text-[11px] bg-primary text-primary-foreground font-bold py-1 px-2 rounded-md transition-colors hover:bg-primary/90"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        <MapController alerts={alerts} />
      </MapContainer>

      <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur-md p-3.5 rounded-xl border border-border shadow-lg z-400 text-left select-none hidden sm:block">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
          Severity Scale
        </h4>
        <div className="space-y-2">
          {ALERT_SEVERITIES.map((severity) => {
            const value = ALERT_SEVERITY_STYLES[severity];
            const color = isDark ? value.darkColor : value.color;
            return (
              <div key={severity} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0 ring-2 ring-background"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[11px] font-medium text-foreground">{value.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
