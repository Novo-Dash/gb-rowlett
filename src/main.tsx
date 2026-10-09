import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles/index.css'
import { Root } from './Root'

const el = document.getElementById('root')!

if (el.hasChildNodes()) {
  // A "/" chega pré-renderizada e este JS só baixa depois que o hero pintou
  // (ver scripts/prerender.mjs): hidrata direto.
  hydrateRoot(el, <Root />)
} else {
  createRoot(el).render(<Root />)
}
