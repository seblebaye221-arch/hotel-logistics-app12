"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/AuthContext";

export function useRoleGuard(requiredType: "hotel" | "logistics") {
  const { user, userType, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/");
      return;
    }
    if (userType !== requiredType) {
      if (userType === "hotel") router.push("/hotel/dashboard");
      else if (userType === "logistics") router.push("/logistics/dashboard");
      else router.push("/");
    }
  }, [user, userType, loading, requiredType, router]);
}