/* ════════════════════════════════════════════════════════════════════
   O que as versões do "How to reserve" dividem: os passos, o texto de
   cada passo (com a pendência numa linha só dela), o cabeçalho, a lista
   sem movimento e os ganchos de palco (progresso do sticky).
   ════════════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { reserve } from '@/data/site'
import { clamp01, docTop, useScrollTick } from '@/motion/scroll'
import { Cta } from '../../ui/Cta'
import { Eyebrow } from '../../ui/Eyebrow'
import { Lines } from '../../ui/Lines'
import { Pending } from '../../ui/Pending'

export const steps = reserve.steps
export const total = steps.length
export type Step = (typeof steps)[number]

/** true só no navegador e só com html.motion (o mesmo portão da página). */
export function useLive() {
  const [live, setLive] = useState(false)
  useEffect(() => setLive(document.documentElement.classList.contains('motion')), [])
  return live
}

/** Palco sticky: progresso 0→1 ao longo da altura extra da seção.
    `onP` recebe o progresso a cada frame (escreve no DOM, sem estado);
    `also` mede o que mais a versão precisar, junto com o palco. */
export function useStage(root: RefObject<HTMLElement | null>, onP?: (p: number) => void, also?: () => void) {
  const geo = useRef({ top: 0, run: 1 })
  const measure = useCallback(() => {
    const el = root.current
    if (!el) return
    geo.current.top = docTop(el)
    geo.current.run = Math.max(1, el.offsetHeight - window.innerHeight)
    also?.()
  }, [root, also])
  const tick = useCallback((y: number) => onP?.(clamp01((y - geo.current.top) / geo.current.run)), [onP])
  useScrollTick(tick, measure)
}

export function Head() {
  return (
    <div className="shell how__head">
      <Eyebrow>{reserve.eyebrow}</Eyebrow>
      <Lines id="how-title" className="d h2 how__title" parts={reserve.title} />
    </div>
  )
}

export function Body({ s }: { s: Step }) {
  return (
    <>
      <p className="how__b">{s.body}</p>
      {'pending' in s && s.pending ? (
        <p className="how__pend">
          <Pending>{s.pending}</Pending>
        </p>
      ) : null}
    </>
  )
}

export function ReserveCta() {
  return (
    <div className="how__cta">
      <Cta origin="reserve" size="block">
        {reserve.cta}
      </Cta>
    </div>
  )
}

/** Sem movimento: a lista numerada e o botão. */
export function Still() {
  return (
    <div className="shell how__still">
      <ol className="how__list">
        {steps.map((s) => (
          <li key={s.n}>
            <span className="how__listn d" aria-hidden="true">
              {s.n}
            </span>
            <div>
              <h3 className="how__t d">{s.title}</h3>
              <Body s={s} />
            </div>
          </li>
        ))}
      </ol>
      <ReserveCta />
    </div>
  )
}
