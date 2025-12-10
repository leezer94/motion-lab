import { DemoGrid } from "@/features/demo-grid";
import { LanguageSwitcher } from "@/features/language-switcher";
import { ThemeToggle } from "@/features/theme-toggle";
import { HeroSection } from "@/widgets/hero";
import { LabTip } from "@/widgets/lab-tip";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background px-6 py-6 text-foreground transition-colors sm:px-10">
      `
      <div className="mx-auto flex max-w-5xl flex-col gap-12">
        <div className="flex flex-row justify-end">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
        <HeroSection />
        <DemoGrid />
        <LabTip />
      </div>
    </main>
  );
}
