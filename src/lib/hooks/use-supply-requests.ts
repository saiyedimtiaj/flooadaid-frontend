"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api-client";
import type { ReliefItem, SupplyRequest, SupplyRequestStatus, SupplyUrgency } from "@/lib/types/api";

export function useSupplyRequests(params: { status?: SupplyRequestStatus; mine?: boolean } = {}) {
  const qs = new URLSearchParams();
  if (params.status) qs.set("status", params.status);
  if (params.mine) qs.set("mine", "true");
  return useQuery({
    queryKey: ["supply-requests", params],
    queryFn: () => api.get<SupplyRequest[]>(`/supply-requests?${qs.toString()}`),
    refetchInterval: 30_000,
  });
}

export function useSupplyRequestSummary() {
  return useQuery({
    queryKey: ["supply-requests", "summary"],
    queryFn: () => api.get<Partial<Record<SupplyRequestStatus, number>>>("/supply-requests/summary"),
  });
}

function invalidate(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ["supply-requests"] });
  qc.invalidateQueries({ queryKey: ["relief-stock"] });
  qc.invalidateQueries({ queryKey: ["relief-summary"] });
  qc.invalidateQueries({ queryKey: ["relief-holdings"] });
  qc.invalidateQueries({ queryKey: ["relief-assignments"] });
}

export interface SupplyRequestInput {
  shelterId: string;
  items: ReliefItem[];
  urgency?: SupplyUrgency;
  note?: string;
}

export function useCreateSupplyRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SupplyRequestInput) => api.post<SupplyRequest>("/supply-requests", data),
    onSuccess: () => {
      invalidate(qc);
      toast.success("Supply request sent to the relief team");
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Failed to send request"),
  });
}

export function useApproveSupplyRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: {
      id: string;
      volunteerId: string;
      items?: { item: string; quantity: number }[];
      reviewNote?: string;
    }) => api.patch<SupplyRequest>(`/supply-requests/${id}/approve`, body),
    onSuccess: () => {
      invalidate(qc);
      toast.success("Approved — items dispatched to the volunteer");
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Failed to approve"),
  });
}

export function useRejectSupplyRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reviewNote }: { id: string; reviewNote: string }) =>
      api.patch<SupplyRequest>(`/supply-requests/${id}/reject`, { reviewNote }),
    onSuccess: () => {
      invalidate(qc);
      toast.success("Request declined");
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Failed to decline"),
  });
}
