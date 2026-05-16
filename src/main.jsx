import { render } from 'preact'
import './index.css'
import { App } from './app.jsx'

const redirect = sessionStorage.getItem('redirect')
if (redirect) {
  sessionStorage.removeItem('redirect')
  window.history.replaceState(null, '', redirect)
}

render(<App />, document.getElementById('app'))
