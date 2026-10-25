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
  SosTracking,
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

/**
 * Public tracker. Anyone holding the id sees status + timeline; the
 * requester, assigned volunteer and admins also get contact details.
 * Polling stops once the request is closed.
 */
export function useSosTracking(id: string | null) {
  return useQuery({
    queryKey: ["sos-tracking", id],
    queryFn: () => api.get<SosTracking>(`/sos/${id}`),
    enabled: !!id,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "RESOLVED" || status === "CANCELLED" ? false : 10_000;
    },
  });
}

/** Logged-in requester withdrawing their own SOS. */
export function useCancelOwnSos() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch<SosRequest>(`/sos/${id}/cancel`),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["sos-tracking", id] });
      toast.success("Your SOS request was cancelled");
    },
    onError: (error) =>
      toast.error(error instanceof ApiError ? error.message : "Failed to cancel request"),
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
      queryClient.invalidateQueries({ queryKey: ["volunteers", "me", "tasks"] });
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
