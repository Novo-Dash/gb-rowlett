/* ════════════════════════════════════════════════════════════════════
   inview.ts — gatilho de entrada, uma vez só.

   Grava `data-in` direto no DOM (fora do React) quando o elemento entra
   na tela. Todo o movimento mora no CSS, escopado em `html.motion`:
   sem essa classe (reduced motion), nada fica escondido esperando JS.
   Um IntersectionObserver compartilhado para a página toda.
   ════════════════════════════════════════════════════════════════════ */

import { useEffect, type RefObject } from 'react'

let io: IntersectionObserver | null = null
const callbacks = new WeakMap<Element, () => void>()

function observer(): IntersectionObserver {
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const el = e.target as HTMLElement
          el.dataset.in = ''
          callbacks.get(el)?.()
          io!.unobserve(el)
        }
      },
      // dispara um pouco antes de chegar (12% acima da base da tela)
      { rootMargin: '0px 0px -12% 0px', threshold: 0 },
    )
  }
  return io
}

export function useInView<T extends HTMLElement>(ref: RefObject<T | null>, onEnter?: () => void) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      el.dataset.in = ''
      onEnter?.()
      return
    }
    if (onEnter) callbacks.set(el, onEnter)
    observer().observe(el)
    return () => observer().unobserve(el)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref])
}
