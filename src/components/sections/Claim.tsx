/* ════════════════════════════════════════════════════════════════════
   [XII] O pedido — a última seção antes do rodapé, e o único lugar onde
   o formulário é o assunto. Marinho + foto da obra a 30%: a página abre
   em branco, escurece na abertura, volta ao branco e escurece de novo
   para pedir. Duas inversões e nenhuma a mais.

   Headline em --t-statement com as vagas do grupo aberto (trecho vermelho
   com duplicado em red-glow), benefícios em coluna única separados por
   fio a 15% com ✓ em red-hi, botão + telefone como ação escrita, o vídeo
   vertical 9/16 (slot honesto enquanto não existe).
   ════════════════════════════════════════════════════════════════════ */

import { useRef } from 'react'
import { claim, pricing, site, spotsLeft } from '@/data/site'
import { useInView } from '@/motion/inview'
import { trackCall } from '@/track'
import { Cta } from '../ui/Cta'
import { Eyebrow } from '../ui/Eyebrow'
import { Check } from '../ui/Icons'
import { Lines } from '../ui/Lines'
import { VideoSlot } from '../ui/Media'
import { Pending } from '../ui/Pending'
import { Pic } from '../ui/Pic'

export function Claim() {
  const list = useRef<HTMLUListElement>(null)
  useInView(list)
  const left = spotsLeft()
  const benefits = claim.benefits.filter((b) => !b.needsCharge || pricing.chargedToday === false)

  return (
    <section id="claim" className="claim on-dark" aria-labelledby="claim-title">
      <div className="claim__bg" aria-hidden="true">
        <Pic name="opening" alt="" sizes="100vw" />
        <span className="claim__veil" />
      </div>
      <div className="shell claim__in">
        <div className="claim__copy">
          <Eyebrow tone="light">{claim.eyebrow}</Eyebrow>
          <Lines
            id="claim-title"
            className="d statement claim__title"
            parts={left !== null ? [{ text: claim.title }, { text: claim.spotsLine(left), accent: true, br: true }] : [{ text: claim.title }]}
          />
          {left === null ? (
            <p className="claim__pend">
              <Pending>{claim.spotsPending}</Pending>
            </p>
          ) : null}

          <ul ref={list} className="claim__list">
            {benefits.map((b, i) => (
              <li key={b.text} className="claim__item rise" style={{ ['--i' as string]: i }}>
                <span className="claim__ok" aria-hidden="true">
                  <Check />
                </span>
                <span>{b.text}</span>
              </li>
            ))}
            {pricing.chargedToday === null ? (
              <li className="claim__item">
                <Pending>Charge at pre-registration to confirm</Pending>
              </li>
            ) : null}
          </ul>
          <p className="claim__compare">{claim.compare}</p>

          <div className="claim__act">
            <Cta origin="claim" size="block">
              {claim.cta}
            </Cta>
            <a className="claim__call" href={site.phoneHref} onClick={trackCall}>
              {claim.callLine} <b>{site.phone}</b>
            </a>
          </div>
          <p className="claim__micro">{claim.micro}</p>
        </div>

        <div className="claim__media">
          <VideoSlot id="claim" src={site.finalVideo.src} poster={site.finalVideo.poster} brief={claim.videoBrief} pendingLabel={claim.videoPendingLabel} className="claim__video" />
        </div>
      </div>
    </section>
  )
}
