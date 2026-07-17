"use client"

import { useMemo, useState } from "react"
import { Loader2 } from "lucide-react"
import SheltersHeader from "./shelters-header"
import ShelterStatsBar from "./shelter-stats-bar"
import ShelterFilters from "./shelter-filters"
import ShelterSplitView from "./shelter-split-view"
import ShelterDetailSheet from "./shelter-detail-sheet"
import ShelterSosCta from "./shelter-sos-cta"
import { useShelters } from "@/lib/hooks/use-shelters"
import type { Shelter } from "@/lib/types/api"

const FACILITY_KEY_MAP: Record<string, keyof Shelter> = {
  food: "hasFood",
  water: "hasWater",
  medical: "hasMedical",
  electricity: "hasElectricity",
  toilet: "hasToilet",
}

export default function SheltersContent() {
  const [selectedShelterId, setSelectedShelterId] = useState<string | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null)
  const [facilityFilters, setFacilityFilters] = useState<string[]>([])
  const [capacityFilter, setCapacityFilter] = useState<"all" | "available" | "full">("all")

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
  }

  return (
    <div className="container mt-16 mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
      <SheltersHeader />

      <ShelterStatsBar />

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
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-87.5 md:h-[calc(100vh-220px)] md:min-h-100 rounded-xl border border-border bg-muted/10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ShelterSplitView
          shelters={filteredShelters}
          selectedShelterId={selectedShelterId}
          onSelectShelter={handleSelectShelter}
          userLocation={userLocation}
          setUserLocation={setUserLocation}
          onClearFilters={handleClearFilters}
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
