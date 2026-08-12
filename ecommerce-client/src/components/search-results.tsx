"use client";

import { useEffect } from "react";
import { productNotFound } from "@/lib/swal";

interface SearchResultsProps {
  query: string;
  isEmpty: boolean;
  children: React.ReactNode;
}

export function SearchResults({ query, isEmpty, children }: SearchResultsProps) {
  useEffect(() => {
    if (query && isEmpty) {
      productNotFound(query);
    }
  }, [query, isEmpty]);

  return <>{children}</>;
}