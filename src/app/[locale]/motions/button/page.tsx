import { AdaptiveHoverMorph } from "./_components/adaptive-hover-morph";
import { MotionDetailHeader } from "../_components/detail/motion-detail-header";

export default function ButtonMotion() {
  return (
    <div className="space-y-10">
      <MotionDetailHeader
        kicker="Button motion / 01"
        title="Adaptive Hover Morph"
        description="A pill CTA that compresses into a circular icon the moment the user hovers. The morph guides focus by gradually removing text, boosting contrast, and pulsing a halo to suggest immediacy."
      />
      <AdaptiveHoverMorph />
      <section className="grid gap-6 rounded-3xl border border-border/60 bg-card/70 p-6 md:grid-cols-2">
        <article>
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Interaction rationale
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            We start with descriptive text for clarity, then collapse to icon-only for intent. The
            contrast ramp helps the CTA stand out during the exact moment a user shows interest
            (hover). Press feedback keeps the tactile feel responsive even on desktop.
          </p>
        </article>
        <article>
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Implementation notes
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Animate width + border radius together for a believable morph.</li>
            <li>Swap text for icon using opacity/translate rather than display toggles.</li>
            <li>Allow designers to tweak morph depth and glow strength from tokens.</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
