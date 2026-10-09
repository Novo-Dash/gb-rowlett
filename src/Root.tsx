import { StrictMode, useEffect } from 'react'
import App from './App'

declare global {
  interface Window {
    /** Toques em botões antes da hidratação (script inline do pré-render). */
    __gbq?: HTMLElement[]
    __gbh?: boolean
  }
}

/** Depois que o React assumiu: reexecuta o último toque guardado. Nenhum clique morto. */
function HydrationReplay() {
  useEffect(() => {
    if (window.__gbh) return
    window.__gbh = true
    const last = window.__gbq?.pop()
    window.__gbq = []
    if (last?.isConnected) last.click()
  }, [])
  return null
}

/** Árvore comum ao cliente e ao pré-render — tem de ser idêntica nos dois. */
export function Root() {
  return (
    <StrictMode>
      <App />
      <HydrationReplay />
    </StrictMode>
  )
}
