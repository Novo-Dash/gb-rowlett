/* ════════════════════════════════════════════════════════════════════
   Eyebrow — o rótulo acima do título das seções: a barra vermelha
   inclinada no ângulo do itálico (cresce de baixo na entrada) + o rótulo
   em AdihausDIN Cn Bold Italic. É onde a marca faz grafismo.
   ════════════════════════════════════════════════════════════════════ */

import { useRef } from 'react'
import { useInView } from '@/motion/inview'

interface EyebrowProps {
  children: React.ReactNode
  tone?: 'ink' | 'light'
  className?: string
}

export function Eyebrow({ children, tone = 'ink', className }: EyebrowProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  useInView(ref)
  return (
    <p ref={ref} className={['eb', tone === 'light' && 'eb--light', className].filter(Boolean).join(' ')}>
      <i className="eb__bar" aria-hidden="true" />
      <span className="eb__t">{children}</span>
    </p>
  )
}
