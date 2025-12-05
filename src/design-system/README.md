# Motion Lab design system

This folder hosts the design tokens and primitives that power the Motion Lab UI. Components
defined here stay framework-agnostic and focus on styling + animation so that any feature can
reuse them without pulling widget-specific logic.

Structure:

- `tokens/` exposes design tokens (radius, animation curves, etc.).
- `primitives/` contains foundational building blocks like buttons, cards, and layout helpers.
  Each primitive is ready for both motion-enabled and static scenarios.

Consume the package via the `@design-system/*` path aliases defined in `tsconfig.json`.
