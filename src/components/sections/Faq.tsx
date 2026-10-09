/* ════════════════════════════════════════════════════════════════════
   [XI] Perguntas — uma coluna, centralizada. Cada pergunta é uma PEÇA:
   número em Cn itálico vermelho, a pergunta grande em corpo (nunca na
   condensada), quadrado com +/−. Aberta, a peça vira cartão branco com
   sombra e a barra vermelha à esquerda, e o quadrado enche de vermelho.
   A primeira já vem aberta. A resposta abre por grid-template-rows e
   fica `inert` fechada. Uma aberta por vez.
   Resposta pendente: marcador visível em prospect; em client a pergunta
   100% pendente some da lista e do JSON-LD (FAQPage só com confirmadas).
   ════════════════════════════════════════════════════════════════════ */

import { useId, useRef, useState } from 'react'
import { faq } from '@/data/site'
import { UX } from '@/lib/ux'
import { useInView } from '@/motion/inview'
import { Cta } from '../ui/Cta'
import { Eyebrow } from '../ui/Eyebrow'
import { Lines } from '../ui/Lines'
import { Pending } from '../ui/Pending'

export function Faq() {
  const [openIdx, setOpenIdx] = useState<number>(0)
  const uid = useId().replace(/:/g, '')
  const list = useRef<HTMLUListElement>(null)
  useInView(list)

  const items = UX.client ? faq.items.filter((it) => it.a !== null) : faq.items
  const confirmed = faq.items.filter((it) => it.a !== null && !it.pending)
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: confirmed.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

  return (
    <section id="faq" className="faq" aria-labelledby="faq-title">
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
      <div className="shell faq__in">
        <div className="faq__head">
          <Eyebrow>{faq.eyebrow}</Eyebrow>
          <Lines id="faq-title" className="d h2 faq__title" parts={faq.title} />
        </div>

        <ul ref={list} className="faq__list">
          {items.map((it, i) => {
            const isOpen = openIdx === i
            const qid = `${uid}-q${i}`
            const aid = `${uid}-a${i}`
            return (
              <li key={it.q} className="faq__item" data-open={isOpen ? '' : undefined} style={{ ['--i' as string]: i }}>
                <h3 className="faq__h">
                  <button id={qid} type="button" className="faq__q" aria-expanded={isOpen} aria-controls={aid} onClick={() => setOpenIdx(isOpen ? -1 : i)}>
                    <span className="faq__num d" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="faq__qt">{it.q}</span>
                    <span className="faq__icon" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 16 16">
                        <path className="faq__ih" d="M2 8h12" />
                        <path className="faq__iv" d="M8 2v12" />
                      </svg>
                    </span>
                  </button>
                </h3>
                <div id={aid} role="region" aria-labelledby={qid} className="faq__a" inert={!isOpen}>
                  <div>
                    <p>
                      {it.a}
                      {it.pending ? (
                        <>
                          {it.a ? ' ' : null}
                          <Pending>{it.pending}</Pending>
                        </>
                      ) : null}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <div className="faq__cta">
          <Cta origin="faq" size="block">
            {faq.cta}
          </Cta>
        </div>
      </div>
    </section>
  )
}
