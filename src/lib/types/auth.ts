export type Role = "ADMIN" | "VOLUNTEER" | "USER";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone: string | null;
  emailVerified: string | null;
  districtId?: number | null;
  createdAt: string;
  updatedAt?: string;
}
