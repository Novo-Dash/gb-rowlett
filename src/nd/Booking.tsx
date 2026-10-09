/* ════════════════════════════════════════════════════════════════════
   Booking — o funil do kit Novo Dash, no fluxo de PRÉ-CADASTRO da Rowlett
   (PRD §11). O kit (attribution, webhook, tracking, programs, config,
   types, nd.css) chega da Collective sem alteração; o que muda aqui é o
   fluxo: a academia não abriu, então não há calendário nem Webhook 2.

     passo 1  Who is training?  (child / teen / me / family)
     passo 2  Which class?      (pré-selecionado por card, horário ou menu;
                                 "family" permite mais de uma)
     passo 3  Name · Phone · Email · interesse em turma feminina
     → Webhook 1 (lead) · Lead (Pixel + CAPI) · generate_lead · Ads Lead
       · Clarity form_submit SÓ depois do 2xx.

   Diálogo em tela cheia no celular, inputs de 16px (sem zoom do iOS),
   foco preso e devolvido a quem abriu, html.bk-open enquanto aberto.
   Webhook PLACEHOLDER (prospect, sem UUID): não dispara, avisa no console
   e a tela de sucesso aparece do mesmo jeito.
   ════════════════════════════════════════════════════════════════════ */

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Pending } from '@/components/ui/Pending'
import { Arrow, Check, Close, Tri } from '@/components/ui/Icons'
import { form, openTier, programs, site } from '@/data/site'
import { UX } from '@/lib/ux'
import { trackFormSubmit } from '@/track'
import type { BookingHint, ProgramKey, Who } from '@/types'
import { captureAttribution, formatPhone, getAttribution, getSourceLabel, isGhlReturnVisit, prefillFromUrl, toE164 } from './attribution'
import { LEAD_WEBHOOK, client } from './config'
import { adsConversion, fbTrack, gaTrack, identify } from './tracking'

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
  }, [])

  const value = useMemo(() => ({ open, close, isOpen: hint !== null }), [open, close, hint])
  return (
    <BookingContext.Provider value={value}>
      {children}
      {hint ? <BookingModal hint={hint} onClose={close} /> : null}
    </BookingContext.Provider>
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

type Data = { who: Who | ''; programs: ProgramKey[]; fullName: string; email: string; phone: string; women: boolean; hp: string }
type Step = 1 | 2 | 3 | 'done'

const whoDefaultPrograms = (who: Who, hinted?: ProgramKey): ProgramKey[] => {
  if (hinted) return [hinted]
  if (who === 'me') return ['adults']
  if (who === 'teen') return ['adults']
  return []
}

export function BookingForm({ hint, onDone }: { hint: BookingHint; onDone?: () => void }) {
  const scope = useId()
  const hintedWho: Who | '' = hint.who ?? (hint.program ? (programs.cards.find((p) => p.key === hint.program)?.who[0] ?? '') : '')
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

  useEffect(() => {
    if (UX.client) {
      fbTrack('ViewContent', { content_name: 'Founding Member spot' })
      gaTrack('view_content', { content_name: 'Founding Member spot' })
    }
  }, [])

  const total = 3
  const user = () => ({ name: data.fullName.trim(), email: data.email.trim(), phone: toE164(data.phone) })

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (data.fullName.trim().length < 2) next.fullName = form.contact.errors.name
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())) next.email = form.contact.errors.email
    if (data.phone.replace(/\D/g, '').length < 10) next.phone = form.contact.errors.phone
    setErrors(next)
    if (Object.keys(next).length) return
    if (data.hp) return // honeypot: bot preencheu o campo invisível
    if (sent.current) return setStep('done')
    setStatus('sending')
    const ok = await sendLead(data, hint.origin)
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
    const list = programs.cards.filter((p) => !data.who || multi || (p.who as Who[]).includes(data.who as Who))
    const toggle = (k: ProgramKey) =>
      patch({ programs: multi ? (data.programs.includes(k) ? data.programs.filter((x) => x !== k) : [...data.programs, k]) : [k] })
    return (
      <div className="nd-stack">
        <Head step={2} total={total} title={form.program.label} text={multi ? form.program.multiHint : undefined} back={<button type="button" onClick={() => setStep(1)} className="nd-link">‹ {form.back}</button>} />
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
      <Head step={3} total={total} title={form.contact.label} back={<button type="button" onClick={() => setStep(2)} className="nd-link">‹ {form.back}</button>} />
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

/** Webhook 1: o lead. Devolve true no 2xx (ou no PLACEHOLDER de prospect). */
async function sendLead(d: Data, origin: string): Promise<boolean> {
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
    program: d.programs.map((k) => programs.cards.find((p) => p.key === k)?.title ?? k).join(', '),
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
    console.warn('[nd] webhook PLACEHOLDER (modo prospect): lead NÃO enviado', payload)
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

function Field({ id, label, error, ...props }: { id: string; label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="nd-stack-xs">
      <label htmlFor={id} className="nd-label">
        {label}
      </label>
      <input id={id} {...props} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} className={`nd-input${error ? ' is-error' : ''}`} />
      {error ? (
        <p id={`${id}-err`} className="nd-error">
          <Tri /> {error}
        </p>
      ) : null}
    </div>
  )
}

function Head({ step, total, title, text, back }: { step: 1 | 2 | 3; total: number; title: string; text?: ReactNode; back?: ReactNode }) {
  return (
    <header className="nd-head">
      <div className="nd-progress" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
          <span key={n} className={n <= step ? 'is-on' : undefined} />
        ))}
      </div>
      <p className="nd-step">
        {form.stepLabel(step, total)}
        {back}
      </p>
      <h2 className="nd-title">{title}</h2>
      {text ? <p className="nd-muted">{text}</p> : null}
    </header>
  )
}
