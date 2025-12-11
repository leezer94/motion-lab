import { create } from "zustand";

export type MotionNavState = {
  openSections: Record<string, boolean>;
  initializeSections: (sectionIds: string[]) => void;
  toggleSection: (sectionId: string) => void;
  setSectionOpen: (sectionId: string, isOpen: boolean) => void;
};

export const useMotionNavStore = create<MotionNavState>((set) => ({
  openSections: {},
  initializeSections: (sectionIds) =>
    set((state) => {
      const nextOpenSections: Record<string, boolean> = {};
      let changed = false;

      sectionIds.forEach((id) => {
        if (state.openSections[id] ?? false) {
          nextOpenSections[id] = true;
        } else {
          nextOpenSections[id] = false;
          if (!(id in state.openSections)) {
            changed = true;
          }
        }
      });

      if (Object.keys(state.openSections).length !== sectionIds.length) {
        changed = true;
      }

      return changed ? { openSections: nextOpenSections } : state;
    }),
  toggleSection: (sectionId) =>
    set((state) => ({
      openSections: {
        ...state.openSections,
        [sectionId]: !(state.openSections[sectionId] ?? false),
      },
    })),
  setSectionOpen: (sectionId, isOpen) =>
    set((state) => ({
      openSections: {
        ...state.openSections,
        [sectionId]: isOpen,
      },
    })),
}));
