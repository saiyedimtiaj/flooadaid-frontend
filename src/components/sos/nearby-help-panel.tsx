"use client";

import { MapPin, Phone, Navigation, Users, Home, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNearbyShelters } from "@/lib/hooks/use-shelters";
import { useNearbyVolunteers } from "@/lib/hooks/use-volunteers";

interface NearbyHelpPanelProps {
  location: { lat: number; lng: number } | null;
  /** Only show volunteer contact info to authenticated admin/volunteer views. */
  showVolunteers?: boolean;
}

export function NearbyHelpPanel({ location, showVolunteers = false }: NearbyHelpPanelProps) {
  const { data: shelters, isLoading: sheltersLoading } = useNearbyShelters(location, { limit: 4 });
  const { data: volunteers, isLoading: volsLoading } = useNearbyVolunteers(
    showVolunteers ? location : null,
    { limit: 5 },
  );

  if (!location) {
    return (
      <Card className="rounded-3xl border border-dashed border-border bg-muted/10 p-6 text-center">
        <MapPin className="size-8 text-muted-foreground/50 mx-auto mb-2" />
        <p className="text-sm font-semibold text-foreground">Nearby help</p>
        <p className="text-xs text-muted-foreground mt-1">
          Set a location to see the closest shelters
          {showVolunteers ? " and volunteers" : ""}.
        </p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:sticky lg:top-6">
      {/* Nearby shelters */}
      <Card className="rounded-3xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center justify-center size-8 rounded-xl bg-primary/10 text-primary">
            <Home className="size-4" />
          </div>
          <h3 className="text-sm font-bold text-foreground">Nearby Shelters</h3>
        </div>

        {sheltersLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : shelters && shelters.length > 0 ? (
          <div className="flex flex-col gap-3">
            {shelters.map((s) => (
              <div key={s.id} className="rounded-2xl border border-border/70 bg-muted/20 p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{s.address}</p>
                  </div>
                  <span className="text-[10px] font-black text-primary bg-primary/10 rounded-full px-2 py-0.5 shrink-0">
                    {s.distanceKm.toFixed(1)} km
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className="text-muted-foreground">
                    {s.currentOccupancy}/{s.capacity} full
                  </span>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${s.latitude},${s.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                  >
                    <Navigation className="size-3" /> Directions
                  </a>
                  {s.contactPhone && (
                    <a
                      href={`tel:${s.contactPhone}`}
                      className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                    >
                      <Phone className="size-3" /> Call
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground py-2">No shelters found nearby.</p>
        )}
      </Card>

      {/* Nearby volunteers (auth only) */}
      {showVolunteers && (
        <Card className="rounded-3xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center size-8 rounded-xl bg-accent-teal/10 text-accent-teal">
              <Users className="size-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Nearby Volunteers</h3>
          </div>

          {volsLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : volunteers && volunteers.length > 0 ? (
            <div className="flex flex-col gap-3">
              {volunteers.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between gap-2 rounded-2xl border border-border/70 bg-muted/20 p-3.5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{v.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {v.district} · {v.distanceKm.toFixed(1)} km
                    </p>
                  </div>
                  {v.phone && (
                    <a
                      href={`tel:${v.phone}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline shrink-0"
                    >
                      <Phone className="size-3.5" /> {v.phone}
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground py-2">No available volunteers nearby.</p>
          )}
        </Card>
      )}
    </div>
  );
}
