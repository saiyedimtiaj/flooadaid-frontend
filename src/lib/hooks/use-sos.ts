"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api-client";
import type {
  HelpType,
  Paginated,
  PeopleCount,
  PublicSosStats,
  SosRequest,
  SosStatus,
} from "@/lib/types/api";

export interface CreateSosInput {
  name: string;
  phone: string;
  latitude: number;
  longitude: number;
  addressText?: string;
  districtId: number;
  peopleCount: PeopleCount;
  helpType: HelpType[];
  description?: string;
  /** Single photo — kept for backward compatibility with the current backend. */
  photoUrl?: string;
  /** Multiple photos — used once the backend accepts an array (Phase 2). */
  photoUrls?: string[];
}

export function useCreateSos() {
  return useMutation({
    mutationFn: (data: CreateSosInput) => api.post<SosRequest>("/sos", data),
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Failed to submit SOS request"),
  });
}

/** Admin/volunteer entering an SOS on behalf of someone (bad-network areas). */
export function useCreateManualSos() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSosInput) => api.post<SosRequest>("/sos/manual", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sos"] });
      toast.success("Request recorded");
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Failed to record request"),
  });
}

/** Public — anyone holding the (unguessable) id can poll their own request's status. */
export function useSosTracking(id: string | null) {
  return useQuery({
    queryKey: ["sos-tracking", id],
    queryFn: () => api.get<SosRequest>(`/sos/${id}`),
    enabled: !!id,
    refetchInterval: (query) => (query.state.data?.status === "RESOLVED" ? false : 10_000),
  });
}

export function useSosRequests(params: { status?: SosStatus; limit?: number } = {}) {
  const qs = new URLSearchParams();
  if (params.status) qs.set("status", params.status);
  if (params.limit) qs.set("limit", String(params.limit));

  return useQuery({
    queryKey: ["sos", params],
    queryFn: () => api.get<Paginated<SosRequest>>(`/sos?${qs.toString()}`),
    refetchInterval: 15_000,
  });
}

export function usePublicSosStats() {
  return useQuery({
    queryKey: ["sos-public-stats"],
    queryFn: () => api.get<PublicSosStats>("/sos/public-stats"),
  });
}

function invalidateSos(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: ["sos"] });
}

export function useUpdateSosStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: SosStatus; note?: string }) =>
      api.patch<SosRequest>(`/sos/${id}/status`, { status, note }),
    onSuccess: () => {
      invalidateSos(queryClient);
      toast.success("Status updated");
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Failed to update status"),
  });
}

export function useAssignSos() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, volunteerId }: { id: string; volunteerId: string }) =>
      api.patch<SosRequest>(`/sos/${id}/assign`, { volunteerId }),
    onSuccess: () => {
      invalidateSos(queryClient);
      toast.success("Volunteer assigned");
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Failed to assign volunteer"),
  });
}
