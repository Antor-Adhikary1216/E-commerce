"use client";
import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";

interface LoadingState {
  route: boolean;
  auth: boolean;
  api: boolean;
}

interface LoadingContextValue {
  loading: LoadingState;
  setRouteLoading: (v: boolean) => void;
  setAuthLoading: (v: boolean) => void;
  setApiLoading: (v: boolean) => void;
}

const LoadingContext = createContext<LoadingContextValue | null>(null);

export function useLoadingContext() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoadingContext must be used within LoadingProvider");
  return ctx;
}

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState<LoadingState>({ route: false, auth: true, api: false });
  const routeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const apiTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const setRouteLoading = useCallback((v: boolean) => {
    setLoading((prev) => ({ ...prev, route: v }));
  }, []);

  const setAuthLoading = useCallback((v: boolean) => {
    setLoading((prev) => ({ ...prev, auth: v }));
  }, []);

  const setApiLoading = useCallback((v: boolean) => {
    setLoading((prev) => ({ ...prev, api: v }));
  }, []);

  return (
    <LoadingContext.Provider value={{ loading, setRouteLoading, setAuthLoading, setApiLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useIsGlobalLoading() {
  const { loading } = useLoadingContext();
  return loading.route || loading.auth || loading.api;
}
