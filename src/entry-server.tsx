import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { App } from './App'
import { metaFor } from './seo'
import './styles/index.css'

export { ALL_PATHS, LLMS_TXT, LLMS_FULL_TXT, RSS_XML, REDIRECTS } from './seo'

export function render(url: string) {
  const html = renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  )
  return { html, meta: metaFor(url) }
}
