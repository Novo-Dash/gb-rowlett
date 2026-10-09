/* ════════════════════════════════════════════════════════════════════
   [IX · C] Como reservar — A FAIXA EM PÉ.

     cabeçalho        ║   01  Pre-register.
     (fixo ao lado)   ║       texto
                      █   02  We confirm your spot.      ← a ponteira chegou
                      ▌       texto
                          03  Doors open.  [botão]

   Sem palco preso: a seção rola normal. Uma faixa branca desce em pé ao
   lado dos passos, puxada pela rolagem, com a ponteira PRETA na frente.
   Quando a ponteira passa por um passo, ele acende e ela ganha um grau.
   No desktop o cabeçalho fica parado à esquerda (sticky de CSS).
   Reduced motion: a faixa já inteira, a ponteira no fim com os 3 graus,
   tudo aceso.
   ════════════════════════════════════════════════════════════════════ */

import { useCallback, useRef, useState } from 'react'
import { clamp01, docTop, useScrollTick } from '@/motion/scroll'
import { Body, Head, ReserveCta, steps, total, useLive } from './shared'

export function ReserveRail() {
  const live = useLive()
  const rail = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLOListElement>(null)
  const geo = useRef({ top: 0, h: 1, tip: 0, marks: [] as number[] })
  const last = useRef(-1)
  const [step, setStep] = useState(-1)

  const measure = useCallback(() => {
    const r = rail.current
    const l = list.current
    if (!r || !l) return
    const top = docTop(r)
    geo.current.top = top
    geo.current.h = Math.max(1, r.offsetHeight)
    geo.current.tip = (r.querySelector('.hc__tip') as HTMLElement | null)?.offsetHeight ?? 0
    // cada passo acende quando a ponta da faixa alcança a linha do título
    geo.current.marks = Array.from(l.children).map((li) => docTop(li as HTMLElement) - top + 28)
  }, [])

  const tick = useCallback((y: number, vh: number) => {
    const g = geo.current
    const r = rail.current
    if (!r) return
    // a ponta da faixa segue uma linha a 62% da tela
    const reach = clamp01((y + vh * 0.62 - g.top) / g.h) * g.h
    r.style.setProperty('--reach', `${reach.toFixed(1)}px`)
    r.style.setProperty('--ty', `${Math.max(0, reach - g.tip).toFixed(1)}px`)
    let n = -1
    g.marks.forEach((m, i) => {
      if (reach >= m) n = i
    })
    if (n !== last.current) {
      last.current = n
      setStep(n)
    }
  }, [])
  useScrollTick(tick, measure)

  const lit = (i: number) => !live || i <= step

  return (
    <section id="reserve" className="hc" aria-labelledby="how-title">
      <div className="hc__in">
        <div className="hc__side">
          <Head />
        </div>
        <div className="shell hc__body">
          <div ref={rail} className="hc__rail" aria-hidden="true">
            <span className="hc__cloth" />
            <span className="hc__tip">
              {steps.map((s, i) => (
                <i key={s.n} className="hc__stripe" data-on={lit(i) ? '' : undefined} />
              ))}
            </span>
          </div>
          <ol ref={list} className="hc__list">
            {steps.map((s, i) => (
              <li key={s.n} className={['hc__step', lit(i) && 'is-on'].filter(Boolean).join(' ')}>
                <span className="hc__n d" aria-hidden="true">
                  {s.n}
                </span>
                <div className="hc__txt">
                  <h3 className="how__t d">{s.title}</h3>
                  <Body s={s} />
                  {i === total - 1 ? <ReserveCta /> : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
