/* ════════════════════════════════════════════════════════════════════
   Hero — o card no filme (gramática da Lindale v2, leitura da Rowlett).

   CENA 1 · o poster (ou o b-roll, quando chegar) preenche o hero inteiro,
   de ponta a ponta e por trás da nav — sem card, sem margem branca, sem
   mordidas (decisão do Adryan). O texto vai DIRETO sobre o filme, embaixo à esquerda,
   sobre o véu marinho: eyebrow, H1 ("never trained." em vermelho vivo com
   duplicado), lead, o CTA e, embaixo dele, a linha da oferta pequena. No
   desktop o texto mora na coluna da esquerda, sobre a parede, e o professor
   fica na coluna da direita. Foto (Adryan, 9 out 2026): a fachada com a chegada do tatame,
   em três recortes (celular quadrado, desktop 16:9, ultrawide). Decisões do Adryan em
   9 out 2026: sem placa/ingresso branco, sem micro-itens, sem carimbo.
   CENA 2 · rolando, o filme assenta (escala 1,1 → 1), o marinho desce e a frase da oferta
   ("Join before we open." pequena; "Pay less than everyone / who joins
   after." grandes) SOBE DE BAIXO, linha a linha, com o botão apontando
   para a oferta.

   Sem pin: o filme é sticky e o --k é escrito pelo barramento de scroll.
   Reduced motion: o card fica parado e a cena 2 aparece sobre o filme
   escurecido. LCP = o poster AVIF. O H1 nunca anima opacidade.
   ════════════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useRef } from 'react'
import { hero, site } from '@/data/site'
import { clamp01, docTop, prefersReducedMotion, useScrollTick } from '@/motion/scroll'
import { Cta } from '../ui/Cta'
import { Eyebrow } from '../ui/Eyebrow'
import { Tri } from '../ui/Icons'
import { Lines } from '../ui/Lines'
import { Pic } from '../ui/Pic'

/** O vídeo entra depois do load, só com conexão boa e sem reduced motion. */
function useLateFilm(ref: React.RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const v = ref.current
    if (!v || prefersReducedMotion()) return
    if (!site.heroFilm.mobile && !site.heroFilm.desktop) return
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
    if (conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType ?? '')) return
    const start = () => {
      const src = window.matchMedia('(min-width: 768px)').matches ? site.heroFilm.desktop : site.heroFilm.mobile
      if (!src) return
      v.src = src
      v.addEventListener('playing', () => v.setAttribute('data-on', ''), { once: true })
      void v.play().catch(() => {})
    }
    const idle = () => ('requestIdleCallback' in window ? window.requestIdleCallback(start, { timeout: 2500 }) : setTimeout(start, 600))
    if (document.readyState === 'complete') idle()
    else window.addEventListener('load', idle, { once: true })
    const io = new IntersectionObserver(([e]) => {
      if (!v.src) return
      if (e.isIntersecting) void v.play().catch(() => {})
      else v.pause()
    })
    io.observe(v)
    return () => io.disconnect()
  }, [ref])
}

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const card = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const geo = useRef({ top: 0, run: 1 })
  const last = useRef(-1)
  useLateFilm(video)

  const measure = useCallback(() => {
    const rt = root.current
    const c = card.current
    if (!rt || !c) return
    geo.current.top = docTop(rt)
    geo.current.run = Math.max(1, c.offsetHeight * 0.6)
  }, [])

  const tick = useCallback((y: number, vh: number) => {
    const rt = root.current
    if (!rt) return
    const p = clamp01((y - geo.current.top) / geo.current.run)
    const s = clamp01((y - (geo.current.top + geo.current.run)) / (vh * 0.65))
    const key = p + s * 10
    if (Math.abs(key - last.current) < 0.001) return
    last.current = key
    rt.style.setProperty('--k', (1 - p * p).toFixed(4))
    rt.style.setProperty('--p', p.toFixed(4))
    rt.style.setProperty('--s', s.toFixed(4))
  }, [])
  useScrollTick(tick, measure)

  return (
    <section ref={root} id="top" className="hero" aria-labelledby="hero-title">
      {/* O filme das duas cenas: sticky, de ponta a ponta */}
      <div className="hero__sticky" aria-hidden="true">
        <div className="hero__media">
          <Pic
            name="film-m"
            alt=""
            priority
            sizes="100vw"
            className="hero__poster"
            art={[
              { name: 'hero-w', media: '(min-width: 1024px)', sizes: 'max(100vw, 236svh)' },
              { name: 'hero-d', media: '(min-width: 768px)', sizes: '100vw' },
            ]}
          />
          <video ref={video} className="hero__video" muted loop playsInline preload="none" tabIndex={-1} disablePictureInPicture />
          <span className="hero__veil" />
          <span className="hero__deep" />
        </div>
      </div>

      {/* CENA 1 · o texto direto sobre o filme, embaixo à esquerda */}
      <div ref={card} className="hero__scene hero__scene--card on-dark">
        <div className="shell hero__copy">
          <Eyebrow tone="light" className="hero__eb">
            {hero.eyebrow}
          </Eyebrow>
          <Lines as="h1" id="hero-title" onLoad className="d h1 hero__title" parts={hero.title} />
          <p className="hero__lead rise rise--load" style={{ ['--d' as string]: '300ms' }}>
            {hero.lead}
          </p>
          <div className="hero__act rise rise--load" data-hero-cta="" style={{ ['--d' as string]: '380ms' }}>
            <Cta origin="hero" size="block">
              {hero.cta}
            </Cta>
            {/* a oferta embaixo do botão, pequena e discreta */}
            <p className="hero__note">
              <Tri />
              <span>{hero.offerLine}</span>
            </p>
          </div>
        </div>
      </div>

      {/* CENA 2 · o filme tomou a tela */}
      <div className="hero__scene hero__scene--open on-dark">
        <div className="hero__pin">
          <div className="shell hero__open">
            <p className="hero__need d">
              {hero.scene.lines.map((l, i) => (
                <span
                  key={l.text}
                  className={['hero__need-l', 'big' in l && l.big && 'hero__need-big', 'accent' in l && l.accent && 'dup dup--glow dup--thin'].filter(Boolean).join(' ')}
                  data-text={'accent' in l && l.accent ? l.text : undefined}
                  style={{ ['--w' as string]: l.w, ['--i' as string]: i }}
                >
                  {l.text}
                </span>
              ))}
            </p>
            <Cta origin="hero" href="#offer" className="hero__explore">
              {hero.scene.cta}
            </Cta>
          </div>
        </div>
      </div>
    </section>
  )
}
