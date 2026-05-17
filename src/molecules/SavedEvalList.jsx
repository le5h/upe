import { useMemo } from 'preact/hooks'
import { listAll } from '../hooks/useStorage'
import { scoreFromHash, detailsFromHash } from '../hooks/useEvaluation'
import { useI18n } from '../i18n/context'
import { TYPE_ICONS } from '../icons'

export function SavedEvalList({ onSelect }) {
  const { t } = useI18n()
  const saved = useMemo(() => {
    return listAll().map(item => {
      const details = detailsFromHash(item.hash)
      return {
        ...item,
        score: scoreFromHash(item.hash),
        top: details.top,
      }
    })
  }, [])

  if (saved.length === 0) return null

  return (
    <section class="saved-list">
      <h2 class="saved-list-heading">{'\u{1F4BE}'} {t('Saved evaluations')}</h2>
      <div class="saved-list-scroll">
        {saved.map(item => (
          <button key={item.key} class="saved-card" onClick={() => onSelect(item.hash)}>
            <span class="saved-card-type">{TYPE_ICONS[item.type] || ''}</span>
            <span class="saved-card-info">
              <span class="saved-card-name">{item.name}</span>
              <span class="saved-card-params">
                {item.top.map(p => (
                  <span key={p.key} class="saved-card-param">{p.emoji} {t(p.stepLabel)}</span>
                ))}
              </span>
            </span>
            <span class="saved-card-score">{Math.round(item.score * 100)}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
