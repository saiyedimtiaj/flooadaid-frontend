"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api-client";
import type { Paginated, ReliefCoverage, ReliefItem, ReliefLog } from "@/lib/types/api";

export interface ReliefInput {
  districtId: number;
  locationName: string;
  itemsDistributed: ReliefItem[];
  familiesServed: number;
  distributedBy: string;
  distributionDate: string;
  photoUrls?: string[];
  notes?: string;
}

export function useReliefLogs(params: { limit?: number } = {}) {
  const qs = new URLSearchParams();
  if (params.limit) qs.set("limit", String(params.limit));

  return useQuery({
    queryKey: ["relief", params],
    queryFn: () => api.get<Paginated<ReliefLog>>(`/relief?${qs.toString()}`),
  });
}

export function useReliefCoverage() {
  return useQuery({
    queryKey: ["relief-coverage"],
    queryFn: () => api.get<ReliefCoverage[]>("/relief/coverage"),
  });
}

export function useCreateRelief() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReliefInput) => api.post<ReliefLog>("/relief", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relief"] });
      queryClient.invalidateQueries({ queryKey: ["relief-coverage"] });
      toast.success("Relief distribution logged");
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Failed to log distribution"),
  });
}

// ── Relief inventory + assignment ledger ────────────────────────────────

export interface ReliefStock {
  id: string;
  item: string;
  unit: string;
  quantity: number;
  updatedAt: string;
}

export interface ReliefAssignment {
  id: string;
  item: string;
  quantity: number;
  unit: string;
  volunteerId: string;
  shelterId: string | null;
  status: "ASSIGNED" | "DELIVERED" | "CANCELLED";
  note: string | null;
  createdAt: string;
  deliveredAt: string | null;
  volunteer?: { id: string; name: string; phone: string | null };
  shelter?: { id: string; name: string } | null;
}

export interface ReliefHolding {
  volunteerId: string;
  name: string;
  phone: string | null;
  holding: Record<string, { quantity: number; unit: string }>;
  delivered: Record<string, { quantity: number; unit: string }>;
}

export interface ReliefInventorySummary {
  totalItems: number;
  totalUnits: number;
  activeAssignments: number;
  deliveries: number;
}

export function useReliefStock() {
  return useQuery({
    queryKey: ["relief-stock"],
    queryFn: () => api.get<ReliefStock[]>("/relief/stock"),
  });
}

export function useReliefSummary() {
  return useQuery({
    queryKey: ["relief-summary"],
    queryFn: () => api.get<ReliefInventorySummary>("/relief/summary"),
  });
}

export function useReliefHoldings() {
  return useQuery({
    queryKey: ["relief-holdings"],
    queryFn: () => api.get<ReliefHolding[]>("/relief/holdings"),
  });
}

export function useReliefAssignments(params: { mine?: boolean } = {}) {
  const qs = params.mine ? "?mine=true" : "";
  return useQuery({
    queryKey: ["relief-assignments", params],
    queryFn: () => api.get<ReliefAssignment[]>(`/relief/assignments${qs}`),
  });
}

function invalidateInventory(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ["relief-stock"] });
  qc.invalidateQueries({ queryKey: ["relief-summary"] });
  qc.invalidateQueries({ queryKey: ["relief-holdings"] });
  qc.invalidateQueries({ queryKey: ["relief-assignments"] });
}

export function useUpsertStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { item: string; unit: string; quantity: number }) =>
      api.post<ReliefStock>("/relief/stock", data),
    onSuccess: () => {
      invalidateInventory(qc);
      toast.success("Stock updated");
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Failed to update stock"),
  });
}

export function useCreateAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { item: string; quantity: number; volunteerId: string; note?: string }) =>
      api.post<ReliefAssignment>("/relief/assignments", data),
    onSuccess: () => {
      invalidateInventory(qc);
      toast.success("Relief assigned to volunteer");
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Failed to assign relief"),
  });
}

export function useDeliverAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, shelterId }: { id: string; shelterId: string }) =>
      api.patch<ReliefAssignment>(`/relief/assignments/${id}/deliver`, { shelterId }),
    onSuccess: () => {
      invalidateInventory(qc);
      toast.success("Delivery recorded");
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Failed to record delivery"),
  });
}
