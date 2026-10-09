/* ════════════════════════════════════════════════════════════════════
   [VII] Sem experiência — "Never trained? That's the starting line."

   Duas colunas: "You need" com ▲ vermelho; "You don't need" com o ▲ em
   contorno e o item riscado. A foto do tatame entre elas no desktop. A
   frase de fechamento em --t-statement ("Nobody gets in shape first.")
   com o trecho vermelho em duplicado: é a permissão para o adulto
   travado, e o único display grande entre a obra e o contador.
   ════════════════════════════════════════════════════════════════════ */

import { useRef } from 'react'
import { ready } from '@/data/site'
import { useInView } from '@/motion/inview'
import { Cta } from '../ui/Cta'
import { Eyebrow } from '../ui/Eyebrow'
import { Tri, TriOutline } from '../ui/Icons'
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
            <h3 className="ready__label label">{ready.needLabel}</h3>
            <ul>
              {ready.need.map((t, i) => (
                <li key={t} className="rise" style={{ ['--i' as string]: i }}>
                  <Tri />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <figure className="ready__photo">
            <Pic name="ready" alt={ready.photoAlt} sizes="(min-width: 1024px) 30vw, 90vw" />
          </figure>
          <div className="ready__col ready__col--dont">
            <h3 className="ready__label label">{ready.dontLabel}</h3>
            <ul>
              {ready.dont.map((t, i) => (
                <li key={t} className="rise" style={{ ['--i' as string]: i + 5 }}>
                  <TriOutline />
                  <s>{t}</s>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Lines as="p" className="d statement ready__statement" parts={ready.statement} />
        <div className="ready__cta">
          <Cta origin="faq" who="me" size="block">
            {ready.cta}
          </Cta>
        </div>
      </div>
    </section>
  )
}
