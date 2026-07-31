import type { Metadata } from "next";
import { Catalog } from "@/components/catalog";

export const metadata: Metadata = { title: "Today's offers" };

export default async function SalePage() {
  return (
    <Catalog
      basePath="/sale"
      query={{ feature: "flashSale" }}
      title="Today's offers"
      subtitle="Limited-time deals across the market"
      emptyTitle="No flash deals right now"
      emptyMessage="Deals refresh often — check back soon or browse everything."
    />
  );
}
