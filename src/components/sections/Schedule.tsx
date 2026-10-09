/* ════════════════════════════════════════════════════════════════════
   [V] Horários — o quadro de placar. Texto, nunca imagem.

   Desktop: placar de 6 colunas (os dias), cada horário uma célula com a
   hora em Cn e a turma em label. Celular: lista por dia; o dia de hoje
   abre primeiro (decidido depois de montar, para o HTML pré-renderizado
   nunca divergir). Cada horário é um ALVO: abre o formulário com a turma.
   A legenda são os rótulos dos grupos com o marcador de cada um (não são
   botões; não é tablist). As contagens (18 / 10 / 3 / 5) vêm do dado.
   ════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from 'react'
import { schedule, scheduleCopy, scheduleCounts, scheduleGroups, type SlotKey } from '@/data/site'
import { useBooking } from '@/nd/Booking'
import { useInView } from '@/motion/inview'
import { trackCta } from '@/track'
import { Eyebrow } from '../ui/Eyebrow'
import { Tri, TriOutline } from '../ui/Icons'
import { Lines } from '../ui/Lines'
import { Pending } from '../ui/Pending'

const Mark = ({ k }: { k: SlotKey }) => (
  <span className={`mark mark--${k}`} aria-hidden="true">
    {k === 'lc1' ? <TriOutline /> : <Tri />}
  </span>
)

export function Schedule() {
  const { open } = useBooking()
  const board = useRef<HTMLDivElement>(null)
  useInView(board)
  // SSR: segunda-feira aberta. No cliente, o dia de hoje (domingo → segunda).
  const [openDay, setOpenDay] = useState(0)
  const [today, setToday] = useState(-1)
  useEffect(() => {
    const d = new Date().getDay() // 0 = dom
    const idx = d === 0 ? 0 : d - 1
    setOpenDay(idx)
    setToday(idx)
  }, [])

  return (
    <section id="schedule" className="sched" aria-labelledby="schedule-title">
      <div className="shell">
        <div className="sched__head">
          <div>
            <Eyebrow>{scheduleCopy.eyebrow}</Eyebrow>
            <Lines id="schedule-title" className="d h2 h2--long sched__title" parts={scheduleCopy.title} />
          </div>
          <div className="sched__aside">
            <p className="sched__summary d">{scheduleCopy.summary(scheduleCounts)}</p>
            <ul className="sched__legend" aria-label={scheduleCopy.legendLabel}>
              {(Object.keys(scheduleGroups) as SlotKey[]).map((k) => (
                <li key={k}>
                  <Mark k={k} />
                  <span>{scheduleGroups[k].label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div ref={board} className="sched__board">
          {schedule.map((d, i) => {
            const isOpen = openDay === i
            const lid = `sched-${d.day.toLowerCase()}`
            return (
              <section key={d.day} className="sched__day" data-open={isOpen ? '' : undefined} data-today={today === i ? '' : undefined} aria-labelledby={`${lid}-h`} style={{ ['--k' as string]: i }}>
                <h3 className="sched__dayname" id={`${lid}-h`}>
                  <span className="sched__daytext d">
                    {d.long}
                    {today === i ? <small className="label">{scheduleCopy.todayLabel}</small> : null}
                  </span>
                  <button type="button" className="sched__toggle d" aria-expanded={isOpen} aria-controls={lid} onClick={() => setOpenDay(isOpen ? -1 : i)}>
                    <span>
                      {d.long}
                      {today === i ? <small className="label">{scheduleCopy.todayLabel}</small> : null}
                    </span>
                    <span className="sched__n label">{d.slots.length}</span>
                    <span className="sched__plus" aria-hidden="true" />
                  </button>
                </h3>
                <div id={lid} className="sched__list" inert={!isOpen}>
                  <ul>
                    {d.slots.map((s) => {
                      const g = scheduleGroups[s.p]
                      const origin = `slot-${d.day.toLowerCase()}-${s.t.replace(/[^\d]/g, '')}`
                      return (
                        <li key={s.t}>
                          <button
                            type="button"
                            className={`slot slot--${s.p}`}
                            onClick={() => {
                              trackCta(`slot-${d.day.toLowerCase()}-${s.t}`, g.programs[0])
                              open({ program: g.programs[0], who: g.who, origin })
                            }}
                          >
                            <span className="slot__t d">{s.t}</span>
                            <span className="slot__g">
                              <Mark k={s.p} />
                              {g.short}
                            </span>
                            <span className="sr-only">
                              , {d.long}. {scheduleCopy.slotAction}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </section>
            )
          })}
        </div>

        <div className="sched__foot">
          <p className="body">{scheduleCopy.note(scheduleCounts.adults)}</p>
          <p>
            <Pending>{scheduleCopy.gb2Pending}</Pending>
          </p>
        </div>
      </div>
    </section>
  )
}
