import { useI18n } from '../i18n/context'

const LOCALE_NAMES = {
  en: 'English',
  ru: 'Русский',
  de: 'Deutsch',
  ja: '日本語',
  zh: '中文',
  es: 'Español',
  hi: 'हिन्दी',
  ar: 'العربية',
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
