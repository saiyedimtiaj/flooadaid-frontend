"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
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

export function useReliefSummary() {
  return useQuery({
    queryKey: ["reports", "relief-summary"],
    queryFn: () => api.get<ReliefSummary>("/reports/relief-summary"),
  });
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export const reportExportUrls = {
  csv: `${API_URL}/reports/export/csv`,
  pdf: `${API_URL}/reports/export/pdf`,
};
