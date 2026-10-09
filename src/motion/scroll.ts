/* ════════════════════════════════════════════════════════════════════
   scroll.ts — um único barramento de scroll para a página inteira.

   • UM listener passivo de scroll + UM de resize → UM requestAnimationFrame
     por frame, que chama todos os inscritos. Nada de setState: cada
     inscrito escreve variáveis CSS direto no DOM.
   • Medidas por offsetTop acumulado (cache, refeito no resize e quando
     as fontes terminam de carregar) — nunca getBoundingClientRect por frame.
   • Reduced motion: os inscritos recebem progress = 1 uma vez e param
     (a página aparece no estado final, parada e completa).
   ════════════════════════════════════════════════════════════════════ */

import { useEffect } from 'react'

type Tick = (scrollY: number, vh: number) => void
type Measure = () => void

const ticks = new Set<Tick>()
const measures = new Set<Measure>()
let raf = 0
let bound = false

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function frame() {
  raf = 0
  const y = window.scrollY
  const vh = window.innerHeight
  ticks.forEach((t) => t(y, vh))
}

function request() {
  if (!raf) raf = requestAnimationFrame(frame)
}

function remeasure() {
  measures.forEach((m) => m())
  request()
}

function bind() {
  if (bound || typeof window === 'undefined') return
  bound = true
  window.addEventListener('scroll', request, { passive: true })
  // Só largura muda o layout; a barra do navegador mobile mudando a altura
  // não pode disparar remedida (causaria "tremida" no meio da rolagem).
  let lastW = window.innerWidth
  window.addEventListener('resize', () => {
    if (window.innerWidth !== lastW) {
      lastW = window.innerWidth
      remeasure()
    } else request()
  })
  document.fonts?.ready.then(remeasure)
  window.addEventListener('load', remeasure, { once: true })
}

/** Topo absoluto do elemento no documento (soma de offsetTop). */
export function docTop(el: HTMLElement): number {
  let y = 0
  let n: HTMLElement | null = el
  while (n) {
    y += n.offsetTop
    n = n.offsetParent as HTMLElement | null
  }
  return y
}

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

/** Inscrição crua no barramento (para casos que medem outra coisa). */
export function useScrollTick(tick: Tick, measure?: Measure) {
  useEffect(() => {
    if (prefersReducedMotion()) return
    bind()
    if (measure) {
      measure()
      measures.add(measure)
    }
    ticks.add(tick)
    request()
    return () => {
      ticks.delete(tick)
      if (measure) measures.delete(measure)
    }
  }, [tick, measure])
}

