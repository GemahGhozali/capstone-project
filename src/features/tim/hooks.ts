"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { SearchMahasiswaResult } from "./types";

export function useSearchMahasiswa() {
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedQuery = useDebounce(searchQuery).trim();

  const isDebouncing = debouncedQuery.length >= 1;

  const mahasiswaQuery = useQuery({
    gcTime: 0,
    staleTime: 0,
    retry: false,
    enabled: isDebouncing,
    refetchOnWindowFocus: false,
    queryKey: ["mahasiswa", "search", debouncedQuery],
    queryFn: async ({ signal }): Promise<SearchMahasiswaResult[]> => {
      const query = encodeURIComponent(debouncedQuery);
      const response = await fetch(`/api/mahasiswa/search?q=${query}`, { signal });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message ?? "Gagal mengambil data mahasiswa!");
      }

      return response.json();
    },
  });

  return { ...mahasiswaQuery, setSearchQuery, searchQuery, isDebouncing, debouncedQuery };
}
