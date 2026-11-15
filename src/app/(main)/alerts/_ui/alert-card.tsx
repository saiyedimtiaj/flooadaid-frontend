"use client";

import { MapPin, Droplets, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ALERT_SEVERITY_STYLES } from "@/lib/alert-severity-styles";
import { timeAgo } from "@/lib/format-time-ago";
import type { Alert } from "@/lib/types/api";
import { useT } from "@/lib/i18n/use-t";

// Background colors for different alert severity levels
const severityBgColors: Record<Alert["severity"], string> = {
  CRITICAL: "bg-rose-500",
  DANGER: "bg-orange-500",
  WARNING: "bg-yellow-500",
  WATCH: "bg-blue-500",
  NORMAL: "bg-emerald-500",
};

// Defines the data and click handler required by the AlertCard component
interface AlertCardProps {
  alert: Alert;
  onClick: () => void;
}

// Displays individual flood alert information
export function AlertCard({ alert, onClick }: AlertCardProps) {
  const { pick } = useT();
  return (
    <Card
      onClick={onClick}
      className="relative flex overflow-hidden border border-border shadow-xs hover:border-primary/40 hover:bg-muted/10 transition-all duration-200 cursor-pointer group text-left"
    >
      {/* Shows a colored indicator based on alert severity */}
      <div className={`w-1.5 shrink-0 ${severityBgColors[alert.severity]}`} />

      <div className="flex-1 p-5 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Displays the alert severity and district name */}
            <Badge
              className="text-[10px] font-bold capitalize select-none"
              variant={alert.severity === "CRITICAL" || alert.severity === "DANGER" ? "danger" : "success"}
            >
              {ALERT_SEVERITY_STYLES[alert.severity].label}
            </Badge>
            <span className="text-xs font-semibold text-muted-foreground">{pick(alert.district.nameEn, alert.district.nameBn)}</span>
          </div>

          {/* Shows how long ago the alert was created */}
          <span className="text-xs text-muted-foreground font-mono shrink-0">{timeAgo(alert.createdAt)}</span>
        </div>

        <div>
          {/* Displays the alert title and an icon on hover */}
          <h3 className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors flex items-start gap-1">
            {alert.title}
            <ArrowUpRight className="h-4 w-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
          </h3>

           {/* Displays the Bangla title only when available */}
          {alert.titleBn && (
            <p className="text-xs text-muted-foreground/80 mt-0.5 italic">{alert.titleBn}</p>
          )}
        </div>

        {/* Displays the district location and water level information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground/60 shrink-0" />
            <span className="truncate">{alert.district.nameBn}</span>
          </div>

                  {/* Shows water level only when the value is available */}
          {alert.waterLevelCm !== null && (
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-primary/60 shrink-0" />
              <span className="font-medium text-foreground">{alert.waterLevelCm} cm</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
