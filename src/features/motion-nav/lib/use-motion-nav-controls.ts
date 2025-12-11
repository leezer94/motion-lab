"use client";

import { useEffect } from "react";
import { useMotionNavStore } from "../model/motion-nav-store";
import type { MotionNavListSection } from "../types";

export function useMotionNavControls(sections: MotionNavListSection[]) {
  const openSections = useMotionNavStore((state) => state.openSections);
  const initializeSections = useMotionNavStore((state) => state.initializeSections);
  const toggleSection = useMotionNavStore((state) => state.toggleSection);
  const setSectionOpen = useMotionNavStore((state) => state.setSectionOpen);

  useEffect(() => {
    initializeSections(sections.map((section) => section.key));
  }, [sections, initializeSections]);

  useEffect(() => {
    sections.forEach((section) => {
      const hasActiveItem = section.items.some((item) => item.isActive);
      setSectionOpen(section.key, hasActiveItem);
    });
  }, [sections, setSectionOpen]);

  return {
    openSections,
    toggleSection,
  };
}
