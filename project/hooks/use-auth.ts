"use client";

import { useState, useEffect, useCallback } from "react";
import { User, UserRole } from "@/types/user";
import { AuthService } from "@/services/auth-service";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const switchRole = async (role: UserRole) => {
    const updated = await AuthService.switchRole(role);
    setUser(updated);
    return updated;
  };

  return {
    user,
    role: user?.role || "resident",
    loading,
    switchRole,
    refetchUser: fetchUser,
  };
}

