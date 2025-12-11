import type { DemoTranslationKey } from "@/entities/demo/model/demos";
import { motionDemoRegistry } from "@/features/motion-demos";

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

type MotionNavSectionConfig = {
  id: string;
  labelTranslationKey: string;
  categorySlug: string;
  extraItems?: MotionNavLeaf[];
};

const sectionConfigs: MotionNavSectionConfig[] = [
  {
    id: "buttons",
    labelTranslationKey: "buttons",
    categorySlug: "button",
  },
  {
    id: "timelines",
    labelTranslationKey: "timelines",
    categorySlug: "timeline",
  },
  {
    id: "interactions",
    labelTranslationKey: "interactions",
    categorySlug: "interactions",
  },
];

export const motionNavSections: MotionNavSection[] = sectionConfigs.map((section) => {
  const dynamicItems: MotionNavLeaf[] = motionDemoRegistry
    .filter((demo) => demo.category === section.categorySlug)
    .map((demo) => ({
      slug: demo.slug,
      translationKey: demo.translationKey,
      isAvailable: true,
    }));

  return {
    id: section.id,
    labelTranslationKey: section.labelTranslationKey,
    items: [...dynamicItems, ...(section.extraItems ?? [])],
  };
});
