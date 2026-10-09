/* ════════════════════════════════════════════════════════════════════
   track.ts — eventos de clique e de envio (PRD §18).

   Clarity: cta_click (com cta_origin como tag de sessão), call_click,
   directions_click, email_click, video_play, scroll_depth, form_submit
   (só depois do 2xx do GHL). Pixel/GA4 ficam no kit (nd/tracking.ts).
   Em modo prospect NADA dispara. Fire-and-forget: sem Clarity, no-op.
   ════════════════════════════════════════════════════════════════════ */

import { UX } from './lib/ux'

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void
  }
}

export type CtaOrigin =
  | 'nav'
  | 'hero'
  | 'ticket'
  | `program-${string}`
  | `slot-${string}`
  | 'build'
  | 'reserve'
  | 'opening'
  | 'faq'
  | 'footer'
  | 'menu'

function clarity(...args: unknown[]) {
  if (UX.prospect) return
  try {
    if (typeof window !== 'undefined' && typeof window.clarity === 'function') window.clarity(...args)
  } catch {
    /* nunca quebra a página */
  }
}

export function trackCta(origin: CtaOrigin, program?: string) {
  clarity('set', 'cta_origin', origin)
  if (program) clarity('set', 'cta_program', program)
  clarity('event', 'cta_click')
}

export const trackCall = () => clarity('event', 'call_click')
export const trackDirections = () => clarity('event', 'directions_click')
export const trackEmail = () => clarity('event', 'email_click')
export const trackScrollDepth = (pct: 25 | 50 | 75 | 100) => {
  clarity('set', 'scroll_depth', String(pct))
  clarity('event', 'scroll_depth')
}
export const trackViewContent = (what: string) => {
  clarity('set', 'view_content', what)
  clarity('event', 'view_content')
}

/** Só depois da resposta de sucesso do envio do lead. */
export function trackFormSubmit(programs: string[], tier: string) {
  clarity('set', 'program', programs.join(','))
  clarity('set', 'tier', tier)
  clarity('event', 'form_submit')
}
