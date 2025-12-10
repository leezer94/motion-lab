import type { DemoTranslationKey } from "@/entities/demo/model/demos";

export type MotionNavLeaf = {
  slug: string;
  translationKey: DemoTranslationKey;
  isAvailable: boolean;
};

export type MotionNavSection = {
  id: string;
  labelTranslationKey: string;
  items: MotionNavLeaf[];
};

export const motionNavSections: MotionNavSection[] = [
  {
    id: "buttons",
    labelTranslationKey: "buttons",
    items: [
      {
        slug: "button",
        translationKey: "hoverSprings",
        isAvailable: true,
      },
    ],
  },
  {
    id: "timelines",
    labelTranslationKey: "timelines",
    items: [
      {
        slug: "timeline-reveal",
        translationKey: "timelineReveal",
        isAvailable: true,
      },
    ],
  },
  {
    id: "interactions",
    labelTranslationKey: "interactions",
    items: [
      {
        slug: "drag-constraints",
        translationKey: "dragConstraints",
        isAvailable: false,
      },
    ],
  },
];
