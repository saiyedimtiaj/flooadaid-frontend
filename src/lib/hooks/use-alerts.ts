"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api-client";
import type { Alert, Paginated } from "@/lib/types/api";

export interface AlertInput {
  title: string;
  titleBn?: string;
  description: string;
  severity: Alert["severity"];
  districtId: number;
  waterLevelCm?: number;
  isActive?: boolean;
  /** ISO date-time; null clears an existing expiry on update. */
  expiresAt?: string | null;
}

export interface AlertsQueryParams {
  limit?: number;
  isActive?: boolean;
  districtId?: number;
  /** Comma-separated severities, e.g. "DANGER,CRITICAL" (case-insensitive) */
  severity?: string;
}

export function useAlerts(params: AlertsQueryParams = {}) {
  const qs = new URLSearchParams();
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.isActive !== undefined) qs.set("isActive", String(params.isActive));
  if (params.districtId) qs.set("districtId", String(params.districtId));
  if (params.severity) qs.set("severity", params.severity);

  return useQuery({
    queryKey: ["alerts", params],
    queryFn: () => api.get<Paginated<Alert>>(`/alerts?${qs.toString()}`),
  });
}

function invalidateAlerts(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: ["alerts"] });
}

export function useCreateAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AlertInput) => api.post<Alert>("/alerts", data),
    onSuccess: () => {
      invalidateAlerts(queryClient);
      toast.success("Alert created");
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Failed to create alert"),
  });
}

export function useUpdateAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AlertInput> }) =>
      api.patch<Alert>(`/alerts/${id}`, data),
    onSuccess: () => {
      invalidateAlerts(queryClient);
      toast.success("Alert updated");
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Failed to update alert"),
  });
}

export function useDeleteAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/alerts/${id}`),
    onSuccess: () => {
      invalidateAlerts(queryClient);
      toast.success("Alert deleted");
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Failed to delete alert"),
  });
}
