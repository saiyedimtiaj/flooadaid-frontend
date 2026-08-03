import type { AlertSeverity } from "@/lib/types/api";

export const ALERT_SEVERITIES: AlertSeverity[] = ["CRITICAL", "DANGER", "WARNING", "WATCH", "NORMAL"];

// Single source of truth for severity → color. These hex values mirror the
// light-mode --alert-* custom properties in globals.css exactly (CRITICAL is
// intentionally the darkest/most saturated tone, not brightest-red, so the
// escalation reads correctly at a glance: Normal → Watch → Warning → Danger →
// Critical). Leaflet's SVG renderer can't consume CSS custom properties for
// per-marker fill color, so the values are duplicated here rather than read
// live — if you retheme globals.css, update both.
export const ALERT_SEVERITY_STYLES: Record<
  AlertSeverity,
  { color: string; darkColor: string; radius: number; opacity: number; label: string }
> = {
  NORMAL: { color: "#22c55e", darkColor: "#4ade80", radius: 10, opacity: 0.55, label: "Normal" },
  WATCH: { color: "#eab308", darkColor: "#facc15", radius: 12, opacity: 0.6, label: "Watch" },
  WARNING: { color: "#f97316", darkColor: "#fb923c", radius: 14, opacity: 0.65, label: "Warning" },
  DANGER: { color: "#ef4444", darkColor: "#f87171", radius: 17, opacity: 0.72, label: "Danger" },
  CRITICAL: { color: "#7c2d12", darkColor: "#dc2626", radius: 20, opacity: 0.85, label: "Critical" },
};

// Bangladesh geographic center — fallback map position when a district has no lat/lng on record.
export const BANGLADESH_CENTER: [number, number] = [23.685, 90.3563];
