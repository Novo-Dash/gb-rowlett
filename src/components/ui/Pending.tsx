/* ════════════════════════════════════════════════════════════════════
   Pending — marca no lugar do dado que o cliente ainda não mandou.
   A página imprime o marcador em vez de inventar: data, vagas tomadas,
   preço de família, bio do coach não se preenchem com placeholder
   plausível. Visível em prospect; some com VITE_UX_MODE=client.
   ════════════════════════════════════════════════════════════════════ */

import { UX } from '@/lib/ux'
import { Tri } from './Icons'

/** `tone`: a cor do marcador acompanha a superfície onde ele mora
    (padrão = vermelho sobre --red-wash; navy = no azul do ingresso; red = no vermelho). */
export function Pending({ children, className, tone }: { children: React.ReactNode; className?: string; tone?: 'navy' | 'red' }) {
  if (UX.client) return null
  return (
    <span className={['pending', tone && `pending--${tone}`, className].filter(Boolean).join(' ')}>
      <Tri />
      <span>{children}</span>
    </span>
  )
}
