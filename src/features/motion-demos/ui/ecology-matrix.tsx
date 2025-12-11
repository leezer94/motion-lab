"use client";

import { useMemo, useState } from "react";
import { MotionLivePreview } from "@/widgets/motion-preview";
import { MotionControlPanel } from "@/features/motion-controls";
import { useIsMobile } from "@/shared/hooks";
import { useGbifSpecimens, type SpecimenCard } from "../model/use-gbif-specimens";
import { EcologyCarouselCard } from "./ecology-carousel-card";
import { EcologyCarouselSkeleton } from "./ecology-carousel-skeleton";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const normalizedIndex = ((activeIndex % dataset.length) + dataset.length) % dataset.length;
  const isMobile = useIsMobile();

  const carouselItems = useMemo(() => {
    const total = dataset.length;
    const half = Math.floor(total / 2);
    return dataset.map((specimen, index) => {
      let relative = index - normalizedIndex;
      if (relative > half) relative -= total;
      if (relative < -half) relative += total;
      return { specimen, relative, index };
    });
  }, [dataset, normalizedIndex]);

  const handleCarouselChange = (direction: -1 | 1) => {
    setActiveIndex((prev) => prev + direction);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_0.8fr]">
      <MotionLivePreview
        label="Ecology carousel"
        footer={
          <p>
            Hover a specimen to expand its description, then flip through the carousel to plan how
            canopy, understory, and floor stories should flow.
          </p>
        }
        className="h-full"
        contentClassName="bg-slate-950/40 p-0"
      >
        <div className="relative flex h-[360px] w-full items-center justify-center overflow-hidden rounded-[32px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_rgba(15,23,42,0.85))]" />
          <div className="relative z-10 flex h-full w-full items-center justify-center">
            {isLoading ? (
              <EcologyCarouselSkeleton />
            ) : (
              carouselItems.map(({ specimen, relative, index }) => (
                <EcologyCarouselCard
                  key={specimen.id}
                  specimen={specimen}
                  relativePosition={relative}
                  isActive={relative === 0}
                  isMobile={isMobile}
                  onSelect={() => setActiveIndex(index)}
                />
              ))
            )}
          </div>
          <div className="absolute inset-x-0 bottom-5 z-20 flex items-center justify-center gap-3">
            <CarouselButton label="Previous specimen" onClick={() => handleCarouselChange(-1)} />
            <CarouselButton label="Next specimen" onClick={() => handleCarouselChange(1)} />
          </div>
          {error ? (
            <p className="absolute bottom-5 left-5 z-20 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-xs text-rose-100">
              Failed to load live specimens, showing fallback taxonomy.
            </p>
          ) : null}
        </div>
      </MotionLivePreview>
      <MotionControlPanel
        title="Narrative cues"
        description="Use this carousel to decide how to pace reveals and where to anchor motion accents."
      >
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            Highlight one specimen at a time, letting adjacent cards preview what&apos;s coming
            next. This reduces cognitive load when presenting complex ecology data to motion-first
            stakeholders.
          </p>
          <p className="text-xs text-muted-foreground/80">
            Once the narrative layer is signed off, hook spring values into each card&apos;s
            transition to mirror canopy vs. understory personality—glow pulses for humid layers,
            tighter easing for ground cover.
          </p>
        </div>
      </MotionControlPanel>
    </div>
  );
}

type CarouselButtonProps = {
  label: string;
  onClick: () => void;
};

function CarouselButton({ label, onClick }: CarouselButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-semibold text-white transition hover:bg-white/15"
      aria-label={label}
    >
      {label}
    </button>
  );
}
