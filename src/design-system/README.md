# Motion Lab design system

This folder hosts the design tokens and primitives that power the Motion Lab UI. Components
defined here stay framework-agnostic and focus on styling + animation so that any feature can
reuse them without pulling widget-specific logic.

Structure:

- `tokens/` exposes the low-level UI DNA:
  - `colors.ts` mirrors the light/dark palette as CSS variables so Tailwind + inline styles stay in
    sync.
  - `index.ts` aggregates motion/timing/radii tokens consumed across primitives.
- `primitives/` contains foundational building blocks like buttons, cards, and layout helpers. Every
  primitive now uses Radix `Slot` so you can wrap a link/element without losing styling.

### Color tokens

`tokens/colors.ts` exports light/dark palettes that are mirrored as CSS variables inside
`src/app/globals.css`. Tailwind utilities consume those variables through the inline `@theme`
definition, so using `bg-background` / `text-foreground` (or the `@design-system` primitives) will
always stay in sync with the single color source.

Consume the package via the `@design-system/*` path aliases defined in `tsconfig.json`. All folders
and files follow kebab-case naming (e.g., `design-system`, `code-pill.tsx`)—keep the convention when
adding new tokens or primitives.
