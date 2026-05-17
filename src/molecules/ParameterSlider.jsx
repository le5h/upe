import { useMemo, useRef, useState, useLayoutEffect } from 'preact/hooks'
import { WeightBadge } from '../atoms/WeightBadge'
import { accentColor } from '../utils/color'

export function ParameterSlider({ param, value, onChange, excluded, onToggleExcluded }) {
  const steps = param.steps || []
  const isBinary = steps.length === 2
  const min = steps[0]?.value ?? 0
  const max = steps[steps.length - 1]?.value ?? 1
  const rootRef = useRef(null)
  const trackRef = useRef(null)
  const fillRef = useRef(null)
  const glowRef = useRef(null)
  const thumbRef = useRef(null)
  const valueRef = useRef(null)
  const stepsRef = useRef(null)
  const originRef = useRef(null)
  const dragging = useRef(false)
  const [localValue, setLocalValue] = useState(value)

  const pct = ((localValue - min) / (max - min)) * 100

  const syncVisualPct = (p, val, cb) => {
    const s = p + '%'
    if (fillRef.current) fillRef.current.style.width = s
    if (glowRef.current) glowRef.current.style.width = s
    if (thumbRef.current) thumbRef.current.style.left = s
    if (rootRef.current) rootRef.current.style.setProperty('--param-accent', accentColor(val ?? min + (p / 100) * (max - min)))
    const v = val ?? min + (p / 100) * (max - min)
    if (valueRef.current && !isBinary) valueRef.current.textContent = v.toFixed(2)
    if (stepsRef.current) {
      const kids = stepsRef.current.children
      let best = -1, bestDist = Infinity
      for (let i = 0; i < kids.length; i++) {
        const sv = steps[i].value
        const d = Math.abs(sv - v)
        if (d < bestDist) { bestDist = d; best = i }
      }
      for (let i = 0; i < kids.length; i++) kids[i].classList.toggle('active', i === best)
    }
    if (cb) cb(v)
  }

  const syncVisual = (t, val, cb) => syncVisualPct(Math.round(t * 10000) / 100, val, cb)

  useLayoutEffect(() => {
    syncVisualPct(pct, localValue)
  }, [pct, localValue])

  const handleEnable = () => {
    if (excluded) onToggleExcluded()
  }

  const tFromX = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect()
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  }

  const handlePointerDown = (e) => {
    originRef.current = { x: e.clientX, y: e.clientY }
    dragging.current = false
    handleEnable()
    const t0 = tFromX(e.clientX)
    syncVisual(t0, min + t0 * (max - min))
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
        try { trackRef.current?.releasePointerCapture(e.pointerId) } catch (_) {}
        return
      }
      dragging.current = true
    }

    const tm = tFromX(e.clientX)
    const vm = min + tm * (max - min)
    syncVisual(tm, vm, (v) => onChange(param.key, isBinary ? (v >= (min + max) / 2 ? max : min) : Math.round(v * 100) / 100))
  }

  const handlePointerUp = (e) => {
    if (!originRef.current && !dragging.current) return
    originRef.current = null
    if (!dragging.current) return
    dragging.current = false
    const t = tFromX(e.clientX)
    const val = min + t * (max - min)
    const final = isBinary ? (val >= 0.5 ? max : min) : Math.round(val * 100) / 100
    setLocalValue(final)
    onChange(param.key, final)
    try { trackRef.current?.releasePointerCapture(e.pointerId) } catch (_) {}
  }

  const closestStep = useMemo(
    () => {
      if (isBinary && localValue === 0.5) return null
      return steps.reduce((a, b) =>
        Math.abs(b.value - localValue) < Math.abs(a.value - localValue) ? b : a
      )
    },
    [isBinary, steps, localValue]
  )

  const handleStepClick = (s) => {
    handleEnable()
    setLocalValue(s.value)
    onChange(param.key, s.value)
  }

  return (
    <div ref={rootRef} class={`param-slider ${excluded ? 'param-excluded' : ''}`}>
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
        <span class="param-value" ref={valueRef}>
          {isBinary ? (closestStep?.label ?? '\u2014') : localValue.toFixed(2)}
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
          <div
            ref={trackRef}
            class="slider"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => { dragging.current = false; setLocalValue(value) }}
          >
            <div class="slider-track">
              <div class="slider-glow" ref={glowRef}></div>
              <div class="slider-fill" ref={fillRef}></div>
            </div>
            <div class="slider-thumb" ref={thumbRef}></div>
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
