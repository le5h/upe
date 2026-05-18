import { renderToString } from 'preact-render-to-string'
import en from './i18n/en'
import { I18nProvider } from './i18n/context'
import { Home } from './pages/Home'

const LOCALES = ['en', 'ru', 'de', 'ja', 'zh', 'es', 'hi', 'ar', 'ko', 'it', 'pt', 'fr', 'pl']

export async function prerender() {
  const translations = en.default || en

  const html = renderToString(
    <I18nProvider locales={LOCALES} initialLocale="en" initialTranslations={translations}>
      <Home />
    </I18nProvider>
  )

  return {
    html,
    head: {
      lang: 'en',
      title: 'UPE — Universal Parametric Evaluator',
    },
  }
}
