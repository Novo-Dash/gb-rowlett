/* ════════════════════════════════════════════════════════════════════
   [X] Abertura — o contador, na ÚNICA banda escura do corpo (--night),
   com a fachada a 30% ao fundo. "The doors open in" em red-glow com
   duplicado, o odômetro de dias/horas/min/seg (rolos de dígito, HTML já
   nasce no valor, largura reservada) e o registro em <dl> de 4 colunas.
   Fundo e véu em preto. Sem data confirmada, o odômetro conta até a data
   PROVISÓRIA de 30 dias (opening.countdownISO), com a pendência embaixo.
   ════════════════════════════════════════════════════════════════════ */

import { opening, site } from '@/data/site'
import { useCountdown } from '@/hooks/useCountdown'
import { Cta } from '../ui/Cta'
import { Eyebrow } from '../ui/Eyebrow'
import { Lines } from '../ui/Lines'
import { Odo } from '../ui/Odo'
import { Pending } from '../ui/Pending'
import { Pic } from '../ui/Pic'

export function Opening() {
  const iso = site.openingISO ?? opening.countdownISO
  const t = useCountdown(iso)
  const values = t ? [t.days, t.hours, t.minutes, t.seconds] : null

  return (
    <section id="opening" className="open on-dark" aria-labelledby="opening-title">
      <div className="open__bg" aria-hidden="true">
        <Pic name="opening" alt="" sizes="100vw" />
        <span className="open__veil" />
      </div>
      <div className="shell open__in">
        <div className="open__head">
          <Eyebrow tone="light">{opening.eyebrow}</Eyebrow>
          <Lines id="opening-title" className="d h2 open__title" parts={[{ text: opening.title[0].text, accent: true }]} />
        </div>

        <div className="odometer" role="timer" aria-live="off" aria-label={`${opening.title[0].text} ${t ? `${t.days} days ${t.hours} hours ${t.minutes} minutes` : ''}`}>
          {opening.units.map((u, i) => (
            <div key={u} className="odometer__unit">
              <span className="odometer__n d">
                <Odo value={values ? values[i] : 0} pad={2} live />
              </span>
              <span className="odometer__l label">{u}</span>
            </div>
          ))}
        </div>
        {site.openingISO ? null : (
          <p className="open__prov">
            <Pending tone="red">{opening.countdownPending}</Pending>
          </p>
        )}

        <dl className="open__register">
          {opening.register.map((r) => (
            <div key={r.term} className="open__reg">
              <dt className="label">{r.term}</dt>
              <dd className="d">{r.value ?? <Pending>{r.pending}</Pending>}</dd>
            </div>
          ))}
        </dl>

        <div className="open__cta">
          <Cta origin="opening" size="block">
            {opening.cta}
          </Cta>
        </div>
      </div>
    </section>
  )
}
