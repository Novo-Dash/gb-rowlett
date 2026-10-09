/* ════════════════════════════════════════════════════════════════════
   Pending — marca no lugar do dado que o cliente ainda não mandou.
   A página imprime o marcador em vez de inventar: data, vagas tomadas,
   preço de família, bio do coach não se preenchem com placeholder
   plausível. Visível em prospect; some com VITE_UX_MODE=client.
   ════════════════════════════════════════════════════════════════════ */

import { UX } from '@/lib/ux'
import { Tri } from './Icons'

export function Pending({ children, className }: { children: React.ReactNode; className?: string }) {
  if (UX.client) return null
  return (
    <span className={['pending', className].filter(Boolean).join(' ')}>
      <Tri />
      <span>{children}</span>
    </span>
  )
}

/** Dado que só existe em prospect: em client, renderiza o fallback (ou nada). */
export function Prospect({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return <>{UX.client ? fallback : children}</>
}
