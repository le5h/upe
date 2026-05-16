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

function defaultForParam(_p) {
  return 0.5
}

function decodeSafe(s) {
  try { return decodeURIComponent(s) } catch { return s }
}

function parseHash(hash) {
  hash = (hash || location.hash.slice(1)).replace(/\|/g, ';')
  if (!hash) {
    const params = resolveParams('movie')
    return {
      type: 'movie',
      name: '',
      values: Object.fromEntries(params.map(p => [p.key, defaultForParam(p)])),
      excluded: new Set(params.map(p => p.key)),
    }
  }

  const segs = hash.split(';')
  const first = decodeSafe(segs[0])
  const ci = first.indexOf(':')
  const typeRaw = ci === -1 ? first : first.slice(0, ci)
  const type = config.types[typeRaw] ? typeRaw : 'movie'
  let name = ''
  if (ci !== -1) {
    name = decodeSafe(first.slice(ci + 1)).replace(/_/g, ' ')
  }
  const params = resolveParams(type)
  const values = {}

  for (let i = 1; i < segs.length; i++) {
    const seg = decodeSafe(segs[i])
    const sep = seg.indexOf(':')
    if (sep === -1) continue
    const k = seg.slice(0, sep)
    const v = seg.slice(sep + 1)
    if (k && v !== undefined && config.paramDefs[k]) {
      values[k] = parseFloat(v)
    }
  }

  const excluded = new Set()
  for (const p of params) {
    if (!(p.key in values)) {
      values[p.key] = defaultForParam(p)
      excluded.add(p.key)
    }
  }

  return { type, name, values, excluded }
}

function buildUrl(type, name, values, excluded, params) {
  let hash = type
  if (name) hash += ':' + encodeURIComponent(name.replace(/ /g, '_'))
  for (const p of params || []) {
    if (excluded?.has(p.key)) continue
    const v = values?.[p.key]
    if (v !== undefined) hash += ';' + p.key + ':' + Math.round(v * 100) / 100
  }
  return '#' + hash
}

export function useEvaluation({ translateParam } = {}) {
  const { type: initialType, name: initialName, values: initialValues, excluded: initialExcluded } = parseHash()

  const [type, setTypeState] = useState(initialType)
  const [name, setNameState] = useState(initialName)
  const [values, setValues] = useState(initialValues)
  const [excluded, setExcluded] = useState(initialExcluded)

  const params = useMemo(() => {
    const raw = resolveParams(type)
    return translateParam ? raw.map(translateParam) : raw
  }, [type, translateParam])

  const setType = useCallback((newType) => {
    setTypeState(newType)
    setNameState('')
    const newParams = resolveParams(newType)
    setValues(Object.fromEntries(newParams.map(p => [p.key, defaultForParam(p)])))
    setExcluded(new Set(newParams.map(p => p.key)))
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
    setExcluded(new Set(ps.map(p => p.key)))
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
