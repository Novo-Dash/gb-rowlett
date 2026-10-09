/* ════════════════════════════════════════════════════════════════════
   site.ts — TODA a copy e TODO o dado da página (PRD-GBR-001 §10).
   Fonte: "Copy para grand opening GB Rowlett" (ETAPA 1, 9 out 2026) +
   flyer "Regular Schedule". Nada de texto no TSX.

   Dado que o cliente não mandou é `null` + marcador <Pending> na seção
   (visível em prospect, oculto em client). Nunca inventar: data, vagas
   tomadas, preço de família, bio do coach, review.
   O único número que o cliente mexe na mão é `tiers[0].claimed`.
   ════════════════════════════════════════════════════════════════════ */

import type { ProgramKey, Who } from '@/types'

/* ── A unidade ─────────────────────────────────────────────────────── */
export const site = {
  name: 'Gracie Barra Rowlett',
  shortName: 'GB Rowlett',
  network: 'Gracie Barra',
  city: 'Rowlett',
  state: 'TX',
  address: {
    line1: '3503 Rowlett Rd, Bldg K, Suite 302',
    line2: 'Rowlett, TX 75088',
    full: '3503 Rowlett Rd, Bldg K, Suite 302, Rowlett, TX 75088',
  },
  phone: '(945) 385-9359',
  phoneHref: 'tel:+19453859359',
  smsHref: 'sms:+19453859359',
  email: 'info@gbrowlett.com', // [CONFIRMAR domínio da LP] (§20 #16)
  url: 'https://gbrowlett.com',
  /** [CONFIRMAR] @gbrowlett existe? null = pendência, nunca ícone vazio. (§20 #15) */
  socials: { instagram: null as string | null, facebook: null as string | null },
  /** [CONFIRMAR] data e hora da abertura. null = contador não aparece. (§20 #1) */
  openingISO: null as string | null,
  openingLabel: null as string | null,
  /** [CONFIRMAR] primeira aula. (§20 #1) */
  firstClassesLabel: null as string | null,
  /** O filme do hero: o b-roll da obra existe (IMG_1600/1601.MOV em Obras GB) mas
      ainda não chegou em brand/video (>10 MB no conector). Poster AVIF até lá. (§20 #19) */
  heroFilm: { mobile: null as string | null, desktop: null as string | null },
  /** Vídeo vertical do pedido. [CONFIRMAR existe] (§20 #19) */
  finalVideo: { src: null as string | null, poster: null as string | null },
  /** Embed do Maps no endereço exato (destino final do redirect, responde 200). */
  mapsEmbedSrc:
    'https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s3503+Rowlett+Rd+Bldg+K+Suite+302,+Rowlett,+TX+75088!6i16',
  directionsHref:
    'https://www.google.com/maps/dir/?api=1&destination=3503+Rowlett+Rd+Bldg+K+Suite+302,+Rowlett,+TX+75088',
  coachName: 'Andre Carepa',
  coachYears: 27,
}

/* ── A oferta ──────────────────────────────────────────────────────── */
export const pricing = {
  founding: { amount: 87, period: 'every two weeks', enrollment: 0 },
  standard: { amount: 107, period: 'every two weeks', enrollment: 47 },
  adultsAccess: 'unlimited',
  kidsPerWeek: 3,
  /** [CONFIRMAR] preço da família, com número. (§20 #7) */
  family: null as string | null,
  /** [CONFIRMAR] o $87 vale enquanto o membro treinar? (§20 #4) */
  permanent: null as boolean | null,
  /** [CONFIRMAR] cobrança no pré-cadastro. Assumido: nada cobrado hoje. (§20 #5) */
  chargedToday: null as boolean | null,
}

