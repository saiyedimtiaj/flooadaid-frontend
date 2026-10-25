"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api-client";
import type { DashboardStats, ReliefSummary, SosSummary } from "@/lib/types/api";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["reports", "dashboard"],
    queryFn: () => api.get<DashboardStats>("/reports/dashboard"),
    refetchInterval: 30_000,
  });
}

export function useSosSummary() {
  return useQuery({
    queryKey: ["reports", "sos-summary"],
    queryFn: () => api.get<SosSummary>("/reports/sos-summary"),
  });
}

/** Distribution-log totals (not to be confused with use-relief's inventory summary). */
export function useReportsReliefSummary() {
  return useQuery({
    queryKey: ["reports", "relief-summary"],
    queryFn: () => api.get<ReliefSummary>("/reports/relief-summary"),
  });
}

const EXPORTS = {
  csv: { path: "/reports/export/csv", filename: "sos-requests.csv" },
  pdf: { path: "/reports/export/pdf", filename: "floodaid-report.pdf" },
} as const;

export function useDownloadReport() {
  return useMutation({
    mutationFn: (kind: keyof typeof EXPORTS) =>
      api.download(EXPORTS[kind].path, EXPORTS[kind].filename),
    onError: (error) =>
      toast.error(error instanceof ApiError ? error.message : "Download failed"),
  });
}
