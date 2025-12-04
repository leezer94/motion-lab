# Framer Motion Examples

Next.js 16 playground configured with ESLint, Prettier, Tailwind CSS, and Framer Motion so you can iterate on motion experiments quickly.

## Tech stack

- [Next.js App Router](https://nextjs.org/docs) with the latest stable runtime
- [Framer Motion](https://www.framer.com/motion/) for animation primitives
- Tailwind CSS v4 preview styles from `create-next-app`
- ESLint flat config + Prettier for consistent formatting

## Development

```bash
npm run dev        # start the local dev server on http://localhost:3000
npm run build      # create a production build
npm run start      # run the production build locally
npm run lint       # lint the entire project with ESLint
npm run format     # format every source file with Prettier
npm run format:check  # verify formatting without writing changes
```

Framer Motion is already imported inside `src/app/page.tsx`. Add more demos under `src/components` and import them into the page (or route segments) to keep experiments isolated.

## Deployment

When you're ready, deploy to any platform that supports Next.js (Vercel, Cloudflare, etc.). Make sure to run `npm run build` first to ensure the bundle compiles without errors.
