import { useState, useEffect } from 'preact/hooks'
import config from '../config/evaluation.json'
import { EvaluationPage } from '../templates/EvaluationPage'
import { HomePage } from './HomePage'
import { useI18n } from '../i18n/context'

function getPage() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  if (path === '/') return 'home'
  return config.types[path.split('/')[1]] ? 'eval' : 'home'
}

const PAGE_TITLES = {
  en: 'UPE \u2014 Universal Parametric Evaluator',
  ru: 'UPE \u2014 \u0423\u043D\u0438\u0432\u0435\u0440\u0441\u0430\u043B\u044C\u043D\u044B\u0439 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u043E\u0446\u0435\u043D\u0449\u0438\u043A',
  de: 'UPE \u2014 Universeller parametrischer Bewerter',
  ja: 'UPE \u2014 \u30E6\u30CB\u30D0\u30FC\u30B5\u30EB\u30D1\u30E9\u30E1\u30C8\u30EA\u30C3\u30AF\u8A55\u4FA1\u30C4\u30FC\u30EB',
  zh: 'UPE \u2014 \u901A\u7528\u53C2\u6570\u5316\u8BC4\u4EF7\u5DE5\u5177',
  es: 'UPE \u2014 Evaluador param\u00E9trico universal',
  hi: 'UPE \u2014 \u0938\u093E\u0930\u094D\u0935\u092D\u094C\u092E\u093F\u0915 \u092A\u0948\u0930\u093E\u092E\u0947\u091F\u094D\u0930\u093F\u0915 \u092E\u0942\u0932\u094D\u092F\u093E\u0902\u0915\u0928',
  ar: 'UPE \u2014 \u0627\u0644\u0645\u0642\u064A\u0645 \u0627\u0644\u0645\u0639\u064A\u0627\u0631\u064A \u0627\u0644\u0634\u0627\u0645\u0644',
}

const META_DESCS = {
  en: 'Score movies, series, and games across weighted parameters. No gut feelings \u2014 just structured, shareable evaluations.',
  ru: '\u041E\u0446\u0435\u043D\u0438\u0432\u0430\u0439\u0442\u0435 \u0444\u0438\u043B\u044C\u043C\u044B, \u0441\u0435\u0440\u0438\u0430\u043B\u044B \u0438 \u0438\u0433\u0440\u044B \u043F\u043E \u0432\u0437\u0432\u0435\u0448\u0435\u043D\u043D\u044B\u043C \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u0430\u043C.',
  de: 'Bewerte Filme, Serien und Spiele anhand gewichteter Parameter. Kein Bauchgef\u00FChl \u2014 nur strukturierte, teilbare Bewertungen.',
  ja: '\u6620\u753B\u3001\u30B7\u30EA\u30FC\u30BA\u3001\u30B2\u30FC\u30E0\u3092\u52A0\u91CD\u30D1\u30E9\u30E1\u30FC\u30BF\u3067\u8A55\u4FA1\u3002\u76F4\u611F\u3067\u306F\u306A\u304F\u3001\u69CB\u9020\u5316\u3055\u308C\u305F\u5171\u6709\u53EF\u80FD\u306A\u30B9\u30B3\u30A2\u3092\u3002',
  zh: '\u901A\u8FC7\u52A0\u6743\u53C2\u6570\u8BC4\u5206\u7535\u5F71\u3001\u5267\u96C6\u548C\u6E38\u620F\u3002\u6CA1\u6709\u4E3B\u89C2\u611F\u53D7\u2014\u53EA\u6709\u7ED3\u6784\u5316\u3001\u53EF\u5206\u4EAB\u7684\u8BC4\u4EF7\u3002',
  es: 'Punt\u00FAa pel\u00EDculas, series y juegos con par\u00E1metros ponderados. Sin corazonadas \u2014 solo evaluaciones estructuradas y compartibles.',
  hi: '\u092D\u093E\u0930\u093F\u0924 \u092A\u0948\u0930\u093E\u092E\u0940\u091F\u0930\u094D\u0938 \u0915\u0947 \u0938\u093E\u0925 \u092B\u093C\u093F\u0932\u094D\u092E\u094B\u0902, \u0938\u093F\u0930\u0940\u091C\u093C\u094B\u0902 \u0914\u0930 \u0917\u0947\u092E\u094D\u0938 \u0915\u094B \u0938\u094D\u0915\u094B\u0930 \u0915\u0930\u0947\u0902\u0964',
  ar: '\u0642\u064A\u0645 \u0627\u0644\u0623\u0641\u0644\u0627\u0645 \u0648\u0627\u0644\u0645\u0633\u0644\u0633\u0644\u0627\u062A \u0648\u0627\u0644\u0623\u0644\u0639\u0627\u0628 \u0639\u0628\u0631 \u0645\u0639\u0627\u064A\u064A\u0631 \u0645\u0631\u062C\u062D\u0629.',
}

function DirSetter() {
  const { rtl, locale } = useI18n()
  useEffect(() => {
    document.documentElement.dir = rtl ? 'rtl' : 'ltr'
    document.title = PAGE_TITLES[locale] || PAGE_TITLES.en
    const meta = document.querySelector('meta[name="description"]') || (() => {
      const el = document.createElement('meta')
      el.name = 'description'
      document.head.appendChild(el)
      return el
    })()
    meta.content = META_DESCS[locale] || META_DESCS.en
  }, [rtl, locale])
  return null
}

export function Home() {
  const [page, setPage] = useState(getPage)

  useEffect(() => {
    const onPop = () => setPage(getPage())
    addEventListener('popstate', onPop)
    return () => removeEventListener('popstate', onPop)
  }, [])

  return (
    <>
      <DirSetter />
      {page === 'home'
        ? <HomePage onSelect={t => { history.pushState(null, '', '/' + t); setPage('eval') }} />
        : <EvaluationPage onHome={() => { history.pushState(null, '', '/'); setPage('home') }} />
      }
    </>
  )
}
