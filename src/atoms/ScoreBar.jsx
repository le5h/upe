export function ScoreBar({ fraction }) {
  const pct = Math.round(fraction * 100)
  return (
    <div class="score-bar-track">
      <div class="score-bar-glow" style={{ width: pct + '%' }}></div>
      <div class="score-bar-fill" style={{ width: pct + '%' }}></div>
    </div>
  )
}
