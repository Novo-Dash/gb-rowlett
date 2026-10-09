/* ════════════════════════════════════════════════════════════════════
   Booking — o funil do kit Novo Dash na Rowlett, em DOIS modos, escolhidos
   sozinhos pelo que o GHL devolve (nenhuma turma escrita no código):

   AO VIVO  (Location ID configurado + turmas ativas no GHL) — a especificação
            "Calendário de Agendamento de Aula Trial":
     passo 1  nome · e-mail · telefone · turma (ao vivo do GHL) · nome da criança
              se a turma for de kids → Webhook 1 (1x por sessão) · Lead · generate_lead · Ads Lead
     passo 2  dia + horário (abre no 1º dia com aula; horário único já vem marcado)
              → Webhook 2 (n8n, contrato fixo) · Schedule · trial_booked · Ads Trial Booked
     fim      a data e a hora confirmadas + endereço

   FOUNDING (sem Location ID, sem turmas, ou falha na busca) — o pré-cadastro
   da pré-abertura (PRD §11):
     passo 1  Who is training?  passo 2  Which class?  passo 3  dados → Webhook 1

   Modo prospect (e sem Location ID): nenhum webhook sai e nenhum tracker dispara;
   o payload vai para o console. A mesma <BookingForm /> serve o modal e a /book.
   Diálogo em tela cheia no celular, inputs de 16px (sem zoom do iOS), foco preso
   e devolvido a quem abriu, html.bk-open enquanto aberto.
   ════════════════════════════════════════════════════════════════════ */

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Pending } from '@/components/ui/Pending'
import { Arrow, Check, Close, Route, Tri } from '@/components/ui/Icons'
import { form, openTier, programs as cards, site } from '@/data/site'
import { UX } from '@/lib/ux'
import { trackFormSubmit } from '@/track'
import type { BookingHint, ProgramKey, Who } from '@/types'
import { captureAttribution, formatPhone, getAttribution, getSourceLabel, isGhlReturnVisit, isValidPhone, prefillFromUrl, toE164 } from './attribution'
import { LEAD_WEBHOOK, client } from './config'
import { dateKey, fetchPrograms, groupPrograms, isWaitlist, labelOf, longDate, noteOf, optionHint, parseKey, shortName, timeLabel, type Program } from './programs'
import { adsConversion, fbTrack, gaTrack, identify } from './tracking'
import { sendBooking, sendLead as sendLiveLead, type BookingData } from './webhook'

type Ctx = { open: (hint?: BookingHint) => void; close: () => void; isOpen: boolean }
const BookingContext = createContext<Ctx | null>(null)

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used inside BookingProvider')
  return ctx
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [hint, setHint] = useState<BookingHint | null>(null)
  const opener = useRef<HTMLElement | null>(null)
  const open = useCallback((h?: BookingHint) => {
    opener.current = (document.activeElement as HTMLElement | null) ?? null
    setHint(h ?? { origin: 'unknown' })
  }, [])
  const close = useCallback(() => {
    setHint(null)
    // o foco volta para quem abriu
    const el = opener.current
    if (el?.isConnected) el.focus()
  }, [])

  useEffect(() => {
    captureAttribution()
    // aquece a lista de turmas: o modal abre com ela pronta (sem Location ID, volta vazia na hora)
    fetchPrograms().catch(() => {})
  }, [])

  const value = useMemo(() => ({ open, close, isOpen: hint !== null }), [open, close, hint])
  return (
    <BookingContext.Provider value={value}>
      {children}
      {hint ? <BookingModal hint={hint} onClose={close} /> : null}
    </BookingContext.Provider>
  )
}

/** A rota /book: as duas colunas do modal como página, sem navegação para fora. */
export function BookPage() {
  useEffect(() => {
    captureAttribution()
  }, [])
  return (
    <main className="nd nd-page">
      <div className="nd-dialog is-page" role="region" aria-label={form.title}>
        <Panel />
        <div className="nd-scroll">
          <BookingForm hint={{ origin: 'book' }} />
        </div>
      </div>
    </main>
  )
}

