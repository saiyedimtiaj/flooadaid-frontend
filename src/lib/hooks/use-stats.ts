"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { DistrictOverviewResponse, PublicSummary } from "@/lib/types/api";

/** Per-district live situation for the flood map (public, aggregate only). */
export function useDistrictOverview() {
  return useQuery({
    queryKey: ["stats", "district-overview"],
    queryFn: () => api.get<DistrictOverviewResponse>("/stats/district-overview"),
    refetchInterval: 60_000,
  });
}

export function usePublicSummary() {
  return useQuery({
    queryKey: ["stats", "public-summary"],
    queryFn: () => api.get<PublicSummary>("/stats/public-summary"),
    refetchInterval: 60_000,
  });
}
