"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth } from "./firebase";
import { useLoadingContext } from "@/contexts/loading-context";

export function useAuthUser() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const { setAuthLoading } = useLoadingContext();

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setUser(null);
      setAuthLoading(false);
      return;
    }
    return onAuthStateChanged(auth, (next) => {
      setUser(next);
      setAuthLoading(false);
    });
  }, [setAuthLoading]);

  return user;
}