function BookingModal({ hint, onClose }: { hint: BookingHint; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('bk-open')
    const { body } = document
    const prev = [body.style.overflow, body.style.paddingRight]
    const gap = window.innerWidth - root.clientWidth
    body.style.overflow = 'hidden'
    if (gap > 0) body.style.paddingRight = `${gap}px`
    // foco entra no diálogo e fica preso nele
    const dialog = ref.current
    dialog?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose()
      if (e.key !== 'Tab' || !dialog) return
      const focusables = dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])')
      if (!focusables.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      root.classList.remove('bk-open')
      ;[body.style.overflow, body.style.paddingRight] = prev
    }
  }, [onClose])

  return (
    <div className="nd nd-overlay" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} role="dialog" aria-modal="true" aria-label={form.title} tabIndex={-1} className="nd-dialog">
        <button type="button" onClick={onClose} aria-label={form.close} className="nd-close">
          <Close />
        </button>
        <Panel />
        <div className="nd-scroll">
          <BookingForm hint={hint} onDone={onClose} />
        </div>
      </div>
    </div>
  )
}

/** Coluna de marca: logo, oferta, benefícios da faixa aberta. Compacta no celular. */
function Panel() {
  const copy = client.copy ?? {}
  return (
    <aside className="nd-panel">
      <div className="nd-panel-head">
        <img src={client.academy.logo} alt="" width={52} height={52} className="nd-logo" draggable={false} />
        <p className="nd-eyebrow">{copy.eyebrow}</p>
        <p className="nd-panel-title">{copy.panelTitle}</p>
        <p className="nd-panel-text">{copy.panelText}</p>
        <ul className="nd-bullets">
          {openTier.perks.map((b) => (
            <li key={b}>
              <span className="nd-tick">
                <Check />
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>
      <div className="nd-panel-foot">
        <p className="nd-panel-name">{site.name}</p>
        <p className="nd-panel-address">{site.address.full}</p>
      </div>
    </aside>
  )
}

type ProgramsState = { status: 'loading' | 'ready' | 'error'; list: Program[] }

/** O funil, no modo que o GHL permitir. Mesmo componente no modal e na /book. */
export function BookingForm({ hint, onDone }: { hint: BookingHint; onDone?: () => void }) {
  const [live, setLive] = useState<ProgramsState>(() => ({ status: client.ghl.locationId && !client.booking.leadOnly ? 'loading' : 'ready', list: [] }))

  useEffect(() => {
    if (UX.client) {
      fbTrack('ViewContent', { content_name: 'Trial Booking' })
      gaTrack('view_content', { content_name: 'Trial Booking' })
    }
    if (!client.ghl.locationId || client.booking.leadOnly) return
    let alive = true
    fetchPrograms()
      .then((list) => alive && setLive({ status: 'ready', list }))
      .catch(() => alive && setLive({ status: 'error', list: [] }))
    return () => {
      alive = false
    }
  }, [])

  if (live.status === 'loading') {
    return (
      <div className="nd-stack">
        <Head step={1} total={2} title={form.live.title} />
        <div className="nd-loading" role="status">
          <span className="nd-spinner" aria-hidden="true" />
          {form.live.loading}
        </div>
      </div>
    )
  }
  return live.list.length ? <LiveForm list={live.list} hint={hint} onDone={onDone} /> : <FoundingForm hint={hint} onDone={onDone} />
}

/* ── AO VIVO: dados + turma → dia e horário → confirmado ─────────────── */

/** O card ou o horário que abriu o modal aponta uma turma da página; acha a do GHL pelo nome. */
function hintedCalendar(list: Program[], key?: ProgramKey) {
  const title = key ? cards.cards.find((c) => c.key === key)?.title : undefined
  if (!title) return ''
  const words = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
  const want = words(title)
  return list.find((p) => {
    const have = new Set(words(labelOf(p.calendar_id, p.name)))
    return want.every((w) => have.has(w))
  })?.calendar_id ?? ''
}

function LiveForm({ list, hint, onDone }: { list: Program[]; hint: BookingHint; onDone?: () => void }) {
  const scope = useId()
  const [step, setStep] = useState<1 | 2 | 'done'>(1)
  const [data, setData] = useState<BookingData>(() => ({
    ...prefillFromUrl(),
    childName: '',
    calendarId: hintedCalendar(list, hint.program),
    date: '',
    time: '',
    preferredAudience: '',
  }))
  const [women, setWomen] = useState(false)
  const leadSent = useRef(false)
  const patch = (next: Partial<BookingData>) => setData((prev) => ({ ...prev, ...next }))
  const program = list.find((p) => p.calendar_id === data.calendarId) ?? null
  const user = () => ({ name: data.fullName.trim(), email: data.email.trim(), phone: toE164(data.phone) })

  if (step === 'done') {
    const booked = Boolean(program && data.date && data.time)
    return (
      <LiveSuccess
        booked={booked}
        date={data.date}
        time={data.time}
        program={program ? shortName(program) : ''}
        name={data.fullName.trim()}
        onDone={onDone}
        // outra criança (ou outra turma), a mesma pessoa: volta ao passo 1 com o contato; o lead não sai de novo
        another={booked ? (program?.audience === 'kids' ? 'child' : 'class') : null}
        onAnother={() => {
          patch({ childName: '', date: '', time: '' })
          setStep(1)
        }}
      />
    )
  }

  if (step === 2) {
    return (
      <LiveStep2
        program={program}
        data={data}
        onChange={patch}
        onBack={() => setStep(1)}
        onConfirm={() => {
          if (UX.client) {
            fbTrack('Schedule', { content_category: program?.audience }, user())
            gaTrack('trial_booked', { audience: program?.audience })
            adsConversion(client.tracking.adsBookedLabel)
          }
          if (program && data.date && data.time) sendBooking(data, program, client.source)
          setStep('done')
        }}
      />
    )
  }

  return (
    <LiveStep1
      scope={scope}
      data={data}
      list={list}
      program={program}
      women={women}
      onWomen={setWomen}
      onChange={patch}
      onNext={() => {
        if (!leadSent.current) {
          // Webhook 1 uma vez por sessão; identify antes do Lead (Advanced Matching / Enhanced Conversions)
          leadSent.current = true
          sendLiveLead(data, program, client.source, { women_interest: women, cta_origin: hint.origin, page: form.page, tier: openTier.id })
          if (UX.client) {
            identify(user())
            fbTrack('Lead', { content_category: program?.audience }, user())
            gaTrack('generate_lead', { audience: program?.audience })
            adsConversion(client.tracking.adsLeadLabel)
            trackFormSubmit(program ? [program.name] : [], openTier.id)
          }
        }
        // turma em lista de espera: o lead é tudo; sem calendário, sem Webhook 2
        setStep(isWaitlist(program) ? 'done' : 2)
      }}
    />
  )
}

function LiveStep1({
  scope, data, list, program, women, onWomen, onChange, onNext,
}: {
  scope: string
  data: BookingData
  list: Program[]
  program: Program | null
  women: boolean
  onWomen: (v: boolean) => void
  onChange: (p: Partial<BookingData>) => void
  onNext: () => void
}) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const childRef = useRef<HTMLInputElement>(null)
  const needsChild = program?.audience === 'kids'
  const edit = (p: Partial<BookingData>) => {
    onChange(p)
    setErrors((prev) => {
      const next = { ...prev }
      for (const k of Object.keys(p)) delete next[k]
      if ('calendarId' in p) delete next.class
      return next
    })
  }
  // turma de kids escolhida PELA PESSOA: o campo da criança aparece, a tela rola até ele e o
  // foco entra (a turma que já chega marcada pelo card não rola: o topo do formulário fica à vista)
  const initial = useRef(data.calendarId)
  useEffect(() => {
    if (data.calendarId === initial.current) return
    if (!needsChild) return
    const el = childRef.current
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    el?.focus({ preventScroll: true })
  }, [needsChild, data.calendarId])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (data.fullName.trim().length < 2) next.fullName = form.contact.errors.name
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())) next.email = form.contact.errors.email
    if (!isValidPhone(data.phone)) next.phone = form.contact.errors.phone
    if (!program) next.class = form.live.classError
    if (needsChild && data.childName.trim().length < 2) next.childName = form.live.childError
    setErrors(next)
    if (!Object.keys(next).length) onNext()
  }

  const groups = groupPrograms(list)
  return (
    <form onSubmit={submit} noValidate className="nd-stack">
      <Head step={1} total={2} title={form.live.title} />
      <div className="nd-stack-sm">
        <Field id={`${scope}-name`} label={form.contact.name} autoComplete="name" placeholder={form.contact.namePlaceholder} value={data.fullName} error={errors.fullName} onChange={(e) => edit({ fullName: e.target.value })} />
        <div className="nd-row">
          <Field id={`${scope}-phone`} label={form.contact.phone} type="tel" inputMode="tel" autoComplete="tel" placeholder={form.contact.phonePlaceholder} value={data.phone} error={errors.phone} onChange={(e) => edit({ phone: formatPhone(e.target.value) })} />
          <Field id={`${scope}-email`} label={form.contact.email} type="email" autoComplete="email" placeholder={form.contact.emailPlaceholder} value={data.email} error={errors.email} onChange={(e) => edit({ email: e.target.value })} />
        </div>
      </div>
      <fieldset className="nd-stack-xs">
        <legend className="nd-label">{form.live.classLabel}</legend>
        {groups.map((g) => (
          <div key={g.label} className="nd-options">
            {groups.length > 1 ? <p className="nd-group">{g.label}</p> : null}
            {g.programs.map((p) => {
              const on = p.calendar_id === data.calendarId
              const hintText = optionHint(p)
              return (
                <label key={p.calendar_id} className={`nd-option${on ? ' is-active' : ''}`}>
                  <input type="radio" name={`${scope}-prog`} checked={on} onChange={() => edit({ calendarId: p.calendar_id, date: '', time: '' })} />
                  <span>
                    <span className="nd-option-title">{shortName(p)}</span>
                    {hintText ? <span className="nd-option-hint">{hintText}</span> : null}
                  </span>
                </label>
              )
            })}
          </div>
        ))}
        {errors.class ? <p className="nd-error">{errors.class}</p> : null}
      </fieldset>
      {needsChild ? (
        <Field ref={childRef} id={`${scope}-child`} label={form.live.child} hint={form.live.childHint} value={data.childName} error={errors.childName} onChange={(e) => edit({ childName: e.target.value })} />
      ) : null}
      <label className="nd-check">
        <input type="checkbox" checked={women} onChange={(e) => onWomen(e.target.checked)} />
        <span>{form.contact.women}</span>
      </label>
      <div className="nd-stack-xs">
        <button type="submit" className="nd-button">
          {form.live.continue} <Arrow />
        </button>
        <p className="nd-foot">{form.live.nextNote}</p>
      </div>
    </form>
  )
}

