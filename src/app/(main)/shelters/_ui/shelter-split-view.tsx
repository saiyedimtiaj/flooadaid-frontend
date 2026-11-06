"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowUpDown,
  X,
  Map as MapIcon,
  List as ListIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShelterCard from "./shelter-card";
import ShelterMap from "./shelter-map-client";
import { toast } from "sonner";
import type { Shelter } from "@/lib/types/api";
import { useT } from "@/lib/i18n/use-t";

interface ShelterSplitViewProps {
  shelters: Shelter[];
  selectedShelterId: string | null;
  onSelectShelter: (shelter: Shelter | null) => void;
  userLocation: { lat: number; lng: number } | null;
  setUserLocation: (loc: { lat: number; lng: number } | null) => void;
  onClearFilters: () => void;
  /** When true (a location was chosen via the map/search modal), always sort nearest-first. */
  forceNearest?: boolean;
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function ShelterSplitView({
  shelters,
  selectedShelterId,
  onSelectShelter,
  userLocation,
  setUserLocation,
  onClearFilters,
  forceNearest = false,
}: ShelterSplitViewProps) {
  const { tr, num, lang } = useT();
  const [nearestFirst, setNearestFirst] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "map">("list");
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const sortByDistance = (nearestFirst || forceNearest) && userLocation;

  const sortedShelters = useMemo(() => {
    if (sortByDistance && userLocation) {
      return [...shelters].sort((a, b) => {
        const distA = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          a.latitude,
          a.longitude,
        );
        const distB = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          b.latitude,
          b.longitude,
        );
        return distA - distB;
      });
    }
    return shelters;
  }, [shelters, sortByDistance, userLocation]);

  useEffect(() => {
    if (selectedShelterId) {
      const targetCard = cardRefs.current[selectedShelterId];
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [selectedShelterId]);

  const handleNearestToggle = () => {
    if (!userLocation) {
      if (!navigator.geolocation) {
        toast.error(tr("Not Supported", "সমর্থিত নয়"), {
          description: tr("Geolocation is not supported by your browser.", "আপনার ব্রাউজারে অবস্থান শনাক্তকরণ সমর্থিত নয়।"),
        });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setNearestFirst(true);
        },
        () => {
          toast.error(tr("Location Access Denied", "অবস্থান ব্যবহারের অনুমতি নেই"), {
            description: tr(
              "Please enable location permissions to sort by distance.",
              "দূরত্ব অনুযায়ী সাজাতে অবস্থানের অনুমতি চালু করুন।",
            ),
          });
        },
        { enableHighAccuracy: true },
      );
    } else {
      setNearestFirst(!nearestFirst);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="block md:hidden">
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as "list" | "map")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 h-13 bg-muted p-1.5 rounded-full">
            <TabsTrigger
              value="list"
              className="flex items-center justify-center gap-2 text-sm font-semibold rounded-full transition-all duration-200 data-active:bg-linear-to-br data-active:from-primary data-active:to-[color-mix(in_oklch,var(--primary),black_18%)] data-active:text-primary-foreground data-active:shadow-sm dark:data-active:bg-linear-to-br dark:data-active:border-transparent"
            >
              <ListIcon className="size-4" />
              <span>{tr("List", "তালিকা")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="map"
              className="flex items-center justify-center gap-2 text-sm font-semibold rounded-full transition-all duration-200 data-active:bg-linear-to-br data-active:from-primary data-active:to-[color-mix(in_oklch,var(--primary),black_18%)] data-active:text-primary-foreground data-active:shadow-sm dark:data-active:bg-linear-to-br dark:data-active:border-transparent"
            >
              <MapIcon className="size-4" />
              <span>{tr("Map", "মানচিত্র")}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-12 gap-4">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="md:col-span-1 lg:col-span-7"
        >
          <ShelterMap
            shelters={sortedShelters}
            selectedShelterId={selectedShelterId}
            onSelectShelter={onSelectShelter}
            userLocation={userLocation}
            setUserLocation={setUserLocation}
          />
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="md:col-span-1 lg:col-span-5"
        >
          <div className="h-[calc(100vh-220px)] min-h-100 max-h-175 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-1 shrink-0">
              <span className="text-sm text-muted-foreground font-medium">
                {lang === "bn"
                  ? `${num(sortedShelters.length)}টি আশ্রয়কেন্দ্র পাওয়া গেছে`
                  : `${sortedShelters.length} ${sortedShelters.length === 1 ? "shelter" : "shelters"} found`}
              </span>
              <button
                onClick={handleNearestToggle}
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border transition-all duration-200 ${
                  nearestFirst && userLocation
                    ? "bg-primary/10 border-primary/20 text-primary"
                    : "bg-background border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                <ArrowUpDown className="size-3" />
                <span>{tr("Nearest First", "কাছেরটি আগে")}</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 pb-4 scrollbar-thin scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40 scrollbar-track-transparent">
              <AnimatePresence mode="popLayout">
                {sortedShelters.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4 }}
                    className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed rounded-xl"
                  >
                    <div className="p-3 bg-muted rounded-full">
                      <Search className="size-8 text-muted-foreground/40" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mt-4">
                      {tr("No shelters found", "কোনো আশ্রয়কেন্দ্র পাওয়া যায়নি")}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-70">
                      {tr(
                        "Try adjusting your search query, selecting another district, or clearing filters.",
                        "খোঁজের শব্দ বদলে, অন্য জেলা বেছে বা ফিল্টার মুছে চেষ্টা করুন।",
                      )}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onClearFilters}
                      className="mt-4 gap-1.5 h-9"
                    >
                      <X className="size-4" />
                      {tr("Clear Filters", "ফিল্টার মুছুন")}
                    </Button>
                  </motion.div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {sortedShelters.map((shelter, index) => (
                      <div
                        key={shelter.id}
                        ref={(el) => {
                          cardRefs.current[shelter.id] = el;
                        }}
                      >
                        <ShelterCard
                          shelter={shelter}
                          isSelected={shelter.id === selectedShelterId}
                          onSelect={onSelectShelter}
                          index={index}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="block md:hidden">
        <AnimatePresence mode="wait">
          {activeTab === "map" ? (
            <motion.div
              key="mobile-map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ShelterMap
                shelters={sortedShelters}
                selectedShelterId={selectedShelterId}
                onSelectShelter={onSelectShelter}
                userLocation={userLocation}
                setUserLocation={setUserLocation}
              />
            </motion.div>
          ) : (
            <motion.div
              key="mobile-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center justify-between py-1 shrink-0">
                <span className="text-sm text-muted-foreground font-medium">
                  {lang === "bn"
                    ? `${num(sortedShelters.length)}টি আশ্রয়কেন্দ্র পাওয়া গেছে`
                    : `${sortedShelters.length} ${sortedShelters.length === 1 ? "shelter" : "shelters"} found`}
                </span>
                <button
                  onClick={handleNearestToggle}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border transition-all duration-200 ${
                    nearestFirst && userLocation
                      ? "bg-primary/10 border-primary/20 text-primary"
                      : "bg-background border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <ArrowUpDown className="size-3" />
                  <span>{tr("Nearest First", "কাছেরটি আগে")}</span>
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <AnimatePresence mode="popLayout">
                  {sortedShelters.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.4 }}
                      className="py-12 flex flex-col items-center justify-center text-center px-4 border border-dashed rounded-xl"
                    >
                      <div className="p-3 bg-muted rounded-full">
                        <Search className="size-8 text-muted-foreground/40" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mt-4">
                        {tr("No shelters found", "কোনো আশ্রয়কেন্দ্র পাওয়া যায়নি")}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 max-w-70">
                        {tr(
                          "Try adjusting your search query, selecting another district, or clearing filters.",
                          "খোঁজের শব্দ বদলে, অন্য জেলা বেছে বা ফিল্টার মুছে চেষ্টা করুন।",
                        )}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onClearFilters}
                        className="mt-4 gap-1.5 h-9"
                      >
                        <X className="size-4" />
                        {tr("Clear Filters", "ফিল্টার মুছুন")}
                      </Button>
                    </motion.div>
                  ) : (
                    sortedShelters.map((shelter, index) => (
                      <div
                        key={shelter.id}
                        ref={(el) => {
                          cardRefs.current[shelter.id] = el;
                        }}
                      >
                        <ShelterCard
                          shelter={shelter}
                          isSelected={shelter.id === selectedShelterId}
                          onSelect={onSelectShelter}
                          index={index}
                        />
                      </div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
