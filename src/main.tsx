import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles/index.css'
import { BookRoot, Root } from './Root'

const el = document.getElementById('root')!

if (/^\/book\/?$/.test(window.location.pathname)) {
  // /book (a Vercel reescreve para o index.html pré-renderizado da "/"): troca a
  // landing escondida pela página só do formulário, sem hidratar a "/".
  el.textContent = ''
  createRoot(el).render(<BookRoot />)
} else if (el.hasChildNodes()) {
  // A "/" chega pré-renderizada e este JS só baixa depois que o hero pintou
  // (ver scripts/prerender.mjs): hidrata direto.
  hydrateRoot(el, <Root />)
} else {
  createRoot(el).render(<Root />)
}