export type Tier = {
  id: 'first-50' | 'founding-class'
  order: 'I' | 'II'
  label: string
  /** null = o cliente ainda não deu o limite. */
  seats: number | null
  /** O único número que o cliente atualiza na mão. null = [CONFIRMAR]. */
  claimed: number | null
  /** O perk DESTA faixa (o perk decresce, o preço não). */
  perk: { title: string; short: string; big?: string; bigSub?: string }
  perks: string[]
  /** Como a faixa se apresenta quando está aberta / travada. */
  note: string
}

export const tiers: Tier[] = [
  {
    id: 'first-50',
    order: 'I',
    label: 'The First 50',
    seats: 50,
    claimed: null, // [CONFIRMAR] vagas já tomadas (§20 #2)
    perk: { title: 'Gracie Barra uniform included', short: 'Uniform included' },
    perks: ['$87 every two weeks', 'No enrollment fee', 'Gracie Barra uniform included'],
    note: 'The first fifty people to join before the doors open.',
  },
  {
    id: 'founding-class',
    order: 'II',
    label: 'The Founding Class',
    seats: null, // [CONFIRMAR] limite de vagas (§20 #3)
    claimed: 0,
    perk: { title: '50% off the Gracie Barra uniform', short: '50% off uniform', big: '50% off', bigSub: 'the Gracie Barra uniform' },
    perks: ['$87 every two weeks', 'No enrollment fee', '50% off the Gracie Barra uniform'],
    note: 'Opens when The First 50 is full.',
  },
]

/** A faixa à venda: a primeira com vaga (claimed desconhecido conta como aberta).
    Tudo que fala do "grupo atual" lê daqui, nunca tiers[0]. */
export const openTier: Tier =
  tiers.find((t) => t.seats === null || t.claimed === null || t.claimed < t.seats) ?? tiers[tiers.length - 1]

/** Vagas restantes do grupo aberto; null enquanto `claimed` ou `seats` for pendência. */
export const spotsLeft = (t: Tier = openTier): number | null =>
  t.seats === null || t.claimed === null ? null : Math.max(0, t.seats - t.claimed)


/* ── Nav ───────────────────────────────────────────────────────────── */
export const nav = {
  callLabel: 'Call or text Gracie Barra Rowlett',
  logoLabel: 'Gracie Barra Rowlett — claim a Founding Member spot',
  menuOpen: 'Open menu',
  menuClose: 'Close menu',
  menu: {
    classes: {
      label: 'Classes',
      links: [
        { label: 'Little Champions 1 · 4–6', program: 'lc1' as ProgramKey },
        { label: 'Little Champions 2 · 7–9', program: 'lc2' as ProgramKey },
        { label: 'Juniors · 10–14', program: 'juniors' as ProgramKey },
        { label: 'Adults · All Levels', program: 'adults' as ProgramKey },
      ],
    },
    schedule: {
      label: 'Schedule',
      links: [
        { label: 'Weekly schedule', href: '#schedule' },
        { label: 'The founding offer', href: '#offer' },
        { label: 'Questions', href: '#faq' },
      ],
    },
    visit: {
      label: 'Visit',
      directions: 'Get directions',
      book: 'Claim a Founding spot',
    },
  },
}

/* ── I · Hero ──────────────────────────────────────────────────────── */
export const hero = {
  eyebrow: 'Opening soon · Rowlett, TX',
  /** O trecho vermelho com duplicado em contorno: "never trained". */
  title: [
    { text: "A new Gracie Barra is coming to Rowlett, built for people who've" },
    { text: 'never trained.', accent: true },
  ],
  lead: 'Kids from 4, teens and adults. No experience needed. The official Gracie Barra curriculum, led by Andre Carepa, 27 years in jiu-jitsu.',
  offerLine: 'Founding Members pay $87 every two weeks. No enrollment fee.',
  cta: 'Claim my Founding Member spot',
  /** Cena 2: a frase da oferta. `w` = largura em em (AdihausDIN Cn Bold Italic,
      scripts/fit-lines.py). As duas linhas grandes usam a mesma largura (a da mais
      longa, "Pay less than everyone" = 8.094em), então saem no mesmo corpo; a
      pequena usa 17.4 e sai a ~47% delas (as grandes cresceram a pedido do Adryan,
      a pequena ficou no tamanho de antes). */
  scene: {
    lines: [
      { text: 'Join before we open.', w: 17.4 },
      { text: 'Pay less than everyone', w: 8.094, big: true },
      { text: 'who joins after.', w: 8.094, big: true, accent: true },
    ],
    cta: 'Explore the founding offer',
  },
  /** O alt descreve a FOTO: é o Andre num tatame Gracie Barra, não a Rowlett. [CONFIRMAR autorização] */
  posterAlt: 'Andre Carepa in a white gi drilling a technique with a student on a blue Gracie Barra mat',
  filmPending: 'Hero b-roll: IMG_1600 / IMG_1601 (Obras GB) still to be delivered to brand/video',
}

