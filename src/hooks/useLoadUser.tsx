// File: /hooks/useLoadUser.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/user.type";

export function useLoadUser(requiredRole?: string) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const userString = localStorage.getItem("user");
        const userData: User | null = userString ? JSON.parse(userString) : null;

        if (!userData) {
          router.push("/");
          return;
        }

        if (requiredRole && userData.role !== requiredRole) {
          router.push("/");
          setError("You don't have permission to access this page");
          return;
        }

        setUser(userData);
      } catch (err) {
        console.error("Error loading user:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    }
  }, [router, requiredRole]);

  return { user, loading, error };
}