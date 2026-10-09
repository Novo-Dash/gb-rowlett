/* ════════════════════════════════════════════════════════════════════
   Nav — o cartão branco flutuante (a gramática da Lindale v2).

     ( ≡    [selo GB]    ☎ (945) 385-9359 )

   • Cartão de 880px máx, 52/60px, raio 14px (a ÚNICA exceção ao canto reto,
     por ser objeto flutuante), backdrop-filter (o único vidro da página).
   • Menu à esquerda abre o próprio cartão para baixo (grid 0fr → 1fr) em
     três cards: Classes (cada turma abre o formulário com ela marcada),
     Schedule (rola até a seção) e Visit (ligar, rota, reservar).
   • Logo no centro abre o formulário. À direita, só o telefone, como ação
     escrita e com o número sempre visível (pedido do Adryan: sem botão e sem
     o nome escrito na nav).
   • Some rolando para baixo (depois de 1 tela) e volta rolando para cima;
     com o menu aberto, fica; com o formulário aberto (html.bk-open), some.
   ════════════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useRef, useState } from 'react'
import { nav, site } from '@/data/site'
import { useBooking } from '@/nd/Booking'
import { useScrollTick } from '@/motion/scroll'
import { trackCall, trackCta, trackDirections } from '@/track'
import type { ProgramKey } from '@/types'
import { Arrow, Phone, Route } from '../ui/Icons'

export function Nav() {
  const { open } = useBooking()
  const ref = useRef<HTMLElement>(null)
  const state = useRef({ lastY: 0, hidden: false, menu: false })
  const [menu, setMenu] = useState(false)
  state.current.menu = menu

  const tick = useCallback((y: number, vh: number) => {
    const el = ref.current
    if (!el) return
    const s = state.current
    const dy = y - s.lastY
    if (Math.abs(dy) > 6) {
      const hide = dy > 0 && y > vh && !s.menu
      if (hide !== s.hidden) {
        s.hidden = hide
        el.toggleAttribute('data-hidden', hide)
      }
      s.lastY = y
    }
  }, [])
  useScrollTick(tick)

  useEffect(() => {
    if (!menu) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menu])

  const book = (program?: ProgramKey) => {
    setMenu(false)
    trackCta(program ? 'menu' : 'nav', program)
    open({ program, origin: program ? 'menu' : 'nav' })
  }

  const m = nav.menu
  return (
    <header ref={ref} className="nav" data-open={menu ? '' : undefined}>
      <nav className="nav__card" aria-label="Main">
        <div className="nav__bar">
          <button
            type="button"
            className="nav__burger"
            aria-expanded={menu}
            aria-controls="nav-menu"
            aria-label={menu ? nav.menuClose : nav.menuOpen}
            onClick={() => setMenu((v) => !v)}
          >
            <i />
            <i />
          </button>

          {/* o selo abre o formulário: o caminho mais curto para a vaga */}
          <button type="button" className="nav__brand" aria-label={nav.logoLabel} onClick={() => book()}>
            <img src="/img/badge-56.webp" srcSet="/img/badge-56.webp 1x, /img/badge-112.webp 2x, /img/badge-150.webp 3x" alt="" width={56} height={56} className="nav__logo" />
          </button>

          <div className="nav__actions">
            {/* o telefone no lugar do botão: ação escrita, sempre com o número */}
            <a href={site.phoneHref} className="nav__call" aria-label={`${nav.callLabel}: ${site.phone}`} onClick={trackCall}>
              <Phone />
              <span className="nav__num">{site.phone}</span>
            </a>
          </div>
        </div>

        <div id="nav-menu" className="nav__menu" inert={!menu}>
          <div className="nav__menuin">
            <div className="nav__cards">
              <section className="nav__group" style={{ ['--k' as string]: 0 }}>
                <p className="nav__label">{m.classes.label}</p>
                <ul>
                  {m.classes.links.map((l) => (
                    <li key={l.program}>
                      <button type="button" className="nav__link" onClick={() => book(l.program)}>
                        {l.label}
                        <Arrow />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
              <section className="nav__group" style={{ ['--k' as string]: 1 }}>
                <p className="nav__label">{m.schedule.label}</p>
                <ul>
                  {m.schedule.links.map((l) => (
                    <li key={l.href}>
                      <a className="nav__link" href={l.href} onClick={() => setMenu(false)}>
                        {l.label}
                        <Arrow />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
              <section className="nav__group nav__group--dark on-dark" style={{ ['--k' as string]: 2 }}>
                <p className="nav__label">{m.visit.label}</p>
                <ul>
                  <li>
                    <a className="nav__link" href={site.phoneHref} onClick={trackCall}>
                      {site.phone}
                      <Phone />
                    </a>
                  </li>
                  <li>
                    <a className="nav__link" href={site.directionsHref} target="_blank" rel="noopener noreferrer" onClick={trackDirections}>
                      {m.visit.directions}
                      <Route />
                    </a>
                  </li>
                  <li>
                    <button type="button" className="nav__link" onClick={() => book()}>
                      {m.visit.book}
                      <Arrow />
                    </button>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </nav>
      {menu ? <button type="button" className="nav__scrim" aria-label={nav.menuClose} tabIndex={-1} onClick={() => setMenu(false)} /> : null}
    </header>
  )
}
