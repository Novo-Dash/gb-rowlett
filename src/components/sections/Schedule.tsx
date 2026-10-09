/* ════════════════════════════════════════════════════════════════════
   [V] Horários — o quadro de horários (o mecanismo do schedule da Like
   Water v2, na linguagem GB). Texto, nunca imagem.

   Uma semana lida como o quadro na parede da academia: os horários
   descendo à esquerda, os dias no topo, cada aula na sua célula.
   · cabeçalho centralizado sobre o quadro (o quadro é a seção);
   · o filtro (All · Adults + Teens · Ages 4–6 · Ages 7–14) APAGA o que não
     foi escolhido, então a grade nunca pula;
   · a linha dos dias em marinho, com a data de cada um; a coluna de HOJE
     fica acesa de cima a baixo;
   · cada aula é um BOTÃO que abre o pré-cadastro com a turma marcada;
     passar o mouse acende a linha e a coluna dela (onde e quando, de relance);
   · um vermelho só (o da marca): as turmas se distinguem pelo nome, não por
     cor; domingo fica como coluna fechada.
   Celular: os dias viram abas, um dia por vez, com hoje aberto. "Hoje" e as
   datas só existem no navegador (no pré-render o quadro não tem "hoje"):
   nada diverge na hidratação.
   ════════════════════════════════════════════════════════════════════ */

import { useEffect, useMemo, useRef, useState } from 'react'
import { schedule, scheduleCopy, scheduleCounts, scheduleGroups, type Slot, type SlotKey } from '@/data/site'
import { useBooking } from '@/nd/Booking'
import { useInView } from '@/motion/inview'
import { trackCta } from '@/track'
import { Cta } from '../ui/Cta'
import { Eyebrow } from '../ui/Eyebrow'
import { Lines } from '../ui/Lines'
import { Pending } from '../ui/Pending'

type Filter = 'all' | SlotKey
type Day = (typeof schedule)[number]

/** "6:30 PM" → minutos desde 0h (para ordenar as linhas do quadro). */
const mins = (t: string) => {
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!m) return 0
  const h = (Number(m[1]) % 12) + (m[3].toUpperCase() === 'PM' ? 12 : 0)
  return h * 60 + Number(m[2])
}

const IDX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

/** Hoje (no fuso da academia) e a data de cada dia a partir de hoje; só no navegador. */
function useWeek() {
  const [week, setWeek] = useState<{ today: string; dates: Record<string, string> } | null>(null)
  useEffect(() => {
    const tz = 'America/Chicago'
    const now = new Date()
    const today = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: tz }).format(now).slice(0, 3)
    const t = IDX[today] ?? 1
    const fmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: tz })
    const dates: Record<string, string> = {}
    Object.entries(IDX).forEach(([d, i]) => {
      dates[d] = fmt.format(new Date(now.getTime() + ((i - t + 7) % 7) * 86400000))
    })
    setWeek({ today, dates })
  }, [])
  return week
}

