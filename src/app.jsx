import { I18nProvider } from './i18n/context'
import en from './i18n/en'
import ru from './i18n/ru'
import de from './i18n/de'
import ja from './i18n/ja'
import zh from './i18n/zh'
import es from './i18n/es'
import hi from './i18n/hi'
import ar from './i18n/ar'
import { Home } from './pages/Home'

export function App() {
  return (
    <I18nProvider translations={{ en, ru, de, ja, zh, es, hi, ar }}>
      <Home />
    </I18nProvider>
  )
}
