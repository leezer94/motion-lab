"use client";

import { MotionNavList, type MotionNavListSection } from "./motion-nav-list";

type MotionSidebarProps = {
  copy: {
    label: string;
    heading: string;
    subheading: string;
  };
  navSections: MotionNavListSection[];
};

export function MotionSidebar({ copy, navSections }: MotionSidebarProps) {
  return (
    <aside className="lg:w-72">
      <div className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.12)] lg:sticky lg:top-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          {copy.label}
        </p>
        <h2 className="mt-2 text-2xl font-semibold">{copy.heading}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{copy.subheading}</p>
        <MotionNavList sections={navSections} />
      </div>
    </aside>
  );
}
