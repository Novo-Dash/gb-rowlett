/* ════════════════════════════════════════════════════════════════════
   [IX] Como reservar — DESIGN PASS: quatro versões da faixa, escolhidas
   por link (?how=a|b|c|d#reserve). O pré-render e o padrão são a A (a
   faixa no tatame); as outras trocam depois de montar, só no navegador.
   Escolhida a versão, as outras e este seletor saem do código.
     A · a faixa branca no tatame vermelho (atual)
     B · a faixa preta bordada
     C · a faixa em pé, sem palco preso
     D · a faixa que desenrola para o lado
   ════════════════════════════════════════════════════════════════════ */

import { useEffect, useState } from 'react'
import { UX } from '@/lib/ux'
import { ReserveMat } from './reserve/Mat'
import { ReserveRail } from './reserve/Rail'
import { ReserveRoll } from './reserve/Roll'
import { ReserveStitch } from './reserve/Stitch'

const V = { a: ReserveMat, b: ReserveStitch, c: ReserveRail, d: ReserveRoll }
type Key = keyof typeof V

export function Reserve() {
  const [v, setV] = useState<Key>('a')
  const [pick, setPick] = useState(false)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('how')
    if (q && q in V) {
      setV(q as Key)
      setPick(true)
    }
  }, [])
  const C = V[v]
  return (
    <>
      <C key={v} />
      {pick && UX.prospect ? (
        <nav className="howpick" aria-label="Reserve section versions">
          {(Object.keys(V) as Key[]).map((k) => (
            <a key={k} href={`?how=${k}#reserve`} aria-current={k === v ? 'true' : undefined}>
              {k.toUpperCase()}
            </a>
          ))}
        </nav>
      ) : null}
    </>
  )
}
