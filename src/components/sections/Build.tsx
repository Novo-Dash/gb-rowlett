/* ════════════════════════════════════════════════════════════════════
   [IV] A obra (= Why Us) — "The academy is new. That's your advantage."

   Pastilha vermelha com a etapa atual (vem do dado; pendente = marcador)
   e cinco fotos REAIS em fila de borda a borda, cantos retos, véu marinho
   a 18% em repouso. Hover: as outras quatro caem a 45%, a apontada sobe,
   cresce e perde o véu (CSS puro, sem estado). As fotos da obra são
   prova: sem filtro que as faça parecer render. As três razões de "why us"
   ficam ACIMA das fotos como tópicos: só o título, com o triângulo GB
   vermelho de marcador; o botão fica centralizado embaixo da fila.
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
  const plates = useRef<HTMLUListElement>(null)
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

      {/* as três razões, ACIMA das fotos, em tópicos: só o título */}
      <div className="shell">
        <ul ref={plates} className="build__why">
          {build.plates.map((p, i) => (
            <li key={p} className="why rise" style={{ ['--i' as string]: i }}>
              <Tri className="why__mark" />
              <h3 className="why__t d">{p}</h3>
            </li>
          ))}
        </ul>
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
