import { DemoGrid } from "@/features/demo-grid";
import { HeroSection } from "@/widgets/hero";
import { LabTip } from "@/widgets/lab-tip";
import { GlobalToolbar } from "@/widgets/global-toolbar";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background px-6 py-6 text-foreground transition-colors sm:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-12">
        <GlobalToolbar className="self-end" />
        <HeroSection />
        <DemoGrid />
        <LabTip />
      </div>
    </main>
  );
}
