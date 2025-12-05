import { DemoGrid } from "@/features/demo-grid";
import { HeroSection } from "@/widgets/hero";
import { LabTip } from "@/widgets/lab-tip";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-50 sm:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-12">
        <HeroSection />
        <DemoGrid />
        <LabTip />
      </div>
    </main>
  );
}