/* ── Letreiro em X ─────────────────────────────────────────────────── */
export const marquee = {
  red: ['Founding rate before we open', 'No enrollment fee', 'Kids from 4', '18 classes a week'],
  navy: ['Rowlett, TX', 'Gracie Barra', 'No experience needed', 'Opening soon'],
}

/* ── II · Oferta de fundação ───────────────────────────────────────── */
export const offer = {
  eyebrow: 'The founding offer',
  title: [{ text: 'Founding Members' }],
  body: 'Founding Members pay $87 every two weeks with no enrollment fee. Once we open, the standard rate is $107 every two weeks plus a $47 enrollment fee. Adults train unlimited. Kids train 3 classes a week.',
  permanencePending: 'Does the $87 hold for as long as the member keeps training?',
  passLabel: 'Founding Member pass: The First 50 and The Founding Class',
  openPill: 'Open now',
  lockedPill: 'Opens next',
  seatsLabel: (n: number) => `${n} seats`,
  takenLabel: (c: number, s: number) => `${c} of ${s} taken`,
  leftLabel: (n: number) => `${n} left`,
  claimedPending: 'First 50 spots already taken: number to confirm',
  seatsPending: 'Founding Class seat limit to confirm',
  ticketCta: 'Claim a First 50 spot',
  /** O canhoto II: o preço é o mesmo; o que muda é o perk. */
  lockedSamePrice: 'Same $87 every two weeks · No enrollment fee',
  comingSoon: 'Coming soon',
  priceLine: '$87',
  pricePer: 'every two weeks',
  enrollmentLine: 'No enrollment fee',
  compare: { label: 'After opening', founding: '$87', standard: '$107', per: 'every two weeks', plus: '+ $47 enrollment fee' },
  stamp: { ring: 'Doors open in · ', label: 'days', sr: 'days to opening' },
  stampPending: 'Opening date to confirm: the day counter appears when the date is set',
}

/* ── III · Programas ───────────────────────────────────────────────── */
export interface Program {
  key: ProgramKey
  title: string
  tag: string
  line: string
  /** Descreve a FOTO. Troca a foto, troca o alt. */
  alt: string
  image: 'p-lc1' | 'p-lc2' | 'p-juniors' | 'p-adults'
  /** Foto de outra unidade GB usada como placeholder marcado. */
  photoPending: string | null
  /** Quem este programa atende, para o passo 1 do formulário. */
  who: Who[]
  action: string
}

/** Título mais longo dos cards, em em (AdihausDIN Cn Bold Italic): os quatro usam o
    mesmo tamanho, calculado para este caber numa linha. scripts/fit-lines.py. */
export const PROGRAM_TITLE_EM = 7.3

