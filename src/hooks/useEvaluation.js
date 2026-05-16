import { useState, useCallback, useMemo } from 'preact/hooks'
import config from '../config/evaluation.json'

function computeSteps(labels) {
  return labels.map((label, i, arr) => ({
    value: arr.length > 1 ? i / (arr.length - 1) : 0.5,
    label
  }))
}

function enrichParam(raw) {
  const def = config.paramDefs[raw.key]
  return { ...def, ...raw, steps: computeSteps(def?.steps || []) }
}

function resolveParams(type) {
  const typeDef = config.types[type]
  if (!typeDef) return []
  return typeDef.parameters.map(enrichParam)
}

function parsePath() {
  const parts = window.location.pathname.replace(/\/$/, '').split('/').filter(Boolean)
  const type = parts[0] && config.types[parts[0]] ? parts[0] : 'movie'
  const name = parts.length > 1 ? decodeURIComponent(parts.slice(1).join('/')).replace(/_/g, ' ') : ''
  return { type, name }
}

function parseSearch(params) {
  const search = new URL(window.location.href).searchParams
  const hasParams = [...search.keys()].length > 0
  const values = {}
  const excluded = new Set()

  for (const p of params) {
    const v = search.get(p.key)
    if (v !== null) {
      values[p.key] = parseFloat(v)
    } else {
      values[p.key] = defaultForParam(p)
      if (hasParams || p.key !== 'lk') excluded.add(p.key)
    }
  }
  return { values, excluded }
}

function defaultForParam(p) {
  const steps = p.steps || []
  const mid = Math.floor((steps.length - 1) / 2)
  return steps[mid]?.value ?? 0.5
}

function buildUrl(type, name, values, excluded, params) {
  const path = name
    ? `/${type}/${encodeURIComponent(name.replace(/ /g, '_'))}`
    : `/${type}`
  const search = new URLSearchParams()
  for (const p of params || []) {
    if (excluded?.has(p.key)) continue
    const v = values?.[p.key]
    if (v !== undefined) search.set(p.key, String(Math.round(v * 100) / 100))
  }
  const qs = search.toString()
  return qs ? path + '?' + qs : path
}

export function useEvaluation() {
  const { type: initialType, name: initialName } = parsePath()
  const initialParams = resolveParams(initialType)
  const { values: initialValues, excluded: initialExcluded } = parseSearch(initialParams)

  const [type, setTypeState] = useState(initialType)
  const [name, setNameState] = useState(initialName)
  const [values, setValues] = useState(initialValues)
  const [excluded, setExcluded] = useState(initialExcluded)

  const params = useMemo(() => resolveParams(type), [type])

  const setType = useCallback((newType) => {
    setTypeState(newType)
    setNameState('')
    const newParams = resolveParams(newType)
    setValues(Object.fromEntries(newParams.map(p => [p.key, defaultForParam(p)])))
    setExcluded(new Set(newParams.filter(p => p.key !== 'lk').map(p => p.key)))
  }, [])

  const setName = useCallback((n) => {
    setNameState(n)
  }, [])

  const setParamValue = useCallback((key, val) => {
    setValues(prev => ({ ...prev, [key]: val }))
  }, [])

  const toggleExcluded = useCallback((key) => {
    setExcluded(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const resetAll = useCallback(() => {
    const ps = resolveParams(type)
    setValues(Object.fromEntries(ps.map(p => [p.key, defaultForParam(p)])))
    setExcluded(new Set(ps.filter(p => p.key !== 'lk').map(p => p.key)))
  }, [type])

  const totalScore = useMemo(() => {
    let weightedSum = 0
    let totalWeight = 0
    for (const p of params) {
      if (excluded.has(p.key)) continue
      const v = values[p.key] ?? defaultForParam(p)
      weightedSum += v * p.weight
      totalWeight += p.weight
    }
    return totalWeight > 0 ? weightedSum / totalWeight : 0
  }, [params, values, excluded])

  return { type, setType, name, setName, params, values, setParamValue, excluded, toggleExcluded, totalScore, resetAll }
}

export { buildUrl }
