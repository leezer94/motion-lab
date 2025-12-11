export type DemoTranslationKey = "hoverSprings" | "timelineReveal" | "ecologyMatrix";

export type Demo = {
  key: DemoTranslationKey;
  accent: string;
};

export const demos: Demo[] = [
  {
    key: "hoverSprings",
    accent: "from-amber-400/30 to-orange-500/20",
  },
  {
    key: "timelineReveal",
    accent: "from-indigo-400/30 to-sky-500/20",
  },
  {
    key: "ecologyMatrix",
    accent: "from-emerald-400/30 to-lime-500/20",
  },
];
