import { useState, useEffect, useCallback } from 'preact/hooks'
import config from '../config/evaluation.json'
import { EvaluationPage } from './EvaluationPage'
import { HomePage } from './HomePage'
import { Footer } from '../molecules/Footer'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

function getPage() {
  const hash = typeof location !== 'undefined' ? location.hash.slice(1) : ''
  if (!hash) return 'home'
  return config.types[hash.split(';')[0].split(':')[0]] ? 'eval' : 'home'
}

export function Home() {
  const [page, setPage] = useState(getPage)

  useEffect(() => {
    const onPop = () => setPage(getPage())
    addEventListener('popstate', onPop)
    return () => removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((to, isEval) => {
    const update = () => {
      history.pushState(null, '', isEval ? '#' + to : '/');
      setPage(isEval ? 'eval' : 'home');
    };
    if (document.startViewTransition) {
      document.startViewTransition(update);
    } else {
      update();
    }
  }, []);

  useDocumentMeta()

  return (
    <>
      {page === 'home'
        ? <HomePage onSelect={t => navigate(t, true)} />
        : <EvaluationPage onHome={() => navigate('home', false)} />
      }
      <Footer />
    </>
  )
}
