import { ParameterSlider } from '../molecules/ParameterSlider'

function Section({ title, params, values, onChange, excluded, onToggleExcluded }) {
  if (params.length === 0) return null
  const sorted = [...params].sort((a, b) => b.weight - a.weight)
  return (
    <div class="param-section">
      <h3 class="section-title">{title}</h3>
      {sorted.map(p => (
        <ParameterSlider
          key={p.key}
          param={p}
          value={values[p.key] ?? 0.5}
          onChange={onChange}
          excluded={excluded.has(p.key)}
          onToggleExcluded={() => onToggleExcluded(p.key)}
        />
      ))}
    </div>
  )
}

export function ParameterList({ params, values, onChange, excluded, onToggleExcluded }) {
  const subjective = params.filter(p => (p.type || 'subjective') === 'subjective')
  const objective = params.filter(p => (p.type || 'subjective') === 'objective')

  return (
    <div class="parameter-list">
      <Section title="Subjective" params={subjective} values={values} onChange={onChange} excluded={excluded} onToggleExcluded={onToggleExcluded} />
      <Section title="Objective" params={objective} values={values} onChange={onChange} excluded={excluded} onToggleExcluded={onToggleExcluded} />
    </div>
  )
}
