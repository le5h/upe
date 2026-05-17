# Universal Parametric Evaluator

Score movies, series, and games across weighted parameters. Get a normalized score (0–100, /10, 5-star) and share it via URL. Built with [OpenCode](https://github.com/anomalyco/opencode).

## Features

- **Movie / Series / Game** — each type has tailored weighted parameters
- **Step scales** — 2, 4, or 6 labeled steps per parameter (e.g. Awful → Masterpiece)
- **Exclusion toggles** — exclude a parameter to gray it out; re-enable to restore accent-colored border
- **Dynamic accent** — every parameter and the total score card gets a color gradient that responds to the score
- **Author field** — persisted in localStorage, shared via `?by=` in URL; hidden on shared links, reappears on edit
- **Shareable URLs** — full evaluation state + author encoded in the URL hash; one click to copy
- **Saved evaluations** — localStorage-backed, listed on the home page with top-3 param previews
- **Wikipedia title suggestions** — autocomplete searches English Wikipedia first, falls back to current locale
- **Wikipedia thumbnails** — when a title is selected, the article thumbnail appears inside the score card
- **i18n** — 12 languages (en, ru, de, ja, zh, es, hi, ar, ko, it, pt, fr) with RTL support for Arabic
- **Custom slider** — div-based slider with pointer events, `touch-action: pan-y`, real-time visual updates via DOM refs, tap-to-seek, vertical-gesture rejection
- **Config-driven** — all params, weights, steps, and types live in `src/config/evaluation.json`

## Stack

[Preact](https://preactjs.com/) + [Vite](https://vitejs.dev/) with atomic design. No external UI libraries.

## Usage

```bash
npm install
npm run dev
```

Edit `src/config/evaluation.json` to customize parameters, weights, and types.
