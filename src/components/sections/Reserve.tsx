/* ════════════════════════════════════════════════════════════════════
   [IX] Como reservar — a faixa no palco (gramática da Lindale v2, Like
   Water "Four steps"), com TRÊS passos = três graus.

     cabeçalho (eyebrow + H2)
     ▓▓▓▓▕█▌▌▌▏═══ a faixa branca no bloco vermelho, saindo da tela ═══
     [ 01 ]   o passo: título + texto, no lugar      [ 1/3 ]

   A cena fica no palco (sticky CSS, sem pin) enquanto a rolagem troca
   os passos NO MESMO LUGAR: o número gigante gira como rolo, e a cada
   passo a ponteira preta ganha um grau com um tranco (--ease-spring). O
   último passo leva o botão. Reduced motion: lista, faixa com os 3 graus.
   Orçamento de sticky: ≈1,5 tela (hero ≈1,2) = ≤ 3 telas.
   ════════════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useRef, useState } from 'react'
import { reserve } from '@/data/site'
import { clamp01, docTop, useScrollTick } from '@/motion/scroll'
import { Cta } from '../ui/Cta'
import { Eyebrow } from '../ui/Eyebrow'
import { Lines } from '../ui/Lines'
import { Pending } from '../ui/Pending'

export function Reserve() {
  const steps = reserve.steps
  const total = steps.length
  const [step, setStep] = useState(0)
  const [live, setLive] = useState(false)
  const root = useRef<HTMLElement>(null)
  const band = useRef<HTMLDivElement>(null)
  const geo = useRef({ top: 0, run: 1 })
  const last = useRef(-1)

  useEffect(() => {
    setLive(document.documentElement.classList.contains('motion'))
  }, [])

  const measure = useCallback(() => {
    const el = root.current
    if (!el) return
    geo.current.top = docTop(el)
    geo.current.run = Math.max(1, el.offsetHeight - window.innerHeight)
  }, [])

  const tick = useCallback(
    (y: number) => {
      const p = clamp01((y - geo.current.top) / geo.current.run)
      const next = Math.min(total - 1, Math.floor(p * total))
      if (next !== last.current) {
        last.current = next
        setStep(next)
      }
    },
    [total],
  )
  useScrollTick(tick, measure)

  // O tranco: a faixa afunda um pouco cada vez que ganha um grau.
  useEffect(() => {
    if (!live) return
    band.current?.animate(
      [
        { transform: 'rotate(-1.4deg) translateY(0)' },
        { transform: 'rotate(-1.0deg) translateY(6px)' },
        { transform: 'rotate(-1.4deg) translateY(0)' },
      ],
      { duration: 420, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', delay: 120 },
    )
  }, [step, live])

  const body = (s: (typeof steps)[number]) => (
    <p className="how__b">
      {s.body}
      {'pending' in s && s.pending ? (
        <>
          {' '}
          <Pending>{s.pending}</Pending>
        </>
      ) : null}
    </p>
  )

  return (
    <section ref={root} id="reserve" className="how" aria-labelledby="how-title">
      <div className="how__stage">
        <div className="shell how__head">
          <Eyebrow>{reserve.eyebrow}</Eyebrow>
          <Lines id="how-title" className="d h2 how__title" parts={reserve.title} />
        </div>

        <div className="how__mat">
          <div ref={band} className="how__band" aria-hidden="true">
            <div className="how__fabric">
              <span className="how__bar">
                {steps.map((s, i) => (
                  <i key={s.n} className="how__stripe" data-on={!live || i <= step ? '' : undefined} />
                ))}
              </span>
            </div>
          </div>
        </div>

        {/* com movimento: uma linha ancorada, um passo por vez */}
        <div className="shell how__row">
          <p className="how__num d" aria-hidden="true">
            <span className="how__reel" style={{ transform: `translateY(${(-step * 100) / total}%)` }}>
              {steps.map((s) => (
                <span key={s.n} data-n={s.n} />
              ))}
            </span>
          </p>
          <ol className="how__stack">
            {steps.map((s, i) => (
              <li key={s.n} className={['how__step', i === step && 'is-on', i < step && 'is-past'].filter(Boolean).join(' ')} aria-current={i === step ? 'step' : undefined} inert={live && i !== step}>
                <h3 className="how__t d">{s.title}</h3>
                {body(s)}
                {i === total - 1 ? (
                  <div className="how__cta">
                    <Cta origin="reserve" size="block">
                      {reserve.cta}
                    </Cta>
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
          <p className="how__meter" aria-hidden="true">
            <b className="d">
              {step + 1}/{total}
            </b>
            {reserve.meter}
          </p>
        </div>

        {/* sem movimento: a lista */}
        <div className="shell how__still">
          <ol className="how__list">
            {steps.map((s) => (
              <li key={s.n}>
                <span className="how__listn d" aria-hidden="true">
                  {s.n}
                </span>
                <div>
                  <h3 className="how__t d">{s.title}</h3>
                  {body(s)}
                </div>
              </li>
            ))}
          </ol>
          <div className="how__cta">
            <Cta origin="reserve" size="block">
              {reserve.cta}
            </Cta>
          </div>
        </div>
      </div>
    </section>
  )
}
