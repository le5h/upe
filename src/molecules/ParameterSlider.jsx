import { useMemo } from 'preact/hooks'
import { WeightBadge } from '../atoms/WeightBadge'

const ACCENT_STOPS = [
  [0, [239, 68, 68]],
  [0.25, [249, 115, 22]],
  [0.5, [52, 211, 153]],
  [0.75, [59, 130, 246]],
  [1, [124, 92, 252]],
]

function accentColor(t) {
  const stops = ACCENT_STOPS
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const lo = stops[i - 1], hi = stops[i]
      const f = (t - lo[0]) / (hi[0] - lo[0])
      const r = Math.round(lo[1][0] + (hi[1][0] - lo[1][0]) * f)
      const g = Math.round(lo[1][1] + (hi[1][1] - lo[1][1]) * f)
      const b = Math.round(lo[1][2] + (hi[1][2] - lo[1][2]) * f)
      return `${r},${g},${b}`
    }
  }
  return `${stops[stops.length - 1][1][0]},${stops[stops.length - 1][1][1]},${stops[stops.length - 1][1][2]}`
}

export function ParameterSlider({ param, value, onChange, excluded, onToggleExcluded }) {
  const steps = param.steps || []
  const isBinary = steps.length === 2
  const min = steps[0]?.value ?? 0
  const max = steps[steps.length - 1]?.value ?? 1

  const closestStep = useMemo(
    () => {
      if (isBinary && value === 0.5) return null
      return steps.reduce((a, b) =>
        Math.abs(b.value - value) < Math.abs(a.value - value) ? b : a
      )
    },
    [isBinary, steps, value]
  )

  const accent = accentColor(value)

  const handleEnable = () => {
    if (excluded) onToggleExcluded()
  }

  const handleSlider = (e) => {
    handleEnable()
    const raw = parseFloat(e.currentTarget.value)
    if (isBinary) {
      onChange(param.key, raw >= 0.5 ? max : min)
    } else {
      onChange(param.key, raw)
    }
  }

  const handleStepClick = (s) => {
    handleEnable()
    onChange(param.key, s.value)
  }

  return (
    <div class={`param-slider ${excluded ? 'param-excluded' : ''}`} style={`--param-accent:${accent}`}>
      <div class="param-header">
        <label class="param-checkbox">
          <input
            type="checkbox"
            checked={!excluded}
            onInput={onToggleExcluded}
          />
        </label>
        <span class="param-label">{param.emoji && <span class="param-emoji">{param.emoji}</span>}{param.label}</span>
        <WeightBadge weight={param.weight} />
        <span class="param-value">
          {isBinary ? (closestStep?.label ?? '\u2014') : value.toFixed(2)}
        </span>
      </div>
      {isBinary ? (
        <div class="binary-options">
          {steps.map(s => (
            <button
              key={s.value}
              class={`binary-btn ${s.value === value ? 'active' : ''}`}
              onClick={() => handleStepClick(s)}
            >
              {s.label}
            </button>
          ))}
        </div>
      ) : (
        <div class="slider-container">
          <input
            type="range"
            min={min}
            max={max}
            step={0.01}
            value={value}
            onInput={handleSlider}
            class="slider"
            style={{ '--fill': ((value - min) / (max - min)) * 100 + '%' }}
          />
          <div class="step-labels">
            {steps.map(s => (
              <span
                key={s.value}
                class={`step-tick ${closestStep && s.value === closestStep.value ? 'active' : ''}`}
                onClick={() => handleStepClick(s)}
              >
                {s.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
