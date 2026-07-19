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
import { Badge } from "@/components/ui/badge";
import { ALERT_SEVERITY_STYLES, BANGLADESH_CENTER } from "@/lib/alert-severity-styles";
import { timeAgo } from "@/lib/format-time-ago";
import type { Alert } from "@/lib/types/api";

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
    <div className="relative w-full h-87.5 md:h-180 rounded-xl overflow-hidden border border-border shadow-sm z-10">
      <MapContainer center={BANGLADESH_CENTER} zoom={7} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {alerts.map((alert) => {
          const style = ALERT_SEVERITY_STYLES[alert.severity];
          return (
            <CircleMarker
              key={alert.id}
              center={positionOf(alert)}
              radius={style.radius}
              fillColor={style.color}
              color={style.color}
              weight={2}
              opacity={style.opacity}
              fillOpacity={style.opacity - 0.1}
            >
              <Popup>
                <div className="p-1 space-y-2 min-w-200px">
                  <div className="flex items-center justify-between gap-2">
                    <Badge className="text-[10px] capitalize font-bold shrink-0" variant="info">
                      {style.label}
                    </Badge>
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

      <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur-md p-3 rounded-lg border border-border shadow-lg z-400 text-left select-none hidden sm:block">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
          Severity Scale
        </h4>
        <div className="space-y-1.5">
          {Object.values(ALERT_SEVERITY_STYLES).map((value) => (
            <div key={value.label} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: value.color }} />
              <span className="text-[11px] font-medium text-foreground">{value.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
