/* ════════════════════════════════════════════════════════════════════
   [III] Programas — "Find your class." Quatro cards 3/4 com a foto
   inteira e a sombra marinho embaixo. Cada card INTEIRO é um botão: abre
   o formulário com a turma marcada.

   Mecanismo: no celular, trilho horizontal nativo com snap (momentum do
   próprio sistema). O card mais perto do centro fica ACESO (luz vermelha
   no topo); os vizinhos recuam um pouco (--c, escrito pelo scroll do
   trilho num rAF). Contador 01/04 + régua vermelha. Na entrada, cada
   card nasce por uma cunha triangular. Desktop: 2 colunas em 700px, 4 em
   1280; a luz no hover, o card cresce 4% sobre os vizinhos.
   Foto de outra unidade GB = marcador de pendência visível no card.
   ════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef } from 'react'
import { PROGRAM_TITLE_EM, programs } from '@/data/site'
import { useBooking } from '@/nd/Booking'
import { prefersReducedMotion } from '@/motion/scroll'
import { useInView } from '@/motion/inview'
import { trackCta } from '@/track'
import { Eyebrow } from '../ui/Eyebrow'
import { Arrow } from '../ui/Icons'
import { Lines } from '../ui/Lines'
import { Pending } from '../ui/Pending'
import { Pic } from '../ui/Pic'

export function Programs() {
  const { open } = useBooking()
  const rail = useRef<HTMLUListElement>(null)
  const count = useRef<HTMLSpanElement>(null)
  const wrap = useRef<HTMLDivElement>(null)
  useInView(wrap)

  useEffect(() => {
    const el = rail.current
    if (!el) return
    let raf = 0
    const cards = Array.from(el.children) as HTMLElement[]
    const update = () => {
      raf = 0
      const mid = el.scrollLeft + el.clientWidth / 2
      let best = 0
      let bestD = Infinity
      cards.forEach((c, i) => {
        const center = c.offsetLeft + c.offsetWidth / 2
        const d = Math.abs(center - mid)
        if (d < bestD) {
          bestD = d
          best = i
        }
        const n = Math.min(1, d / (c.offsetWidth || 1))
        if (!prefersReducedMotion()) c.style.setProperty('--c', n.toFixed(3))
      })
      const max = el.scrollWidth - el.clientWidth
      el.parentElement?.style.setProperty('--rail', max > 0 ? (el.scrollLeft / max).toFixed(3) : '0')
      if (count.current) count.current.textContent = String(best + 1).padStart(2, '0')
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section id="programs" className="programs" aria-labelledby="programs-title">
      <div className="shell programs__head">
        <Eyebrow>{programs.eyebrow}</Eyebrow>
        <Lines id="programs-title" className="d h2 programs__title" parts={programs.title} />
      </div>

      <div ref={wrap} className="programs__wrap">
        <ul ref={rail} className="programs__rail" aria-label="Classes">
          {programs.cards.map((c, i) => (
            <li key={c.key} className="pcard" style={{ ['--k' as string]: i, ['--tw' as string]: PROGRAM_TITLE_EM }}>
              <button
                type="button"
                className="pcard__btn"
                onClick={() => {
                  trackCta(`program-${c.key}`, c.key)
                  open({ program: c.key, who: c.who[0], origin: `program-${c.key}` })
                }}
              >
                <span className="pcard__media">
                  <Pic name={c.image} alt={c.alt} sizes="(min-width: 1280px) 24vw, (min-width: 700px) 46vw, 76vw" />
                </span>
                <span className="pcard__shade" aria-hidden="true" />
                <span className="pcard__light" aria-hidden="true" />
                <span className="pcard__text">
                  <span className="pcard__head">
                    <span className="pcard__title d">{c.title}</span>
                    <span className="pcard__tag">{c.tag}</span>
                  </span>
                  <span className="pcard__row">
                    <span className="pcard__line">{c.line}</span>
                    <span className="pcard__go" aria-hidden="true">
                      <Arrow />
                      <Arrow />
                    </span>
                  </span>
                  <span className="sr-only">{c.action}</span>
                </span>
              </button>
              {c.photoPending ? (
                <span className="pcard__pend">
                  <Pending>{c.photoPending}</Pending>
                </span>
              ) : null}
            </li>
          ))}
        </ul>

        <div className="programs__meter shell" aria-hidden="true">
          <span className="programs__count label">
            <span ref={count}>01</span> / {String(programs.cards.length).padStart(2, '0')}
          </span>
          <span className="programs__bar">
            <span />
          </span>
        </div>
      </div>
    </section>
  )
}
