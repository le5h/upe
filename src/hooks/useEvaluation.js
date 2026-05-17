import { useState, useCallback, useMemo, useRef } from 'preact/hooks'
import config from '../config/evaluation.json'
import { loadByTypeAndName } from './useStorage'

const STORED_AUTHOR_KEY = 'eval_author'

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
  hash = (hash || location.hash.slice(1)).replace(/\|/g, ';').replace(/^#/, '')
  if (!hash) {
    const params = resolveParams('movie')
    return {
      type: 'movie',
      name: '',
      author: '',
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
  let authorOut = ''

  for (let i = 1; i < segs.length; i++) {
    const seg = decodeSafe(segs[i])
    const sep = seg.indexOf(':')
    if (sep === -1) continue
    const k = seg.slice(0, sep)
    const v = seg.slice(sep + 1)
    if (k === '_by') {
      authorOut = v
    } else if (k && v !== undefined && config.paramDefs[k]) {
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

  return { type, name, author: authorOut, values, excluded }
}

function buildUrl(type, name, values, excluded, params, author) {
  let hash = type
  if (name) hash += ':' + encodeURIComponent(name.replace(/ /g, '_'))
  if (author) hash += ';_by:' + encodeURIComponent(author)
  for (const p of params || []) {
    if (excluded?.has(p.key)) continue
    const v = values?.[p.key]
    if (v !== undefined) hash += ';' + p.key + ':' + Math.round(v * 100) / 100
  }
  return '#' + hash
}

export function useEvaluation({ translateParam } = {}) {
  const _skipPersistRef = useRef(false)

  const { type: initialType, name: initialName, author: initialAuthor, values: initialValues, excluded: initialExcluded } = parseHash()

  const [type, setTypeState] = useState(initialType)
  const [name, setNameState] = useState(initialName)
  const nameRef = useRef(initialName)
  const [author, setAuthorState] = useState(initialAuthor ? '' : (localStorage.getItem(STORED_AUTHOR_KEY) || ''))
  const [sharedAuthor, setSharedAuthor] = useState(initialAuthor || '')
  const sharedAuthorRef = useRef(initialAuthor || '')
  const [showByField, setShowByField] = useState(!initialAuthor)
  const [values, setValues] = useState(initialValues)
  const [excluded, setExcluded] = useState(initialExcluded)

  const adoptSharedAuthor = useCallback(() => {
    if (sharedAuthorRef.current) {
      const name = sharedAuthorRef.current
      setAuthorState(name)
      localStorage.setItem(STORED_AUTHOR_KEY, name)
      sharedAuthorRef.current = ''
    }
  }, [])

  const restore = useCallback((hash) => {
    _skipPersistRef.current = true
    const p = parseHash(hash)
    setTypeState(p.type)
    nameRef.current = p.name
    setNameState(p.name)
    setAuthorState(p.author ? '' : (localStorage.getItem(STORED_AUTHOR_KEY) || ''))
    sharedAuthorRef.current = p.author || ''
    setSharedAuthor(p.author || '')
    setShowByField(!p.author)
    setValues(p.values)
    setExcluded(p.excluded)
  }, [])

  const params = useMemo(() => {
    const raw = resolveParams(type)
    return translateParam ? raw.map(translateParam) : raw
  }, [type, translateParam])

  const setType = useCallback((newType) => {
    _skipPersistRef.current = true
    setTypeState(newType)
    const newParams = resolveParams(newType)
    const saved = nameRef.current && loadByTypeAndName(newType, nameRef.current)
    if (saved?.hash) {
      const p = parseHash(saved.hash)
      setValues(p.values)
      setExcluded(p.excluded)
    } else {
      setValues(Object.fromEntries(newParams.map(p => [p.key, defaultForParam(p)])))
      setExcluded(new Set(newParams.map(p => p.key)))
    }
    sharedAuthorRef.current = ''
    setSharedAuthor('')
    setShowByField(true)
    setAuthorState(localStorage.getItem(STORED_AUTHOR_KEY) || '')
  }, [])

  const setName = useCallback((n) => {
    nameRef.current = n
    setNameState(n)
    adoptSharedAuthor()
    setShowByField(true)
    setSharedAuthor('')
  }, [adoptSharedAuthor])

  const setAuthor = useCallback((a) => {
    setAuthorState(a)
    setSharedAuthor('')
    localStorage.setItem(STORED_AUTHOR_KEY, a)
  }, [])

  const setParamValue = useCallback((key, val) => {
    adoptSharedAuthor()
    setShowByField(true)
    setSharedAuthor('')
    setValues(prev => ({ ...prev, [key]: val }))
  }, [adoptSharedAuthor])

  const toggleExcluded = useCallback((key) => {
    adoptSharedAuthor()
    setShowByField(true)
    setSharedAuthor('')
    setExcluded(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [adoptSharedAuthor])

  const resetAll = useCallback(() => {
    _skipPersistRef.current = true
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

  return { type, setType, name, setName, author, setAuthor, sharedAuthor, showByField, params, values, setParamValue, excluded, toggleExcluded, totalScore, resetAll, restore, _skipPersistRef }
}

function scoreFromHash(hash) {
  const { type, values, excluded } = parseHash(hash)
  const params = resolveParams(type)
  let weightedSum = 0
  let totalWeight = 0
  for (const p of params) {
    if (excluded.has(p.key)) continue
    const v = values[p.key] ?? defaultForParam(p)
    weightedSum += v * p.weight
    totalWeight += p.weight
  }
  return totalWeight > 0 ? weightedSum / totalWeight : 0
}

function detailsFromHash(hash) {
  const { type, values, excluded } = parseHash(hash)
  const params = resolveParams(type)
  const top = params
    .filter(p => !excluded.has(p.key))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map(p => {
      const v = values[p.key] ?? 0.5
      const step = p.steps.reduce((a, b) =>
        Math.abs(b.value - v) < Math.abs(a.value - v) ? b : a
      )
      return { key: p.key, emoji: p.emoji, label: p.label, value: v, stepLabel: step.label }
    })
  return { type, top }
}

export { buildUrl, parseHash, scoreFromHash, detailsFromHash }
