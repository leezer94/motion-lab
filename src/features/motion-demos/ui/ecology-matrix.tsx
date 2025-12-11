"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { MotionLivePreview } from "@/widgets/motion-preview";
import { MotionControlPanel } from "@/features/motion-controls";
import { useIsMobile } from "@/shared/hooks";
import { useGbifSpecimens, type SpecimenCard } from "../model/use-gbif-specimens";
import { EcologyCarouselCard } from "./ecology-carousel-card";
import { EcologyCarouselSkeleton } from "./ecology-carousel-skeleton";
import { cn } from "@/design-system/utils/cn";

export function EcologyMatrix() {
  const { cards, isLoading, error } = useGbifSpecimens();
  const dataset = cards;
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

  const activeSpecimen = dataset[normalizedIndex] ?? dataset[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_0.8fr]">
      <MotionLivePreview
        label="Orchid ecology carousel"
        footer={
          <p>
            Hover or tap an orchid tile to expand its staging story, then cycle to feel how canopy,
            understory, and floor cues might translate into your motion stack.
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
              Live data is offline—showing studio presets instead.
            </p>
          ) : null}
        </div>
      </MotionLivePreview>
      <MotionControlPanel
        title="Narrative cues"
        description="Map fragrance-inspired cues to your UI tokens and align hover stories with bloom moods."
      >
        {isLoading ? <NarrativeSkeleton /> : <NarrativeDetails specimen={activeSpecimen} />}
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

function NarrativeDetails({ specimen }: { specimen: SpecimenCard }) {
  return (
    <div className="space-y-5 text-sm text-muted-foreground">
      <div className="flex min-h-[112px] items-center gap-4 rounded-3xl border border-border/60 bg-card/40 p-4">
        <div className="relative h-16 w-16">
          <div
            className={cn(
              "absolute inset-0 rounded-2xl border border-white/10 bg-gradient-to-br",
              specimen.accent,
              specimen.image ? "opacity-0" : "opacity-100",
            )}
          />
          {specimen.image ? (
            <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/15 shadow-[0_10px_40px_rgba(2,6,23,0.45)]">
              <Image
                src={specimen.image.src}
                alt={specimen.image.alt}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
          ) : null}
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            {specimen.family}
          </p>
          <h2 className="text-xl font-semibold text-foreground">{specimen.name}</h2>
          <p className="text-sm text-muted-foreground/80">{specimen.region}</p>
        </div>
      </div>
      <div className="min-h-[220px] rounded-3xl border border-border/60 bg-card/40 p-4">
        <dl className="space-y-4 text-foreground">
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.35em] text-emerald-300">
              Fragrance accord
            </dt>
            <dd className="mt-1 text-base">{specimen.fragranceProfile}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Profile</dt>
            <dd className="mt-1 text-sm">{specimen.profile}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Mood cue</dt>
            <dd className="mt-1 text-sm">{specimen.moodCue}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Motion direction
            </dt>
            <dd className="mt-1 text-sm leading-relaxed text-foreground/90 line-clamp-4">
              {specimen.notes}
            </dd>
          </div>
        </dl>
        {specimen.image?.photographer ? (
          <p className="mt-4 text-[11px] text-muted-foreground">
            Photo:{" "}
            <a
              className="underline-offset-2 hover:underline"
              href={specimen.image.link}
              target="_blank"
              rel="noreferrer"
            >
              {specimen.image.photographer}
            </a>
          </p>
        ) : null}
      </div>
      <p className="text-xs text-muted-foreground/80">
        Highlight one orchid at a time. Adjacent cards preview upcoming moods so the team can
        rehearse tempo shifts without cognitive overload. Once a narrative sticks, reuse the same
        pacing inside hover, drag, and modal tokens.
      </p>
    </div>
  );
}

function NarrativeSkeleton() {
  return (
    <div className="space-y-5 text-sm text-muted-foreground">
      <div className="flex min-h-[112px] items-center gap-4 rounded-3xl border border-border/60 bg-card/40 p-4">
        <div className="h-16 w-16 rounded-2xl bg-muted/30" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="h-2 w-24 rounded-full bg-muted/30" />
          <div className="h-3 w-40 rounded-full bg-muted/30" />
          <div className="h-2 w-28 rounded-full bg-muted/20" />
        </div>
      </div>
      <div className="min-h-[220px] rounded-3xl border border-border/60 bg-card/40 p-4">
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((key) => (
            <div key={key} className="space-y-2">
              <div className="h-2 w-20 rounded-full bg-muted/30" />
              <div className="h-3 w-full rounded-full bg-muted/20" />
            </div>
          ))}
        </div>
      </div>
      <div className="h-3 w-3/4 rounded-full bg-muted/30" />
    </div>
  );
}
