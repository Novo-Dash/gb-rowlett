/* ════════════════════════════════════════════════════════════════════
   [IX · D] Como reservar — A FAIXA QUE DESENROLA.

     cabeçalho
     ═══ 01 Pre-register … ┊ 02 We confirm … ┊ 03 Doors open … ▐█▌▌▌█▏
     ← a rolagem empurra a faixa para a esquerda          1/3  [botão]

   O palco fica parado (sticky) e a rolagem vertical puxa uma faixa
   branca LONGA para o lado. Os três passos estão escritos nela, separados
   por costuras. No fim chega a ponteira preta e os três graus são
   costurados nela, um a um. O botão fica sempre embaixo da faixa.
   Palco: ~1,8 tela de rolagem. Reduced motion: a lista.
   ════════════════════════════════════════════════════════════════════ */

import { useCallback, useRef, useState } from 'react'
import { reserve } from '@/data/site'
import { Body, Head, ReserveCta, Still, steps, total, useLive, useStage } from './shared'

export function ReserveRoll() {
  const live = useLive()
  const root = useRef<HTMLElement>(null)
  const belt = useRef<HTMLDivElement>(null)
  const geo = useRef({ travel: 0, tipIn: 0.8, segs: [] as number[], vw: 1 })
  const state = useRef({ step: 0, stripes: 0 })
  const [view, setView] = useState({ step: 0, stripes: 0 })

  const measure = useCallback(() => {
    const b = belt.current
    if (!b) return
    const vw = window.innerWidth
    const pad = parseFloat(getComputedStyle(b).paddingLeft) || 0
    const travel = Math.max(0, b.scrollWidth - vw + pad)
    const tip = b.querySelector('.hd__tip') as HTMLElement | null
    geo.current.vw = vw
    geo.current.travel = travel
    // a ponteira "chegou" quando a borda dela passa de 70% da tela
    geo.current.tipIn = tip && travel ? Math.min(0.92, Math.max(0, (tip.offsetLeft - vw * 0.7) / travel)) : 0.8
    geo.current.segs = Array.from(b.querySelectorAll<HTMLElement>('.hd__seg')).map((s) => s.offsetLeft + s.offsetWidth * 0.35)
  }, [])

  const onP = useCallback((p: number) => {
    const g = geo.current
    const b = belt.current
    if (!b) return
    // um respiro no começo e no fim: a faixa assenta antes de andar e depois de chegar
    const q = Math.min(1, Math.max(0, (p - 0.04) / 0.88))
    const x = -q * g.travel
    b.style.setProperty('--x', `${x.toFixed(1)}px`)
    let step = 0
    g.segs.forEach((c, i) => {
      if (c + x < g.vw * 0.55) step = i
    })
    const k = q <= g.tipIn ? 0 : Math.min(total, Math.ceil(((q - g.tipIn) / (1 - g.tipIn)) * total * 1.15))
    if (step !== state.current.step || k !== state.current.stripes) {
      state.current = { step, stripes: k }
      setView({ step, stripes: k })
    }
  }, [])
  useStage(root, onP, measure)

  return (
    <section ref={root} id="reserve" className="how hd" aria-labelledby="how-title">
      <div className="how__stage hd__stage">
        <Head />

        <div className="hd__track">
          <div ref={belt} className="hd__belt">
            <ol className="hd__segs">
              {steps.map((s, i) => (
                <li key={s.n} className={['hd__seg', (!live || i <= view.step) && 'is-on'].filter(Boolean).join(' ')}>
                  <span className="hd__n d" aria-hidden="true">
                    {s.n}
                  </span>
                  <h3 className="how__t d">{s.title}</h3>
                  <Body s={s} />
                </li>
              ))}
            </ol>
            <span className="hd__tip" aria-hidden="true">
              {steps.map((s, i) => (
                <i key={s.n} className="hd__stripe" data-on={!live || i < view.stripes ? '' : undefined} />
              ))}
            </span>
          </div>
        </div>

        <div className="shell hd__foot">
          <p className="how__meter" aria-hidden="true">
            <b className="d">
              {view.step + 1}/{total}
            </b>
            {reserve.meter}
          </p>
          <ReserveCta />
        </div>

        <Still />
      </div>
    </section>
  )
}
