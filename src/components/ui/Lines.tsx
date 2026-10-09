/* ════════════════════════════════════════════════════════════════════
   Lines — título que sobe de dentro de uma máscara, palavra a palavra.

   Divide no render (React), não em runtime: nada de SplitText, nenhum
   re-split em resize, e o texto real fica legível para leitor de tela
   (as máscaras ficam em aria-hidden e o heading recebe aria-label).
   O movimento é CSS (`html.motion [data-in]`), só transform. O trecho
   `accent` fica vermelho e já carrega o data-text do duplicado em contorno.
   ════════════════════════════════════════════════════════════════════ */

import { createElement, Fragment, useRef } from 'react'
import { useInView } from '@/motion/inview'

export interface LinePart {
  text: string
  accent?: boolean
  /** Força quebra de linha antes desta parte. */
  br?: boolean
}

interface LinesProps {
  as?: 'h1' | 'h2' | 'h3' | 'p'
  parts: LinePart[]
  className?: string
  /** Atraso inicial em ms (ex.: hero entra no load). */
  delay?: number
  /** Hero: anima no load, não na entrada na tela. */
  onLoad?: boolean
  id?: string
}

export function Lines({ as = 'h2', parts, className, delay = 0, onLoad, id }: LinesProps) {
  const ref = useRef<HTMLElement>(null)
  useInView(ref)
  let i = 0
  const label = parts.map((p) => p.text).join(' ')
  const children = parts.map((part, pi) => (
    <Fragment key={pi}>
      {part.br ? <br /> : null}
      <span className={part.accent ? 'ln__accent dup' : undefined} data-text={part.accent ? part.text : undefined}>
        {part.text.split(/\s+/).filter(Boolean).map((w, wi, arr) => {
          const idx = i++
          // o espaço fica FORA da máscara inline-block (dentro dela, colapsa)
          return (
            <Fragment key={wi}>
              <span className="ln__m">
                <span className="ln__w" style={{ ['--i' as string]: idx }}>
                  {w}
                </span>
              </span>
              {wi < arr.length - 1 || pi < parts.length - 1 ? ' ' : null}
            </Fragment>
          )
        })}
      </span>
    </Fragment>
  ))
  // aria-label é proibido em <p>: nesse caso o texto real vai em sr-only.
  const isHeading = as !== 'p'
  return createElement(
    as,
    {
      ref,
      id,
      className: ['ln', onLoad && 'ln--load', className].filter(Boolean).join(' '),
      'aria-label': isHeading ? label : undefined,
      style: delay ? ({ ['--d' as string]: `${delay}ms` } as React.CSSProperties) : undefined,
    },
    isHeading ? null : <span className="sr-only">{label}</span>,
    <span aria-hidden="true">{children}</span>,
  )
}