export function Schedule() {
  const { open } = useBooking()
  const week = useWeek()
  const today = week?.today ?? null
  const [filter, setFilter] = useState<Filter>('all')
  const [day, setDay] = useState('Mon')
  const [hover, setHover] = useState<{ d: string; t: string } | null>(null)
  const board = useRef<HTMLDivElement>(null)
  useInView(board)

  useEffect(() => {
    if (today && today !== 'Sun') setDay(today)
  }, [today])

  /** Todos os horários da semana, em ordem: as linhas do quadro. */
  const times = useMemo(() => [...new Set(schedule.flatMap((d) => d.slots.map((s) => s.t)))].sort((a, b) => mins(a) - mins(b)), [])
  const at = (d: Day, t: string) => d.slots.filter((s) => s.t === t)
  const shown = (s: Slot) => filter === 'all' || s.p === filter

  const cls = (s: Slot, d: Day) => {
    const g = scheduleGroups[s.p]
    const origin = `slot-${d.day.toLowerCase()}-${s.t.replace(/[^\d]/g, '')}`
    return (
      <button
        key={s.p}
        type="button"
        className={['sc__class', !shown(s) && 'is-dim'].filter(Boolean).join(' ')}
        onClick={() => {
          trackCta(`slot-${d.day.toLowerCase()}-${s.t}`, g.programs[0])
          open({ program: g.programs[0], who: g.who, origin })
        }}
      >
        <span className="sc__name">{g.name}</span>
        <span className="sc__sub">{g.sub}</span>
        <span className="sr-only">
          , {d.long} {s.t}. {scheduleCopy.slotAction}
        </span>
      </button>
    )
  }

  const current = schedule.find((d) => d.day === day) ?? schedule[0]

  return (
    <section id="schedule" className="sc" aria-labelledby="schedule-title">
      <div className="shell sc__in">
        <div className="sc__head">
          <Eyebrow>{scheduleCopy.eyebrow}</Eyebrow>
          <Lines id="schedule-title" className="d h2 h2--long sc__title" parts={scheduleCopy.title} />
          <p className="sc__summary label">{scheduleCopy.summary(scheduleCounts)}</p>
        </div>

        <div className="sc__filters" role="group" aria-label={scheduleCopy.filterLabel}>
          {scheduleCopy.filters.map((f) => (
            <button key={f.id} type="button" className="sc__chip" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Desktop: o quadro */}
        <div ref={board} className="sc__board">
          <table className="sc__table" onMouseLeave={() => setHover(null)}>
            <caption className="sr-only">{scheduleCopy.caption}</caption>
            <thead>
              <tr>
                <th scope="col" className="sc__corner">
                  <span className="label">{scheduleCopy.timeLabel}</span>
                </th>
                {schedule.map((d) => (
                  <th key={d.day} scope="col" className={['sc__day', d.day === today && 'is-today'].filter(Boolean).join(' ')}>
                    <abbr className="sc__dayname d" title={d.long}>
                      {d.day}
                    </abbr>
                    <span className="sc__date label">{d.day === today ? scheduleCopy.todayLabel : (week?.dates[d.day] ?? ' ')}</span>
                  </th>
                ))}
                <th scope="col" className={['sc__day', 'is-closed', today === 'Sun' && 'is-today'].filter(Boolean).join(' ')}>
                  <abbr className="sc__dayname d" title={scheduleCopy.sunday.long}>
                    {scheduleCopy.sunday.short}
                  </abbr>
                  <span className="sc__date label">{today === 'Sun' ? scheduleCopy.todayLabel : (week?.dates.Sun ?? ' ')}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {times.map((t, ti) => (
                <tr key={t} className={hover?.t === t ? 'is-hover' : undefined}>
                  <th scope="row" className="sc__time d">
                    {t}
                  </th>
                  {schedule.map((d) => {
                    const list = at(d, t)
                    return (
                      <td
                        key={d.day}
                        className={[d.day === today && 'is-today', hover?.d === d.day && 'is-hover'].filter(Boolean).join(' ') || undefined}
                        onMouseEnter={() => (list.length ? setHover({ d: d.day, t }) : undefined)}
                      >
                        {list.map((s) => cls(s, d))}
                      </td>
                    )
                  })}
                  {ti === 0 ? (
                    <td rowSpan={times.length} className="sc__closed">
                      <span className="label">{scheduleCopy.closed}</span>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Celular: um dia por vez */}
        <div className="sc__list">
          <div className="sc__tabs" role="tablist" aria-label={scheduleCopy.dayLabel}>
            {schedule.map((d) => (
              <button
                key={d.day}
                type="button"
                role="tab"
                aria-selected={day === d.day}
                aria-controls="sc-day"
                className={['sc__tab', d.day === today && 'is-today'].filter(Boolean).join(' ')}
                onClick={() => setDay(d.day)}
              >
                {d.day}
                {d.day === today ? <i className="sc__dot" aria-label={scheduleCopy.todayLabel} /> : null}
              </button>
            ))}
          </div>
          <div id="sc-day" role="tabpanel" aria-label={current.long}>
            <ul className="sc__slots">
              {current.slots.map((s) => (
                <li key={s.t} className="sc__slot">
                  <span className="sc__time d">{s.t}</span>
                  <span className="sc__slotclasses">{cls(s, current)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="sc__foot">
          <p className="sc__note">{scheduleCopy.note(scheduleCounts.adults)}</p>
          <Pending>{scheduleCopy.gb2Pending}</Pending>
          <div className="sc__cta">
            <Cta origin="faq" size="block">
              {scheduleCopy.cta}
            </Cta>
          </div>
        </div>
      </div>
    </section>
  )
}
