# Panto — Furniture Store Landing Page

**Live demo: https://panto-landing-beta.vercel.app**

Responsive landing page for a furniture store, built from a Figma design with **Vite, SCSS and TypeScript**, no UI
framework.

> Design: [Panto – Furniture Landing Page Design](https://www.figma.com/community/file/1061732519182077733/panto-furniture-landing-page-design)
> by **Kretya Studio**, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
> The code in this repository is my own implementation of that design.

## Stack

| Tool           | Why                                                              |
| -------------- | ---------------------------------------------------------------- |
| **Vite**       | dev server with HMR, production build, asset hashing             |
| **SCSS**       | design tokens, `fluid()` helper, breakpoint mixins, BEM partials |
| **TypeScript** | UI behaviour in strict mode, ~220 lines, zero dependencies       |

## Features

- **Interactive hero.** A glassmorphism search pill with `backdrop-filter`, pulsing hotspots on the product photo and a
  colour picker for the sofa built as an accessible radio group (arrow keys work).
- **Product tabs** that follow the WAI-ARIA tabs pattern: `role="tablist"`, roving `tabindex`, and Arrow/Home/End keys.
- **Carousels** built on native CSS scroll-snap. They swipe on touch devices, and the arrow buttons scroll by one card
  and disable themselves at the ends (`ResizeObserver` keeps them in sync).
- **Cart counter.** The "+" buttons update the header badge with a bump animation and announce the change to screen
  readers through an `aria-live` region.
- **Sticky header** that turns solid with a blur after scrolling, plus a full-screen mobile menu (Esc closes it,
  scroll is locked while it's open).
- **Scroll reveal** animations. All motion respects `prefers-reduced-motion`.
- **Design details** recreated in CSS: product images that break out of their cards, photos that bleed off the page
  edge, grey offset plates, and the testimonial card with a notch for the avatar (an SVG mask from the Figma shape).
- **Performance.** All images are WebP (15 files, about 680 KB instead of 9 MB of PNG/JPG), with responsive `srcset`
  for the hero, lazy loading below the fold and an SVG sprite for repeated icons.
- **Responsive** from 1440px down to 360px phones.

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build
```

## Project structure

```
panto/
├── index.html
├── public/
│   ├── favicon.svg
│   └── images/             # WebP exports from the Figma file
├── src/
│   ├── main.ts             # header, menu, search, swatches, tabs, carousels, cart, reveal
│   ├── vite-env.d.ts
│   └── styles/
│       ├── main.scss
│       ├── _tokens.scss    # colors, fonts, breakpoints, fluid()
│       ├── _base.scss      # reset + shared components (titles, buttons, rating)
│       ├── _header.scss
│       ├── _hero.scss
│       ├── _sections.scss  # why us, products, experience, materials, reviews
│       └── _footer.scss
├── tsconfig.json
└── vite.config.ts
```

## Notes on fidelity

- The design uses **Gilroy**, which is a commercial font. It is replaced with **Outfit**, the closest free geometric
  sans. Product cards keep **Inter** as in the design.
- The design's testimonials are in Indonesian. They are translated to English here to match the rest of the page.
- The design only has chairs, so the Beds / Sofa / Lamp tabs show a "coming soon" state.
