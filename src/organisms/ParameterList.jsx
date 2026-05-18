import { memo } from 'preact/compat'
import { useCallback } from 'preact/hooks'
import { ParameterSlider } from '../molecules/ParameterSlider'
import { useI18n } from '../i18n/context'
import { Trans } from '../i18n/Trans'

const ParamSlider = memo(ParameterSlider)

function SliderWrap({ param, value, onChange, excluded, onToggleExcluded }) {
  const toggle = useCallback(() => onToggleExcluded(param.key), [onToggleExcluded, param.key])
  return <ParamSlider param={param} value={value} onChange={onChange} excluded={excluded} onToggleExcluded={toggle} />
}

function Section({ title, params, values, onChange, excluded, onToggleExcluded }) {
  if (params.length === 0) return null
  const sorted = [...params].sort((a, b) => b.weight - a.weight)
  return (
    <div class="param-section">
      <h3 class="section-title">{title}</h3>
      {sorted.map(p => (
        <SliderWrap
          key={p.key}
          param={p}
          value={values[p.key] ?? 0.5}
          onChange={onChange}
          excluded={excluded.has(p.key)}
          onToggleExcluded={onToggleExcluded}
        />
      ))}
    </div>
  )
}

export function ParameterList({ params, values, onChange, excluded, onToggleExcluded }) {
  const { t } = useI18n()
  const subjective = params.filter(p => (p.type || 'subjective') === 'subjective')
  const objective = params.filter(p => (p.type || 'subjective') === 'objective')

  return (
    <div class="parameter-list">
      <Section title={'\u{1F4AD} ' + t('Subjective')} params={subjective} values={values} onChange={onChange} excluded={excluded} onToggleExcluded={onToggleExcluded} />
      <Section title={'\u{1F4CB} ' + t('Objective')} params={objective} values={values} onChange={onChange} excluded={excluded} onToggleExcluded={onToggleExcluded} />
    </div>
  )
}
