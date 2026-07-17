"use client";

import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Badge } from "@/components/ui/badge";
import type { BadgeProps } from "@/components/ui/badge";

type Severity = "critical" | "danger" | "warning" | "watch";

interface District {
  name: string;
  position: [number, number];
  severity: Severity;
  color: string;
  radius: number;
  waterLevel: string;
}

const severityBadge: Record<Severity, BadgeProps["variant"]> = {
  critical: "danger",
  danger: "danger",
  warning: "warning",
  watch: "warning",
};

const severityLabel: Record<Severity, string> = {
  critical: "CRITICAL",
  danger: "DANGER",
  warning: "WARNING",
  watch: "WATCH",
};

const districts: District[] = [
  {
    name: "চট্টগ্রাম",
    position: [22.3569, 91.7832],
    severity: "critical",
    color: "#7C2D12",
    radius: 22,
    waterLevel: "বিপদসীমার ২৫০ সেমি উপরে",
  },
  {
    name: "কক্সবাজার",
    position: [21.4272, 92.0058],
    severity: "danger",
    color: "#EF4444",
    radius: 16,
    waterLevel: "বিপদসীমার ১২০ সেমি উপরে",
  },
  {
    name: "বান্দরবান",
    position: [22.1953, 92.2184],
    severity: "danger",
    color: "#F97316",
    radius: 16,
    waterLevel: "বিপদসীমার ৯০ সেমি উপরে",
  },
  {
    name: "রাঙামাটি",
    position: [22.7324, 92.2985],
    severity: "warning",
    color: "#F97316",
    radius: 13,
    waterLevel: "বিপদসীমার ৫০ সেমি উপরে",
  },
  {
    name: "খাগড়াছড়ি",
    position: [23.1193, 91.9847],
    severity: "warning",
    color: "#F97316",
    radius: 13,
    waterLevel: "বিপদসীমার ৩৫ সেমি উপরে",
  },
  {
    name: "মৌলভীবাজার",
    position: [24.4829, 91.7774],
    severity: "warning",
    color: "#EAB308",
    radius: 13,
    waterLevel: "বিপদসীমার ২০ সেমি উপরে",
  },
  {
    name: "হবিগঞ্জ",
    position: [24.374, 91.4164],
    severity: "watch",
    color: "#EAB308",
    radius: 11,
    waterLevel: "বিপদসীমার কাছাকাছি",
  },
];

export default function FloodMap() {
  return (
    <MapContainer
      center={[23.685, 90.3563]}
      zoom={7}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {districts.map((district) => (
        <CircleMarker
          key={district.name}
          center={district.position}
          radius={district.radius}
          pathOptions={{
            color: district.color,
            fillColor: district.color,
            fillOpacity: 0.55,
            weight: 2,
          }}
        >
          <Popup>
            <div className="flex flex-col gap-1.5 min-w-40">
              <span className="font-semibold text-foreground">
                {district.name}
              </span>
              <Badge variant={severityBadge[district.severity]}>
                {severityLabel[district.severity]}
              </Badge>
              <span className="text-xs text-muted">
                পানির অবস্থা: {district.waterLevel}
              </span>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
