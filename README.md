# Motion Lab

Next.js 16 playground configured with ESLint, Prettier, Tailwind CSS, and Framer Motion so you can iterate on motion experiments quickly. Husky automates the pre-commit workflow so every change ships linted, type-safe, and build-ready.

## Tech stack

- [Next.js App Router](https://nextjs.org/docs) with the latest stable runtime
- [Framer Motion](https://www.framer.com/motion/) for animation primitives
- Tailwind CSS v4 preview styles from `create-next-app`
- ESLint flat config + Prettier for consistent formatting
- Husky pre-commit hook that runs `format:check`, `lint`, `typecheck`, and a production `build`
- `next build --webpack` is used to keep builds deterministic inside restricted environments
- Feature-Sliced Design (FSD) layout over the App Router for scalable composition

## Development

```bash
npm run dev        # start the local dev server on http://localhost:3000
npm run build      # create a production build (forces webpack)
npm run start      # run the production build locally
npm run lint       # lint the entire project with ESLint
npm run format     # format every source file with Prettier
npm run format:check  # verify formatting without writing changes
npm run typecheck  # run the TypeScript compiler in noEmit mode
```

Framer Motion is already imported inside the widgets/features slices and the App Router composes them from `src/app/page.tsx`. Husky is wired through the `prepare` script, so after `npm install` the `.husky/pre-commit` hook automatically enforces formatting, linting, type safety, and the production build before a commit can land.

## Architecture

```
src/
├─ app/              # Next.js App Router entry points
├─ shared/           # Reusable config, lib helpers, and non-visual tokens
├─ entities/         # Business entities (e.g., demo cards)
├─ features/         # User-facing scenarios composed from entities
├─ widgets/          # Page-level sections composed from features
├─ design-system/    # Local UI primitives + tokens that power every slice
```

Add new Framer Motion experiments by creating a slice in `entities/` (data + UI), elevate it through a `features/` interaction, and compose it inside a widget or route segment. This keeps responsibilities localized while still benefiting from the App Router’s layout/streaming features.

### Shared utilities to know about

- `widgets/global-toolbar` exposes a reusable toolbar (`ThemeToggle`, `LanguageSwitcher`, optional "back home" link) that both the home route and motion playground consume. Drop it into any other route to keep the global controls consistent.
- `features/motion-demos/model/motion-demo-registry.ts` now exports helpers such as `getMotionDemoHref` so every nav item, CTA, or card can build canonical motion URLs with a single function.
- `features/motion-nav/lib/use-motion-nav-controls.ts` wraps the zustand store behind a hook that initializes sections and handles active-state syncing automatically.
- `shared/api/hooks/use-api-infinite-query.ts` mirrors `useApiQuery` but for paginated endpoints—pass `queryKey`, `initialPageParam`, `getNextPageParam`, and either a static `ApiFetchRequest` or a function that receives `pageParam`.
- `app/api/unsplash/orchids/route.ts` is a minimal proxy that fetches curated orchid imagery from Unsplash so the Ecology Matrix demo has reliable visuals without exposing API keys to the client.

### Environment variables

Create an `.env.local` in the repo root with any sensitive keys. The Ecology Matrix demo expects:

```
UNSPLASH_ACCESS_KEY=your_key_here
```

Without it the server route will fall back to the static specimens baked into the registry.

## Design system workspace

UI primitives that behave like a mini design system live inside `src/design-system`. Import them via
the `@design-system/*` path alias (`import { Card } from "@design-system";`) so that any slice can
share the same button, card, and typography styling without moving to a monorepo. Extend this folder
with additional tokens or components as the app grows—every consumer automatically gets the update.

## Internationalization

`next-intl` powers localized routes under `/[locale]` (`/en`, `/ko`). Messages live in
`src/i18n/messages/*.json`, the middleware (`middleware.ts`) keeps `/` redirected to the default
locale, and `[locale]/layout.tsx` loads the correct dictionary via `NextIntlClientProvider`. Add new
locales by dropping another JSON file + updating `src/i18n/routing.ts`.

## Deployment

When you're ready, deploy to any platform that supports Next.js (Vercel, Cloudflare, etc.). Make sure to run `npm run build` first to ensure the bundle compiles without errors.
