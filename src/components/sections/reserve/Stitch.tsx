/* ════════════════════════════════════════════════════════════════════
   [IX · B] Como reservar — A FAIXA BORDADA.

     cabeçalho
     ════ faixa PRETA (a do professor) ══ WE CONFIRM YOUR SPOT. ══ ▐▌▌▌▏═
     Step 02 / 03   o texto do passo                       (o botão no 3)

   A faixa preta atravessa a tela com a ponteira VERMELHA na ponta. A cada
   passo o título é BORDADO na faixa, ponto a ponto, da esquerda para a
   direita (clip em steps(), com a agulha correndo na frente), e a
   ponteira ganha um grau branco. Palco sticky de ~1,5 tela, como a A.
   Reduced motion: a lista; a faixa não aparece.
   ════════════════════════════════════════════════════════════════════ */

import { useCallback, useRef, useState } from 'react'
import { useInView } from '@/motion/inview'
import { Body, Head, ReserveCta, Still, steps, total, useLive, useStage } from './shared'

export function ReserveStitch() {
  const live = useLive()
  const root = useRef<HTMLElement>(null)
  const [step, setStep] = useState(0)
  const last = useRef(0)
  useInView(root)

  const onP = useCallback((p: number) => {
    const next = Math.min(total - 1, Math.floor(p * total))
    if (next !== last.current) {
      last.current = next
      setStep(next)
    }
  }, [])
  useStage(root, onP)

  const s = steps[step]

  return (
    <section ref={root} id="reserve" className="how hb" aria-labelledby="how-title">
      <div className="how__stage hb__stage">
        <Head />

        <div className="hb__belt" aria-hidden="true">
          <div className="hb__fabric">
            <div className="hb__line">
              {/* a key troca a cada passo: o bordado novo nasce e é costurado de novo */}
              <span key={s.n} className="hb__emb d">
                <span className="hb__thread">{s.title}</span>
                <span className="hb__needle" />
              </span>
            </div>
            <span className="hb__bar">
              {steps.map((x, i) => (
                <i key={x.n} className="hb__stripe" data-on={!live || i <= step ? '' : undefined} />
              ))}
            </span>
          </div>
        </div>

        <div className="shell hb__row">
          <p className="hb__count" aria-hidden="true">
            <span className="label">Step</span>
            <b className="d">{s.n}</b>
            <span className="hb__of d">/ {String(total).padStart(2, '0')}</span>
          </p>
          <ol className="hb__stack">
            {steps.map((x, i) => (
              <li key={x.n} className={['hb__step', i === step && 'is-on'].filter(Boolean).join(' ')} aria-current={i === step ? 'step' : undefined} inert={live && i !== step}>
                {/* o título visível está bordado na faixa; aqui ele fica para o leitor de tela */}
                <h3 className="sr-only">{x.title}</h3>
                <Body s={x} />
                {i === total - 1 ? <ReserveCta /> : null}
              </li>
            ))}
          </ol>
        </div>

        <Still />
      </div>
    </section>
  )
}
