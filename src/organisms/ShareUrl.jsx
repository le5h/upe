import { useRef, useState } from 'preact/hooks'

export function ShareUrl() {
  const [copied, setCopied] = useState(false)
  const timeout = useRef(null)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      clearTimeout(timeout.current)
      timeout.current = setTimeout(() => setCopied(false), 2000)
    } catch { /* noop */ }
  }

  return (
    <div class="share-url">
      <input type="text" value={window.location.href} readOnly class="input url-input" onClick={e => e.currentTarget.select()} />
      <button onClick={copy} class="btn btn-copy">
        {copied ? 'Copied!' : 'Copy URL'}
      </button>
    </div>
  )
}
