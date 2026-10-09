/* ════════════════════════════════════════════════════════════════════
   Footer — o azul-marinho GB.

   1 · "Right here in Rowlett": endereço, pendência de referência, e o mapa
       em P&B com o NOSSO pino (o triângulo GB) cravado no endereço exato e
       a foto da fachada encostada nele, que cresce no hover.
   2 · Grade: a marca (selo + sobre + social) · a academia · onde fica com
       AÇÕES ESCRITAS (rota, ligar/texto, e-mail) · as turmas (cada uma abre
       o formulário).
   3 · O letreiro: "GRACIE BARRA ROWLETT" em contorno + o selo em contorno.
   4 · A base: ©, afiliação e a assinatura.
   ════════════════════════════════════════════════════════════════════ */

import { footer, programs, site } from '@/data/site'
import { useBooking } from '@/nd/Booking'
import { trackCall, trackCta, trackDirections, trackEmail } from '@/track'
import { Eyebrow } from '../ui/Eyebrow'
import { Lines } from '../ui/Lines'
import { LogoOutline, Mail, Phone, Route } from '../ui/Icons'
import { Pending } from '../ui/Pending'
import { Pic } from '../ui/Pic'

export function Footer() {
  const { open } = useBooking()
  return (
    <footer className="foot on-dark">
      <div className="shell">
        <div className="foot__where">
          <div className="foot__wherehead">
            <Eyebrow tone="light">{footer.visitLabel}</Eyebrow>
            <Lines id="where-title" className="d h2 foot__title" parts={footer.mapTitle} />
            <address className="foot__addr">
              {site.address.line1}
              <br />
              {site.address.line2}
            </address>
            <p>
              <Pending>{footer.landmarkPending}</Pending>
            </p>
            <ul className="foot__acts">
              <li>
                <a className="foot__line" href={site.directionsHref} target="_blank" rel="noopener noreferrer" onClick={trackDirections}>
                  <span className="foot__ic">
                    <Route />
                  </span>
                  <span>{footer.directions}</span>
                </a>
              </li>
              <li>
                <a className="foot__line" href={site.phoneHref} onClick={trackCall}>
                  <span className="foot__ic">
                    <Phone />
                  </span>
                  <span>
                    {footer.call} {site.phone}
                  </span>
                </a>
              </li>
              <li>
                <a className="foot__line" href={`mailto:${site.email}`} onClick={trackEmail}>
                  <span className="foot__ic">
                    <Mail />
                  </span>
                  <span>{site.email}</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="foot__map">
            <span className="foot__thumb">
              <Pic name="visit" alt={footer.facadeAlt} sizes="220px" />
            </span>
            <svg className="foot__pin" viewBox="0 0 40 46" aria-hidden="true">
              <path className="foot__pin-out" d="M20 44 L3 6 H37 Z" />
              <path className="foot__pin-in" d="M20 31 L11 12 H29 Z" />
            </svg>
            <iframe title={footer.mapIframeTitle} src={site.mapsEmbedSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>

        <div className="foot__grid">
          <div className="foot__brand">
            <img src="/img/logo-160.webp" alt={site.name} width={96} height={96} loading="lazy" decoding="async" />
            <p className="foot__about">{footer.about}</p>
            {site.socials.instagram ? (
              <a className="foot__social" href={site.socials.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            ) : null}
          </div>

          <div>
            <p className="foot__h">{footer.academyLabel}</p>
            <nav aria-label={footer.academyLabel} className="foot__links">
              {footer.links.map((l) => (
                <a key={l.href} href={l.href}>
                  {l.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <p className="foot__h">{footer.programsLabel}</p>
            <ul className="foot__programs">
              {programs.cards.map((c) => (
                <li key={c.key}>
                  <button
                    type="button"
                    onClick={() => {
                      trackCta('footer', c.key)
                      open({ program: c.key, origin: 'footer' })
                    }}
                  >
                    <b>{c.title}</b>
                    <span className="foot__muted"> {c.tag}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="foot__marquee" aria-hidden="true">
        <div className="foot__track">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="d foot__word">
              <span>{footer.marquee}</span>
              <LogoOutline />
            </span>
          ))}
        </div>
      </div>

      <div className="shell">
        <div className="foot__base">
          <span>{footer.copyright}</span>
          <span>{footer.affiliation}</span>
          <a href={footer.madeByHref} target="_blank" rel="noopener noreferrer">
            {footer.madeBy}
          </a>
        </div>
      </div>
    </footer>
  )
}
