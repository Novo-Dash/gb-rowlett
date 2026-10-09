/* ════════════════════════════════════════════════════════════════════
   [II] A oferta de fundação — os ingressos (arquitetura da Collective,
   linguagem GB).

   Dois ingressos de cantos retos. O ABERTO é um ingresso vermelho
   (degradê do botão): pastilha "Open now" com ponto pulsando, preço
   grande, "No enrollment fee", o perk DESTA faixa, barra de vagas em
   branco sobre red-deep, picote (linha tracejada com dois furos) e o
   talão só com o botão BRANCO de seta vermelha. O TRAVADO é borrado a
   5px com o triângulo marinho no centro (sr-only para leitor de tela):
   o perk dele fica legível por trás do borrão. O carimbo de dias até a
   abertura morde o canto do aberto (some sem data: pendência).
   Aqui o desconto não decresce; o PERK decresce (uniforme → 50%).
   Comparação sempre visível embaixo: a tabela normal riscando o preço
   de fundador, não o contrário.
   ════════════════════════════════════════════════════════════════════ */

import { useRef } from 'react'
import { offer, openTier, pricing, site, spotsLeft, tiers, type Tier } from '@/data/site'
import { useDaysLeft } from '@/hooks/useCountdown'
import { useInView } from '@/motion/inview'
import { trackViewContent } from '@/track'
import { Cta } from '../ui/Cta'
import { Eyebrow } from '../ui/Eyebrow'
import { Tri, TriOutline } from '../ui/Icons'
import { Lines } from '../ui/Lines'
import { Pending } from '../ui/Pending'
import { Stamp } from '../ui/Stamp'

export function Offer() {
  const root = useRef<HTMLElement>(null)
  const list = useRef<HTMLDivElement>(null)
  useInView(root, () => trackViewContent('offer'))
  useInView(list)
  const days = useDaysLeft(site.openingISO)

  return (
    <section ref={root} id="offer" className="offer" aria-labelledby="offer-title">
      <div className="shell">
        <div className="offer__head">
          <div>
            <Eyebrow>{offer.eyebrow}</Eyebrow>
            <Lines id="offer-title" className="d h2 h2--long offer__title" parts={offer.title} />
          </div>
          <div className="offer__aside">
            <p className="body offer__body">{offer.body}</p>
            {pricing.permanent === null ? (
              <p className="offer__pend">
                <Pending>{offer.permanencePending}</Pending>
              </p>
            ) : null}
          </div>
        </div>

        <div ref={list} className="tickets">
          {tiers.map((t, i) => (t.id === openTier.id ? <OpenTicket key={t.id} tier={t} index={i} days={days} /> : <LockedTicket key={t.id} tier={t} index={i} />))}
        </div>

        <p className="offer__compare">
          <span className="label">{offer.compare.label}</span>
          <s className="offer__was d">{offer.compare.founding}</s>
          <b className="d">{offer.compare.standard}</b>
          <span>{offer.compare.per}</span>
          <span className="offer__plus">{offer.compare.plus}</span>
        </p>
      </div>
    </section>
  )
}

function OpenTicket({ tier, index, days }: { tier: Tier; index: number; days: number | null }) {
  const left = spotsLeft(tier)
  const pct = tier.seats && tier.claimed !== null ? tier.claimed / tier.seats : 0
  return (
    <article className="tk tk--open on-dark rise" style={{ ['--i' as string]: index }} aria-label={`${tier.order} · ${tier.label}`}>
      <p className="tk__pill label">
        <i aria-hidden="true" />
        {offer.openPill}
      </p>
      <div className="tk__body">
        <p className="tk__order label">
          <span className="tnum">{tier.order}</span> · {tier.label}
        </p>
        <p className="tk__price">
          <span className="tk__amount d">{offer.priceLine}</span>
          <span className="tk__per">{offer.pricePer}</span>
        </p>
        <p className="tk__enroll d">{offer.enrollmentLine}</p>
        <p className="tk__perk">
          <Tri />
          <span>{tier.perk.title}</span>
        </p>
        <div className="tk__seats">
          <div className="tk__seatrow label">
            {tier.seats !== null && tier.claimed !== null ? (
              <>
                <span>{offer.takenLabel(tier.claimed, tier.seats)}</span>
                <span>{offer.leftLabel(left ?? 0)}</span>
              </>
            ) : (
              <>
                <span>{tier.seats !== null ? offer.seatsLabel(tier.seats) : null}</span>
                <Pending>{offer.claimedPending}</Pending>
              </>
            )}
          </div>
          <div className="tk__bar" aria-hidden="true">
            <span style={{ ['--pct' as string]: pct }} />
          </div>
        </div>
      </div>
      <div className="tk__perf" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="tk__stub">
        <Cta origin="ticket" size="block" className="cta--inverse">
          {offer.ticketCta}
        </Cta>
      </div>
      <div className="tk__stampwrap">
        <Stamp id="offer" className="tk__stamp" ring={offer.stamp.ring} value={days} label={offer.stamp.label} srText={days !== null ? `${days} ${offer.stamp.sr}` : undefined} />
        {days === null ? <Pending className="tk__stamp-pending">{offer.stampPending}</Pending> : null}
      </div>
    </article>
  )
}

function LockedTicket({ tier, index }: { tier: Tier; index: number }) {
  return (
    <article className="tk tk--locked rise" style={{ ['--i' as string]: index }} aria-label={`${tier.order} · ${tier.label}`}>
      <p className="sr-only">
        {tier.order} · {tier.label}. {offer.lockedSr} {tier.perk.title}.
      </p>
      <p className="tk__pill tk__pill--navy label">{offer.lockedPill}</p>
      <div className="tk__body tk__blur" aria-hidden="true">
        <p className="tk__order label">
          <span className="tnum">{tier.order}</span> · {tier.label}
        </p>
        <p className="tk__price">
          <span className="tk__amount d">{offer.priceLine}</span>
          <span className="tk__per">{offer.pricePer}</span>
        </p>
        <p className="tk__enroll d">{offer.enrollmentLine}</p>
        <p className="tk__perk">
          <Tri />
          <span>{tier.perk.title}</span>
        </p>
        <p className="tk__note">{tier.note}</p>
      </div>
      <span className="tk__lock" aria-hidden="true">
        <TriOutline />
      </span>
      {tier.seats === null ? (
        <p className="tk__seatpend">
          <Pending>{offer.seatsPending}</Pending>
        </p>
      ) : null}
    </article>
  )
}
