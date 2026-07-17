"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api-client";
import type { PublicVolunteerStats, SosRequest, VolunteerProfile } from "@/lib/types/api";
import { useInvalidateCurrentUser } from "./use-current-user";

export function usePublicVolunteerStats() {
  return useQuery({
    queryKey: ["volunteers-public-stats"],
    queryFn: () => api.get<PublicVolunteerStats>("/volunteers/public-stats"),
  });
}

export function useVolunteers() {
  return useQuery({
    queryKey: ["volunteers"],
    queryFn: () => api.get<VolunteerProfile[]>("/volunteers"),
  });
}

export function useMyVolunteerProfile(enabled = true) {
  return useQuery({
    queryKey: ["volunteers", "me"],
    queryFn: () => api.get<VolunteerProfile | null>("/volunteers/me"),
    enabled,
  });
}

export function useMyTasks(enabled = true) {
  return useQuery({
    queryKey: ["volunteers", "me", "tasks"],
    queryFn: () => api.get<SosRequest[]>("/volunteers/me/tasks"),
    refetchInterval: 15_000,
    enabled,
  });
}

export interface RegisterVolunteerInput {
  skills: string[];
  availableFrom?: string;
  availableTo?: string;
  districtId: number;
}

export function useRegisterVolunteer() {
  const queryClient = useQueryClient();
  const invalidateCurrentUser = useInvalidateCurrentUser();
  return useMutation({
    mutationFn: (data: RegisterVolunteerInput) =>
      api.post<VolunteerProfile>("/volunteers/register", data),
    onSuccess: async () => {
      await invalidateCurrentUser();
      queryClient.invalidateQueries({ queryKey: ["volunteers"] });
      toast.success("You're registered as a volunteer!");
    },
    onError: (error) =>
      toast.error(error instanceof ApiError ? error.message : "Failed to register"),
  });
}

export function useVerifyVolunteer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch<VolunteerProfile>(`/volunteers/${id}/verify`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volunteers"] });
      toast.success("Volunteer verified");
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Failed to verify"),
  });
}

export function useUpdateVolunteerAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      api.patch<VolunteerProfile>(`/volunteers/${id}/availability`, { isAvailable }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volunteers"] });
      toast.success("Availability updated");
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Failed to update availability"),
  });
}
