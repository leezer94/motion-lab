"use client";

type MotionDetailHeaderProps = {
  kicker: string;
  title: string;
  description: string;
};

export function MotionDetailHeader({ kicker, title, description }: MotionDetailHeaderProps) {
  return (
    <section className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
        {kicker}
      </p>
      <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
      <p className="text-base text-muted-foreground">{description}</p>
    </section>
  );
}