export const programs = {
  eyebrow: 'The classes',
  title: [{ text: 'Find your class.' }],
  cards: [
    {
      key: 'lc1',
      title: 'Little Champions 1',
      tag: 'ages 4–6',
      line: 'Kids from 4 learn to move, fall and focus, in a class only for their age.', // [CONFIRMAR com copy]
      alt: 'A young student in a blue gi smiling on the mat at a Gracie Barra class',
      image: 'p-lc1',
      photoPending: 'Photo from GB Lindale: authorization to confirm',
      who: ['child', 'family'],
      action: 'Claim a Little Champions 1 spot',
    },
    {
      key: 'lc2',
      title: 'Little Champions 2',
      tag: 'ages 7–9',
      line: 'Fundamentals for kids 7 to 9, grouped by age.', // [CONFIRMAR com copy]
      alt: 'Andre Carepa kneeling on the mat beside a child in a blue gi',
      image: 'p-lc2',
      photoPending: null,
      who: ['child', 'family'],
      action: 'Claim a Little Champions 2 spot',
    },
    {
      key: 'juniors',
      title: 'Juniors',
      tag: 'ages 10–14',
      line: 'The same curriculum, with more technique and more responsibility.', // [CONFIRMAR com copy]
      alt: 'Kids in white gis lined up on the mat during a Gracie Barra class',
      image: 'p-juniors',
      photoPending: 'Photo from GB Lindale: authorization to confirm',
      who: ['child', 'teen', 'family'],
      action: 'Claim a Juniors spot',
    },
    {
      key: 'adults',
      title: 'Adults · All Levels',
      tag: '17+ · teens 15–16',
      line: 'No experience required. Teens 15–16 train in this class, same curriculum.',
      alt: 'Andre Carepa drilling an arm lock with a training partner on a blue mat',
      image: 'p-adults',
      photoPending: null,
      who: ['me', 'teen', 'family'],
      action: 'Claim an Adults spot',
    },
  ] satisfies Program[],
}

/* ── IV · A obra (Why Us) ──────────────────────────────────────────── */
export const build = {
  eyebrow: 'Behind the doors',
  title: [{ text: 'The academy is new.' }, { text: "That's your advantage.", br: true }],
  body: "No established cliques, no corner of the mat that's already taken. You walk in with the rest of the founding group, and you help set the tone of the room.",
  /** [CONFIRMAR] etapa atual da obra. null = <Pending>. */
  phase: null as string | null,
  phasePending: 'Current stage of the build',
  phaseLabel: 'Right now',
  /** Cinco fotos reais (Obras GB). `title` descreve CADA foto: vira o alt. */
  stages: [
    { id: 'sign', image: 'build-1', title: 'A crane lifting the Gracie Barra sign onto the storefront' },
    { id: 'room', image: 'build-2', title: 'The main room with new drywall, ducts overhead and the concrete floor still bare' },
    { id: 'walls', image: 'build-3', title: 'Framed walls and a doorway in the back of the academy' },
    { id: 'doors', image: 'build-4', title: 'New walls and a doorway, drywall still unpainted' },
    { id: 'front', image: 'build-5', title: 'The storefront with the Gracie Barra Jiu-Jitsu & Self-Defense sign installed' },
  ] as const,
  plates: [
    {
      title: 'Beginners are the plan, not the exception.',
      body: 'No experience needed, at any age. The classes start where you are.',
    },
    {
      title: 'The official curriculum, taught by someone you can meet.',
      body: "Every Gracie Barra academy teaches the official curriculum, and this one is no exception. What's specific to Rowlett is who teaches it: Andre Carepa, 27 years in jiu-jitsu.",
    },
    {
      title: 'One trip for the whole family.',
      body: 'On Tuesdays and Thursdays the classes run back to back: 4:30 for ages 4–6, 5:30 for ages 7–14, 6:30 for teens and adults. One drive, everybody trains.',
    },
  ],
  cta: 'Claim my Founding Member spot',
}

