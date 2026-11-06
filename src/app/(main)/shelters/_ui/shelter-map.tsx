"use client";

import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { CircleMarker as LeafletCircleMarker } from "leaflet";
import { motion } from "framer-motion";
import { Navigation, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import "leaflet/dist/leaflet.css";
import type { Shelter } from "@/lib/types/api";
import { useT } from "@/lib/i18n/use-t";

interface ShelterMapInnerProps {
  shelters: Shelter[];
  selectedShelterId: string | null;
  onSelectShelter: (shelter: Shelter | null) => void;
  userLocation: { lat: number; lng: number } | null;
  setUserLocation: (loc: { lat: number; lng: number } | null) => void;
}

function MapController({
  selectedShelter,
  userLocation,
  shouldFlyToUser,
  setShouldFlyToUser,
}: {
  selectedShelter: Shelter | null;
  userLocation: { lat: number; lng: number } | null;
  shouldFlyToUser: boolean;
  setShouldFlyToUser: (val: boolean) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedShelter) {
      map.flyTo([selectedShelter.latitude, selectedShelter.longitude], 13, {
        duration: 0.8,
        easeLinearity: 0.25,
      });
    }
  }, [selectedShelter, map]);

  useEffect(() => {
    if (userLocation && shouldFlyToUser) {
      map.flyTo([userLocation.lat, userLocation.lng], 12, {
        duration: 0.8,
        easeLinearity: 0.25,
      });
      setShouldFlyToUser(false);
    }
  }, [userLocation, shouldFlyToUser, map, setShouldFlyToUser]);

  return null;
}

function MapEventsHandler({ onMapClick }: { onMapClick: () => void }) {
  useMapEvents({
    click(e) {
      const isMarkerClick = (e.originalEvent.target as HTMLElement).closest(
        ".leaflet-interactive",
      );
      if (!isMarkerClick) {
        onMapClick();
      }
    },
  });
  return null;
}

