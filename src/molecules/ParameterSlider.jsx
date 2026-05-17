import { useRef } from 'preact/hooks'
import { WeightBadge } from '../atoms/WeightBadge'
import { accentColor } from '../utils/color'

export function ParameterSlider({ param, value, onChange, excluded, onToggleExcluded }) {
  const steps = param.steps || []
  const isBinary = steps.length === 2
  const min = steps[0]?.value ?? 0
  const max = steps[steps.length - 1]?.value ?? 1
  const rootRef = useRef(null)
  const trackRef = useRef(null)
  const stepsRef = useRef(null)
  const valueRef = useRef(null)
  const originRef = useRef(null)
  const dragging = useRef(false)
  const pressValRef = useRef(value)

  const v2p = (v) => ((v - min) / (max - min)) * 100

  const setVisual = (v) => {
    const p = v2p(v)
    const s = p + '%'
    rootRef.current.style.setProperty('--slider-pct', s)
    rootRef.current.style.setProperty('--param-accent', accentColor(v))
    if (!isBinary) valueRef.current.textContent = v.toFixed(2)
    if (stepsRef.current) {
      const kids = stepsRef.current.children
      let best = -1, bestDist = Infinity
      for (let i = 0; i < kids.length; i++) {
        const d = Math.abs(steps[i].value - v)
        if (d < bestDist) { bestDist = d; best = i }
      }
      for (let i = 0; i < kids.length; i++) kids[i].classList.toggle('active', i === best)
    }
  }

  const commitVal = (v) => isBinary ? (v >= (min + max) / 2 ? max : min) : Math.round(v * 100) / 100

  const tFromX = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect()
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  }

  const handlePointerDown = (e) => {
    originRef.current = { x: e.clientX, y: e.clientY }
    dragging.current = false
    if (excluded) onToggleExcluded()
    const v = min + tFromX(e.clientX) * (max - min)
    pressValRef.current = v
    setVisual(v)
    trackRef.current.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e) => {
    if (!originRef.current) return
    const dx = e.clientX - originRef.current.x
    const adx = Math.abs(dx)
    const ady = Math.abs(e.clientY - originRef.current.y)

    if (!dragging.current) {
      if (adx + ady < 8) return
      if (ady > adx) {
        originRef.current = null
        setVisual(value)
        try { trackRef.current?.releasePointerCapture(e.pointerId) } catch {}
        return
      }
      dragging.current = true
    }

    const v = min + tFromX(e.clientX) * (max - min)
    setVisual(v)
    onChange(param.key, commitVal(v))
  }

  const handlePointerUp = (e) => {
    originRef.current = null
    if (!dragging.current) {
      const final = commitVal(pressValRef.current)
      setVisual(final)
      onChange(param.key, final)
      try { trackRef.current?.releasePointerCapture(e.pointerId) } catch {}
      return
    }
    dragging.current = false
    const v = min + tFromX(e.clientX) * (max - min)
    const final = commitVal(v)
    setVisual(final)
    onChange(param.key, final)
    try { trackRef.current?.releasePointerCapture(e.pointerId) } catch {}
  }

  const handlePointerCancel = () => {
    dragging.current = false
    setVisual(value)
  }

  const handleStepClick = (s) => {
    if (excluded) onToggleExcluded()
    setVisual(s.value)
    onChange(param.key, s.value)
  }

  const pct = v2p(value)
  const closestStep = isBinary && value === 0.5
    ? null
    : steps.reduce((a, b) => Math.abs(b.value - value) < Math.abs(a.value - value) ? b : a)

  return (
    <div
      ref={rootRef}
      class={`param-slider ${excluded ? 'param-excluded' : ''}`}
      style={`--slider-pct:${pct}%;--param-accent:${accentColor(value)}`}
    >
      <div class="param-header">
        <label class="param-checkbox">
          <input type="checkbox" checked={!excluded} onInput={onToggleExcluded} />
        </label>
        <span class="param-label">{param.emoji && <span class="param-emoji">{param.emoji}</span>}{param.label}</span>
        <WeightBadge weight={param.weight} />
        <span class="param-value" ref={valueRef}>
          {isBinary ? (closestStep?.label ?? '\u2014') : value.toFixed(2)}
        </span>
      </div>
      {isBinary ? (
        <div class="binary-options">
          {steps.map(s => (
            <button key={s.value} class={`binary-btn ${s.value === value ? 'active' : ''}`} onClick={() => handleStepClick(s)}>
              {s.label}
            </button>
          ))}
        </div>
      ) : (
        <div class="slider-container">
          <div
            ref={trackRef}
            class="slider"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
          >
            <div class="slider-track">
              <div class="slider-glow"></div>
              <div class="slider-fill"></div>
            </div>
            <div class="slider-thumb"></div>
          </div>
          <div class="step-labels" ref={stepsRef}>
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
