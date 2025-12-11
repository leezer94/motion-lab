"use client";

import { useMemo } from "react";
import { useApiQuery } from "@/shared/api";
import { CANNABIS_IMAGE_QUERY_KEY, GBIF_SPECIES_QUERY_KEY } from "./query-keys";

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

type SpecimenImage = {
  id: string;
  src: string;
  alt: string;
  photographer: string;
  link: string;
};

type UnsplashGalleryResponse = {
  results: SpecimenImage[];
};

type CannabisNarrative = {
  displayName: string;
  region: string;
  accent: string;
  profile: string;
  notes: string;
  terpeneProfile: string;
  effectCue: string;
};

const cannabisNarratives: CannabisNarrative[] = [
  {
    displayName: "Solar Mist Cultivar",
    region: "Desert greenhouse canopy",
    accent: "from-emerald-400/60 to-teal-500/40",
    profile: "Citrus-first vapor trail",
    notes: "Bright terpene spray that pops for hero transitions or onboarding reveals.",
    terpeneProfile: "Limonene · Caryophyllene",
    effectCue: "Uplifted focus",
  },
  {
    displayName: "Obsidian Kush Array",
    region: "Night-cooled indoor racks",
    accent: "from-sky-500/60 to-indigo-500/40",
    profile: "Velvet low-end swell",
    notes: "Ground CTA hover states with a deep violet pulse.",
    terpeneProfile: "Myrcene · Nerolidol",
    effectCue: "Slow depth",
  },
  {
    displayName: "Amber Resin Hybrid",
    region: "Terraced hillside beds",
    accent: "from-amber-500/60 to-orange-500/40",
    profile: "Spiced midtones",
    notes: "Use for scroll markers that glide through archival timelines.",
    terpeneProfile: "Caryophyllene · Humulene",
    effectCue: "Warm cadence",
  },
  {
    displayName: "Rosin Bloom Microbatch",
    region: "Microclimate lab benches",
    accent: "from-rose-500/60 to-fuchsia-500/40",
    profile: "Petal-soft intro cue",
    notes: "Wrap modal entrances with a bloom that feels bespoke.",
    terpeneProfile: "Linalool · Ocimene",
    effectCue: "Airy shimmer",
  },
  {
    displayName: "Verdant Coast Sativa",
    region: "Pacific fog plains",
    accent: "from-lime-500/60 to-emerald-500/40",
    profile: "Glassine highlight wash",
    notes: "Pairs with light-mode hero gradients that need polish.",
    terpeneProfile: "Pinene · Terpinolene",
    effectCue: "Coastal clarity",
  },
  {
    displayName: "Glacier Breath Phenotype",
    region: "Hydroponic arctic dome",
    accent: "from-cyan-500/60 to-blue-500/40",
    profile: "Icy vapor sweep",
    notes: "Great for frosted stats or KPI stacks with halation.",
    terpeneProfile: "Eucalyptol · Bisabolol",
    effectCue: "Cooling relief",
  },
  {
    displayName: "Lumen Stack Indica",
    region: "Subterranean LED arrays",
    accent: "from-purple-500/60 to-violet-500/40",
    profile: "Crushed berry trail",
    notes: "Softens offboarding flows with luxe afterglow.",
    terpeneProfile: "Myrcene · Linalool",
    effectCue: "Evening settle",
  },
  {
    displayName: "Canopy Drift Blend",
    region: "Equatorial canopy labs",
    accent: "from-green-500/60 to-emerald-400/40",
    profile: "Lush fade cushion",
    notes: "Ideal for dense editorial spreads that need breathing room.",
    terpeneProfile: "Farnesene · Valencene",
    effectCue: "Floating calm",
  },
  {
    displayName: "Sunstone Hash Draft",
    region: "High-altitude drying lofts",
    accent: "from-orange-500/60 to-red-500/40",
    profile: "Charred sugar spark",
    notes: "Inject energy into CTA strips or carousel endcaps.",
    terpeneProfile: "Geraniol · Caryophyllene",
    effectCue: "Bold ignition",
  },
];

const CANNABIS_QUERY = "cannabis";

export type SpecimenCard = {
  id: string;
  name: string;
  family: string;
  region: string;
  accent: string;
  profile: string;
  notes: string;
  terpeneProfile: string;
  effectCue: string;
  image?: SpecimenImage;
};

export function useGbifSpecimens() {
  const speciesQuery = useApiQuery<GbifSpeciesResponse>({
    queryKey: GBIF_SPECIES_QUERY_KEY,
    request: {
      url: `https://api.gbif.org/v1/species/search?q=${encodeURIComponent(
        CANNABIS_QUERY,
      )}&rank=species&limit=9`,
      cache: "no-store",
    },
    staleTime: 1000 * 60 * 10,
  });

  const galleryQuery = useApiQuery<UnsplashGalleryResponse>({
    queryKey: CANNABIS_IMAGE_QUERY_KEY,
    request: {
      url: "/api/unsplash/cannabis",
    },
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  const cards = useMemo<SpecimenCard[]>(() => {
    return cannabisNarratives.map((narrative, index) => {
      const species = speciesQuery.data?.results?.[index];
      const image = galleryQuery.data?.results?.[index];

      return {
        id: species?.key ? String(species.key) : `cannabis-${index}`,
        name: species?.canonicalName ?? species?.scientificName ?? narrative.displayName,
        family: species?.family ?? "Cannabaceae",
        region: narrative.region,
        accent: narrative.accent,
        profile: narrative.profile,
        notes: narrative.notes,
        terpeneProfile: narrative.terpeneProfile,
        effectCue: narrative.effectCue,
        image,
      };
    });
  }, [galleryQuery.data, speciesQuery.data]);

  return {
    cards,
    isLoading: speciesQuery.isLoading || galleryQuery.isLoading,
    error: speciesQuery.error ?? galleryQuery.error,
    refetch: () => {
      void speciesQuery.refetch();
      void galleryQuery.refetch();
    },
  };
}
