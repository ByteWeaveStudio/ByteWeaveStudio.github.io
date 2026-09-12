# ByteWeave Studio — byteweave.studio

Marketing site for ByteWeave Studio. Vite + React + TypeScript + Tailwind v4 +
React Router, prerendered to static HTML per route and deployed to GitHub Pages.

## Routes

| Path | Page |
|---|---|
| `/` | Home |
| `/work` | What we build — disciplines, scale, client roster |
| `/case-studies` | Index of the three detailed write-ups |
| `/case-studies/:slug` | Individual case study |
| `/products` | Netra3 and SplitPocket |
| `/blog` | Blog index (empty state until `posts.ts` has entries) |
| `/about` | Studio, principles, engagement model, method |

`/work` and `/case-studies` are deliberately different: Work answers "do you
build my kind of thing?", Case Studies tells three stories in depth.

## Commands

```bash
pnpm dev        # dev server
pnpm build      # typecheck → client build → SSR build → prerender into dist/
pnpm preview    # serve dist/ exactly as GitHub Pages will
pnpm typecheck
```

## How the build works

`pnpm build` runs four steps. The last one matters most:

1. `tsc --noEmit` — typecheck
2. `vite build` — client bundle into `dist/`
3. `vite build --ssr src/entry-server.tsx` — SSR bundle into `dist-ssr/`
4. `node scripts/prerender.mjs` — renders **every route** and writes each to
   `dist/<path>/index.html`, replacing the `<!--app-html-->` placeholder

Without step 4 a crawler (and the LinkedIn card scraper, which does not run
JavaScript) would receive an empty `<div id="root">`. The prerender also
applies per-route `<title>`, description, canonical and OG tags from
`src/seo.ts`, and generates `dist/sitemap.xml` and `dist/404.html` from the
same route list — so the build, the sitemap and the deploy check cannot
disagree about what exists.

Routes come from `src/seo.ts` (`ALL_PATHS`). **Adding a page means adding it
there**, or it will render client-side but never be prerendered.

`pnpm preview` runs a small plugin that mimics GitHub Pages: it resolves
`/foo` to `/foo/index.html` and serves `404.html` for anything unmatched.
Vite's default SPA fallback would return the homepage for every path and hide
whether the prerender actually worked.

`public/CNAME` and `public/.nojekyll` must ship with every deploy — without
them Pages drops the custom domain and strips underscore-prefixed assets. The
deploy workflow asserts both are present before uploading.

## Content: the no-fabrication rule

Every claim on the site lives in `src/content/` as typed data, never inline in
JSX, and every value traces to the owner-confirmed evidence in
`../Website/PRODUCT.md`.

Three deliberate absences:

- **`testimonials.ts` is an empty array.** The four testimonials on the old
  site are template filler (invented companies, theme stock avatars, and a
  "99% accuracy" claim supported by no case study). The Testimonials section
  returns `null` on an empty array — add one verified quote and it reappears.
- **Case studies with no verified number have `outcomes: []`.** The UI renders
  nothing rather than reaching for "significant improvement".
- **`posts.ts` is an empty array.** The blog is fully built and routed; the
  index renders an honest empty state until there is something real to publish.

`products.ts` marks SplitPocket `building`, not `live`: its own brief lists
testing and deployment as the remaining road to v1, so there is no App Store
or Play Store claim anywhere on the site. Netra3 is `live` (netra3.ai).

When adding anything, verify it against `PRODUCT.md` first.

## The 3D scenes

There are two, and they share everything that matters.

`src/three/Lazy3D.tsx` is the single place the gating rules live: a canvas
mounts only when motion is allowed, the viewport is >= 1024px, the element is
in view, WebGL exists, and the device has more than four cores. The scene chunk
is imported after first paint via `requestIdleCallback`. Each scene receives an
`active` prop and pauses its frameloop when scrolled past, so two canvases on
one page never both run.

