"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Crosshair, Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { LatLng } from "./location-picker-map";
import { useT } from "@/lib/i18n/use-t";

function MapLoading() {
  const { tr } = useT();
  return (
    <Skeleton className="w-full h-full flex items-center justify-center bg-muted/40 gap-2">
      <MapPin className="size-5 animate-bounce text-muted-foreground" />
      <span className="text-xs font-semibold text-muted-foreground">{tr("Loading map…", "মানচিত্র লোড হচ্ছে…")}</span>
    </Skeleton>
  );
}

const DynamicMap = dynamic(() => import("./location-picker-map"), {
  ssr: false,
  loading: () => <MapLoading />,
});

type DetectState = "idle" | "detecting" | "success" | "error";

interface LocationPickerProps {
  value: LatLng | null;
  onChange: (loc: LatLng) => void;
  /** Map height utility class, e.g. "h-72". Defaults to h-72. */
  heightClass?: string;
  className?: string;
}

/**
 * Reusable "pick a location on the map" field: a click-to-place map plus a
 * "use my current location" GPS button and a coordinate readout. Shared by the
 * admin shelter form and the manual SOS-entry form.
 */
export function LocationPicker({
  value,
  onChange,
  heightClass = "h-72",
  className,
}: LocationPickerProps) {
  const { tr, num } = useT();
  const [detectState, setDetectState] = useState<DetectState>("idle");

  const detect = () => {
    if (!navigator.geolocation) {
      toast.error(tr("Location not supported on this device", "এই ডিভাইসে অবস্থান শনাক্তকরণ সমর্থিত নয়"));
      return;
    }
    setDetectState("detecting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setDetectState("success");
        toast.success(tr("Location found", "অবস্থান পাওয়া গেছে"));
        setTimeout(() => setDetectState("idle"), 1500);
      },
      () => {
        setDetectState("error");
        toast.error(tr("Could not find your location", "আপনার অবস্থান পাওয়া যায়নি"), {
          description: tr("Please allow location access, or tap the map.", "অবস্থানের অনুমতি দিন অথবা মানচিত্রে চাপুন।"),
        });
        setTimeout(() => setDetectState("idle"), 2000);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className={className}>
      <div
        className={`relative w-full ${heightClass} rounded-xl overflow-hidden border border-border bg-muted/20`}
      >
        <DynamicMap value={value} onChange={onChange} />
        <div className="absolute bottom-3 left-0 right-0 flex justify-center z-[1001] pointer-events-none">
          <div className="pointer-events-auto">
            <Button
              type="button"
              onClick={detect}
              disabled={detectState === "detecting"}
              size="sm"
              className="rounded-full px-5 h-10 text-xs font-bold gap-2 shadow-md"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={detectState}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.12 }}
                  className="flex items-center gap-1.5"
                >
                  {detectState === "detecting" && (
                    <>
                      <Loader2 className="size-3.5 animate-spin" /> {tr("Finding you…", "আপনার অবস্থান খোঁজা হচ্ছে…")}
                    </>
                  )}
                  {detectState === "success" && (
                    <>
                      <CheckCircle className="size-3.5" /> {tr("Location found", "অবস্থান পাওয়া গেছে")}
                    </>
                  )}
                  {detectState === "error" && (
                    <>
                      <XCircle className="size-3.5" /> {tr("Try again", "আবার চেষ্টা করুন")}
                    </>
                  )}
                  {detectState === "idle" && (
                    <>
                      <Crosshair className="size-3.5" /> {tr("Use My Current Location", "আমার বর্তমান অবস্থান ব্যবহার করুন")}
                    </>
                  )}
                </motion.span>
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-2.5">
        {value ? (
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle className="size-4 text-emerald-500 shrink-0" />
            <span className="font-semibold text-foreground">{tr("Location set", "অবস্থান নির্ধারিত")}:</span>
            <span className="font-mono text-muted-foreground">
              {num(value.lat.toFixed(5))}, {num(value.lng.toFixed(5))}
            </span>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <MapPin className="size-4 text-amber-500 shrink-0" />
            {tr("Tap the map or use the button to set the location.", "অবস্থান নির্ধারণ করতে মানচিত্রে চাপুন বা বোতামটি ব্যবহার করুন।")}
          </p>
        )}
      </div>
    </div>
  );
}
