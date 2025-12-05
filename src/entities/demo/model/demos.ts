export type Demo = {
  title: string;
  description: string;
  accent: string;
};

export const demos: Demo[] = [
  {
    title: "Hover springs",
    description: "Subtle lift/rotate animation for buttons or cards.",
    accent: "from-amber-400/30 to-orange-500/20",
  },
  {
    title: "Timeline reveal",
    description: "Elements pop into view with a staggered timeline.",
    accent: "from-indigo-400/30 to-sky-500/20",
  },
  {
    title: "Drag constraints",
    description: "Give components boundaries for tactile interactions.",
    accent: "from-emerald-400/30 to-lime-500/20",
  },
];