/* ── V · Horários (texto, nunca imagem) ────────────────────────────── */
export type SlotKey = 'adults' | 'lc1' | 'lc2-juniors'
export interface Slot {
  t: string
  p: SlotKey
}
export const scheduleGroups: Record<SlotKey, { label: string; short: string; programs: ProgramKey[]; who: Who }> = {
  adults: { label: 'Adults + Teens · Fundamentals / All Levels', short: 'Adults + Teens', programs: ['adults'], who: 'me' },
  lc1: { label: 'Little Champions 1 (4–6)', short: 'LC1 · 4–6', programs: ['lc1'], who: 'child' },
  'lc2-juniors': { label: 'LC2 + Juniors (7–14)', short: 'LC2 + Juniors · 7–14', programs: ['lc2', 'juniors'], who: 'child' },
}
export const schedule: { day: string; long: string; slots: Slot[] }[] = [
  { day: 'Mon', long: 'Monday', slots: [{ t: '12:00 PM', p: 'adults' }, { t: '5:15 PM', p: 'lc2-juniors' }, { t: '6:30 PM', p: 'adults' }] },
  { day: 'Tue', long: 'Tuesday', slots: [{ t: '6:00 AM', p: 'adults' }, { t: '4:30 PM', p: 'lc1' }, { t: '5:30 PM', p: 'lc2-juniors' }, { t: '6:30 PM', p: 'adults' }] },
  { day: 'Wed', long: 'Wednesday', slots: [{ t: '12:00 PM', p: 'adults' }, { t: '5:15 PM', p: 'lc2-juniors' }, { t: '6:30 PM', p: 'adults' }] },
  { day: 'Thu', long: 'Thursday', slots: [{ t: '6:00 AM', p: 'adults' }, { t: '4:30 PM', p: 'lc1' }, { t: '5:30 PM', p: 'lc2-juniors' }, { t: '6:30 PM', p: 'adults' }] },
  { day: 'Fri', long: 'Friday', slots: [{ t: '12:00 PM', p: 'adults' }] },
  { day: 'Sat', long: 'Saturday', slots: [{ t: '9:00 AM', p: 'lc1' }, { t: '10:00 AM', p: 'lc2-juniors' }, { t: '11:00 AM', p: 'adults' }] },
]

/** Contagens DERIVADAS do dado, nunca digitadas. */
export const scheduleCounts = (() => {
  const all = schedule.flatMap((d) => d.slots)
  const by = (k: SlotKey) => all.filter((s) => s.p === k).length
  return { total: all.length, adults: by('adults'), lc1: by('lc1'), lc2Juniors: by('lc2-juniors') }
})()

/** "I work all day" — gerado da grade: os horários de adultos agrupados por hora. */
export const adultTimesSentence = (() => {
  const byTime = new Map<string, string[]>()
  for (const d of schedule) for (const s of d.slots) if (s.p === 'adults') byTime.set(s.t, [...(byTime.get(s.t) ?? []), d.long])
  const span = (days: string[]) => {
    const order = schedule.map((d) => d.long)
    const idx = days.map((d) => order.indexOf(d)).sort((a, b) => a - b)
    const contiguous = idx.every((v, i) => i === 0 || v === idx[i - 1] + 1)
    if (days.length >= 3 && contiguous) return `${order[idx[0]]} to ${order[idx[idx.length - 1]]}`
    return days.length === 1 ? days[0] : `${days.slice(0, -1).join(', ')} and ${days[days.length - 1]}`
  }
  const parts = [...byTime.entries()].map(([t, days]) => `${t.replace(':00', '').replace('12 PM', 'noon')} ${days.length === 1 ? 'on ' : ''}${span(days.map((d) => (days.length === 1 ? d : d.slice(0, 3) === 'Sat' ? 'Saturday' : d)))}`)
  return parts.join(', ').replace(/, ([^,]*)$/, ', and $1') + '.'
})()

export const scheduleCopy = {
  eyebrow: 'The schedule',
  title: [{ text: 'Classes from 6 AM to 6:30 PM.' }, { text: 'Pick the one that fits your week.', br: true }],
  note: (n: number) => `${n} adult classes a week, including 6 AM on Tue/Thu for anyone who has to be at work by 8.`,
  summary: (c: typeof scheduleCounts) => `${c.total} classes a week · ${c.adults} adults · ${c.lc1} Little Champions 1 · ${c.lc2Juniors} LC2 + Juniors`,
  legendLabel: 'Classes',
  todayLabel: 'Today',
  slotAction: 'Claim a spot in this class',
  gb2Pending: 'Flyer legend mentions GB2 (white belt 2 stripes+) but the grid has no GB2 class: not published',
}

