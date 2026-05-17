import { useLayoutEffect, useRef } from 'preact/hooks'
import { buildUrl } from './useEvaluation'

export function useUrlSync({ type, name, author, values, excluded, params }) {
  const first = useRef(true)

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const url = buildUrl(type, name, values, excluded, params, author)
    window.history.replaceState(null, '', url)
  }, [type, name, author, values, excluded, params])
}
