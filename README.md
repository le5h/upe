# Universal Parametric Evaluator

A **Vite + Preact** app using atomic design for scoring movies, series, and games across weighted parameters.

## Features

- **Type selection** — Movie / Series / Game with tailored parameter sets
- **Weighted parameters** — Each param has a weight multiplier; "I like it" carries the most weight
- **Step scales** — Params have 2, 4, or 6 evenly-spaced labeled steps (e.g. Awful → Masterpiece)
- **Exclusion toggles** — Checkbox per param to exclude from scoring; auto-enables on interaction
- **Shareable URLs** — State is encoded in the path + query string: `/movie/Avatar?s=0.8`
- **Score variants** — Main score (000–100), /10 rating, and 5-star display
- **All JSON-driven** — Params, weights, steps, types are configured in `src/config/evaluation.json`

## Stack

- [Preact](https://preactjs.com/) with atomic design (`atoms` → `molecules` → `organisms` → `templates` → `pages`)
- [Vite](https://vitejs.dev/) for dev/build
- No external UI libraries

## Usage

```bash
npm install
npm run dev
```

## Project structure

```
src/
  atoms/         # Smallest UI primitives (ScoreBar, WeightBadge)
  molecules/     # Composed units (ParameterSlider, ScoreSummary)
  organisms/     # Complex sections (ParameterList)
  templates/     # Page layouts (EvaluationPage)
  pages/         # Route entry points (Home)
  hooks/         # State & URL sync logic
  config/        # evaluation.json — all parameters, types, steps
```

## Customizing

Edit `src/config/evaluation.json` to tweak:

- **`paramDefs`** — Define parameter keys with label, type (subjective/objective), and step labels
- **`types`** — Associate parameters with weights per evaluation type

## Deploy to GitHub Pages

```bash
npm run build
```

Then push the `dist/` folder to the `gh-pages` branch of your repo:

```bash
npx gh-pages -d dist
```

Or use the [GitHub Actions deploy workflow](https://vite.dev/guide/static-deploy.html#github-pages).

The `base: './'` config and `public/404.html` (with sessionStorage redirect) enable client-side routing on GitHub Pages without a custom server.
