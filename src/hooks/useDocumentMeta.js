import { useEffect } from 'preact/hooks'
import { useI18n } from '../i18n/context'

export function useDocumentMeta() {
  const { t, locale, rtl } = useI18n()

  useEffect(() => {
    document.documentElement.dir = rtl ? 'rtl' : 'ltr'
    document.title = t('pageTitle')
    const meta = document.querySelector('meta[name="description"]') || (() => {
      const el = document.createElement('meta')
      el.name = 'description'
      document.head.appendChild(el)
      return el
    })()
    meta.content = t('metaDesc')
  }, [t, rtl, locale])
}
