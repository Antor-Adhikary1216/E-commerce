import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers/app-providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LoginPrompt } from "@/components/login-prompt";

const inter = Inter({ subsets: ["latin"], display: "optional", adjustFontFallback: true });

export const metadata: Metadata = {
  metadataBase: new URL("https://shoppingindia.example"),
  title: { default: "Shopping India — Your Online Marketplace", template: "%s | Shopping India" },
  description: "Your one-stop online marketplace for everyday essentials across India.",
  openGraph: { type: "website", title: "Shopping India — Your Online Marketplace", description: "Your one-stop online marketplace for everyday essentials across India." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#1c2734" />
      </head>
      <body className={inter.className}>
        <AppProviders>
          <SiteHeader />
          {children}
          <SiteFooter />
          <LoginPrompt />
        </AppProviders>
      </body>
    </html>
  );
}
