# Universal Parametric Evaluator

Score movies, series, and games across weighted parameters. Get a normalized score (0–100, /10, or 5-star) and share it via URL.

## Features

- **Movie / Series / Game** — each type has tailored weighted parameters
- **Step scales** — 2, 4, or 6 labeled steps per parameter (e.g. Awful → Masterpiece)
- **Exclusion toggles** — exclude parameters from scoring; auto-enables on interaction
- **Shareable URLs** — full state encoded in path + query string
- **i18n** — 8 languages with RTL support
- **Config-driven** — all params, weights, steps, and types live in `src/config/evaluation.json`

## Stack

[Preact](https://preactjs.com/) + [Vite](https://vitejs.dev/) with atomic design. No external UI libraries.

## Usage

```bash
npm install
npm run dev
```

Edit `src/config/evaluation.json` to customize parameters, weights, and types.

---

Built with [OpenCode](https://github.com/anomalyco/opencode).
