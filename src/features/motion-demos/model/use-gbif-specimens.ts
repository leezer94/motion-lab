"use client";

import { useMemo } from "react";
import { useApiQuery } from "@/shared/api";
import { ORCHID_IMAGE_QUERY_KEY, GBIF_SPECIES_QUERY_KEY } from "./query-keys";

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

type OrchidNarrative = {
  displayName: string;
  region: string;
  accent: string;
  profile: string;
  notes: string;
  fragranceProfile: string;
  moodCue: string;
};

const orchidNarratives: OrchidNarrative[] = [
  {
    displayName: "Aurora Phalaenopsis",
    region: "Mist cooled atriums",
    accent: "from-emerald-400/60 to-teal-500/40",
    profile: "Ribboned petal stretch",
    notes: "Use for hero CTAs that unfurl as the user pauses on them.",
    fragranceProfile: "Green tea · Lemongrass",
    moodCue: "Fresh clarity",
  },
  {
    displayName: "Lunar Widow Orchid",
    region: "Night-lit conservatories",
    accent: "from-sky-500/60 to-indigo-500/40",
    profile: "Velvet halo pulse",
    notes: "Grounds nighttime dashboards with a moody glow.",
    fragranceProfile: "Violet · Bergamot",
    moodCue: "Calm focus",
  },
  {
    displayName: "Amber Crest Oncidium",
    region: "Terraced thermal beds",
    accent: "from-amber-500/60 to-orange-500/40",
    profile: "Sequenced sunburst",
    notes: "Pair with timeline markers that hop between eras.",
    fragranceProfile: "Honey · Clove",
    moodCue: "Golden cadence",
  },
  {
    displayName: "Rosette Jewel Orchid",
    region: "Microclimate lab benches",
    accent: "from-rose-500/60 to-fuchsia-500/40",
    profile: "Silk bloom intro",
    notes: "Perfect for modal entrances or onboarding cards.",
    fragranceProfile: "Lychee · Magnolia",
    moodCue: "Soft arrival",
  },
  {
    displayName: "Verdant Coast Cymbidium",
    region: "Coastal fog plains",
    accent: "from-lime-500/60 to-emerald-500/40",
    profile: "Glassine highlight wash",
    notes: "Give light-mode hero gradients extra polish.",
    fragranceProfile: "Sea salt · Pine",
    moodCue: "Tidal ease",
  },
  {
    displayName: "Glacier Drift Dendrobium",
    region: "Cryogenic grow domes",
    accent: "from-cyan-500/60 to-blue-500/40",
    profile: "Frosted vapor sweep",
    notes: "Great for stats blocks that need crystalline depth.",
    fragranceProfile: "Eucalyptus · Mint",
    moodCue: "Cooling relief",
  },
  {
    displayName: "Lumen Stack Cattleya",
    region: "Subterranean LED arrays",
    accent: "from-purple-500/60 to-violet-500/40",
    profile: "Crushed berry trail",
    notes: "Softens offboarding flows with plush afterglow.",
    fragranceProfile: "Berry · Musk",
    moodCue: "Evening settle",
  },
  {
    displayName: "Canopy Drift Vanda",
    region: "Equatorial canopy labs",
    accent: "from-green-500/60 to-emerald-400/40",
    profile: "Suspended bloom cushion",
    notes: "Ideal for dense editorial spreads needing breathing room.",
    fragranceProfile: "Fern · Citrus",
    moodCue: "Floating calm",
  },
  {
    displayName: "Sunstone Paphiopedilum",
    region: "High-altitude drying lofts",
    accent: "from-orange-500/60 to-red-500/40",
    profile: "Charred sugar spark",
    notes: "Inject energy into CTA strips or carousel endcaps.",
    fragranceProfile: "Amber · Sandalwood",
    moodCue: "Bold ignition",
  },
];

const ORCHID_QUERY = "orchid";

export type SpecimenCard = {
  id: string;
  name: string;
  family: string;
  region: string;
  accent: string;
  profile: string;
  notes: string;
  fragranceProfile: string;
  moodCue: string;
  image?: SpecimenImage;
};

export function useGbifSpecimens() {
  const speciesQuery = useApiQuery<GbifSpeciesResponse>({
    queryKey: GBIF_SPECIES_QUERY_KEY,
    request: {
      url: `https://api.gbif.org/v1/species/search?q=${encodeURIComponent(
        ORCHID_QUERY,
      )}&rank=species&limit=9`,
      cache: "no-store",
    },
    staleTime: 1000 * 60 * 10,
  });

  const galleryQuery = useApiQuery<UnsplashGalleryResponse>({
    queryKey: ORCHID_IMAGE_QUERY_KEY,
    request: {
      url: "/api/unsplash/orchids",
    },
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  const cards = useMemo<SpecimenCard[]>(() => {
    return orchidNarratives.map((narrative, index) => {
      const species = speciesQuery.data?.results?.[index];
      const image = galleryQuery.data?.results?.[index];

      return {
        id: species?.key ? String(species.key) : `orchid-${index}`,
        name: species?.canonicalName ?? species?.scientificName ?? narrative.displayName,
        family: species?.family ?? "Orchidaceae",
        region: narrative.region,
        accent: narrative.accent,
        profile: narrative.profile,
        notes: narrative.notes,
        fragranceProfile: narrative.fragranceProfile,
        moodCue: narrative.moodCue,
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
