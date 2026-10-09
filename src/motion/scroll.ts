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

import { useEffect, type RefObject } from 'react'

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

export interface ScrollRange {
  /** Posição (0–1 da altura da tela) onde o topo do elemento faz progress = 0. */
  start?: number
  /** Posição (0–1 da altura da tela) onde o FIM do elemento faz progress = 1. */
  end?: number
}

/**
 * Escreve `--p` (0–1) no elemento conforme ele atravessa a tela.
 * Por padrão: 0 quando o topo entra pela base da tela, 1 quando o fim
 * sai pelo topo. `onProgress` permite efeitos extras sem re-render.
 */
export function useScrollProgress<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { start = 1, end = 0 }: ScrollRange = {},
  onProgress?: (p: number, el: T) => void,
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) {
      el.style.setProperty('--p', '1')
      onProgress?.(1, el)
      return
    }
    bind()
    let top = 0
    let height = 0
    let last = -1
    const measure = () => {
      top = docTop(el)
      height = el.offsetHeight
    }
    const tick: Tick = (y, vh) => {
      // de (top - start*vh) até (top + height - end*vh)
      const from = top - start * vh
      const to = top + height - end * vh
      const p = clamp01((y - from) / Math.max(1, to - from))
      if (Math.abs(p - last) < 0.0005) return
      last = p
      el.style.setProperty('--p', p.toFixed(4))
      onProgress?.(p, el)
    }
    measure()
    measures.add(measure)
    ticks.add(tick)
    request()
    return () => {
      measures.delete(measure)
      ticks.delete(tick)
    }
    // onProgress é estável por contrato (definido fora do render ou com useCallback)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, start, end])
}

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