/* ── VI · Para os pais ─────────────────────────────────────────────── */
export const parents = {
  eyebrow: 'For parents',
  title: [{ text: 'What parents ask us first' }],
  items: [
    { q: 'Is it safe?', a: "There's no striking in jiu-jitsu, and a tap always means stop. Kids train by age group: a 4-year-old never trains with a 12-year-old." },
    { q: 'Will it make my child aggressive?', a: 'Jiu-jitsu is built on leverage and control, not hitting, and kids practice staying calm when something is hard.' },
    { q: "Will the coach know my child's name?", a: "You're joining before we open, so you're among the first families we get to know." },
  ],
  whereParentsPending: 'Where parents stay during class',
  photoAlt: 'Andre Carepa on one knee next to a child in a blue gi, in front of the Gracie Barra wall',
  photoPending: 'Kids photo: use authorization to confirm',
  cta: 'Claim a spot for my child',
}

/* ── VII · Sem experiência ─────────────────────────────────────────── */
export const ready = {
  eyebrow: 'No experience',
  title: [{ text: 'Never trained?' }, { text: "That's the starting line.", br: true }],
  needLabel: 'You need',
  need: ['comfortable clothes', 'to show up', 'curiosity', 'respect for your training partners', 'the courage to walk in the first time'],
  dontLabel: "You don't need",
  dont: ['experience', 'to be in shape', 'strength or flexibility', 'to know anyone', 'to feel ready first'],
  statement: [{ text: 'Nobody gets in shape first.' }, { text: 'You train, and the shape follows.', accent: true, br: true }],
  photoAlt: 'Andre Carepa sitting on the mat with a training partner, mid-conversation, in front of the Gracie Barra wall',
  cta: 'Claim my Founding Member spot',
}

/* ── VIII · Coach ──────────────────────────────────────────────────── */
export const coach = {
  eyebrow: 'Who teaches',
  name: 'Andre Carepa',
  lead: '27 years in jiu-jitsu.',
  /** Ficha. value null = <Pending>. (§20 #8) */
  sheet: [
    { term: 'Belt', value: null as string | null, pending: 'Belt (black belt in the photos: confirm in writing)' },
    { term: 'Lineage', value: null as string | null, pending: 'Lineage' },
    { term: 'Teaching since', value: null as string | null, pending: 'Year he started teaching' },
    { term: 'Kids and beginner classes', value: null as string | null, pending: 'Does Andre teach the kids and beginner classes himself?' },
    { term: 'Why Rowlett', value: null as string | null, pending: 'Why Rowlett, in his words' },
  ],
  photoAlt: 'Andre Carepa kneeling on a blue mat in a white gi and black belt, in front of the Gracie Barra wall',
  thenNowPending: 'Brown-belt photos (Fotos as Brown Belt) for a "then and now": files over 10 MB, still to be delivered',
  cta: 'Meet Andre as a Founding Member',
}

/* ── IX · Como reservar (3 graus na faixa) ─────────────────────────── */
export const reserve = {
  eyebrow: 'What happens next',
  title: [{ text: 'How to reserve your spot.' }],
  steps: [
    { n: '01', title: 'Pre-register.', body: "Pick who's training and which class. About a minute." },
    { n: '02', title: 'We confirm your spot.', body: 'By', pending: 'Phone call, SMS or e-mail, and how soon' },
    {
      n: '03',
      title: 'Doors open.',
      body: 'You start with the founding group. You get the address, what to wear, what to bring and what class looks like, in writing.',
      pending: 'Welcome e-mail in GHL to confirm',
    },
  ],
  meter: 'steps',
  cta: 'Claim my Founding Member spot',
}

