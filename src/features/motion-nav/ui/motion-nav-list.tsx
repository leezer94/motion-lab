"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "@/navigation";
import { cn } from "@/design-system/utils/cn";
import { ChevronDown } from "@/shared/icons";
import { useMotionNavStore } from "../model/motion-nav-store";

export type MotionNavListItem = {
  key: string;
  href: string;
  label: string;
  isActive: boolean;
  isAvailable: boolean;
  comingSoonLabel: string;
};

export type MotionNavListSection = {
  key: string;
  label: string;
  items: MotionNavListItem[];
};

type MotionNavListProps = {
  sections: MotionNavListSection[];
};

export function MotionNavList({ sections }: MotionNavListProps) {
  const openSections = useMotionNavStore((state) => state.openSections);
  const initializeSections = useMotionNavStore((state) => state.initializeSections);
  const toggleSection = useMotionNavStore((state) => state.toggleSection);

  useEffect(() => {
    initializeSections(sections.map((section) => section.key));
  }, [sections, initializeSections]);

  return (
    <nav className="mt-6 flex flex-col gap-4">
      {sections.map((section) => {
        const isOpen = openSections[section.key] ?? false;
        const contentId = `motion-nav-panel-${section.key}`;
        return (
          <div key={section.key}>
            <button
              type="button"
              onClick={() => toggleSection(section.key)}
              className="flex w-full items-center justify-between rounded-2xl border border-transparent px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
              aria-expanded={isOpen ? "true" : "false"}
              aria-controls={contentId}
            >
              <span>{section.label}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isOpen ? "rotate-180" : "",
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={contentId}
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { height: "auto", opacity: 1 },
                    collapsed: { height: 0, opacity: 0 },
                  }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 flex flex-col gap-2">
                    {section.items.map((item) => (
                      <NavItem key={item.key} item={item} />
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </nav>
  );
}

function NavItem({ item }: { item: MotionNavListItem }) {
  if (!item.isAvailable) {
    return (
      <div
        className="relative block px-2 py-1 text-sm font-semibold text-muted-foreground/80"
        aria-disabled="true"
      >
        <span className="flex items-center justify-between">
          <span>{item.label}</span>
          <span className="text-[11px] uppercase tracking-[0.3em]">{item.comingSoonLabel}</span>
        </span>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "relative block px-2 py-1 text-sm font-semibold tracking-tight transition-colors",
        item.isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
      aria-current={item.isActive ? "page" : undefined}
    >
      {item.isActive && (
        <motion.span
          layoutId="motions-nav-active"
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary/60"
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
        />
      )}
      <span className="relative z-10 flex items-center justify-between">
        <span>{item.label}</span>
        {item.isActive && (
          <motion.span
            layoutId="motions-nav-indicator"
            className="h-2 w-2 rounded-full bg-primary"
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          />
        )}
      </span>
    </Link>
  );
}
