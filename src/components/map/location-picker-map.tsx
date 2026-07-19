"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

export interface LatLng {
  lat: number;
  lng: number;
}

interface LocationPickerMapProps {
  value: LatLng | null;
  onChange: (loc: LatLng) => void;
  /** Initial center when nothing is selected. Defaults to Bangladesh. */
  defaultCenter?: [number, number];
  defaultZoom?: number;
}

function MapUpdater({ value }: { value: LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (value) {
      map.setView([value.lat, value.lng], 15, { animate: true });
    }
  }, [value, map]);
  return null;
}

function ClickHandler({ onChange }: { onChange: (loc: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

/**
 * Bare click-to-place Leaflet map. Lifted from the SOS location map so the
 * admin shelter form and the manual-entry form share one pin-picking UI.
 * Always render this behind `dynamic(..., { ssr: false })`.
 */
export default function LocationPickerMap({
  value,
  onChange,
  defaultCenter = [23.685, 90.3563],
  defaultZoom = 7,
}: LocationPickerMapProps) {
  const center: [number, number] = value ? [value.lat, value.lng] : defaultCenter;
  const zoom = value ? 15 : defaultZoom;

  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom className="w-full h-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater value={value} />
      <ClickHandler onChange={onChange} />

      {value && (
        <>
          <CircleMarker
            center={[value.lat, value.lng]}
            radius={18}
            pathOptions={{
              fillColor: "#3B82F6",
              fillOpacity: 0.1,
              stroke: true,
              color: "#3B82F6",
              weight: 1,
              opacity: 0.3,
            }}
          />
          <CircleMarker
            center={[value.lat, value.lng]}
            radius={8}
            pathOptions={{
              fillColor: "#3B82F6",
              fillOpacity: 0.9,
              stroke: true,
              color: "#FFFFFF",
              weight: 2,
            }}
          />
        </>
      )}
    </MapContainer>
  );
}
