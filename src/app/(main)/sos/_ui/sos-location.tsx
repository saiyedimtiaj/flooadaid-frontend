"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Crosshair,
  Loader2,
  CheckCircle,
  XCircle,
  Compass,
  Radio,
  Map,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useT } from "@/lib/i18n/use-t";

function MapFallback() {
  const { t } = useT();
  return (
  <Skeleton className="w-full h-full flex flex-col items-center justify-center bg-muted/40 gap-3 rounded-2xl border border-border/50">
    <div className="relative flex items-center justify-center size-12 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
      <MapPin className="size-5 animate-bounce" />
    </div>
    <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
      {t("sos.loadingMap")}
    </span>
  </Skeleton>
  );
}

const DynamicSOSMap = dynamic(() => import("./sos-leaflet-map"), {
  ssr: false,
  loading: () => <MapFallback />,
});

interface SOSLocationProps {
  location: { lat: number; lng: number } | null;
  setLocation: (loc: { lat: number; lng: number }) => void;
  address: string;
  setAddress: (addr: string) => void;
}

type DetectState = "idle" | "detecting" | "success" | "error";

export default function SOSLocation({
  location,
  setLocation,
  address,
  setAddress,
}: SOSLocationProps) {
  const { t } = useT();
  const [detectState, setDetectState] = useState<DetectState>("idle");

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setDetectState("error");
      toast.error("Not Supported", {
        description:
          "Your browser does not support automatic location detection.",
      });
      setTimeout(() => setDetectState("idle"), 2000);
      return;
    }

    setDetectState("detecting");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setDetectState("success");
        toast.success("Location found");
        setTimeout(() => setDetectState("idle"), 1500);
      },
      () => {
        setDetectState("error");
        toast.error("Could not find your location", {
          description:
            "Please allow location access, or tap your spot on the map.",
        });
        setTimeout(() => setDetectState("idle"), 2000);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Dynamic Header Badge Section */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4"
      >
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center size-9 rounded-xl bg-destructive text-destructive-foreground font-black text-sm border border-white/10 shrink-0">
            1
          </div>
          <div className="flex flex-col">
            <h2 className="text-base sm:text-lg font-black text-foreground tracking-tight">
              {t("sos.where")}
            </h2>
            <p className="text-xs text-muted-foreground">
              {t("sos.whereHint")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-full bg-muted/40 border border-border/60 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          <Radio className="size-3 text-destructive animate-pulse" />
          <span className={location ? "text-emerald-500" : "text-amber-500"}>
            {location ? "Location set" : "Not set yet"}
          </span>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card className="rounded-2xl overflow-hidden border border-border/80 bg-card/30 backdrop-blur-lg flex flex-col relative shadow-none">
          <div className="w-full h-80 md:h-96 relative z-10 border-b border-border/80 bg-muted/20">
            <DynamicSOSMap location={location} setLocation={setLocation} />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center z-1001 pointer-events-none">
              <div className="pointer-events-auto">
                <Button
                  onClick={handleDetectLocation}
                  disabled={detectState === "detecting"}
                  variant="default"
                  size="sm"
                  className="bg-destructive hover:bg-destructive/95 text-destructive-foreground border border-white/15 rounded-full px-5 h-10 text-xs font-bold gap-2 select-none transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-none"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={detectState}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.12 }}
                      className="flex items-center gap-1.5"
                    >
                      {detectState === "detecting" && (
                        <>
                          <Loader2 className="size-3.5 animate-spin" />
                          <span>{t("sos.finding")}</span>
                        </>
                      )}
                      {detectState === "success" && (
                        <>
                          <CheckCircle className="size-3.5" />
                          <span>{t("sos.found")}</span>
                        </>
                      )}
                      {detectState === "error" && (
                        <>
                          <XCircle className="size-3.5" />
                          <span>{t("sos.tryAgain")}</span>
                        </>
                      )}
                      {detectState === "idle" && (
                        <>
                          <Crosshair className="size-3.5" />
                          <span>{t("sos.useMyLocation")}</span>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </Button>
              </div>
            </div>
          </div>

          {/* Location details card area */}
          <div className="p-5 flex flex-col gap-4">
            <AnimatePresence mode="wait">
              {location ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-emerald-500/4 border border-emerald-500/30 rounded-xl p-3.5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <Compass className="size-4 animate-spin-[spin_10s_linear_infinite]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                        {t("sos.locationSet")}
                      </span>
                      <span className="text-xs font-mono text-foreground font-bold tracking-tight mt-0.5">
                        {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                      </span>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex px-2 py-0.5 text-[9px] font-black text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 rounded-md uppercase tracking-wider">
                    {t("sos.ready")}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-amber-500/4 border border-amber-500/20 rounded-xl p-3.5 flex items-center gap-3"
                >
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20">
                    <Map className="size-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">
                      {t("sos.locationNotSet")}
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5">{t("sos.locationNotSetHint")}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Optional nearby-landmark note */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5">
                  <AlertCircle className="size-3.5 text-muted-foreground/60" />{" "}
                  {t("sos.landmark")} <span className="font-normal text-muted-foreground/60">{t("sos.optional")}</span>
                </label>
                <span className="text-[10px] text-muted-foreground font-semibold">
                  {address.length} / 200
                </span>
              </div>

              <Textarea
                rows={2}
                maxLength={200}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t("sos.landmarkPlaceholder")}
                className="resize-none focus-visible:ring-destructive/30 focus-visible:ring-1 focus-visible:border-destructive text-xs sm:text-sm bg-background/50 border-border/80 rounded-xl p-3 placeholder:text-muted-foreground/50 transition-all shadow-none"
              />
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
