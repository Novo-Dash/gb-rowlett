/* ════════════════════════════════════════════════════════════════════
   [VI] Para os pais — TRÊS CARDS, uma pergunta em cada (pedido do Adryan).

     ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
     │   (foto)     │ │   (foto)     │ │   (foto)     │
     │ ┌──────────┐ │ │              │ │              │
     │ │Is it safe│ │ │  …           │ │  …           │
     │ └▾─────────┘ │ │              │ │              │
     │   ┌────────┐ │ │              │ │              │
     │   │resposta│ │ │              │ │              │
     │   └───────▾┘ │ │              │ │              │
     └──────────────┘ └──────────────┘ └──────────────┘

   Cada card tem a sua foto de fundo, com um véu marinho embaixo. A
   pergunta do pai fica num balão branco à esquerda; a resposta da
   academia, num balão vermelho à direita. Quando os cards entram: a
   pergunta sobe, aparecem os três pontinhos de "digitando" e a resposta
   chega no lugar deles (a altura da resposta já está reservada: nada
   pula). Reduced motion: os balões já nascem no lugar, sem os pontinhos.
   ════════════════════════════════════════════════════════════════════ */

import { useRef } from 'react'
import { parents } from '@/data/site'
import { useInView } from '@/motion/inview'
import { Cta } from '../ui/Cta'
import { Eyebrow } from '../ui/Eyebrow'
import { Tri } from '../ui/Icons'
import { Lines } from '../ui/Lines'
import { Pending } from '../ui/Pending'
import { Pic } from '../ui/Pic'

export function Parents() {
  const list = useRef<HTMLUListElement>(null)
  useInView(list)
  return (
    <section id="parents" className="parents" aria-labelledby="parents-title">
      <div className="shell">
        <div className="parents__head">
          <Eyebrow>{parents.eyebrow}</Eyebrow>
          <Lines id="parents-title" className="d h2 parents__title" parts={parents.title} />
        </div>

        <ul ref={list} className="parents__cards">
          {parents.items.map((it, i) => (
            <li key={it.q} className="chat" style={{ ['--i' as string]: i }}>
              <div className="chat__bg" aria-hidden="true">
                <Pic name={it.image} alt="" sizes="(min-width: 1024px) 31vw, 92vw" />
              </div>
              <div className="chat__thread">
                <div className="bub bub--q">
                  <span className="bub__who label">{parents.asker}</span>
                  <h3 className="bub__t d">{it.q}</h3>
                </div>
                <div className="chat__reply">
                  <span className="chat__typing" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <div className="bub bub--a">
                    <span className="bub__who label">
                      <Tri />
                      {parents.answerer}
                    </span>
                    <p className="bub__b">{it.a}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="parents__foot">
          <p className="parents__pend">
            <Pending>{parents.whereParentsPending}</Pending>
            <Pending>{parents.photoPending}</Pending>
          </p>
          <div className="parents__cta">
            <Cta origin="faq" who="child" size="block">
              {parents.cta}
            </Cta>
          </div>
        </div>
      </div>
    </section>
  )
}
