import type { ComponentType } from "react";
import type { DemoTranslationKey } from "@/entities/demo/model/demos";
import { AdaptiveHoverMorph } from "../ui/adaptive-hover-morph";
import { TimelineReveal } from "../ui/timeline-reveal";
import { EcologyMatrix } from "../ui/ecology-matrix";

export type MotionDemoInsight = {
  title: string;
  description?: string;
  listItems?: string[];
};

export type MotionDemoDefinition = {
  category: string;
  demo: string;
  slug: string;
  translationKey: DemoTranslationKey;
  kicker: string;
  title: string;
  description: string;
  insights: MotionDemoInsight[];
  component: ComponentType;
};

export const motionDemoRegistry: MotionDemoDefinition[] = [
  {
    category: "button",
    demo: "adaptive-hover-morph",
    slug: "button/adaptive-hover-morph",
    translationKey: "hoverSprings",
    kicker: "Button motion / 01",
    title: "Adaptive Hover Morph",
    description:
      "A pill CTA that compresses into a circular icon the moment the user hovers. The morph guides focus by gradually removing text, boosting contrast, and pulsing a halo to suggest immediacy.",
    insights: [
      {
        title: "Interaction rationale",
        description:
          "We start with descriptive text for clarity, then collapse to icon-only for intent. The contrast ramp helps the CTA stand out during the exact moment a user shows interest (hover). Press feedback keeps the tactile feel responsive even on desktop.",
      },
      {
        title: "Implementation notes",
        listItems: [
          "Animate width + border radius together for a believable morph.",
          "Swap text for icon using opacity/translate rather than display toggles.",
          "Allow designers to tweak morph depth and glow strength from tokens.",
        ],
      },
    ],
    component: AdaptiveHoverMorph,
  },
  {
    category: "timeline",
    demo: "time-reveal",
    slug: "timeline/time-reveal",
    translationKey: "timelineReveal",
    kicker: "Timeline motion / 01",
    title: "Timeline reveal",
    description:
      "Chain together critical steps and let visitors watch them phase in with confident pacing.",
    insights: [
      {
        title: "When to use it",
        description:
          "Timeline reveals work best when onboarding users or unveiling multi-step roadmaps. They draw attention to each milestone without overwhelming the eye, making it easy to narrate complex stories.",
      },
      {
        title: "Implementation notes",
        listItems: [
          "Pair stagger + delay adjustments with page scroll cues.",
          "Use color pulses sparingly to accentuate only the active card.",
          "Give users a replay affordance so they can revisit the sequence on demand.",
        ],
      },
    ],
    component: TimelineReveal,
  },
  {
    category: "interactions",
    demo: "ecology-matrix",
    slug: "interactions/ecology-matrix",
    translationKey: "ecologyMatrix",
    kicker: "Interaction motion / 01",
    title: "Ecology matrix",
    description:
      "Group specimens by canopy, understory, and forest floor to storyboard how motion should reinforce spatial cues.",
    insights: [
      {
        title: "Why it works",
        description:
          "Spatial matrices communicate hierarchy and help UX designers plot entrance/exit motion that mirrors ecological depth.",
      },
      {
        title: "Implementation notes",
        listItems: [
          "Pull GBIF data into three buckets and let copywriting describe each climate.",
          "Use live data but keep graceful fallbacks so the grid never collapses.",
          "Future motion hooks can animate zone transitions independently.",
        ],
      },
    ],
    component: EcologyMatrix,
  },
];

export function getMotionDemoByParams(category: string, demo: string) {
  const slug = `${category}/${demo}`;
  return motionDemoRegistry.find((definition) => definition.slug === slug);
}

export function getMotionDemoPathByTranslationKey(key: DemoTranslationKey) {
  const match = motionDemoRegistry.find((definition) => definition.translationKey === key);
  return match ? `/motions/${match.slug}` : null;
}
