/* ════════════════════════════════════════════════════════════════════
   [VII] Sem experiência — "Never trained? That's the starting line."
   A CADERNETA (o mecanismo das pranchetas da OCJ, na linguagem GB).

   Prancheta é o objeto do professor no tatame: a lista que o Andre
   escreveu para você. Tábua marinho GB, prendedor de metal com o rebite
   em triângulo vermelho, papel pautado com a margem vermelha, e a letra
   à mão (Caveat Brush) que só existe AQUI na página; título, frase e
   botão continuam na display. A caneta: quando as pranchetas entram,
   cada item ganha a marca desenhada em sequência — ✓ vermelho no que
   você precisa, ✗ marinho no que não precisa. A foto do Andre fica
   presa como polaroid na primeira prancheta. O triângulo GB vermelho,
   grande, fica atrás das pranchetas para dar contraste.

   Tudo centralizado e, no desktop, numa tela só: cabeçalho, as duas
   pranchetas e o botão. Reduced motion: as marcas já nascem
   desenhadas e as pranchetas já pousadas.
   ════════════════════════════════════════════════════════════════════ */

import { useRef } from 'react'
import { ready } from '@/data/site'
import { useInView } from '@/motion/inview'
import { Cta } from '../ui/Cta'
import { Eyebrow } from '../ui/Eyebrow'
import { Lines } from '../ui/Lines'
import { LogoMark } from '../ui/Icons'
import { Pic } from '../ui/Pic'

/* O ✓ à mão: um traço só, a subida mais longa que a descida. */
const Check = () => (
  <svg className="clip__mark clip__mark--check" viewBox="0 0 40 34" fill="none" aria-hidden="true">
    <path d="M4 19 C8 21 11 25 14 30 C19 20 27 10 37 3" pathLength={1} />
  </svg>
)

/* O ✗ à mão: dois traços que se cruzam, o segundo um pouco torto. */
const Cross = () => (
  <svg className="clip__mark clip__mark--cross" viewBox="0 0 40 34" fill="none" aria-hidden="true">
    <path d="M8 5 C15 13 23 21 32 30" pathLength={1} />
    <path d="M31 4 C23 12 15 21 7 29" pathLength={1} />
  </svg>
)

function Clipboard({ kind, title, items, children }: { kind: 'need' | 'dont'; title: string; items: string[]; children?: React.ReactNode }) {
  return (
    <div className={`clip clip--${kind}`}>
      <span className="clip__clamp" aria-hidden="true" />
      <div className="clip__paper">
        <p className="clip__form" aria-hidden="true">
          {ready.form}
        </p>
        <h3 className="clip__title">{title}</h3>
        <ul className="clip__list">
          {items.map((t, i) => (
            <li key={t} style={{ ['--i' as string]: i }}>
              {kind === 'need' ? <Check /> : <Cross />}
              <span>{t}</span>
            </li>
          ))}
        </ul>
        {children}
      </div>
    </div>
  )
}

export function Ready() {
  const desk = useRef<HTMLDivElement>(null)
  useInView(desk)
  return (
    <section id="ready" className="ready" aria-labelledby="ready-title">
      <div className="shell ready__in">
        <div className="ready__head">
          <Eyebrow>{ready.eyebrow}</Eyebrow>
          <Lines id="ready-title" className="d h2 ready__title" parts={ready.title} />
        </div>

        <div ref={desk} className="ready__desk">
          {/* o triângulo GB vermelho, grande, atrás das pranchetas: o contraste da mesa */}
          <LogoMark className="ready__mark" />
          <Clipboard kind="need" title={ready.needLabel} items={ready.need}>
            <figure className="clip__polaroid">
              <span className="clip__tape" aria-hidden="true" />
              <Pic name="ready" alt={ready.photoAlt} sizes="160px" />
            </figure>
          </Clipboard>
          <Clipboard kind="dont" title={ready.dontLabel} items={ready.dont} />
        </div>

        <div className="ready__close">
          <Cta origin="faq" who="me" size="block">
            {ready.cta}
          </Cta>
        </div>
      </div>
    </section>
  )
}
