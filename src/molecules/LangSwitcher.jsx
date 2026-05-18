import { useI18n } from '../i18n/context'

const LOCALE_NAMES = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  pt: 'Português',
  zh: '中文',
  hi: 'हिन्दी',
  ar: 'العربية',
  ko: '한국어',
  ja: '日本語',
  ru: 'Русский',
  pl: 'Polski',
}

export function LangSwitcher() {
  const { locale, setLocale } = useI18n()
  return (
    <span class="lang-wrap"><span class="lang-icon">{'\u{1F310}'}</span><select class="lang-dropdown" value={locale} onChange={e => setLocale(e.target.value)}>
      {Object.entries(LOCALE_NAMES).map(([code, name]) => (
        <option key={code} value={code}>{name}</option>
      ))}
    </select></span>
  )
}
