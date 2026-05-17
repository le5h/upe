import { useMemo } from 'preact/hooks'
import { listAll } from '../hooks/useStorage'
import { scoreFromHash } from '../hooks/useEvaluation'
import config from '../config/evaluation.json'

const icons = { movie: '\u{1F3AC}', series: '\u{1F4FA}', game: '\u{1F3AE}' }

export function SavedEvalList({ onSelect }) {
  const saved = useMemo(() => {
    return listAll().map(item => ({
      ...item,
      score: scoreFromHash(item.hash),
    }))
  }, [])

  if (saved.length === 0) return null

  return (
    <section class="saved-list">
      <h2 class="saved-list-heading">{'\u{1F4BE}'} Saved evaluations</h2>
      <div class="saved-list-scroll">
        {saved.map(item => (
          <button key={item.key} class="saved-card" onClick={() => onSelect(item.hash)}>
            <span class="saved-card-type">{icons[item.type] || ''}</span>
            <span class="saved-card-info">
              <span class="saved-card-name">{item.name}</span>
              {item.author && <span class="saved-card-by">{item.author}</span>}
            </span>
            <span class="saved-card-score">{Math.round(item.score * 100)}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
