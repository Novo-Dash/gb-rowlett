/* ════════════════════════════════════════════════════════════════════
   [II] A oferta de fundação — UM ingresso na largura da seção, com os
   dois grupos dentro dele (decisões do Adryan, 9 out 2026: são só dois
   grupos, então é um ingresso só; e o canhoto não borra, porque o preço
   é o mesmo — o que muda entre os grupos é o PERK).

     ┌─ I · The First 50 · Open now ──────┐┆┌─ II · The Founding Class ─┐
     │ [card vermelho: $87, no enrollment, ┆│ [50% OFF                   │
     │  uniforme incluído, vagas, botão]   ┆│  the Gracie Barra uniform  │
     │                                     ┆│  Same $87 · no enrollment] │
     │ After opening: $87 → $107 + $47     ┆│ Opens when the First 50…   │
     └─────────────────────────────────────┘┆└────────────────────────────┘
                                   (picote com os dois furos)

   O corpo é marinho; a metade I leva o card vermelho (degradê do botão)
   com o botão BRANCO de seta vermelha; a metade II é o canhoto: o MESMO
   quadrado do card I, em marinho um degrau mais claro, com o conteúdo
   borrado e "Coming soon" + cadeado no centro (pedido do Adryan). O carimbo de dias
   até a abertura morde o canto do card I quando a data existir; sem data,
   vira pendência no pé. No celular as metades empilham e o picote fica
   horizontal.
   ════════════════════════════════════════════════════════════════════ */

import { useRef } from 'react'
import { offer, openTier, pricing, site, spotsLeft, tiers, type Tier } from '@/data/site'
import { useDaysLeft } from '@/hooks/useCountdown'
import { useInView } from '@/motion/inview'
import { trackViewContent } from '@/track'
import { Cta } from '../ui/Cta'
import { Eyebrow } from '../ui/Eyebrow'
import { Lock, Tri } from '../ui/Icons'
import { Lines } from '../ui/Lines'
import { Pending } from '../ui/Pending'
import { Stamp } from '../ui/Stamp'

export function Offer() {
  const root = useRef<HTMLElement>(null)
  const pass = useRef<HTMLDivElement>(null)
  useInView(root, () => trackViewContent('offer'))
  useInView(pass)
  const days = useDaysLeft(site.openingISO)
  const open = tiers.find((t) => t.id === openTier.id)!
  const next = tiers.find((t) => t.id !== openTier.id)!

  return (
    <section ref={root} id="offer" className="offer" aria-labelledby="offer-title">
      <div className="shell">
        <div className="offer__head">
          <div>
            <Eyebrow>{offer.eyebrow}</Eyebrow>
            <Lines id="offer-title" className="d h2 offer__title" parts={offer.title} />
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

        <div ref={pass} className="pass on-dark" role="group" aria-label={offer.passLabel}>
          <OpenHalf tier={open} days={days} />
          <span className="pass__perf" aria-hidden="true" />
          <NextHalf tier={next} />
        </div>
      </div>
    </section>
  )
}

function HalfHead({ tier, pill, tone }: { tier: Tier; pill: string; tone: 'open' | 'next' }) {
  return (
    <p className="pass__head">
      <span className="pass__order label">
        <Tri />
        <span className="tnum">{tier.order}</span> · {tier.label}
      </span>
      <span className={`pass__pill pass__pill--${tone} label`}>
        {tone === 'open' ? <i aria-hidden="true" /> : null}
        {pill}
      </span>
    </p>
  )
}

function OpenHalf({ tier, days }: { tier: Tier; days: number | null }) {
  const left = spotsLeft(tier)
  const pct = tier.seats && tier.claimed !== null ? tier.claimed / tier.seats : 0
  return (
    <div className="pass__half pass__half--open">
      <HalfHead tier={tier} pill={offer.openPill} tone="open" />
      <article className="tk tk--open rise" aria-label={`${tier.order} · ${tier.label}`}>
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
        <div className="tk__cta">
          <Cta origin="ticket" size="block" className="cta--inverse">
            {offer.ticketCta}
          </Cta>
        </div>
        {days !== null ? (
          <div className="tk__stampwrap">
            <Stamp id="offer" className="tk__stamp" ring={offer.stamp.ring} value={days} label={offer.stamp.label} srText={`${days} ${offer.stamp.sr}`} />
          </div>
        ) : null}
      </article>
      <div className="pass__foot">
        <p className="pass__compare">
          <span className="label">{offer.compare.label}</span>
          <s className="pass__was d">{offer.compare.founding}</s>
          <b className="d">{offer.compare.standard}</b>
          <span>{offer.compare.per}</span>
          <span className="pass__plus">{offer.compare.plus}</span>
        </p>
        {days === null ? <Pending>{offer.stampPending}</Pending> : null}
      </div>
    </div>
  )
}

/** O canhoto: o grupo seguinte. Mesmo quadrado do card I, em marinho mais claro,
    conteúdo borrado e "Coming soon" + cadeado no centro. O leitor de tela recebe o
    conteúdo inteiro em sr-only (o borrado e o selo do centro são aria-hidden). */
function NextHalf({ tier }: { tier: Tier }) {
  return (
    <div className="pass__half pass__half--next">
      <HalfHead tier={tier} pill={offer.lockedPill} tone="next" />
      <article className="tk tk--next rise" aria-label={`${tier.order} · ${tier.label}`}>
        <p className="sr-only">
          {offer.comingSoon}. {tier.perk.title}. {offer.lockedSamePrice}.
        </p>
        <div className="tk__blur" aria-hidden="true">
          <p className="tk__price">
            <span className="tk__amount d">{tier.perk.big ?? tier.perk.short}</span>
            {tier.perk.bigSub ? <span className="tk__per">{tier.perk.bigSub}</span> : null}
          </p>
          <p className="tk__enroll d">{offer.enrollmentLine}</p>
          <p className="tk__perk">
            <Tri />
            <span>{offer.lockedSamePrice}</span>
          </p>
          <div className="tk__seats">
            <div className="tk__seatrow label">
              <span>{tier.label}</span>
            </div>
            <div className="tk__bar">
              <span />
            </div>
          </div>
        </div>
        <span className="tk__soon" aria-hidden="true">
          <span className="tk__lock">
            <Lock />
          </span>
          <span className="tk__soont d">{offer.comingSoon}</span>
        </span>
      </article>
      <div className="pass__foot">
        <p className="pass__note">{tier.note}</p>
        {tier.seats === null ? <Pending>{offer.seatsPending}</Pending> : null}
      </div>
    </div>
  )
}
