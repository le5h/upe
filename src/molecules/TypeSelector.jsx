import config from '../config/evaluation.json'

export function TypeSelector({ value, onChange }) {
  return (
    <div class="type-buttons">
      {Object.entries(config.types).map(([key, t]) => (
        <button
          key={key}
          class={`type-btn ${key === value ? 'active' : ''}`}
          onClick={() => onChange(key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
