/* ════════════════════════════════════════════════════════════════════
   [VIII] Coach — retrato 4/5 + ficha em <dl> com fios. Os dados que o
   cliente não mandou (faixa, linhagem, datas) aparecem como pendência
   visível: a foto mostra faixa-preta, mas o PRD só publica credencial
   confirmada por escrito. Fica em VIII até lá.
   ════════════════════════════════════════════════════════════════════ */

import { useRef } from 'react'
import { coach } from '@/data/site'
import { useInView } from '@/motion/inview'
import { Cta } from '../ui/Cta'
import { Eyebrow } from '../ui/Eyebrow'
import { Lines } from '../ui/Lines'
import { Pending } from '../ui/Pending'
import { Pic } from '../ui/Pic'

export function Coach() {
  const sheet = useRef<HTMLDListElement>(null)
  useInView(sheet)
  return (
    <section id="coach" className="coach" aria-labelledby="coach-title">
      <div className="shell coach__in">
        <figure className="coach__photo">
          <Pic name="coach" alt={coach.photoAlt} sizes="(min-width: 1024px) 36vw, 90vw" />
        </figure>
        <div className="coach__copy">
          <Eyebrow>{coach.eyebrow}</Eyebrow>
          <Lines id="coach-title" className="d h2 coach__title" parts={[{ text: coach.name }]} />
          <p className="lead coach__lead">{coach.lead}</p>
          <dl ref={sheet} className="coach__sheet">
            {coach.sheet.map((row, i) => (
              <div key={row.term} className="coach__row rise" style={{ ['--i' as string]: i }}>
                <dt className="label">{row.term}</dt>
                <dd>{row.value ?? <Pending>{row.pending}</Pending>}</dd>
              </div>
            ))}
          </dl>
          <div className="coach__cta">
            <Cta origin="coach" size="auto">
              {coach.cta}
            </Cta>
          </div>
        </div>
      </div>
    </section>
  )
}
