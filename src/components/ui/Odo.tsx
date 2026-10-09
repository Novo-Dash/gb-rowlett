/* ════════════════════════════════════════════════════════════════════
   Odo — número em rolos (odômetro), uma vez só, na entrada.

   O HTML já nasce no valor final: o rolo está parado no dígito certo e o
   leitor de tela lê o número real (sr-only). Os rolos são aria-hidden e
   os dígitos vêm de CSS (`content: attr`), então nunca são lidos como
   "0123456789". Largura reservada por um gêmeo invisível: zero layout
   shift. O movimento é uma transição CSS: sempre termina (reduced motion
   = sem transição, aba oculta = termina quando volta).

   `live`: valor que muda com o tempo (contador). Aí o rolo não espera a
   entrada: anda a cada mudança de valor.
   ════════════════════════════════════════════════════════════════════ */

import { useRef } from 'react'
import { useInView } from '@/motion/inview'

const DIGITS = '01234567890123456789' // duas voltas: os rolos da esquerda giram mais

interface OdoProps {
  value: number
  className?: string
  /** Mínimo de dígitos (contador: 2). */
  pad?: number
  live?: boolean
  /** Já nasce no valor final animando no load (hero): não espera a entrada na tela. */
  now?: boolean
}

export function Odo({ value, className, pad = 1, live, now }: OdoProps) {
  const ref = useRef<HTMLSpanElement>(null)
  useInView(ref)
  const str = String(Math.max(0, Math.floor(value))).padStart(pad, '0')
  return (
    <span ref={ref} className={['odo', live && 'odo--live', className].filter(Boolean).join(' ')} data-in={now ? '' : undefined}>
      <span className="sr-only">{str}</span>
      <span className="odo__size" aria-hidden="true">
        {str}
      </span>
      <span className="odo__reels" aria-hidden="true">
        {str.split('').map((d, i) => {
          const target = (i < str.length - 1 && !live ? 10 : 0) + Number(d)
          return (
            <span key={i} className="odo__reel">
              <span
                className="odo__strip"
                style={{
                  ['--to' as string]: target,
                  ['--dur' as string]: live ? '0.45s' : `${1.5 + (str.length - i) * 0.25}s`,
                }}
              >
                {DIGITS.split('').map((c, k) => (
                  <span key={k} data-n={c} />
                ))}
              </span>
            </span>
          )
        })}
      </span>
    </span>
  )
}
