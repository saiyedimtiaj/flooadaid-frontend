"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api-client";
import type { AuthUser, Role } from "@/lib/types/auth";

export function useAllUsers() {
  return useQuery<AuthUser[]>({
    queryKey: ["admin-users"],
    queryFn: () => api.get<AuthUser[]>("/users"),
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: Role }) =>
      api.patch<AuthUser>(`/users/${id}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["volunteers"] });
      toast.success("Role updated");
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Failed to update role"),
  });
}
