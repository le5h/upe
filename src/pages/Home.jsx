import { useState, useEffect } from 'preact/hooks'
import config from '../config/evaluation.json'
import { EvaluationPage } from '../templates/EvaluationPage'
import { HomePage } from './HomePage'

function getPage() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  if (path === '/') return 'home'
  return config.types[path.split('/')[1]] ? 'eval' : 'home'
}

export function Home() {
  const [page, setPage] = useState(getPage)

  useEffect(() => {
    const onPop = () => setPage(getPage())
    addEventListener('popstate', onPop)
    return () => removeEventListener('popstate', onPop)
  }, [])

  if (page === 'home') {
    return <HomePage onSelect={t => { history.pushState(null, '', '/' + t); setPage('eval') }} />
  }

  return <EvaluationPage onHome={() => { history.pushState(null, '', '/'); setPage('home') }} />
}
