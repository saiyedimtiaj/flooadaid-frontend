"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import SheltersHeader from "./shelters-header"
import ShelterFilters from "./shelter-filters"
import ShelterSplitView from "./shelter-split-view"
import ShelterDetailSheet from "./shelter-detail-sheet"
import ShelterSosCta from "./shelter-sos-cta"
import { useShelters } from "@/lib/hooks/use-shelters"
import { MapSkeleton } from "@/components/ui/map-skeleton"
import { Skeleton } from "@/components/ui/skeleton"
import type { Shelter } from "@/lib/types/api"
import type { SelectedLocation } from "@/components/map/location-search-modal"

const FACILITY_KEY_MAP: Record<string, keyof Shelter> = {
  food: "hasFood",
  water: "hasWater",
  medical: "hasMedical",
  electricity: "hasElectricity",
  toilet: "hasToilet",
}

function locationFromParams(params: URLSearchParams): SelectedLocation | null {
  const lat = Number(params.get("lat"))
  const lng = Number(params.get("lng"))
  if (!params.get("lat") || !params.get("lng") || !Number.isFinite(lat) || !Number.isFinite(lng)) return null
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null
  return { lat, lng, label: params.get("near") ?? undefined }
}

export default function SheltersContent() {
  const searchParams = useSearchParams()
  const [initialLocation] = useState(() => locationFromParams(searchParams))
  const [selectedShelterId, setSelectedShelterId] = useState<string | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(
    initialLocation ? { lat: initialLocation.lat, lng: initialLocation.lng } : null,
  )

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(() => {
    const id = Number(searchParams.get("district"))
    return Number.isInteger(id) && id > 0 ? id : null
  })
  const [facilityFilters, setFacilityFilters] = useState<string[]>([])
  const [capacityFilter, setCapacityFilter] = useState<"all" | "available" | "full">("all")
  const [locationFilter, setLocationFilterState] = useState<SelectedLocation | null>(initialLocation)

  // A location chosen from the map/search modal also drives distance sorting.
  const setLocationFilter = (loc: SelectedLocation | null) => {
    setLocationFilterState(loc)
    setUserLocation(loc ? { lat: loc.lat, lng: loc.lng } : null)
  }

  const { data, isLoading } = useShelters({ limit: 100, districtId: selectedDistrictId ?? undefined })
  const shelters = useMemo(() => data?.data ?? [], [data]);

  const filteredShelters = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return shelters.filter((shelter) => {
      if (
        query &&
        !`${shelter.name} ${shelter.address} ${shelter.district.nameEn}`
          .toLowerCase()
          .includes(query)
      ) {
        return false
      }

      if (
        facilityFilters.length > 0 &&
        !facilityFilters.every((facility) => shelter[FACILITY_KEY_MAP[facility]])
      ) {
        return false
      }

      if (capacityFilter !== "all") {
        const occupancyRate = shelter.currentOccupancy / shelter.capacity
        if (capacityFilter === "available" && occupancyRate >= 0.8) return false
        if (capacityFilter === "full" && occupancyRate < 0.8) return false
      }

      return true
    })
  }, [shelters, searchQuery, facilityFilters, capacityFilter])

  const selectedShelter = shelters.find((s) => s.id === selectedShelterId) || null

  const handleSelectShelter = (shelter: Shelter | null) => {
    if (shelter) {
      setSelectedShelterId(shelter.id)
      setIsDetailOpen(true)
    } else {
      setSelectedShelterId(null)
      setIsDetailOpen(false)
    }
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedDistrictId(null)
    setFacilityFilters([])
    setCapacityFilter("all")
    setLocationFilter(null)
  }

  return (
    <div className="container mt-16 mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
      <SheltersHeader />

      <ShelterFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDistrictId={selectedDistrictId}
        setSelectedDistrictId={setSelectedDistrictId}
        facilityFilters={facilityFilters}
        setFacilityFilters={setFacilityFilters}
        capacityFilter={capacityFilter}
        setCapacityFilter={setCapacityFilter}
        totalResults={filteredShelters.length}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:h-[calc(100vh-220px)] md:min-h-100 md:grid-cols-[1.4fr_1fr]">
          <div className="h-87.5 overflow-hidden rounded-xl border border-border md:h-full">
            <MapSkeleton label="Finding shelters…" />
          </div>
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
                <div className="flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="flex flex-1 flex-col gap-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ShelterSplitView
          shelters={filteredShelters}
          selectedShelterId={selectedShelterId}
          onSelectShelter={handleSelectShelter}
          userLocation={userLocation}
          setUserLocation={setUserLocation}
          onClearFilters={handleClearFilters}
          forceNearest={locationFilter !== null}
        />
      )}

      <ShelterDetailSheet
        shelter={selectedShelter}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      <ShelterSosCta />
    </div>
  )
}
