/* ════════════════════════════════════════════════════════════════════
   [IX] Como reservar — os três passos lado a lado e a faixa embaixo
   (referência do Adryan, 9 out 2026).

              WHAT HAPPENS NEXT
           HOW TO RESERVE YOUR SPOT.
     ┌──────────┐  ┏━━━━━━━━━━┓  ┌┄┄┄┄┄┄┄┄┄┄┐
     │01  ✓Done │  ┃02    Now ┃  ┆⌗03  Next ┆   feito · agora (VERMELHO) · depois
     │título    │  ┃título    ┃  ┆título    ┆
     │texto     │  ┃texto     ┃  ┆texto     ┆
     └──────────┘  ┗━━━━━━━━━━┛  └┄┄┄┄┄┄┄┄┄┄┘
              [ Claim my Founding Member spot ]
     ▓▓▓ tatame vermelho ═══ a faixa branca ═══▐█▌▌ ▏═ ▓▓▓  ← o divisor da seção

   A cena fica no palco (sticky CSS) enquanto a rolagem anda. O passo do
   momento é o card VERMELHO (o degradê do botão, texto branco); os feitos
   ficam brancos com o número vermelho e "✓ Done"; os que faltam ficam
   vazados, em contorno tracejado. A cada passo a ponteira preta ganha um
   grau (os três encaixes vazios já
   aparecem, então se vê o que falta). Sem movimento (ou reduced motion):
   tudo aceso, a faixa com os três graus, sem palco preso. Celular e telas
   baixas: sem palco preso (não caberia); cada card acende quando chega ao
   meio da tela e a faixa fecha a seção logo depois do botão.
   ════════════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useRef, useState } from 'react'
import { reserve } from '@/data/site'
import { clamp01, docTop, useScrollTick } from '@/motion/scroll'
import { Cta } from '../ui/Cta'
import { Eyebrow } from '../ui/Eyebrow'
import { Check } from '../ui/Icons'
import { Lines } from '../ui/Lines'

const steps = reserve.steps
const total = steps.length

export function Reserve() {
  const [live, setLive] = useState(false)
  const [step, setStep] = useState(0)
  const root = useRef<HTMLElement>(null)
  const list = useRef<HTMLOListElement>(null)
  const geo = useRef({ top: 0, run: 1, pinned: true, cards: [] as number[] })
  const last = useRef(0)

  useEffect(() => setLive(document.documentElement.classList.contains('motion')), [])

  const measure = useCallback(() => {
    const el = root.current
    if (!el) return
    geo.current.top = docTop(el)
    geo.current.run = Math.max(1, el.offsetHeight - window.innerHeight)
    // o palco só prende quando cabe numa tela (o CSS decide pela largura e altura)
    const stage = el.firstElementChild as HTMLElement | null
    geo.current.pinned = !!stage && getComputedStyle(stage).position === 'sticky'
    geo.current.cards = Array.from(list.current?.children ?? []).map((c) => docTop(c as HTMLElement))
  }, [])

  const tick = useCallback((y: number, vh: number) => {
    const g = geo.current
    let next = 0
    if (g.pinned) {
      next = Math.min(total - 1, Math.floor(clamp01((y - g.top) / g.run) * total))
    } else {
      // sem palco: o card acende quando o topo dele passa de 62% da tela
      g.cards.forEach((top, i) => {
        if (top < y + vh * 0.62) next = i
      })
    }
    if (next !== last.current) {
      last.current = next
      setStep(next)
    }
  }, [])
  useScrollTick(tick, measure)

  const on = (i: number) => !live || i <= step

  return (
    <section ref={root} id="reserve" className="how" aria-labelledby="how-title">
      <div className="how__stage">
        <div className="shell how__head">
          <Eyebrow>{reserve.eyebrow}</Eyebrow>
          <Lines id="how-title" className="d h2 how__title" parts={reserve.title} />
        </div>

        <ol ref={list} className="shell how__steps">
          {steps.map((s, i) => {
            const state = !live ? 'done' : i < step ? 'done' : i === step ? 'now' : 'next'
            return (
              <li key={s.n} className={`how__step is-${state}`} aria-current={state === 'now' ? 'step' : undefined}>
                <div className="how__top">
                  <span className="how__n d" aria-hidden="true">
                    {s.n}
                  </span>
                  {live ? (
                    <span className="how__chip label" aria-hidden="true">
                      {state === 'done' ? <Check /> : null}
                      {reserve.status[state]}
                    </span>
                  ) : null}
                </div>
                <h3 className="how__t d">{s.title}</h3>
                <p className="how__b">{s.body}</p>
              </li>
            )
          })}
        </ol>

        <div className="shell how__cta">
          <Cta origin="reserve" size="block">
            {reserve.cta}
          </Cta>
        </div>

        {/* o divisor da seção: o tatame vermelho de borda a borda, colado embaixo,
            com a faixa branca atravessando (entra pela esquerda, termina na margem) */}
        <div className="how__mat" aria-hidden="true">
          <div className="how__belt">
            <span className="how__bar">
              {steps.map((s, i) => (
                <i key={s.n} className="how__slot">
                  <i className="how__stripe" data-on={on(i) ? '' : undefined} />
                </i>
              ))}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