export default function ShelterMapInner({
  shelters,
  selectedShelterId,
  onSelectShelter,
  userLocation,
  setUserLocation,
}: ShelterMapInnerProps) {
  const { tr, pick, num } = useT();
  const [isLocating, setIsLocating] = useState(false);
  const [shouldFlyToUser, setShouldFlyToUser] = useState(false);
  const markerRefs = useRef<Record<string, LeafletCircleMarker>>({});

  const selectedShelter =
    shelters.find((s) => s.id === selectedShelterId) || null;

  useEffect(() => {
    if (selectedShelterId && markerRefs.current[selectedShelterId]) {
      markerRefs.current[selectedShelterId].openPopup();
    }
  }, [selectedShelterId]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      toast.error(tr("Not Supported", "সমর্থিত নয়"), {
        description: tr("Geolocation is not supported by your browser.", "আপনার ব্রাউজারে অবস্থান শনাক্তকরণ সমর্থিত নয়।"),
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(coords);
        setShouldFlyToUser(true);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        toast.error(tr("Location Access Denied", "অবস্থান ব্যবহারের অনুমতি নেই"), {
          description: tr(
            "Could not access your location. Please check your system preferences.",
            "আপনার অবস্থান পাওয়া যায়নি। ডিভাইসের অনুমতি সেটিংস পরীক্ষা করুন।",
          ),
        });
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className="relative w-full h-87.5 md:h-[calc(100vh-220px)] md:min-h-100 md:max-h-175 rounded-xl overflow-hidden border border-border shadow-sm">
      <MapContainer
        center={[23.685, 90.3563]}
        zoom={7}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController
          selectedShelter={selectedShelter}
          userLocation={userLocation}
          shouldFlyToUser={shouldFlyToUser}
          setShouldFlyToUser={setShouldFlyToUser}
        />

        <MapEventsHandler onMapClick={() => onSelectShelter(null)} />

        {userLocation && (
          <>
            <CircleMarker
              center={[userLocation.lat, userLocation.lng]}
              radius={8}
              fillColor="#3B82F6"
              fillOpacity={0.9}
              color="#FFFFFF"
              weight={2}
            />
            <CircleMarker
              center={[userLocation.lat, userLocation.lng]}
              radius={20}
              fillColor="#3B82F6"
              fillOpacity={0.15}
              color="transparent"
              className="pulse-radar-circle"
            />
          </>
        )}

        {shelters.map((shelter) => {
          const isSelected = shelter.id === selectedShelterId;
          const occupancyPercent = Math.round(
            (shelter.currentOccupancy / shelter.capacity) * 100,
          );

          let color = "#22C55E";
          if (occupancyPercent >= 50 && occupancyPercent <= 80)
            color = "#F59E0B";
          if (occupancyPercent > 80) color = "#EF4444";

          const fillOpacity = occupancyPercent > 80 ? 0.8 : 0.7;

          return (
            <CircleMarker
              key={shelter.id}
              ref={(ref) => {
                if (ref) markerRefs.current[shelter.id] = ref;
              }}
              center={[shelter.latitude, shelter.longitude]}
              radius={isSelected ? 14 : 10}
              fillColor={color}
              fillOpacity={isSelected ? 1.0 : fillOpacity}
              color={isSelected ? "#3B82F6" : "#FFFFFF"}
              weight={isSelected ? 3 : 2}
              opacity={0.9}
              eventHandlers={{
                click: () => {
                  onSelectShelter(shelter);
                },
              }}
            >
              <Popup closeOnClick={false}>
                <div
                  style={{
                    width: "220px",
                    padding: "12px",
                    background: "hsl(var(--background))",
                    color: "hsl(var(--foreground))",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      marginBottom: "2px",
                    }}
                    className="truncate"
                  >
                    {pick(shelter.name, shelter.nameBn)}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "hsl(var(--muted-foreground))",
                      marginBottom: "8px",
                    }}
                    className="truncate"
                  >
                    {shelter.address}
                  </div>

                  <div
                    style={{
                      height: "6px",
                      width: "100%",
                      background: "hsl(var(--muted))",
                      borderRadius: "9999px",
                      overflow: "hidden",
                      marginBottom: "4px",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${occupancyPercent}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "11px",
                      color: "hsl(var(--muted-foreground))",
                      marginBottom: "8px",
                    }}
                  >
                    <span>
                      {num(shelter.currentOccupancy)} / {num(shelter.capacity)}
                    </span>
                    <span>{num(occupancyPercent)}%</span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      fontSize: "11px",
                      marginBottom: "10px",
                    }}
                  >
                    <span
                      style={{
                        color: shelter.hasFood
                          ? "hsl(var(--foreground))"
                          : "hsl(var(--muted-foreground)/0.3)",
                      }}
                    >
                      {shelter.hasFood ? `✓ ${tr("Food", "খাবার")}` : `✗ ${tr("Food", "খাবার")}`}
                    </span>
                    <span
                      style={{
                        color: shelter.hasWater
                          ? "hsl(var(--foreground))"
                          : "hsl(var(--muted-foreground)/0.3)",
                      }}
                    >
                      {shelter.hasWater ? `✓ ${tr("Water", "পানি")}` : `✗ ${tr("Water", "পানি")}`}
                    </span>
                    <span
                      style={{
                        color: shelter.hasMedical
                          ? "hsl(var(--foreground))"
                          : "hsl(var(--muted-foreground)/0.3)",
                      }}
                    >
                      {shelter.hasMedical ? `✓ ${tr("Med", "চিকিৎসা")}` : `✗ ${tr("Med", "চিকিৎসা")}`}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      borderTop: "1px solid hsl(var(--border))",
                      paddingTop: "8px",
                    }}
                  >
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.latitude},${shelter.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "12px",
                        color: "#3B82F6",
                        fontWeight: 500,
                        textDecoration: "none",
                      }}
                    >
                      {tr("Directions", "দিকনির্দেশনা")}
                    </a>
                    {shelter.contactPhone && (
                      <a
                        href={`tel:${shelter.contactPhone}`}
                        style={{
                          fontSize: "12px",
                          color: "#3B82F6",
                          fontWeight: 500,
                          textDecoration: "none",
                        }}
                      >
                        {tr("Call", "কল করুন")}
                      </a>
                    )}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-4 right-4 z-500"
      >
        <Button
          onClick={handleLocateMe}
          disabled={isLocating}
          size="icon"
          aria-label={tr("Use my location", "আমার অবস্থান ব্যবহার করুন")}
          className="size-9 rounded-lg bg-background hover:bg-muted text-foreground border border-border shadow-sm"
        >
          {isLocating ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          ) : (
            <Navigation className="size-4" />
          )}
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-6 right-4 z-500 bg-background/90 backdrop-blur-sm rounded-lg p-2.5 shadow-sm border border-border flex flex-col gap-1.5 min-w-27.5"
      >
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {tr("Capacity", "ধারণক্ষমতা")}
        </span>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[11px] text-foreground">
            <span className="size-2 rounded-full bg-[#22C55E]" />
            <span>{tr("Available", "জায়গা আছে")}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-foreground">
            <span className="size-2 rounded-full bg-[#F59E0B]" />
            <span>{tr("Filling up", "দ্রুত পূর্ণ হচ্ছে")}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-foreground">
            <span className="size-2 rounded-full bg-[#EF4444]" />
            <span>{tr("Nearly full", "প্রায় পূর্ণ")}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
