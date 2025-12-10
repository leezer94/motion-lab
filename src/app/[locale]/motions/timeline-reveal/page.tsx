import { MotionDetailHeader } from "@/widgets/motion-detail";
import { TimelineReveal } from "@/features/motion-demos";

export default function TimelineRevealPage() {
  return (
    <div className="space-y-10">
      <MotionDetailHeader
        kicker="Timeline motion / 01"
        title="Timeline reveal"
        description="Chain together critical steps and let visitors watch them phase in with confident pacing."
      />
      <TimelineReveal />
      <section className="grid gap-6 rounded-3xl border border-border/60 bg-card/70 p-6 md:grid-cols-2">
        <article>
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            When to use it
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Timeline reveals work best when onboarding users or unveiling multi-step roadmaps. They
            draw attention to each milestone without overwhelming the eye, making it easy to narrate
            complex stories.
          </p>
        </article>
        <article>
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Implementation notes
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Pair stagger + delay adjustments with page scroll cues.</li>
            <li>Use color pulses sparingly to accentuate only the active card.</li>
            <li>Give users a replay affordance so they can revisit the sequence on demand.</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
