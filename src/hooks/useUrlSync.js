import { useEffect, useRef } from 'preact/hooks'
import { buildUrl } from './useEvaluation'

export function useUrlSync({ type, name, author, values, excluded, params }) {
  const first = useRef(true)
  const timer = useRef(null)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      const url = buildUrl(type, name, values, excluded, params, author)
      window.history.replaceState(null, '', url)
    }, 150)
    return () => clearTimeout(timer.current)
  }, [type, name, author, values, excluded, params])
}
