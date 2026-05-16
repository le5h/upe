import { createContext } from 'preact'
import { useState, useCallback, useMemo, useContext } from 'preact/hooks'

function detectLocale(translations) {
  const saved = localStorage.getItem('locale')
  if (saved && translations[saved]) return saved
  const browser = navigator.language?.split('-')[0]
  if (browser && translations[browser]) return browser
  return Object.keys(translations)[0] || 'en'
}

const RTL_LOCALES = new Set(['ar'])

const I18nContext = createContext()

export function I18nProvider({ translations, children }) {
  const [locale, setLocaleState] = useState(() => detectLocale(translations))

  const setLocale = useCallback((l) => {
    setLocaleState(l)
    localStorage.setItem('locale', l)
  }, [])

  const value = useMemo(() => {
    const strings = translations[locale] || {}
    const t = (key) => strings[key] ?? key
    return {
      locale,
      locales: Object.keys(translations),
      setLocale,
      rtl: RTL_LOCALES.has(locale),
      t,
      translateParam(param) {
        return {
          ...param,
          label: t(param.label),
          steps: param.steps.map(s => ({ ...s, label: t(s.label) })),
        }
      },
    }
  }, [locale, translations, setLocale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  return useContext(I18nContext)
}
