import { useState, useEffect, useRef } from 'preact/hooks'
import { useI18n } from '../i18n/context'
import { search } from '../hooks/useStorage'
import config from '../config/evaluation.json'

export function NameInput({ value, onChange, inputRef, onRestore }) {
  const { t } = useI18n()
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
    timer.current = setTimeout(() => {
      const results = search(value)
      setSuggestions(results)
      setOpen(results.length > 0)
    }, 200)
    return () => clearTimeout(timer.current)
  }, [value])

  useEffect(() => {
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const pick = (item) => {
    setOpen(false)
    onRestore(item.hash)
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
          {suggestions.map(item => (
            <li key={item.key} onClick={() => pick(item)} class="suggestion-item">
              <span class="suggestion-type">{config.types[item.type]?.label || item.type}</span>
              <span class="suggestion-name">{item.name}</span>
              {item.author && <span class="suggestion-by">{item.author}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
