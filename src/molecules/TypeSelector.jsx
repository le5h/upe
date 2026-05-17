import config from '../config/evaluation.json'
import { useI18n } from '../i18n/context'
import { TYPE_ICONS } from '../icons'

export function TypeSelector({ value, onChange }) {
  const { t } = useI18n()
  return (
    <div class="type-buttons">
      {Object.entries(config.types).map(([key, type]) => (
          <button
            key={key}
            class={`type-btn ${key === value ? 'active' : ''}`}
            style={{ viewTransitionName: 'type-' + key }}
            onClick={() => onChange(key)}
          >
          {TYPE_ICONS[key] && <span class="type-icon">{TYPE_ICONS[key]}</span>}
          {t(type.label)}
        </button>
      ))}
    </div>
  )
}
