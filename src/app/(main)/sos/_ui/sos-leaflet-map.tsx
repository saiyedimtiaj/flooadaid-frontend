"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, CircleMarker, useMapEvents, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface SOSLeafletMapProps {
  location: { lat: number; lng: number } | null
  setLocation: (loc: { lat: number; lng: number }) => void
}

function MapUpdater({ location }: { location: { lat: number; lng: number } | null }) {
  const map = useMap()
  useEffect(() => {
    if (location) {
      map.setView([location.lat, location.lng], 15, { animate: true })
    }
  }, [location, map])
  return null
}

function MapEventsHandler({ setLocation }: { setLocation: (loc: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click(e) {
      setLocation({ lat: e.latlng.lat, lng: e.latlng.lng })
    }
  })
  return null
}

export default function SOSLeafletMap({ location, setLocation }: SOSLeafletMapProps) {
  const bangladeshCenter: [number, number] = [23.6850, 90.3563]
  const mapCenter: [number, number] = location ? [location.lat, location.lng] : bangladeshCenter
  const mapZoom = location ? 15 : 7

  useEffect(() => {
    const style = document.createElement("style")
    style.innerHTML = `
      @keyframes leaflet-pulse {
        0% {
          transform: scale(1);
          opacity: 0.8;
        }
        100% {
          transform: scale(1.3);
          opacity: 0;
        }
      }
      .custom-pulsing-ring {
        transform-origin: center;
        animation: leaflet-pulse 2s infinite ease-out;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater location={location} />
        <MapEventsHandler setLocation={setLocation} />

        {location && (
          <>
            <CircleMarker
              center={[location.lat, location.lng]}
              radius={18}
              pathOptions={{
                fillColor: "#3B82F6",
                fillOpacity: 0.1,
                stroke: true,
                color: "#3B82F6",
                weight: 1,
                opacity: 0.3
              }}
              className="custom-pulsing-ring"
            />
            <CircleMarker
              center={[location.lat, location.lng]}
              radius={8}
              pathOptions={{
                fillColor: "#3B82F6",
                fillOpacity: 0.9,
                stroke: true,
                color: "#FFFFFF",
                weight: 2
              }}
            />
          </>
        )}
      </MapContainer>

      {!location && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center z-1000 pointer-events-none">
          <span className="text-sm font-semibold text-foreground">
            No location selected yet
          </span>
          <p className="text-xs text-muted-foreground mt-1 max-w-60">
            Tap anywhere on the map, or press &ldquo;Use My Current Location&rdquo; below.
          </p>
        </div>
      )}
    </div>
  )
}