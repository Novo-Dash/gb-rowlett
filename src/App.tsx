import { BookingProvider } from '@/nd/Booking'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { StickyCta } from '@/components/layout/StickyCta'
import { Hero } from '@/components/sections/Hero'
import { Marquee } from '@/components/sections/Marquee'
import { Offer } from '@/components/sections/Offer'
import { Programs } from '@/components/sections/Programs'
import { Build } from '@/components/sections/Build'
import { Schedule } from '@/components/sections/Schedule'
import { Parents } from '@/components/sections/Parents'
import { Ready } from '@/components/sections/Ready'
import { Reserve } from '@/components/sections/Reserve'
import { Opening } from '@/components/sections/Opening'
import { Faq } from '@/components/sections/Faq'
import { Claim } from '@/components/sections/Claim'
import { useScrollDepth } from '@/hooks/useScrollDepth'

/**
 * Ordem da página = jornada mental do PRD §6:
 *   I Hero · II Oferta · letreiro · III Programas · IV Obra · V Horários ·
 *   VI Pais · VII Sem experiência · IX Como reservar ·
 *   X Abertura (night) · XI Perguntas · XII Pedido (navy) · mapa + footer.
 * Todas as seções renderizam de uma vez (sem lazy por seção): o espaço de
 * cada bloco existe desde a primeira pintura, então nada entra empurrando
 * o conteúdo (CLS 0). Nenhum pin.
 */
export default function App() {
  useScrollDepth()
  return (
    <BookingProvider>
      <div className="gbr">
        <div className="pattern" aria-hidden="true" />
        <a href="#main" className="skip">
          Skip to content
        </a>
        <Nav />
        <main id="main">
          <Hero />
          <Offer />
          <Marquee />
          <Programs />
          <Build />
          <Schedule />
          <Parents />
          <Ready />
          <Reserve />
          <Opening />
          <Faq />
          <Claim />
        </main>
        <Footer />
        <StickyCta />
      </div>
    </BookingProvider>
  )
}
