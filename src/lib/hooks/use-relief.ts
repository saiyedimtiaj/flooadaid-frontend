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
