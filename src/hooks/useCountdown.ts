/* ════════════════════════════════════════════════════════════════════
   useCountdown — dias/horas/min/seg até `iso`. null sem data.
   • No pré-render e na hidratação devolve o valor calculado na data do
     visitante só depois de montar (useSyncExternalStore com snapshot de
     servidor fixo): nada diverge entre HTML e cliente.
   • Para a cada segundo enquanto a aba está visível; com a aba oculta o
     intervalo para e o valor é recalculado ao voltar (visibilitychange).
   • Sempre termina: passado o prazo, tudo zera e o intervalo é desligado.
   ════════════════════════════════════════════════════════════════════ */

import { useEffect, useState } from 'react'

export interface Remaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  over: boolean
}

function remaining(target: number): Remaining {
  const ms = Math.max(0, target - Date.now())
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms / 3600000) % 24),
    minutes: Math.floor((ms / 60000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
    over: ms === 0,
  }
}

export function useCountdown(iso: string | null): Remaining | null {
  const [value, setValue] = useState<Remaining | null>(null)
  useEffect(() => {
    if (!iso) return
    const target = Date.parse(iso)
    if (Number.isNaN(target)) return
    let id = 0
    const tick = () => {
      const r = remaining(target)
      setValue(r)
      if (r.over && id) window.clearInterval(id)
    }
    const start = () => {
      tick()
      id = window.setInterval(tick, 1000)
    }
    const stop = () => {
      if (id) window.clearInterval(id)
      id = 0
    }
    const onVis = () => (document.hidden ? stop() : start())
    start()
    document.addEventListener('visibilitychange', onVis)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [iso])
  return value
}

/** Dias inteiros até `iso` (carimbo da oferta). null sem data; 0 passado o prazo. */
export function useDaysLeft(iso: string | null): number | null {
  const [days, setDays] = useState<number | null>(null)
  useEffect(() => {
    if (!iso) return
    const t = Date.parse(iso)
    if (Number.isNaN(t)) return
    setDays(Math.max(0, Math.ceil((t - Date.now()) / 86400000)))
  }, [iso])
  return days
}
