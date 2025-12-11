"use client";

import { useMemo } from "react";
import { useApiQuery } from "@/shared/api";
import { GBIF_SPECIES_QUERY_KEY } from "./query-keys";

type GbifSpecies = {
  key: number;
  scientificName?: string;
  canonicalName?: string;
  family?: string;
  kingdom?: string;
};

type GbifSpeciesResponse = {
  results: GbifSpecies[];
};

const gradientPalette = [
  "from-emerald-400/60 to-teal-500/40",
  "from-sky-500/60 to-indigo-500/40",
  "from-amber-500/60 to-orange-500/40",
  "from-rose-500/60 to-fuchsia-500/40",
  "from-lime-500/60 to-emerald-500/40",
  "from-cyan-500/60 to-blue-500/40",
  "from-purple-500/60 to-violet-500/40",
  "from-green-500/60 to-emerald-400/40",
  "from-orange-500/60 to-red-500/40",
];

const DEFAULT_QUERY = "tropical";

export type SpecimenCard = {
  id: string;
  name: string;
  family: string;
  region: string;
  accent: string;
};

export function useGbifSpecimens(query: string = DEFAULT_QUERY) {
  const response = useApiQuery<GbifSpeciesResponse>({
    queryKey: [...GBIF_SPECIES_QUERY_KEY, query],
    request: {
      url: `https://api.gbif.org/v1/species/search?q=${encodeURIComponent(query)}&rank=species&limit=9`,
      cache: "no-store",
    },
    staleTime: 1000 * 60 * 10,
  });

  const cards = useMemo<SpecimenCard[] | null>(() => {
    if (!response.data?.results) {
      return null;
    }

    return response.data.results.slice(0, 9).map((result, index) => ({
      id: String(result.key),
      name: result.canonicalName ?? result.scientificName ?? `Specimen ${index + 1}`,
      family: result.family ?? "Unknown family",
      region: result.kingdom ?? "Botany",
      accent: gradientPalette[index % gradientPalette.length],
    }));
  }, [response.data]);

  return {
    ...response,
    cards,
  };
}
