export function ScoreBar({ fraction, color }) {
  const pct = Math.round(fraction * 100)
  const bg = color ? `linear-gradient(90deg, rgb(${color}), rgb(${color}))` : undefined
  return (
    <div class="score-bar-track">
      <div class="score-bar-glow" style={{ width: pct + '%', background: bg }}></div>
      <div class="score-bar-fill" style={{ width: pct + '%', background: bg }}></div>
    </div>
  )
}
