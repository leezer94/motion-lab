import { notFound } from "next/navigation";
import { MotionDetailHeader } from "@/widgets/motion-detail";
import { getMotionDemoByParams, motionDemoRegistry } from "@/features/motion-demos";

type MotionDemoPageProps = {
  params: Promise<{
    category: string;
    demo: string;
  }>;
};

export default async function MotionDemoPage({ params }: MotionDemoPageProps) {
  const { category, demo } = await params;
  const definition = getMotionDemoByParams(category, demo);

  if (!definition) {
    notFound();
  }

  const DemoComponent = definition.component;

  return (
    <div className="space-y-10">
      <MotionDetailHeader
        kicker={definition.kicker}
        title={definition.title}
        description={definition.description}
      />
      <DemoComponent />
      <section className="grid gap-6 rounded-3xl border border-border/60 bg-card/70 p-6 md:grid-cols-2">
        {definition.insights.map((insight) => (
          <article key={insight.title}>
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              {insight.title}
            </h2>
            {insight.description ? (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {insight.description}
              </p>
            ) : null}
            {insight.listItems ? (
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {insight.listItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </section>
    </div>
  );
}

export function generateStaticParams() {
  return motionDemoRegistry.map(({ category, demo }) => ({
    category,
    demo,
  }));
}
