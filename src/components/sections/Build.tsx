/* ════════════════════════════════════════════════════════════════════
   [IV] A obra (= Why Us) — "The academy is new. That's your advantage."

   Pastilha vermelha com a etapa atual (vem do dado; pendente = marcador)
   e cinco fotos REAIS em fila de borda a borda, cantos retos, véu marinho
   a 18% em repouso. Hover: as outras quatro caem a 45%, a apontada sobe,
   cresce e perde o véu (CSS puro, sem estado). As fotos da obra são
   prova: sem filtro que as faça parecer render. As três razões de "why us"
   ficam ACIMA das fotos, em três cards de mesma altura (régua vermelha,
   número num quadrado vermelho, título, texto); o botão fica centralizado
   embaixo da fila.
   ════════════════════════════════════════════════════════════════════ */

import { useRef } from 'react'
import { build } from '@/data/site'
import { useInView } from '@/motion/inview'
import { Cta } from '../ui/Cta'
import { Eyebrow } from '../ui/Eyebrow'
import { Tri } from '../ui/Icons'
import { Lines } from '../ui/Lines'
import { Pending } from '../ui/Pending'
import { Pic } from '../ui/Pic'

export function Build() {
  const row = useRef<HTMLUListElement>(null)
  const plates = useRef<HTMLOListElement>(null)
  useInView(row)
  useInView(plates)

  return (
    <section id="build" className="build" aria-labelledby="build-title">
      <div className="shell build__head">
        <div>
          <Eyebrow>{build.eyebrow}</Eyebrow>
          <Lines id="build-title" className="d h2 h2--long build__title" parts={build.title} />
        </div>
        <div className="build__aside">
          <p className="body">{build.body}</p>
          <p className="build__phase">
            <span className="build__pill label">
              <Tri />
              {build.phaseLabel}
            </span>
            {build.phase ? <span className="build__stage">{build.phase}</span> : <Pending>{build.phasePending}</Pending>}
          </p>
        </div>
      </div>

      {/* as três razões, ACIMA das fotos, em cards: número + título + texto */}
      <div className="shell">
        <ol ref={plates} className="build__why">
          {build.plates.map((p, i) => (
            <li key={p.title} className="why rise" style={{ ['--i' as string]: i }}>
              <div className="why__head">
                <span className="why__n d" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="why__t d">{p.title}</h3>
              </div>
              <p className="why__b">{p.body}</p>
            </li>
          ))}
        </ol>
      </div>

      <ul ref={row} className="build__row" aria-label="The build, in photos">
        {build.stages.map((s, i) => (
          <li key={s.id} className="build__cell" style={{ ['--k' as string]: i }}>
            <Pic name={s.image} alt={s.title} sizes="(min-width: 768px) 20vw, 50vw" />
            <span className="build__veil" aria-hidden="true" />
          </li>
        ))}
      </ul>

      <div className="shell">
        <div className="build__cta">
          <Cta origin="build" size="block">
            {build.cta}
          </Cta>
        </div>
      </div>
    </section>
  )
}
