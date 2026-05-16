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

function DirSetter() {
  const { rtl } = useI18n()
  useEffect(() => { document.documentElement.dir = rtl ? 'rtl' : 'ltr' }, [rtl])
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
