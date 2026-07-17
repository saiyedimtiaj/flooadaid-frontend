import type { AlertSeverity } from "@/lib/types/api";

export const ALERT_SEVERITIES: AlertSeverity[] = ["CRITICAL", "DANGER", "WARNING", "WATCH", "NORMAL"];

export const ALERT_SEVERITY_STYLES: Record<
  AlertSeverity,
  { color: string; radius: number; opacity: number; label: string }
> = {
  CRITICAL: { color: "#ef4444", radius: 20, opacity: 0.8, label: "Critical" },
  DANGER: { color: "#f97316", radius: 16, opacity: 0.7, label: "Danger" },
  WARNING: { color: "#eab308", radius: 14, opacity: 0.6, label: "Warning" },
  WATCH: { color: "#3b82f6", radius: 12, opacity: 0.5, label: "Watch" },
  NORMAL: { color: "#10b981", radius: 10, opacity: 0.4, label: "Normal" },
};

// Bangladesh geographic center — fallback map position when a district has no lat/lng on record.
export const BANGLADESH_CENTER: [number, number] = [23.685, 90.3563];
