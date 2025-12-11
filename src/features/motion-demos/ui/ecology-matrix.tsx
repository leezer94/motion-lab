"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { MotionLivePreview } from "@/widgets/motion-preview";
import { MotionControlPanel } from "@/features/motion-controls";
import { cn } from "@/design-system/utils/cn";
import { useGbifSpecimens, type SpecimenCard } from "../model/use-gbif-specimens";

type EcologyZone = {
  key: string;
  label: string;
  description: string;
  gradient: string;
};

const ecologyZones: EcologyZone[] = [
  {
    key: "canopy",
    label: "Canopy stratum",
    description: "Humid air, filtered light, epiphytes thrive.",
    gradient: "from-emerald-500/20 to-sky-500/20",
  },
  {
    key: "understory",
    label: "Understory belt",
    description: "Dappled light and rich soils for broad leaves.",
    gradient: "from-amber-500/20 to-rose-500/20",
  },
  {
    key: "ground",
    label: "Forest floor",
    description: "Shade tolerant climbers and mossy anchors.",
    gradient: "from-indigo-500/20 to-purple-500/20",
  },
];

const fallbackSpecimens: SpecimenCard[] = [
  {
    id: "fallback-1",
    name: "Monstera deliciosa",
    family: "Araceae",
    region: "Tropical canopy",
    accent: "from-emerald-400/60 to-teal-500/40",
  },
  {
    id: "fallback-2",
    name: "Lavandula angustifolia",
    family: "Lamiaceae",
    region: "Mediterranean understory",
    accent: "from-sky-500/60 to-indigo-500/40",
  },
  {
    id: "fallback-3",
    name: "Aloe vera",
    family: "Asphodelaceae",
    region: "Arid floor",
    accent: "from-amber-500/60 to-orange-500/40",
  },
  {
    id: "fallback-4",
    name: "Ficus lyrata",
    family: "Moraceae",
    region: "West African canopy",
    accent: "from-cyan-500/60 to-blue-500/40",
  },
  {
    id: "fallback-5",
    name: "Epipremnum aureum",
    family: "Araceae",
    region: "Island understory",
    accent: "from-green-500/60 to-emerald-400/40",
  },
  {
    id: "fallback-6",
    name: "Tradescantia zebrina",
    family: "Commelinaceae",
    region: "Central American floor",
    accent: "from-rose-500/60 to-fuchsia-500/40",
  },
  {
    id: "fallback-7",
    name: "Calathea orbifolia",
    family: "Marantaceae",
    region: "Bolivian understory",
    accent: "from-lime-500/60 to-emerald-500/40",
  },
  {
    id: "fallback-8",
    name: "Tillandsia ionantha",
    family: "Bromeliaceae",
    region: "Mexico canopy",
    accent: "from-purple-500/60 to-violet-500/40",
  },
  {
    id: "fallback-9",
    name: "Nepenthes alata",
    family: "Nepenthaceae",
    region: "Philippine floor",
    accent: "from-orange-500/60 to-red-500/40",
  },
];

export function EcologyMatrix() {
  const { cards, isLoading, error } = useGbifSpecimens();
  const dataset = cards?.length ? cards : fallbackSpecimens;

  const zoneBuckets = useMemo(() => {
    return ecologyZones.map((zone, zoneIndex) => {
      const specimens = dataset
        .filter(Boolean)
        .filter((specimen, index) => specimen && index % ecologyZones.length === zoneIndex);

      return {
        zone,
        specimens,
      };
    });
  }, [dataset]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_0.8fr]">
      <MotionLivePreview
        label="Ecology matrix"
        footer={
          <p>
            Specimens are distributed across canopy, understory, and forest floor to map potential
            placement before choreographing motion accents.
          </p>
        }
        className="h-full"
        contentClassName="bg-slate-950/30 p-0"
      >
        <div className="flex h-full w-full flex-col gap-3 rounded-[32px] p-6">
          {zoneBuckets.map(({ zone, specimens }) => (
            <section
              key={zone.key}
              className={cn(
                "rounded-3xl border border-white/5 bg-slate-950/50 px-5 py-4 shadow-[0_12px_40px_rgba(8,10,35,0.35)]",
                "flex flex-col gap-4",
              )}
            >
              <header className="flex items-baseline justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">
                    {zone.label}
                  </p>
                  <p className="text-sm text-slate-300">{zone.description}</p>
                </div>
                <div
                  className={cn(
                    "h-8 w-8 rounded-2xl border border-white/10 bg-gradient-to-br",
                    zone.gradient,
                  )}
                  aria-hidden="true"
                />
              </header>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {isLoading && specimens.length === 0 ? (
                  <MatrixSkeleton />
                ) : (
                  specimens.map((specimen) => (
                    <SpecimenCard key={specimen.id} specimen={specimen} zone={zone} />
                  ))
                )}
              </div>
            </section>
          ))}
          {error ? (
            <p className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              Failed to load live specimens, showing fallback taxonomy.
            </p>
          ) : null}
        </div>
      </MotionLivePreview>
      <MotionControlPanel
        title="Matrix insights"
        description="Use this spatial grouping to decide where to anchor transitions or progressive disclosure."
      >
        <ul className="space-y-4 text-sm text-muted-foreground">
          <li>
            <span className="font-semibold text-foreground">Canopy</span> – Use diffused glows and
            gentle parallax to mimic high humidity.
          </li>
          <li>
            <span className="font-semibold text-foreground">Understory</span> – Cards can slide from
            the side like leaves unfolding, referencing lateral growth.
          </li>
          <li>
            <span className="font-semibold text-foreground">Forest floor</span> – Consider staggered
            elevations or pulses to communicate ground-level discoveries.
          </li>
        </ul>
      </MotionControlPanel>
    </div>
  );
}

function MatrixSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="h-[92px] animate-pulse rounded-2xl border border-white/5 bg-slate-900/40"
        />
      ))}
    </>
  );
}

type SpecimenCardProps = {
  specimen: SpecimenCard;
  zone: EcologyZone;
};

function SpecimenCard({ specimen, zone }: SpecimenCardProps) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-left text-slate-50 shadow-[0_16px_40px_rgba(8,10,35,0.4)]"
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-60 blur-2xl bg-gradient-to-br",
          specimen.accent,
        )}
        aria-hidden="true"
      />
      <div className="relative z-10 flex flex-col gap-1">
        <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">{zone.label}</p>
        <h3 className="text-sm font-semibold leading-tight">{specimen.name}</h3>
        <p className="text-xs text-slate-300">{specimen.family}</p>
      </div>
      <div className="relative z-10 mt-3 text-xs text-slate-300 transition-all duration-300 ease-out group-hover:max-h-24 group-hover:opacity-100 group-hover:translate-y-0 max-h-0 -translate-y-1 opacity-0">
        {zone.description} <span className="text-slate-400">/ {specimen.region}</span>
      </div>
    </motion.article>
  );
}
