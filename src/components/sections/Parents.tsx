/* ════════════════════════════════════════════════════════════════════
   [VI] Para os pais — três perguntas em aspas grandes (Cn itálico), cada
   resposta com um fato físico; a foto da criança ao lado. A objeção da
   persona primária, respondida antes do FAQ. Nada aqui é botão além do
   CTA, que já abre com "my child".
   ════════════════════════════════════════════════════════════════════ */

import { useRef } from 'react'
import { parents } from '@/data/site'
import { useInView } from '@/motion/inview'
import { Cta } from '../ui/Cta'
import { Eyebrow } from '../ui/Eyebrow'
import { Lines } from '../ui/Lines'
import { Pending } from '../ui/Pending'
import { Pic } from '../ui/Pic'

export function Parents() {
  const list = useRef<HTMLUListElement>(null)
  useInView(list)
  return (
    <section id="parents" className="parents" aria-labelledby="parents-title">
      <div className="shell parents__in">
        <div className="parents__copy">
          <Eyebrow>{parents.eyebrow}</Eyebrow>
          <Lines id="parents-title" className="d h2 parents__title" parts={parents.title} />
          <ul ref={list} className="parents__list">
            {parents.items.map((it, i) => (
              <li key={it.q} className="ask rise" style={{ ['--i' as string]: i }}>
                <span className="ask__mark d" aria-hidden="true">
                  “
                </span>
                <h3 className="ask__q d">{it.q}</h3>
                <p className="ask__a">{it.a}</p>
              </li>
            ))}
          </ul>
          <p className="parents__pend">
            <Pending>{parents.whereParentsPending}</Pending>
          </p>
          <div className="parents__cta">
            <Cta origin="faq" who="child" size="block">
              {parents.cta}
            </Cta>
          </div>
        </div>
        <figure className="parents__photo">
          <Pic name="parents" alt={parents.photoAlt} sizes="(min-width: 1024px) 38vw, 90vw" />
          <figcaption>
            <Pending>{parents.photoPending}</Pending>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