function LiveStep2({
  program, data, onChange, onBack, onConfirm,
}: {
  program: Program | null
  data: BookingData
  onChange: (p: Partial<BookingData>) => void
  onBack: () => void
  onConfirm: () => void
}) {
  const days = program ? Object.keys(program.slots).sort() : []
  const [month, setMonth] = useState(() => (days[0] ? parseKey(days[0]) : new Date()))

  // abre no primeiro dia com aula; dia com um horário só já vem com ele marcado
  useEffect(() => {
    if (!program || !days[0]) return
    setMonth(parseKey(days[0]))
    if (!data.date || !program.slots[data.date]) onChange({ date: days[0], time: program.slots[days[0]].length === 1 ? program.slots[days[0]][0] : '' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program?.calendar_id])

  const times = program && data.date ? (program.slots[data.date] ?? []) : []
  const open = Boolean(program && days.length)
  const canConfirm = open ? Boolean(data.date && data.time) : true

  return (
    <div className="nd-stack">
      <Head
        step={2}
        total={2}
        title={form.live.pickTitle}
        text={program ? <strong>{shortName(program)}</strong> : null}
        back={
          <button type="button" onClick={onBack} className="nd-link">
            ‹ {form.back}
          </button>
        }
      />
      {noteOf(program) ? <p className="nd-note">{noteOf(program)}</p> : null}
      {open && program ? (
        <>
          <Calendar
            month={month}
            selected={data.date}
            bookable={(k) => Boolean(program.slots[k]?.length)}
            onSelect={(k) => onChange({ date: k, time: program.slots[k].length === 1 ? program.slots[k][0] : '' })}
            onMonth={setMonth}
          />
          {data.date && times.length ? (
            <div className="nd-stack-xs">
              <p className="nd-label">{longDate(data.date)}</p>
              <div className="nd-times">
                {times.map((t) => (
                  <button key={t} type="button" aria-pressed={t === data.time} onClick={() => onChange({ time: t })} className={`nd-time${t === data.time ? ' is-active' : ''}`}>
                    {timeLabel(t)}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <p className="nd-note">
          {form.live.noTimes} <a href={site.phoneHref}>{site.phone}</a>
        </p>
      )}
      <button type="button" disabled={!canConfirm} onClick={onConfirm} className="nd-button">
        {form.live.confirm} <Arrow />
      </button>
    </div>
  )
}

function Calendar({
  month, selected, bookable, onSelect, onMonth,
}: {
  month: Date
  selected: string
  bookable: (key: string) => boolean
  onSelect: (key: string) => void
  onMonth: (d: Date) => void
}) {
  const y = month.getFullYear()
  const m = month.getMonth()
  const cells: Array<Date | null> = Array.from({ length: new Date(y, m, 1).getDay() }, () => null)
  for (let d = 1; d <= new Date(y, m + 1, 0).getDate(); d++) cells.push(new Date(y, m, d))
  return (
    <div className="nd-calendar">
      <div className="nd-cal-head">
        <button type="button" aria-label={form.live.prevMonth} onClick={() => onMonth(new Date(y, m - 1, 1))}>
          ‹
        </button>
        <span>{month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        <button type="button" aria-label={form.live.nextMonth} onClick={() => onMonth(new Date(y, m + 1, 1))}>
          ›
        </button>
      </div>
      <div className="nd-cal-grid">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <span key={i} className="nd-cal-dow" aria-hidden="true">
            {d}
          </span>
        ))}
        {cells.map((day, i) => {
          if (!day) return <span key={i} />
          const key = dateKey(day)
          const ok = bookable(key)
          return (
            <button key={i} type="button" disabled={!ok} aria-label={longDate(key)} aria-pressed={key === selected} onClick={() => onSelect(key)} className={`nd-day${key === selected ? ' is-active' : ''}`}>
              {day.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function LiveSuccess({
  booked, date, time, program, name, onDone, another, onAnother,
}: {
  booked: boolean
  date: string
  time: string
  program: string
  name: string
  onDone?: () => void
  another: 'child' | 'class' | null
  onAnother: () => void
}) {
  const first = name.split(/\s+/)[0]
  return (
    <div className="nd-stack">
      <Head step={3} total={2} title={booked ? form.live.bookedTitle : form.live.requestTitle} text={booked ? form.live.bookedText(first) : form.live.requestText(first)} />
      <ul className="nd-details">
        {booked ? (
          <li>
            <Check />
            <span>
              <strong>{longDate(date)}</strong>
              <br />
              {timeLabel(time)}
              {program ? ` · ${program}` : ''}
            </span>
          </li>
        ) : null}
        <li>
          <Route />
          <a href={site.directionsHref} target="_blank" rel="noopener noreferrer">
            {site.address.full}
          </a>
        </li>
      </ul>
      {onDone ? (
        <button type="button" onClick={onDone} className="nd-button">
          {form.live.done}
        </button>
      ) : null}
      {another ? (
        <button type="button" onClick={onAnother} className="nd-link nd-another">
          {form.live.another[another]}
        </button>
      ) : null}
    </div>
  )
}

/* ── FOUNDING: o pré-cadastro da pré-abertura (sem turmas no GHL) ───────── */

type Data = { who: Who | ''; programs: ProgramKey[]; fullName: string; email: string; phone: string; women: boolean; hp: string }
type Step = 1 | 2 | 3 | 'done'

const whoDefaultPrograms = (who: Who, hinted?: ProgramKey): ProgramKey[] => {
  if (hinted) return [hinted]
  if (who === 'me') return ['adults']
  if (who === 'teen') return ['adults']
  return []
}

function FoundingForm({ hint, onDone }: { hint: BookingHint; onDone?: () => void }) {
  const scope = useId()
  const hintedWho: Who | '' = hint.who ?? (hint.program ? (cards.cards.find((p) => p.key === hint.program)?.who[0] ?? '') : '')
  const [step, setStep] = useState<Step>(hintedWho ? 2 : 1)
  const [data, setData] = useState<Data>(() => ({
    ...prefillFromUrl(),
    who: hintedWho,
    programs: hintedWho ? whoDefaultPrograms(hintedWho, hint.program) : hint.program ? [hint.program] : [],
    women: false,
    hp: '',
  }))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')
  const sent = useRef(false)
  const patch = (next: Partial<Data>) => {
    setData((prev) => ({ ...prev, ...next }))
    setErrors({})
  }

  const total = 3
  const user = () => ({ name: data.fullName.trim(), email: data.email.trim(), phone: toE164(data.phone) })

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (data.fullName.trim().length < 2) next.fullName = form.contact.errors.name
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())) next.email = form.contact.errors.email
    if (!isValidPhone(data.phone)) next.phone = form.contact.errors.phone
    setErrors(next)
    if (Object.keys(next).length) return
    if (data.hp) return // honeypot: bot preencheu o campo invisível
    if (sent.current) return setStep('done')
    setStatus('sending')
    const ok = await sendFoundingLead(data, hint.origin)
    if (!ok) return setStatus('error')
    sent.current = true
    if (UX.client) {
      identify(user())
      fbTrack('Lead', { content_category: data.who }, user())
      gaTrack('generate_lead', { audience: data.who })
      adsConversion(client.tracking.adsLeadLabel)
      trackFormSubmit(data.programs, openTier.id)
    }
    setStatus('idle')
    setStep('done')
  }

  if (step === 'done') {
    return (
      <div className="nd-stack">
        <Head step={3} total={total} title={form.success.title} />
        <p className="nd-muted">
          {form.success.body} <Pending>{form.success.channelPending}</Pending>
        </p>
        {onDone ? (
          <button type="button" onClick={onDone} className="nd-button">
            {form.success.done}
          </button>
        ) : null}
      </div>
    )
  }

  if (step === 1) {
    return (
      <div className="nd-stack">
        <Head step={1} total={total} title={form.who.label} />
        <div className="nd-options nd-options--who">
          {form.who.options.map((o) => (
            <label key={o.key} className={`nd-option${data.who === o.key ? ' is-active' : ''}`}>
              <input type="radio" name={`${scope}-who`} checked={data.who === o.key} onChange={() => patch({ who: o.key, programs: whoDefaultPrograms(o.key, hint.program) })} />
              <span className="nd-tri" aria-hidden="true">
                <Tri />
              </span>
              <span>
                <span className="nd-option-title">{o.title}</span>
                <span className="nd-option-hint">{o.hint}</span>
              </span>
            </label>
          ))}
        </div>
        {errors.who ? <p className="nd-error">{errors.who}</p> : null}
        <button
          type="button"
          className="nd-button"
          onClick={() => {
            if (!data.who) return setErrors({ who: form.who.error })
            setStep(2)
          }}
        >
          {form.next} <Arrow />
        </button>
      </div>
    )
  }

  if (step === 2) {
    const multi = data.who === 'family'
    const list = cards.cards.filter((p) => !data.who || multi || (p.who as Who[]).includes(data.who as Who))
    const toggle = (k: ProgramKey) => patch({ programs: multi ? (data.programs.includes(k) ? data.programs.filter((x) => x !== k) : [...data.programs, k]) : [k] })
    return (
      <div className="nd-stack">
        <Head
          step={2}
          total={total}
          title={form.program.label}
          text={multi ? form.program.multiHint : undefined}
          back={
            <button type="button" onClick={() => setStep(1)} className="nd-link">
              ‹ {form.back}
            </button>
          }
        />
        <div className="nd-options">
          {list.map((p) => {
            const on = data.programs.includes(p.key)
            return (
              <label key={p.key} className={`nd-option${on ? ' is-active' : ''}`}>
                <input type={multi ? 'checkbox' : 'radio'} name={`${scope}-prog`} checked={on} onChange={() => toggle(p.key)} />
                <span>
                  <span className="nd-option-title">{p.title}</span>
                  <span className="nd-option-hint">{p.tag}</span>
                </span>
              </label>
            )
          })}
        </div>
        {errors.programs ? <p className="nd-error">{errors.programs}</p> : null}
        <button
          type="button"
          className="nd-button"
          onClick={() => {
            if (!data.programs.length) return setErrors({ programs: form.program.error })
            setStep(3)
          }}
        >
          {form.next} <Arrow />
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="nd-stack">
      <Head
        step={3}
        total={total}
        title={form.contact.label}
        back={
          <button type="button" onClick={() => setStep(2)} className="nd-link">
            ‹ {form.back}
          </button>
        }
      />
      <div className="nd-stack-sm">
        <Field id={`${scope}-name`} label={form.contact.name} autoComplete="name" placeholder={form.contact.namePlaceholder} value={data.fullName} error={errors.fullName} onChange={(e) => patch({ fullName: e.target.value })} />
        <div className="nd-row">
          <Field id={`${scope}-phone`} label={form.contact.phone} type="tel" inputMode="tel" autoComplete="tel" placeholder={form.contact.phonePlaceholder} value={data.phone} error={errors.phone} onChange={(e) => patch({ phone: formatPhone(e.target.value) })} />
          <Field id={`${scope}-email`} label={form.contact.email} type="email" autoComplete="email" placeholder={form.contact.emailPlaceholder} value={data.email} error={errors.email} onChange={(e) => patch({ email: e.target.value })} />
        </div>
        {/* honeypot: fora da tela, fora do tab, nunca preenchido por gente */}
        <div className="nd-hp" aria-hidden="true">
          <label htmlFor={`${scope}-hp`}>Company</label>
          <input id={`${scope}-hp`} type="text" tabIndex={-1} autoComplete="off" value={data.hp} onChange={(e) => patch({ hp: e.target.value })} />
        </div>
        <label className="nd-check">
          <input type="checkbox" checked={data.women} onChange={(e) => patch({ women: e.target.checked })} />
          <span>{form.contact.women}</span>
        </label>
        <Pending>{form.contact.womenPending}</Pending>
      </div>
      <div className="nd-stack-xs">
        <button type="submit" className="nd-button" disabled={status === 'sending'} aria-busy={status === 'sending'}>
          {status === 'sending' ? form.sending : form.submit} <Arrow />
        </button>
        {status === 'error' ? (
          <p className="nd-error" role="alert">
            {form.error}
          </p>
        ) : null}
        <p className="nd-foot">{form.micro}</p>
        <p className="nd-foot">
          <Pending>{form.microPending}</Pending> <Pending>{form.consentPending}</Pending>
        </p>
      </div>
    </form>
  )
}

/** Webhook 1 do pré-cadastro. Devolve true no 2xx (ou no PLACEHOLDER de prospect / sem Location ID). */
async function sendFoundingLead(d: Data, origin: string): Promise<boolean> {
  const [first = '', ...rest] = d.fullName.trim().split(/\s+/)
  const payload = {
    event: 'lead_captured',
    name: d.fullName.trim(),
    firstName: first,
    lastName: rest.join(' '),
    email: d.email.trim(),
    phone: d.phone.trim(),
    phoneE164: toE164(d.phone),
    who: d.who,
    programs: d.programs,
    program: d.programs.map((k) => cards.cards.find((p) => p.key === k)?.title ?? k).join(', '),
    audience: d.who === 'me' ? 'adults' : 'kids',
    tier: openTier.id,
    women_interest: d.women,
    cta_origin: origin,
    page: form.page,
    tags: ['founding-member', `tier-${openTier.id}`, ...d.programs.map((k) => `program-${k}`), 'source'],
    submittedAt: new Date().toISOString(),
    source: getSourceLabel(client.source),
    ...getAttribution(),
  }
  if (!LEAD_WEBHOOK || UX.prospect) {
    console.warn('[nd] webhook PLACEHOLDER (modo prospect ou sem Location ID): lead NÃO enviado', payload)
    return true
  }
  if (isGhlReturnVisit()) return true
  try {
    const r = await fetch(LEAD_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), keepalive: true })
    return r.ok
  } catch {
    return false
  }
}

/* ── peças comuns ─────────────────────────────────────────────────────── */

type FieldProps = { id: string; label: string; error?: string; hint?: string; ref?: React.Ref<HTMLInputElement> } & React.InputHTMLAttributes<HTMLInputElement>

function Field({ id, label, error, hint, ref, ...props }: FieldProps) {
  return (
    <div className="nd-stack-xs">
      <label htmlFor={id} className="nd-label">
        {label}
      </label>
      <input ref={ref} id={id} {...props} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} className={`nd-input${error ? ' is-error' : ''}`} />
      {hint ? <p className="nd-hint">{hint}</p> : null}
      {error ? (
        <p id={`${id}-err`} className="nd-error">
          <Tri /> {error}
        </p>
      ) : null}
    </div>
  )
}

function Head({ step, total, title, text, back }: { step: 1 | 2 | 3; total: number; title: string; text?: ReactNode; back?: ReactNode }) {
  const done = step > total
  return (
    <header className="nd-head">
      <div className="nd-progress" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
          <span key={n} className={n <= step ? 'is-on' : undefined} />
        ))}
      </div>
      <p className="nd-step">
        {done ? form.live.allSet : form.stepLabel(step, total)}
        {back}
      </p>
      <h2 className="nd-title">{title}</h2>
      {text ? <p className="nd-muted">{text}</p> : null}
    </header>
  )
}
