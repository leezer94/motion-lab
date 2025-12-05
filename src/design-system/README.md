# Motion Lab design system

This folder hosts the design tokens and primitives that power the Motion Lab UI. Components
defined here stay framework-agnostic and focus on styling + animation so that any feature can
reuse them without pulling widget-specific logic.

Structure:

- `tokens/` exposes design tokens (radius, animation curves, etc.).
- `primitives/` contains foundational building blocks like buttons, cards, and layout helpers.
  Each primitive is ready for both motion-enabled and static scenarios.

### Color tokens

`tokens/colors.ts` exports light/dark palettes that are mirrored as CSS variables inside
`src/app/globals.css`. Tailwind utilities consume those variables through the inline `@theme`
definition, so using `bg-background` / `text-foreground` (or the `@design-system` primitives) will
always stay in sync with the single color source.

Consume the package via the `@design-system/*` path aliases defined in `tsconfig.json`.
