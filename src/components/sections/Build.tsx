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

import { useEffect, useRef, useState } from 'react'
import { build } from '@/data/site'
import { useInView } from '@/motion/inview'
import { Cta } from '../ui/Cta'
import { Eyebrow } from '../ui/Eyebrow'
import { Arrow, Close, Expand, Tri } from '../ui/Icons'
import { Lines } from '../ui/Lines'
import { Pending } from '../ui/Pending'
import { Pic } from '../ui/Pic'

export function Build() {
  const row = useRef<HTMLUListElement>(null)
  const plates = useRef<HTMLUListElement>(null)
  const [show, setShow] = useState<number | null>(null)
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
            {/* cada foto amplia (pedido do João Vitor): abre a galeria em tela cheia */}
            <button type="button" className="build__zoom" aria-label={`${build.zoom}: ${s.title}`} onClick={() => setShow(i)}>
              <Pic name={s.image} alt={s.title} sizes="(min-width: 768px) 20vw, 50vw" />
              <span className="build__veil" aria-hidden="true" />
              <span className="build__plus" aria-hidden="true">
                <Expand />
              </span>
            </button>
          </li>
        ))}
      </ul>
      {show !== null ? <Lightbox index={show} onIndex={setShow} onClose={() => setShow(null)} /> : null}

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

/** A galeria em tela cheia: a foto inteira (sem o recorte 4:5), setas, Esc fecha, clique fora fecha. */
function Lightbox({ index, onIndex, onClose }: { index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const n = build.stages.length
  const go = (d: number) => onIndex((index + d + n) % n)
  const s = build.stages[index]
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    const { body } = document
    const prev = body.style.overflow
    body.style.overflow = 'hidden'
    ref.current?.focus()
    return () => {
      body.style.overflow = prev
      if (opener?.isConnected) opener.focus()
    }
  }, [])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onIndex((index + 1) % n)
      if (e.key === 'ArrowLeft') onIndex((index - 1 + n) % n)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [index, n, onClose, onIndex])
  return (
    <div ref={ref} className="lbx" role="dialog" aria-modal="true" aria-label={build.galleryLabel} tabIndex={-1} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <figure className="lbx__fig">
        <picture>
          <source type="image/avif" srcSet={`/img/${s.image}-full.avif`} />
          <img key={s.image} src={`/img/${s.image}-full.webp`} alt={s.title} width={1200} height={1600} className="lbx__img" />
        </picture>
        <figcaption className="lbx__cap">
          <span className="label">
            {index + 1} / {n}
          </span>
          {s.title}
        </figcaption>
      </figure>
      <button type="button" className="lbx__btn lbx__btn--prev" aria-label={build.prev} onClick={() => go(-1)}>
        <Arrow />
      </button>
      <button type="button" className="lbx__btn lbx__btn--next" aria-label={build.next} onClick={() => go(1)}>
        <Arrow />
      </button>
      <button type="button" className="lbx__close" aria-label={build.close} onClick={onClose}>
        <Close />
      </button>
    </div>
  )
}
