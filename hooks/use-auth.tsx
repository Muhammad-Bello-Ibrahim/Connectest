"use client";

import { useContext, useMemo } from "react";
import { AuthContext } from "@/components/auth-provider";

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  // Memoize context to avoid unnecessary rerenders
  return useMemo(() => context, [context]);
}
