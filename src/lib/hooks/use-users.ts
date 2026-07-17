"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { AuthUser } from "@/lib/types/auth";

export function useAllUsers() {
  return useQuery<AuthUser[]>({
    queryKey: ["admin-users"],
    queryFn: () => api.get<AuthUser[]>("/users"),
  });
}