/* ── X · Abertura (contador) ───────────────────────────────────────── */
export const opening = {
  eyebrow: 'Opening day',
  title: [{ text: 'The doors open in' }],
  units: ['days', 'hours', 'min', 'sec'] as const,
  noDate: 'Opening date coming soon. Founding Members hear it first.',
  noDatePending: 'Opening date and first classes (§20 #1) · "hear it first" notice to confirm',
  register: [
    { term: 'Address', value: '3503 Rowlett Rd, Bldg K, Suite 302' },
    { term: 'First classes', value: null as string | null, pending: 'First classes date' },
    { term: 'Programs', value: 'Kids 4–14 · Teens · Adults' },
    { term: 'Founding rate', value: '$87 / 2 weeks' },
  ],
  photoAlt: 'The Gracie Barra Rowlett storefront with the sign installed, under a grey sky',
  cta: 'Claim my Founding Member spot',
}

/* ── XI · Perguntas ────────────────────────────────────────────────── */
export interface FaqItem {
  q: string
  /** null = resposta 100% pendente: em client a pergunta some da lista e do JSON-LD. */
  a: string | null
  pending?: string
}
export const faq = {
  eyebrow: 'Questions',
  title: [{ text: 'Good questions.' }],
  items: [
    { q: "I've never trained. Will I be the worst person in the room?", a: "Everyone on that mat was new once. Classes start from zero, and since the academy is new, you won't be walking into an established room." },
    { q: 'My kid has never done a sport. Is that a problem?', a: 'No experience needed, at any age. Kids train by age (4–6, 7–9, 10–14), so your child starts with kids their own age.' },
    { q: 'I work all day. When could I actually train?', a: adultTimesSentence },
    { q: 'What exactly is a Founding Member?', a: 'Someone who joins before we open: $87 every two weeks with no enrollment fee, instead of $107 plus $47 after the doors open.' },
    { q: "What's the difference between The First 50 and The Founding Class?", a: 'Same $87, same no enrollment fee. The First 50 get a Gracie Barra uniform included. After that, The Founding Class gets 50% off the uniform.' },
    { q: 'Am I locked into a contract? What if I need to pause?', a: null, pending: 'Contract, cancellation notice, pause rule (§20 #6)' },
    { q: 'Am I charged when I pre-register? When do you open?', a: "We're opening soon in Rowlett, and Founding Members hear the date first.", pending: 'Is anything charged at pre-registration? (§20 #5)' },
    { q: "My teen is 15. Kids' class or adults'?", a: '15- and 16-year-olds train in the adult class, learning the same curriculum.', pending: 'Sparring pairing rule for teens (§20 #12)' },
    { q: "Do you have a women's class?", a: "Not at launch, but it's in our plans. Women are welcome in Adults All Levels, and you can tell us you're interested on the form.", pending: 'Andre approves this answer (§20 #13)' },
    { q: 'How much does a family pay?', a: null, pending: 'Family price, with the number (§20 #7)' },
  ] satisfies FaqItem[],
  cta: 'Claim my Founding Member spot',
}

/* ── XII · O pedido ────────────────────────────────────────────────── */
export const claim = {
  eyebrow: 'Founding Members',
  title: 'Join before the doors open.',
  spotsLine: (n: number) => `${n} First 50 spots left.`,
  spotsPending: 'Spots left: First 50 claimed count to confirm',
  benefits: [
    { text: '$87 every two weeks' },
    { text: 'No enrollment fee' },
    { text: 'Gracie Barra uniform included (First 50)' },
    { text: 'Adults unlimited, kids 3 classes a week' },
    { text: 'Nothing charged today', needsCharge: true },
  ],
  compare: 'After opening: $107 plus a $47 enrollment fee.',
  cta: 'Claim my Founding Member spot',
  callLine: 'Tap to call or text',
  micro: 'No spam, and no call unless you want one.',
  videoBrief: 'Vertical 9:16 b-roll: Andre inviting the founding group in, or the room coming together',
  videoPendingLabel: 'Video pending',
  photoAlt: 'The main room of the academy under construction, concrete floor and new drywall',
}

