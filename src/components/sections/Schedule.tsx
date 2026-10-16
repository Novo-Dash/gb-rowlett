/* ════════════════════════════════════════════════════════════════════
   [V] Horários — o formato da GB Charleston (pedido do Adryan e do João
   Vitor: "schedule fora do padrão de GB"). Texto, nunca imagem.

     Our schedule.                              lead
     ─ All classes ─ Kids ─ Adults + Teens ─────────────
     ┌▀▀▀▀▀▀▀▀▀▀▀┐ ┌▀▀▀▀▀▀▀▀▀▀▀┐ ┌▀▀▀▀▀▀▀▀▀▀▀┐
     │NAME   GBK │ │NAME   GBK │ │NAME   GB1 │   régua na cor oficial do
     │AGES 4–6   │ │AGES 7–14  │ │ALL LEVELS │   programa (GBK verde, GB1 azul)
     │TUE·THU 4:30│ │…          │ │…          │
     │Claim →    │ │           │ │           │
     └───────────┘ └───────────┘ └───────────┘

   Os cards saem do mesmo dado do quadro (schedule): cada turma agrupa os
   dias pelo horário. Cada card é um botão que abre o formulário com a turma
   marcada. Sem estado de "hoje": nada diverge entre pré-render e cliente.
   ════════════════════════════════════════════════════════════════════ */

import { useMemo, useRef, useState } from 'react'
import { schedule, scheduleCopy, scheduleCounts, scheduleGroups, type SlotKey } from '@/data/site'
import { useBooking } from '@/nd/Booking'
import { useInView } from '@/motion/inview'
import { trackCta } from '@/track'
import { Eyebrow } from '../ui/Eyebrow'
import { Arrow } from '../ui/Icons'
import { Lines } from '../ui/Lines'

type Tab = (typeof scheduleCopy.tabs)[number]['id']

/** "6:30 PM" → minutos desde 0h (para ordenar as linhas do card). */
const mins = (t: string) => {
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!m) return 0
  return (Number(m[1]) % 12) * 60 + Number(m[2]) + (m[3].toUpperCase() === 'PM' ? 720 : 0)
}

const ORDER: SlotKey[] = ['lc1', 'lc2-juniors', 'adults']

/** Cada turma: os horários, cada um com os dias em que acontece ("TUE · THU"). */
function useCards() {
  return useMemo(
    () =>
      ORDER.map((key) => {
        const byTime = new Map<string, string[]>()
        for (const d of schedule) for (const s of d.slots) if (s.p === key) byTime.set(s.t, [...(byTime.get(s.t) ?? []), d.day])
        const rows = [...byTime.entries()].sort((a, b) => Number(a[1].every((d) => d === 'Sat')) - Number(b[1].every((d) => d === 'Sat')) || mins(a[0]) - mins(b[0])).map(([time, days]) => ({ time, days: days.map((x) => x.toUpperCase()).join(' · ') }))
        return { key, group: scheduleGroups[key], badge: scheduleCopy.badge[key], rows, count: rows.reduce((n, r) => n + r.days.split('·').length, 0) }
      }),
    [],
  )
}

export function Schedule() {
  const { open } = useBooking()
  const [tab, setTab] = useState<Tab>('all')
  const grid = useRef<HTMLDivElement>(null)
  useInView(grid)
  const cards = useCards()
  const shown = cards.filter((c) => tab === 'all' || (tab === 'kids' ? c.group.who === 'child' : c.group.who !== 'child'))

  return (
    <section id="schedule" className="sc" aria-labelledby="schedule-title">
      <div className="shell sc__in">
        <div className="sc__head">
          <div>
            <Eyebrow>{scheduleCopy.eyebrow}</Eyebrow>
            <Lines id="schedule-title" className="d h2 sc__title" parts={scheduleCopy.title} />
          </div>
          <div className="sc__aside">
            <p className="body">{scheduleCopy.lead}</p>
            <p className="sc__summary label">{scheduleCopy.summary(scheduleCounts)}</p>
          </div>
        </div>

        <div className="sc__tabs" role="tablist" aria-label={scheduleCopy.tabsLabel}>
          {scheduleCopy.tabs.map((t) => (
            <button key={t.id} type="button" role="tab" id={`sc-tab-${t.id}`} aria-selected={tab === t.id} aria-controls="sc-panel" className={`sc__tab sc__tab--${t.id}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        <div ref={grid} id="sc-panel" role="tabpanel" aria-labelledby={`sc-tab-${tab}`} className="sc__grid">
          {shown.map((c, i) => (
            <button
              key={c.key}
              type="button"
              className={`sccard sccard--${c.badge} rise`}
              style={{ ['--i' as string]: i }}
              onClick={() => {
                trackCta(`slot-${c.key}`, c.group.programs[0])
                open({ program: c.group.programs[0], who: c.group.who, origin: `slot-${c.key}` })
              }}
            >
              <span className="sccard__top">
                <span className="sccard__name d">{c.group.name}</span>
                <img src={`/img/gb/${c.badge}.svg`} alt={c.badge.toUpperCase()} width={72} height={18} loading="lazy" decoding="async" className="sccard__badge" />
              </span>
              <span className="sccard__sub label">{c.group.sub}</span>
              <span className="sccard__rows">
                {c.rows.map((r) => (
                  <span key={r.time} className="sccard__row">
                    <span className="sccard__days label">{r.days}</span>
                    <span className="sccard__time d">{r.time}</span>
                  </span>
                ))}
              </span>
              <span className="sccard__cta label">
                {scheduleCopy.cardAction} <Arrow />
              </span>
              <span className="sr-only">. {scheduleCopy.slotAction}</span>
            </button>
          ))}
        </div>

        <div className="sc__foot">
          <p className="sc__note">{scheduleCopy.note(scheduleCounts.adults)}</p>
          <p className="sc__closed label">{scheduleCopy.sundayClosed}</p>
        </div>
      </div>
    </section>
  )
}
