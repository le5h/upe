import { useEffect, useRef } from 'preact/hooks'
import { buildUrl } from './useEvaluation'

const PREFIX = 'eval:'

function loadItem(key) {
  const rest = key.slice(PREFIX.length)
  const colonIdx = rest.indexOf(':')
  if (colonIdx === -1) return null
  const type = rest.slice(0, colonIdx)
  const name = rest.slice(colonIdx + 1)
  let hash = localStorage.getItem(key)
  const byMatch = hash?.match(/(?:^|;)_by:([^;]+)/)
  const author = byMatch ? decodeURIComponent(byMatch[1]) : ''
  if (byMatch) hash = hash.replace(/;_by:[^;]+/, '')
  return { key, name, hash, type, author }
}

export function listAll() {
  const results = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key?.startsWith(PREFIX)) continue
    const item = loadItem(key)
    if (item) results.push(item)
  }
  return results.sort((a, b) => a.name.localeCompare(b.name))
}

export function search(query) {
  const q = query.toLowerCase().trim()
  if (!q) return []
  return listAll().filter(item => item.name.toLowerCase().includes(q))
}

export function save(type, name, hash) {
  if (!name || !name.trim()) return
  localStorage.setItem(PREFIX + type + ':' + name.trim(), hash)
}

export function remove(type, name) {
  localStorage.removeItem(PREFIX + type + ':' + name.trim())
}

export function useStorageSync({ type, name, author, values, excluded, params, skipRef }) {
  const ref = useRef({ type, name, author, params })
  ref.current = { type, name, author, params }
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (skipRef?.current) {
      skipRef.current = false
      return
    }
    const { type: t, name: n, params: p } = ref.current
    if (!n || !n.trim()) return
    const hash = buildUrl(t, n, values, excluded, p, '').replace(/^#/, '')
    save(t, n, hash)
  }, [values, excluded])
}
