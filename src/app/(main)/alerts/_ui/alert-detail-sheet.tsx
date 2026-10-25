"use client";

import { MapPin, Droplets, Navigation, Share2, Clock } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ALERT_SEVERITY_STYLES } from "@/lib/alert-severity-styles";
import { timeAgo } from "@/lib/format-time-ago";
import type { Alert } from "@/lib/types/api";

const severityStripColors: Record<Alert["severity"], string> = {
  CRITICAL: "bg-rose-500",
  DANGER: "bg-orange-500",
  WARNING: "bg-yellow-500",
  WATCH: "bg-blue-500",
  NORMAL: "bg-emerald-500",
};

interface AlertDetailSheetProps {
  alert: Alert | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AlertDetailSheet({ alert, isOpen, onClose }: AlertDetailSheetProps) {
  if (!alert) return null;

  const style = ALERT_SEVERITY_STYLES[alert.severity];

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-xl p-0 overflow-y-auto border-l border-border bg-background flex flex-col h-full text-left">
        <div className={`h-2.5 w-full shrink-0 ${severityStripColors[alert.severity]}`} />

        <div className="p-6 space-y-6 flex-1">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge
                className="text-xs font-bold capitalize select-none"
                variant={alert.severity === "CRITICAL" || alert.severity === "DANGER" ? "danger" : "success"}
              >
                {style.label} Alert
              </Badge>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                <Clock className="h-3.5 w-3.5" />
                <span>Posted {timeAgo(alert.createdAt)}</span>
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground">{alert.title}</h2>
            {alert.titleBn && (
              <p className="text-sm text-muted-foreground italic leading-relaxed">{alert.titleBn}</p>
            )}
          </div>

          {/* Location Details Block */}
          <div className="rounded-xl border border-border p-4 bg-muted/20 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Location</h4>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-foreground">{alert.district.nameEn} District</p>
                <p className="text-xs text-muted-foreground mt-0.5">{alert.district.nameBn}, Bangladesh</p>
                {alert.district.latitude !== null && alert.district.longitude !== null && (
                  <p className="text-[11px] font-mono text-muted-foreground mt-1.5">
                    Lat: {alert.district.latitude.toFixed(4)} · Lng: {alert.district.longitude.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Water level, if reported */}
          {alert.waterLevelCm !== null && (
            <div className="rounded-xl border border-border p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-primary" />
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Water Level</h4>
              </div>
              <div className="p-3 bg-muted/10 border border-border/50 rounded-lg w-fit">
                <span className="text-[10px] font-semibold text-muted-foreground block">CURRENT LEVEL</span>
                <span className="text-lg font-extrabold text-foreground font-mono">{alert.waterLevelCm} cm</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</h4>
            <p className="text-sm text-foreground leading-relaxed">{alert.description}</p>
          </div>

          <div className="border-t border-border/40 pt-4 flex flex-col gap-1 text-[11px] text-muted-foreground font-mono">
            <div>
              Status:{" "}
              <span className="font-bold text-foreground">{alert.isActive ? "Active" : "Resolved/Inactive"}</span>
            </div>
            <div>
              Last Updated: <span className="font-bold text-foreground">{timeAgo(alert.updatedAt)}</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border bg-background/95 backdrop-blur-md flex gap-3 shrink-0">
          <Button className="flex-1 font-bold group bg-primary hover:bg-primary/95 text-primary-foreground" size="lg" nativeButton={false} render={<a
              href={`https://www.google.com/maps/search/?api=1&query=shelters+near+${alert.district.nameEn}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full" />}>
              <Navigation className="h-4 w-4" />
              Find Nearby Shelters
            </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-4 font-bold"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: alert.title, text: alert.description }).catch(() => {});
              }
            }}
          >
            <Share2 className="h-4.5 w-4.5" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
