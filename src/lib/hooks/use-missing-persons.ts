"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api-client";
import type {
  MissingPerson,
  MissingPersonStatus,
  MissingPersonSummary,
  MissingPersonType,
  Paginated,
} from "@/lib/types/api";

export interface MissingPersonsQuery {
  q?: string;
  districtId?: number;
  type?: MissingPersonType;
  status?: MissingPersonStatus;
  page?: number;
  limit?: number;
}

export function useMissingPersons(params: MissingPersonsQuery = {}) {
  const qs = new URLSearchParams();
  if (params.q) qs.set("q", params.q);
  if (params.districtId) qs.set("districtId", String(params.districtId));
  if (params.type) qs.set("type", params.type);
  if (params.status) qs.set("status", params.status);
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));

  return useQuery({
    queryKey: ["missing-persons", params],
    queryFn: () => api.get<Paginated<MissingPerson>>(`/missing-persons?${qs.toString()}`),
    placeholderData: (prev) => prev,
  });
}

export function useMissingPersonSummary() {
  return useQuery({
    queryKey: ["missing-persons", "summary"],
    queryFn: () => api.get<MissingPersonSummary>("/missing-persons/summary"),
  });
}

export interface MissingPersonInput {
  type: MissingPersonType;
  name: string;
  age?: number;
  gender?: "male" | "female" | "other";
  description?: string;
  photoUrls?: string[];
  lastSeenText: string;
  latitude?: number;
  longitude?: number;
  districtId: number;
  reporterName: string;
  reporterPhone: string;
}

export function useReportMissingPerson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MissingPersonInput) => api.post<MissingPerson>("/missing-persons", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missing-persons"] });
      toast.success("Report published");
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Failed to submit report"),
  });
}

export function useUpdateMissingPersonStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: MissingPersonStatus }) =>
      api.patch<MissingPerson>(`/missing-persons/${id}/status`, { status }),
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ["missing-persons"] });
      toast.success(status === "REUNITED" ? "Marked as reunited" : "Status updated");
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Failed to update status"),
  });
}
