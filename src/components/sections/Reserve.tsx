/* ════════════════════════════════════════════════════════════════════
   [IX] Como reservar — os três passos lado a lado e a faixa embaixo
   (referência do Adryan, 9 out 2026).

              WHAT HAPPENS NEXT
           HOW TO RESERVE YOUR SPOT.
     ┌▀▀▀▀▀▀▀▀▀▀┐  ┌▀▀▀▀▀▀▀▀▀▀┐  ┌──────────┐
     │01  1/3   │  │02  2/3   │  │⌗03  3/3  │   (card aceso × card apagado)
     │título    │  │título    │  │título    │
     │texto     │  │texto     │  │texto     │
     └──────────┘  └──────────┘  └──────────┘
              [ Claim my Founding Member spot ]
     ▓▓▓ tatame vermelho ═══ a faixa branca ═══▐█▌▌ ▏═ ▓▓▓  ← o divisor da seção

   A cena fica no palco (sticky CSS) enquanto a rolagem anda: a cada
   passo alcançado o card acende (régua vermelha, número cheio, sombra)
   e a ponteira preta da faixa ganha um grau (os três encaixes vazios já
   aparecem, então se vê o que falta). Sem movimento (ou reduced motion):
   tudo aceso, a faixa com os três graus, sem palco preso.
   ════════════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useRef, useState } from 'react'
import { reserve } from '@/data/site'
import { clamp01, docTop, useScrollTick } from '@/motion/scroll'
import { Cta } from '../ui/Cta'
import { Eyebrow } from '../ui/Eyebrow'
import { Lines } from '../ui/Lines'
import { Pending } from '../ui/Pending'

const steps = reserve.steps
const total = steps.length

export function Reserve() {
  const [live, setLive] = useState(false)
  const [step, setStep] = useState(0)
  const root = useRef<HTMLElement>(null)
  const geo = useRef({ top: 0, run: 1 })
  const last = useRef(0)

  useEffect(() => setLive(document.documentElement.classList.contains('motion')), [])

  const measure = useCallback(() => {
    const el = root.current
    if (!el) return
    geo.current.top = docTop(el)
    geo.current.run = Math.max(1, el.offsetHeight - window.innerHeight)
  }, [])

  const tick = useCallback((y: number) => {
    const p = clamp01((y - geo.current.top) / geo.current.run)
    const next = Math.min(total - 1, Math.floor(p * total))
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

        <ol className="shell how__steps">
          {steps.map((s, i) => (
            <li key={s.n} className={['how__step', on(i) && 'is-on', live && i === step && 'is-now'].filter(Boolean).join(' ')} aria-current={live && i === step ? 'step' : undefined}>
              <div className="how__top">
                <span className="how__n d" aria-hidden="true">
                  {s.n}
                </span>
                <span className="how__of label" aria-hidden="true">
                  Step {i + 1}/{total}
                </span>
              </div>
              <h3 className="how__t d">{s.title}</h3>
              <p className="how__b">{s.body}</p>
              {'pending' in s && s.pending ? (
                <p className="how__pend">
                  <Pending>{s.pending}</Pending>
                </p>
              ) : null}
            </li>
          ))}
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
