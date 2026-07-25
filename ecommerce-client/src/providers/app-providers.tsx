"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes"; import { Toaster } from "react-hot-toast"; import { useState } from "react";
export function AppProviders({ children }: { children: React.ReactNode }) { const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false } } })); return <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} enableColorScheme={false} disableTransitionOnChange><QueryClientProvider client={client}>{children}<Toaster position="top-right" toastOptions={{ duration: 3500 }}/></QueryClientProvider></ThemeProvider>; }
