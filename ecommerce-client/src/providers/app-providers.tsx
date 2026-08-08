"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { Suspense, useState } from "react";
import { CartProvider } from "@/store/cart";
import { WishlistProvider } from "@/store/wishlist";
import { RouteProgress } from "@/components/route-progress";
import { GlobalLoader } from "@/components/global-loader";
import { LoadingProvider } from "@/contexts/loading-context";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false } } }));
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} enableColorScheme={false} disableTransitionOnChange>
      <MotionConfig reducedMotion="user">
        <QueryClientProvider client={client}>
          <LoadingProvider>
            <CartProvider>
              <WishlistProvider>
                <Suspense fallback={null}>
                  <RouteProgress />
                  <GlobalLoader />
                </Suspense>
                {children}
                <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
              </WishlistProvider>
            </CartProvider>
          </LoadingProvider>
        </QueryClientProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
