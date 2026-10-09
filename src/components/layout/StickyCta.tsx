/* ════════════════════════════════════════════════════════════════════
   StickyCta — barra fixa "Claim my Founding spot" (só no celular).

   Aparece depois que o CTA do hero sai da tela; some enquanto outro CTA
   da página está visível (nunca dois botões iguais lado a lado) e
   enquanto o formulário está aberto (html.bk-open). Respeita
   safe-area-inset-bottom. Entra/sai só com transform; o espaço dela já
   está reservado no .gbr (--sticky-h).
   ════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef } from 'react'
import { stickyCta } from '@/data/site'
import { Cta } from '../ui/Cta'

export function StickyCta() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = ref.current
    if (!bar || typeof IntersectionObserver === 'undefined') return
    const hero = document.querySelector('[data-hero-cta]')
    const others = Array.from(document.querySelectorAll('.gbr main .cta')).filter((el) => !hero?.contains(el))
    const visible = new Set<Element>()
    let heroPassed = false
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) heroPassed = !e.isIntersecting && e.boundingClientRect.top < 0
        else if (e.isIntersecting) visible.add(e.target)
        else visible.delete(e.target)
      }
      bar.toggleAttribute('data-show', heroPassed && visible.size === 0)
    })
    if (hero) io.observe(hero)
    others.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="sticky" role="region" aria-label={stickyCta.region}>
      <Cta origin="sticky" size="block">
        {stickyCta.label}
      </Cta>
    </div>
  )
}
