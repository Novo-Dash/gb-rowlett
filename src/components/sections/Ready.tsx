/* ════════════════════════════════════════════════════════════════════
   [VII] Sem experiência — "Never trained? That's the starting line."

   Duas colunas de linhas-cartão: "You need" com o ✓ num círculo vermelho;
   "You don't need" com o ✕ num círculo em contorno e o item riscado. Tudo centralizado: no desktop as listas se
   espelham em volta do coach recortado, que fica no meio, colado na borda
   de baixo da seção e alto o bastante para a seção ter uma tela. Sem botão
   (pedido do Adryan).
   (A primeira versão de volta, pedido do Adryan: a caderneta não
   conversava com a página. A frase de fechamento continua fora.)
   ════════════════════════════════════════════════════════════════════ */

import { useRef } from 'react'
import { ready } from '@/data/site'
import { useInView } from '@/motion/inview'
import { Eyebrow } from '../ui/Eyebrow'
import { Check, Close } from '../ui/Icons'
import { Lines } from '../ui/Lines'
import { Pic } from '../ui/Pic'

export function Ready() {
  const cols = useRef<HTMLDivElement>(null)
  useInView(cols)
  return (
    <section id="ready" className="ready" aria-labelledby="ready-title">
      <div className="shell">
        <div className="ready__head">
          <Eyebrow>{ready.eyebrow}</Eyebrow>
          <Lines id="ready-title" className="d h2 ready__title" parts={ready.title} />
        </div>

        <div ref={cols} className="ready__cols">
          <div className="ready__col ready__col--need">
            <h3 className="ready__label">{ready.needLabel}</h3>
            <ul>
              {ready.need.map((t, i) => (
                <li key={t} className="rise" style={{ ['--i' as string]: i }}>
                  <span className="ready__ic" aria-hidden="true">
                    <Check />
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* o coach recortado, sem fundo, de pé na borda de baixo da seção; no
              desktop ele cresce até a seção ter uma tela de altura */}
          <figure className="ready__photo">
            <Pic name="coach" alt={ready.photoAlt} sizes="(min-width: 1024px) 60svh, 92vw" />
          </figure>
          <div className="ready__col ready__col--dont">
            <h3 className="ready__label">{ready.dontLabel}</h3>
            <ul>
              {ready.dont.map((t, i) => (
                <li key={t} className="rise" style={{ ['--i' as string]: i + 5 }}>
                  <span className="ready__ic" aria-hidden="true">
                    <Close />
                  </span>
                  <s>{t}</s>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </section>
  )
}
