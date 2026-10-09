/* ════════════════════════════════════════════════════════════════════
   Stamp — o carimbo: círculo vermelho com o anel de texto repetido
   (textLength para fechar sem emenda), rotação FIXA de -8° (nunca
   aleatória), odômetro no centro e rótulo embaixo. Fica fora de qualquer
   máscara que recorte, porque morde a borda de propósito.

   `value` nulo = dado pendente: o carimbo não aparece (visibility), mas
   reserva o espaço. Quem chama decide se imprime um <Pending> ao lado.
   ════════════════════════════════════════════════════════════════════ */

import { Odo } from './Odo'

interface StampProps {
  /** Texto do anel (repetido duas vezes para fechar o círculo). */
  ring: string
  value: number | null
  label: string
  /** Leitura completa para o leitor de tela ("12 days to opening"). */
  srText?: string
  className?: string
  id?: string
  /** Hero: o odômetro roda no load, sem esperar a entrada na tela. */
  now?: boolean
}

export function Stamp({ ring, value, label, srText, className, id, now }: StampProps) {
  const pid = `stamp-ring-${id ?? 'a'}`
  return (
    <p className={['stamp', className].filter(Boolean).join(' ')} data-pending={value === null ? '' : undefined}>
      {value !== null ? <span className="sr-only">{srText ?? `${value} ${label}`}</span> : null}
      <svg className="stamp__ring" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <path id={pid} d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0" />
        </defs>
        <text>
          <textPath href={`#${pid}`} textLength="488" lengthAdjust="spacing">
            {ring + ring}
          </textPath>
        </text>
      </svg>
      <span className="stamp__core" aria-hidden="true">
        {value === null ? <span className="stamp__n d">00</span> : <Odo value={value} className="stamp__n d" now={now} />}
        <span className="stamp__l">{label}</span>
      </span>
    </p>
  )
}
