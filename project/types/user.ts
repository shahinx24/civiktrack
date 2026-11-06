export type UserRole = "resident" | "authority" | "officer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  departmentId?: string;
  departmentName?: string;
  ward?: string;
  createdAt: string;
}

export interface AuthSession {
  user: User | null;
  isAuthenticated: boolean;
  token?: string;
}

