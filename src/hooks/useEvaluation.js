import { useState, useCallback, useMemo, useRef, useEffect } from 'preact/hooks'
import config from '../config/evaluation.json'
import { loadByTypeAndName, save, remove } from './useStorage'

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
      values: Object.fromEntries(params.map(p => [p.key, 0.5])),
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
    if (k === 'by') {
      authorOut = v
    } else if (k && v !== undefined && config.paramDefs[k]) {
      values[k] = parseFloat(v)
    }
  }

  const excluded = new Set()
  for (const p of params) {
    if (!(p.key in values)) {
      values[p.key] = 0.5
      excluded.add(p.key)
    }
  }

  return { type, name, author: authorOut, values, excluded }
}

function buildUrl(type, name, values, excluded, params, author) {
  let hash = type
  if (name) hash += ':' + encodeURIComponent(name.replace(/ /g, '_'))
  if (author) hash += ';by:' + encodeURIComponent(author)
  for (const p of params || []) {
    if (excluded?.has(p.key)) continue
    const v = values?.[p.key]
    if (v !== undefined) hash += ';' + p.key + ':' + Math.round(v * 100) / 100
  }
  return '#' + hash
}

function computeScore(values, params, excluded) {
  let weightedSum = 0
  let totalWeight = 0
  for (const p of params) {
    if (excluded.has(p.key)) continue
    const v = values[p.key] ?? 0.5
    weightedSum += v * p.weight
    totalWeight += p.weight
  }
  return totalWeight > 0 ? weightedSum / totalWeight : 0
}

export function useEvaluation({ translateParam } = {}) {
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

  const paramsRef = useRef([])
  const _blockSave = useRef(false)
  const _firstRender = useRef(true)
  const _saveTimer = useRef(null)

  const adoptSharedAuthor = useCallback(() => {
    if (sharedAuthorRef.current) {
      setAuthorState(sharedAuthorRef.current)
      localStorage.setItem(STORED_AUTHOR_KEY, sharedAuthorRef.current)
      sharedAuthorRef.current = ''
    }
  }, [])

  const params = useMemo(() => {
    const raw = resolveParams(type)
    return translateParam ? raw.map(translateParam) : raw
  }, [type, translateParam])
  paramsRef.current = params

  useEffect(() => {
    if (_firstRender.current) { _firstRender.current = false; return }
    if (_blockSave.current) { _blockSave.current = false; return }
    clearTimeout(_saveTimer.current)
    _saveTimer.current = setTimeout(() => {
      const n = nameRef.current?.trim()
      if (!n) return
      const hash = buildUrl(type, n, values, excluded, paramsRef.current, '').replace(/^#/, '')
      save(type, n, hash)
    }, 300)
    return () => clearTimeout(_saveTimer.current)
  }, [values, excluded])

  const _loadState = useCallback((t, n, clearAuthor) => {
    _blockSave.current = true
    const ps = resolveParams(t)
    const saved = n && loadByTypeAndName(t, n)
    if (saved?.hash) {
      const p = parseHash(saved.hash)
      setValues(p.values)
      setExcluded(p.excluded)
    } else {
      setValues(Object.fromEntries(ps.map(p => [p.key, 0.5])))
      setExcluded(new Set(ps.map(p => p.key)))
    }
    if (clearAuthor) {
      sharedAuthorRef.current = ''
      setSharedAuthor('')
      setShowByField(true)
      setAuthorState(localStorage.getItem(STORED_AUTHOR_KEY) || '')
    }
  }, [])

  const setType = useCallback((newType) => {
    setTypeState(newType)
    _loadState(newType, nameRef.current, true)
  }, [_loadState])

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
    _loadState(type, null, false)
  }, [type, _loadState])

  const resetCurrent = useCallback(() => {
    const n = nameRef.current?.trim()
    if (n) remove(type, n)
    _loadState(type, null, false)
  }, [type, _loadState])

  const clearShared = useCallback(() => {
    _loadState(type, nameRef.current, true)
  }, [type, _loadState])

  const totalScore = useMemo(() => computeScore(values, params, excluded), [params, values, excluded])

  return { type, setType, name, setName, author, setAuthor, sharedAuthor, showByField, params, values, setParamValue, excluded, toggleExcluded, totalScore, resetAll, resetCurrent, clearShared }
}

function scoreFromHash(hash) {
  const { type, values, excluded } = parseHash(hash)
  const params = resolveParams(type)
  return computeScore(values, params, excluded)
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
