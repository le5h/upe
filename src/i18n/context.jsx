import { createContext } from 'preact'
import { useState, useCallback, useMemo, useContext, useEffect } from 'preact/hooks'

const LOAD_LOCALE = {
  en: () => import('./en'),
  ru: () => import('./ru'),
  de: () => import('./de'),
  ja: () => import('./ja'),
  zh: () => import('./zh'),
  es: () => import('./es'),
  hi: () => import('./hi'),
  ar: () => import('./ar'),
  ko: () => import('./ko'),
  it: () => import('./it'),
  pt: () => import('./pt'),
  fr: () => import('./fr'),
  pl: () => import('./pl'),
}

const RTL_LOCALES = new Set(['ar'])

function detectLocale(locales) {
  if (typeof window === 'undefined') return locales[0] || 'en'
  const saved = localStorage.getItem('locale')
  if (saved && locales.includes(saved)) return saved
  const browser = navigator.language?.split('-')[0]
  if (browser && locales.includes(browser)) return browser
  return locales[0] || 'en'
}

const I18nContext = createContext()

export function I18nProvider({ locales, children, initialLocale, initialTranslations }) {
  const [locale, setLocaleState] = useState(() => initialLocale || detectLocale(locales))
  const [translations, setTranslations] = useState(initialTranslations || {})

  useEffect(() => {
    const loader = LOAD_LOCALE[locale]
    if (!loader) return
    loader().then(mod => {
      setTranslations(mod.default || mod)
    }).catch(() => {
      if (locale !== 'en') {
        LOAD_LOCALE.en().then(mod => setTranslations(mod.default || mod))
      }
    })
  }, [locale])

  const setLocale = useCallback((l) => {
    setLocaleState(l)
    localStorage.setItem('locale', l)
  }, [])

  const value = useMemo(() => {
    const t = (key) => translations[key] ?? key
    return {
      locale,
      locales,
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
  }, [locale, locales, setLocale, translations])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  return useContext(I18nContext)
}
