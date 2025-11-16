### PPNM Debug Checklist

**Critical (break build/runtime)**
- [ ] Fix all TypeScript compile errors (see `npm run type-check` / `next build` logs)
- [ ] Fix all ESLint errors blocking `npm run lint`
- [ ] Ensure Husky/setup script never breaks `npm install` in CI/Vercel
- [ ] Confirm `next.config.ts` and `src/app/layout.tsx` are free of conflict markers and are valid
- [ ] Fix any Next.js App Router dynamic params issues (e.g. `sync-dynamic-apis` for `regions/[region]`)

**High (a11y / Next.js rules / bad patterns)**
- [ ] Resolve critical `jsx-a11y/*` violations (labels, anchors, alt text, interactive elements)
- [ ] Fix `@next/next/*` violations (images, links, scripts)
- [ ] Ensure all Headless UI usage is client-safe and not wrapped in `__barrel_optimize__`
- [ ] Replace invalid anchor/button usages and internal navigation patterns

**Medium (stylistic / noise / DX)**
- [ ] Clean up unused variables, unused imports, and noisy `console.log` in production code
- [ ] Prefer specific types over `any` in public APIs and shared utilities
- [ ] Normalize import order and path usage where lint rules require it

> This checklist is maintained by the automated debug pass. Tackle Critical items first, then High, then Medium.


