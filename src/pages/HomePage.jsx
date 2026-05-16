import config from '../config/evaluation.json'

const icons = { movie: '\u{1F3AC}', series: '\u{1F4FA}', game: '\u{1F3AE}' }
const descriptions = {
  movie: '10 weighted params including Story, Acting, Cinematography, Fidelity, and more',
  series: '10 weighted params including Plot Consistency, Cliffhangers, Character Development, and more',
  game: '10 weighted params including Gameplay, Atmosphere, Optimization, Replayability, and more',
}

export function HomePage({ onSelect }) {
  return (
    <div class="home-page">
      <section class="hero">
        <h1 class="hero-title">
          <span class="hero-highlight">UPE</span>
        </h1>
        <p class="hero-sub">Universal Parametric Evaluator</p>
        <p class="hero-desc">
          Score movies, series, and games across weighted parameters. No gut feelings &mdash;
          just structured, shareable evaluations.
        </p>
      </section>

      <section class="type-cards">
        {Object.entries(config.types).map(([key, t]) => (
          <button key={key} class="type-card" onClick={() => onSelect(key)}>
            <span class="type-card-icon">{icons[key]}</span>
            <span class="type-card-label">{t.label}</span>
            <span class="type-card-desc">{descriptions[key]}</span>
          </button>
        ))}
      </section>

      <section class="seo">
        <h2>What is UPE?</h2>
        <p>
          UPE is a config-driven parametric evaluator that replaces vague ratings with
          transparent, weighted scoring. Pick a type, adjust sliders across multiple
          parameters, and get a normalized score you can share via URL.
        </p>

        <h2>Why use a parametric evaluator?</h2>
        <ul>
          <li>
            <strong>Compare two favorites objectively</strong> &mdash; Score both films
            with the same parameters and compare the breakdowns side by side instead of
            guessing which one you liked more.
          </li>
          <li>
            <strong>Avoid recency bias</strong> &mdash; Structured scoring prevents the
            &ldquo;last thing I watched&rdquo; from skewing your judgment.
          </li>
          <li>
            <strong>Share your reasoning</strong> &mdash; Every evaluation is encoded in
            the URL. Send your exact breakdown to friends: &ldquo;Here&rsquo;s why I gave
            it an 82.&rdquo;
          </li>
          <li>
            <strong>Settle debates</strong> &mdash; When you and a friend disagree,
            compare weighted scores to see exactly where opinions diverge&mdash;was it
            the Story or the Acting?
          </li>
          <li>
            <strong>Discover your taste</strong> &mdash; Over time, patterns emerge.
            Do you consistently value Atmosphere over Gameplay? The numbers don&rsquo;t lie.
          </li>
        </ul>

        <h2>Perfect for</h2>
        <div class="use-cases">
          <div class="use-case">
            <h3>Movie enthusiasts</h3>
            <p>Build your personal rating system beyond the 1&ndash;10 scale. Factor in Cinematography, Fidelity to source material, and Aftertaste.</p>
          </div>
          <div class="use-case">
            <h3>Series binge-watchers</h3>
            <p>Quantify what makes a great season. Track Plot Consistency, Cliffhangers, and Character Development across your watchlist.</p>
          </div>
          <div class="use-case">
            <h3>Gamers</h3>
            <p>Compare titles across genres with consistent criteria. Score Gameplay, Atmosphere, Optimization, and Replayability on the same scale.</p>
          </div>
          <div class="use-case">
            <h3>Reviewers &amp; creators</h3>
            <p>Produce transparent, shareable scores your audience can inspect. Every parameter, weight, and value is visible in the URL.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
