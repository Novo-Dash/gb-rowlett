/* ════════════════════════════════════════════════════════════════════
   Cta — o ÚNICO estilo de botão da página. Sempre abre o formulário
   (ou, com `href`, leva a uma âncora: o "Explore" do hero).

   Canto cortado (as mordidas do hero), degradê vermelho e o quadrado
   branco com a seta. Pulsa em vermelho; no hover não troca de cor: um
   brilho atravessa e a seta dá a volta. Estilos em styles/ui.css.
   ════════════════════════════════════════════════════════════════════ */

import { useBooking } from '@/nd/Booking'
import type { ProgramKey, Who } from '@/types'
import { trackCta, type CtaOrigin } from '@/track'
import { Arrow, ArrowDown } from './Icons'

interface CtaProps {
  children: React.ReactNode
  origin: CtaOrigin
  program?: ProgramKey
  who?: Who
  className?: string
  /** 'block' ocupa a largura toda no celular (320px mínimo no desktop). */
  size?: 'block' | 'auto'
  /** Com href vira âncora (seta para baixo). */
  href?: string
}

export function Cta({ children, origin, program, who, className, size = 'auto', href }: CtaProps) {
  const { open } = useBooking()
  const cls = ['cta', `cta--${size}`, className].filter(Boolean).join(' ')
  if (href) {
    return (
      <a className={cls} href={href}>
        <span className="cta__face" aria-hidden="true" />
        <span className="cta__label">{children}</span>
        <span className="cta__icon cta__icon--down" aria-hidden="true">
          <ArrowDown />
        </span>
      </a>
    )
  }
  return (
    <button
      type="button"
      className={cls}
      onClick={() => {
        trackCta(origin, program)
        open({ program, who, origin })
      }}
    >
      <span className="cta__face" aria-hidden="true" />
      <span className="cta__label">{children}</span>
      <span className="cta__icon" aria-hidden="true">
        <Arrow />
      </span>
    </button>
  )
}
