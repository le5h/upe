import { useRef, useState } from 'preact/hooks'
import { ScoreBar } from '../atoms/ScoreBar'
import { NameInput } from './NameInput'
import { useI18n } from '../i18n/context'
import { Trans } from '../i18n/Trans'
import { buildUrl } from '../hooks/useEvaluation'
import { accentColor } from '../utils/color'

export function ScoreSummary({ totalScore, name, setName, author, setAuthor, sharedAuthor, showByField, onReset, nameInputRef, type, params, values, excluded, thumbUrl }) {
  const { t, locale } = useI18n()
  const num = Math.round(totalScore * 100)
  const formatted = String(num).padStart(3, '0')
  const outOf10 = (totalScore * 10).toFixed(1)
  const stars = Math.round(totalScore * 5)
  const [copied, setCopied] = useState(false)
  const timeout = useRef(null)
  const scoreColor = accentColor(totalScore)
  const glowIntensity = 0.04 + totalScore * 0.18

  const share = async () => {
    try {
      const url = buildUrl(type, name, values, excluded, params, author)
      await navigator.clipboard.writeText(window.location.origin + window.location.pathname + url)
      setCopied(true)
      clearTimeout(timeout.current)
      timeout.current = setTimeout(() => setCopied(false), 2000)
    } catch { /* noop */ }
  }

  return (
    <div class="score-summary" style={`--param-accent:${scoreColor};--glow:${glowIntensity}`}>
      {thumbUrl && <a href={`https://${locale}.wikipedia.org/wiki/${encodeURIComponent(name.replace(/\s+/g, '_'))}`} target="_blank" rel="noopener noreferrer"><img class="score-thumb" src={thumbUrl} alt={name} /></a>}
      <div class="score-body">
        <div class="flex-row">
          <NameInput inputRef={nameInputRef} value={name} onChange={setName} />
        </div>
        <div class="score-byline">
          {showByField && <input
            type="text"
            value={author}
            onInput={e => setAuthor(e.currentTarget.value)}
            placeholder={t('by: anonymous')}
            class="score-author"
          />}
          {sharedAuthor ? <span class="shared-by">{'\u{1F517}'} {sharedAuthor}</span> : (
            <button onClick={share} class="btn btn-sm btn-share" title={t('Share')} disabled={!author||!name}>
              {copied ? <Trans>Copied!</Trans> : <>{'\u{1F517}'} <Trans>Share</Trans></>}
            </button>
          )}
        </div>
        <div className="flex gap space-between">
          <div class="score-digits">
            <span class="score-value" style={`color: rgb(${scoreColor})`}>{formatted}</span>
            <span class="score-stars" style={`color: rgb(${scoreColor})`}>{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
            <span class="score-variant">{outOf10}/10</span>
          </div>
          <button onClick={onReset} class="btn btn-sm btn-reset" title={t('Reset')}>{'\u{1F504}'} <Trans>Reset</Trans></button>
        </div>
        <div class="score-bar-wrap">
          <ScoreBar fraction={totalScore} color={scoreColor} />
        </div>
      </div>
    </div>
  )
}
