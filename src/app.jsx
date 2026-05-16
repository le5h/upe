import { I18nProvider } from './i18n/context'
import { Home } from './pages/Home'

const LOCALES = ['en', 'ru', 'de', 'ja', 'zh', 'es', 'hi', 'ar']

export function App() {
  return (
    <I18nProvider locales={LOCALES}>
      <Home />
    </I18nProvider>
  )
}
