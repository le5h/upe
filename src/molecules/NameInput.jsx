import { useState, useEffect, useRef } from 'preact/hooks'
import { useI18n } from '../i18n/context'

function wikiSearch(lang, q) {
  return fetch(`https://${lang}.wikipedia.org/w/api.php?action=opensearch&limit=8&namespace=0&format=json&origin=*&search=${encodeURIComponent(q)}`)
    .then(r => r.ok ? r.json() : null)
    .then(d => d?.[1] || [])
}

export function NameInput({ value, onChange, inputRef }) {
  const { t, locale } = useI18n()
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const timer = useRef(null)
  const wrapRef = useRef(null)
  const userInteracted = useRef(false)

  useEffect(() => {
    clearTimeout(timer.current)
    if (!value || !value.trim()) {
      setSuggestions([])
      setOpen(false)
      return
    }
    if (!userInteracted.current) return
    timer.current = setTimeout(async () => {
      const q = value.trim()
      const en = await wikiSearch('en', q)
      if (en.length > 0) { setSuggestions(en); setOpen(true); return }
      if (locale !== 'en') {
        const loc = await wikiSearch(locale, q)
        setSuggestions(loc); setOpen(loc.length > 0)
      } else {
        setSuggestions([]); setOpen(false)
      }
    }, 200)
    return () => clearTimeout(timer.current)
  }, [value, locale])

  useEffect(() => {
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const pick = (title) => {
    setOpen(false)
    onChange(title)
  }

  return (
    <div class="name-input-wrap" ref={wrapRef}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onInput={e => { userInteracted.current = true; onChange(e.currentTarget.value) }}
        placeholder={t('Name your subject...')}
        class="score-name"
      />
      {open && (
        <ul class="suggestions-dropdown">
          {suggestions.map(title => (
            <li key={title} onClick={() => pick(title)} class="suggestion-item">
              <span class="suggestion-name">{title}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
