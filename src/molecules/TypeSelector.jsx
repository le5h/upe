import config from '../config/evaluation.json'
import { useI18n } from '../i18n/context'

export function TypeSelector({ value, onChange }) {
  const { t } = useI18n()
  return (
    <div class="type-buttons">
      {Object.entries(config.types).map(([key, type]) => (
        <button
          key={key}
          class={`type-btn ${key === value ? 'active' : ''}`}
          onClick={() => onChange(key)}
        >
          {t(type.label)}
        </button>
      ))}
    </div>
  )
}
