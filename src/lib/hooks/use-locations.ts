"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { District, Division, Upazila } from "@/lib/types/api";

export function useDivisions() {
  return useQuery({
    queryKey: ["divisions"],
    queryFn: () => api.get<Division[]>("/locations/divisions"),
    staleTime: Infinity,
  });
}

export function useDistricts(divisionId?: number) {
  return useQuery({
    queryKey: ["districts", divisionId ?? "all"],
    queryFn: () =>
      api.get<District[]>(
        `/locations/districts${divisionId ? `?divisionId=${divisionId}` : ""}`,
      ),
    staleTime: Infinity,
  });
}

export function useUpazilas(districtId?: number) {
  return useQuery({
    queryKey: ["upazilas", districtId ?? "all"],
    queryFn: () =>
      api.get<Upazila[]>(
        `/locations/upazilas${districtId ? `?districtId=${districtId}` : ""}`,
      ),
    staleTime: Infinity,
    enabled: districtId !== undefined,
  });
}
