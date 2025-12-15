"use client";

import type { ReactNode } from "react";
import { AutomationShell } from "@/features/automation-nav/ui/automation-shell";

type AutomationLayoutProps = {
  children: ReactNode;
};

export default function AutomationLayout({ children }: AutomationLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-950">
      <AutomationShell>{children}</AutomationShell>
    </main>
  );
}
