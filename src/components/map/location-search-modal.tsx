"use client";

import { useEffect, useState } from "react";
import { MapPin, Search, Loader2, Crosshair, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LocationPicker } from "@/components/map/location-picker";
import { geocodePlace, type GeocodeResult } from "@/lib/geocode";
import { toast } from "sonner";
import type { LatLng } from "@/components/map/location-picker-map";
import { useT } from "@/lib/i18n/use-t";

export interface SelectedLocation extends LatLng {
  label?: string;
}

interface LocationSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called when the user confirms a location. */
  onSelect: (loc: SelectedLocation) => void;
  title?: string;
  description?: string;
}

export function LocationSearchModal({
  open,
  onOpenChange,
  onSelect,
  title = "Find by location",
  description = "Search a place, tap the map, or use your current location.",
}: LocationSearchModalProps) {
  const { tr } = useT();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [picked, setPicked] = useState<SelectedLocation | null>(null);

  // Reset state whenever the modal opens/closes (via the open handler, not an effect).
  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setQuery("");
      setResults([]);
      setPicked(null);
    }
    onOpenChange(next);
  };

  // Debounced place-name search. All setState happens inside the timeout so we
  // never call it synchronously in the effect body.
  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      if (query.trim().length < 2) {
        if (!cancelled) {
          setResults([]);
          setSearching(false);
        }
        return;
      }
      setSearching(true);
      try {
        const found = await geocodePlace(query);
        if (!cancelled) setResults(found);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query]);

  const chooseResult = (r: GeocodeResult) => {
    setPicked({ lat: r.lat, lng: r.lng, label: r.label });
    setResults([]);
    setQuery(r.label.split(",")[0]);
  };

  const confirm = () => {
    if (!picked) {
      toast.error(tr("Please choose a location first", "অনুগ্রহ করে আগে একটি অবস্থান বেছে নিন"));
      return;
    }
    onSelect(picked);
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden gap-0">
        <DialogHeader className="p-5 pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center size-9 rounded-xl bg-primary/10 text-primary shrink-0">
              <MapPin className="size-4.5" />
            </div>
            <div>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-5 flex flex-col gap-4">
          {/* Place-name search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tr(
                "Search a place, e.g. Feni, Banshkhali, Sylhet…",
                "স্থান খুঁজুন, যেমন ফেনী, বাঁশখালী, সিলেট…",
              )}
              className="pl-10 h-11 rounded-xl"
            />
            {searching && (
              <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground" />
            )}

            {results.length > 0 && (
              <div className="absolute z-20 mt-1.5 left-0 right-0 rounded-xl border border-border bg-popover shadow-lg overflow-hidden max-h-60 overflow-y-auto">
                {results.map((r, i) => (
                  <button
                    key={`${r.lat}-${r.lng}-${i}`}
                    type="button"
                    onClick={() => chooseResult(r)}
                    className="w-full flex items-start gap-2.5 px-3.5 py-2.5 text-left hover:bg-muted transition-colors"
                  >
                    <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground line-clamp-2">{r.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Map picker */}
          <LocationPicker
            value={picked}
            onChange={(loc) => setPicked({ ...loc })}
            heightClass="h-72"
          />

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Crosshair className="size-3.5" />
              {tr("Tip: tap anywhere on the map to drop a pin.", "পরামর্শ: পিন বসাতে মানচিত্রের যেকোনো স্থানে চাপুন।")}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => handleOpenChange(false)} className="font-semibold">
                {tr("Cancel", "বাতিল")}
              </Button>
              <Button onClick={confirm} disabled={!picked} className="gap-2 font-semibold">
                <Check className="size-4" />
                {tr("Use This Location", "এই অবস্থান ব্যবহার করুন")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
