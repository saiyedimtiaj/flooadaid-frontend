"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api-client";
import type { Paginated, Shelter } from "@/lib/types/api";

export interface ShelterInput {
  name: string;
  nameBn?: string;
  address: string;
  districtId: number;
  latitude: number;
  longitude: number;
  capacity: number;
  contactPhone?: string;
  contactName?: string;
  hasFood?: boolean;
  hasWater?: boolean;
  hasMedical?: boolean;
  hasElectricity?: boolean;
  hasToilet?: boolean;
  isActive?: boolean;
}

export interface SheltersQueryParams {
  limit?: number;
  isActive?: boolean;
  districtId?: number;
  hasFood?: boolean;
  hasWater?: boolean;
  hasMedical?: boolean;
}

export function useShelters(params: SheltersQueryParams = {}) {
  const qs = new URLSearchParams();
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.isActive !== undefined) qs.set("isActive", String(params.isActive));
  if (params.districtId) qs.set("districtId", String(params.districtId));
  if (params.hasFood !== undefined) qs.set("hasFood", String(params.hasFood));
  if (params.hasWater !== undefined) qs.set("hasWater", String(params.hasWater));
  if (params.hasMedical !== undefined) qs.set("hasMedical", String(params.hasMedical));

  return useQuery({
    queryKey: ["shelters", params],
    queryFn: () => api.get<Paginated<Shelter>>(`/shelters?${qs.toString()}`),
  });
}

export interface ShelterWithDistance extends Shelter {
  distanceKm: number;
}

export function useNearbyShelters(
  location: { lat: number; lng: number } | null,
  options: { radiusKm?: number; limit?: number } = {},
) {
  const radiusKm = options.radiusKm ?? 25;
  const limit = options.limit ?? 10;

  return useQuery({
    queryKey: ["shelters-nearby", location, radiusKm, limit],
    queryFn: () =>
      api.get<ShelterWithDistance[]>(
        `/shelters/nearby?lat=${location!.lat}&lng=${location!.lng}&radiusKm=${radiusKm}&limit=${limit}`,
      ),
    enabled: location !== null,
  });
}

function invalidateShelters(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: ["shelters"] });
}

export function useCreateShelter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ShelterInput) => api.post<Shelter>("/shelters", data),
    onSuccess: () => {
      invalidateShelters(queryClient);
      toast.success("Shelter added");
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Failed to add shelter"),
  });
}

export function useUpdateShelter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ShelterInput> }) =>
      api.patch<Shelter>(`/shelters/${id}`, data),
    onSuccess: () => {
      invalidateShelters(queryClient);
      toast.success("Shelter updated");
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Failed to update shelter"),
  });
}

export function useUpdateShelterOccupancy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, currentOccupancy }: { id: string; currentOccupancy: number }) =>
      api.patch<Shelter>(`/shelters/${id}/occupancy`, { currentOccupancy }),
    onSuccess: () => {
      invalidateShelters(queryClient);
      toast.success("Occupancy updated");
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Failed to update occupancy"),
  });
}

export function useDeleteShelter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/shelters/${id}`),
    onSuccess: () => {
      invalidateShelters(queryClient);
      toast.success("Shelter closed");
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Failed to close shelter"),
  });
}