**The Weave** (hero) — four layered plates — four layered plates showing data resolving from
raw samples → structured fields → a reasoning graph → an interface. The
metaphor comes from the ByteWeave mark itself (two interlaced ribbons).

`WeaveScene.tsx` (WebGL) and `WeavePoster.tsx` (static SVG) both project the
same layouts from `stages.ts`, so they cannot drift apart.

`WeaveVisual.tsx` decides between them. The canvas loads **only** when all of
these hold: not `prefers-reduced-motion`, viewport ≥ 1024px, hero in view,
WebGL available, and `hardwareConcurrency > 4`. Otherwise the poster stands in.

> The three.js chunk is ~235 kB gzipped and is never on the critical path.
> Do not add three to a manual chunk — naming it made Vite emit
> `<link rel="modulepreload">` for it, which downloaded the whole thing on
> every visit, mobile included, and silently defeated the gating above.

## Display scale

`html { font-size: 110% }` in `src/styles/base.css` is deliberate — the design
is tuned to read at what a browser calls 110% zoom, and that is baked in as
the default. A percentage keeps it proportional to whatever base size the
reader has configured rather than overriding it.

Because everything downstream is rem-based, type, spacing, the container and
the gutters all follow automatically. **Two things do not**, and both are
already compensated for:

- The `vw` terms inside the `clamp()` type sizes in `tokens.css` are scaled by
  the same 1.1 (`8.5vw` became `9.35vw`, and so on). Without that the display
  headings — which are viewport-driven at desktop widths — would be the only
  thing on the page that did not grow.
- A handful of layout-critical arbitrary pixel values were converted to rem
  (the Method rule and its nodes, the capability diagram max-width). The
  blurred wash blobs are still in px on purpose; they are decorative and the
  difference is imperceptible.

Media-query breakpoints intentionally do *not* shift: `rem` in a media query
resolves against the browser's base size, not this override, so `lg` is still
1024 real pixels.

## Assets

The logo had no vector source; `src/assets/logo/ByteWeaveMark.tsx` was traced
from `Logos/favicon.png`, fitted with lines and cubic Béziers, and verified by
rasterising back and pixel-diffing the original (0.357% of ink deviates —
boundary anti-aliasing only). `public/favicon.svg` is generated from the same
path data.

Brand accent is **`#1F48FF`**, measured from the logo artwork. The old site's
`#4928FD` was a leftover Bootstrap template default.

`--color-ink-tertiary` is **decorative only** (2.47:1, below AA). It must never
be used for text; `--color-ink-secondary` is the lightest AA-passing text tone.

Client logos render in full colour. Each carries a `scale` factor in
`clients.ts` because ink height varies from 52% to 86% of the canvas across
those files — at one uniform CSS height they differ by 1.65x in apparent size.
The factors are measured per logo and damped toward 1, since two-line lockups
legitimately carry more visual mass than single-line ones.

## Verification tooling

`scripts/` contains a dependency-free Chrome DevTools Protocol driver:

```bash
node scripts/shot.mjs <url> --out f.png [--w 1440] [--h 900] [--full]
                            [--reduced] [--webgl] [--scrollTo '#id']
                            [--settle 6000] [--eval '...'] [--evalFile f.js]
node scripts/kbd-test.mjs http://localhost:4173/ 390
```

`--webgl` enables software WebGL so the canvas path can be exercised headlessly
(plain headless Chrome has no WebGL, and correctly falls back to the poster).

**`--settle` matters for the 3D.** `--wait` elapses *before* `--scrollTo`, and a
lazily-mounted canvas does not exist, let alone animate, until it is scrolled
into view. Use `--settle` for the post-scroll wait — the extraction sequence
runs for 3.3s, so anything less shows a half-built frame and looks like a bug.

The driver reports console errors and uncaught exceptions after each run; an
exception inside a render loop is otherwise invisible in a screenshot.
