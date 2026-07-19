"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api-client";

export type ReportCategory = "BUG" | "SAFETY" | "DATA_ERROR" | "ABUSE" | "OTHER";
export type ReportStatus = "NEW" | "REVIEWING" | "RESOLVED";

export interface FeedbackReport {
  id: string;
  name: string;
  email: string | null;
  category: ReportCategory;
  message: string;
  status: ReportStatus;
  handledById: string | null;
  createdAt: string;
  handledBy?: { id: string; name: string } | null;
}

export interface CreateFeedbackInput {
  name: string;
  email?: string;
  category: ReportCategory;
  message: string;
}

export function useSubmitFeedback() {
  return useMutation({
    mutationFn: (data: CreateFeedbackInput) => api.post<FeedbackReport>("/feedback", data),
    onError: (error) =>
      toast.error(error instanceof ApiError ? error.message : "Failed to send report"),
  });
}

export function useFeedbackReports(status?: ReportStatus) {
  const qs = status ? `?status=${status}` : "";
  return useQuery({
    queryKey: ["feedback", status ?? "all"],
    queryFn: () => api.get<FeedbackReport[]>(`/feedback${qs}`),
  });
}

export interface FeedbackSummary {
  total: number;
  byStatus: Record<string, number>;
}

export function useFeedbackSummary() {
  return useQuery({
    queryKey: ["feedback-summary"],
    queryFn: () => api.get<FeedbackSummary>("/feedback/summary"),
  });
}

export function useUpdateFeedbackStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ReportStatus }) =>
      api.patch<FeedbackReport>(`/feedback/${id}`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feedback"] });
      qc.invalidateQueries({ queryKey: ["feedback-summary"] });
      toast.success("Report updated");
    },
    onError: (error) =>
      toast.error(error instanceof ApiError ? error.message : "Failed to update report"),
  });
}
