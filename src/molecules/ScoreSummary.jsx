import { useRef, useState } from 'preact/hooks'
import { ScoreBar } from '../atoms/ScoreBar'
import { NameInput } from './NameInput'

export function ScoreSummary({ totalScore, name, setName, onReset }) {
  const num = Math.round(totalScore * 100)
  const formatted = String(num).padStart(3, '0')
  const outOf10 = (totalScore * 10).toFixed(1)
  const stars = Math.round(totalScore * 5)
  const [copied, setCopied] = useState(false)
  const timeout = useRef(null)

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      clearTimeout(timeout.current)
      timeout.current = setTimeout(() => setCopied(false), 2000)
    } catch { /* noop */ }
  }

  return (
    <div class="score-summary">
      <div class="score-top">
        <NameInput value={name} onChange={setName} />
        <div class="score-actions">
          <button onClick={share} class="btn btn-sm btn-share" title="Copy share URL">
            {copied ? 'Copied' : 'Share'}
          </button>
          <button onClick={onReset} class="btn btn-sm btn-reset" title="Reset all to defaults">Reset</button>
        </div>
      </div>
      <div class="score-mid">
        <div class="score-bar-wrap">
          <ScoreBar fraction={totalScore} />
        </div>
        <div class="score-digits">
          <span class="score-value">{formatted}</span>
          <span class="score-variant">{outOf10}/10</span>
          <span class="score-stars">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
        </div>
      </div>
    </div>
  )
}