/* ── Mapa + Footer ─────────────────────────────────────────────────── */
export const footer = {
  about: 'A new Gracie Barra academy in Rowlett, TX.',
  academyLabel: 'The academy',
  visitLabel: 'Where we are',
  programsLabel: 'Classes',
  links: [
    { label: 'The founding offer', href: '#offer' },
    { label: 'Classes', href: '#programs' },
    { label: 'Schedule', href: '#schedule' },
    { label: 'Who teaches', href: '#coach' },
    { label: 'Questions', href: '#faq' },
  ],
  directions: 'Get directions',
  call: 'Call or text',
  emailLabel: 'Email',
  mapTitle: [{ text: 'Right here in Rowlett' }],
  mapIframeTitle: 'Map: Gracie Barra Rowlett, 3503 Rowlett Rd, Bldg K, Suite 302, Rowlett, TX 75088',
  landmarkPending: 'Landmark, parking, nearby cities (suggested: Garland, Sachse, Rockwall)',
  socialPending: 'Instagram handle (@gbrowlett?) to confirm',
  facadeAlt: 'The Gracie Barra Rowlett storefront with the sign installed',
  marquee: 'Gracie Barra Rowlett',
  copyright: '© 2026 Gracie Barra Rowlett',
  affiliation: 'Gracie Barra affiliate',
  madeBy: 'Site by Novo Dash',
  madeByHref: 'https://novodash.com',
}

export const stickyCta = { label: 'Claim my Founding spot', region: 'Claim a Founding Member spot' }

/* ── Formulário (kit nd, fluxo da Rowlett) ─────────────────────────── */
export const form = {
  title: 'Hold my spot',
  stepLabel: (n: number, total: number) => `Step ${n} of ${total}`,
  who: {
    label: "Who's training?",
    options: [
      { key: 'child' as Who, title: 'My child', hint: 'Ages 4–14' },
      { key: 'teen' as Who, title: 'My teen', hint: 'Ages 15–16, adult class' },
      { key: 'me' as Who, title: 'Me', hint: 'Adults · All Levels' },
      { key: 'family' as Who, title: 'The whole family', hint: 'Pick more than one class' },
    ],
    error: 'Pick who is training.',
  },
  program: {
    label: 'Which class?',
    multiHint: 'Pick every class that applies.',
    error: 'Pick a class.',
  },
  contact: {
    label: 'Your details',
    name: 'Name',
    phone: 'Phone',
    email: 'Email',
    namePlaceholder: 'Your full name',
    phonePlaceholder: '(555) 555-0100',
    emailPlaceholder: 'you@email.com',
    women: "I'm interested in a future women's class", // [CONFIRMAR] (§20 #13)
    womenPending: "Women's-class interest field: Andre approves",
    errors: {
      name: 'Please enter your full name.',
      email: 'Please enter a valid email address.',
      phone: 'Please enter a 10 digit phone number.',
    },
  },
  next: 'Next',
  back: 'Back',
  submit: 'Hold my spot',
  sending: 'Sending…',
  micro: 'Nothing is charged today. We hold your spot and confirm it with you.', // [CONFIRMAR cobrança] (§20 #5)
  microPending: 'Charge at pre-registration (§20 #5) · confirmation channel (§20 #9)',
  consentPending: 'Consent text (§20 #23)',
  success: {
    title: "You're on the Founding list.",
    body: "We'll confirm your spot",
    channelPending: 'Confirmation channel and timing (§20 #9)',
    done: 'Done',
  },
  error: "That didn't go through. Call or text (945) 385-9359 and we'll hold your spot.",
  close: 'Close',
  page: 'gbr-grand-opening',
}
