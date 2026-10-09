/** Turmas que um card, um horário ou o menu podem pré-selecionar no formulário. */
export type ProgramKey = 'lc1' | 'lc2' | 'juniors' | 'adults'

/** Quem vai treinar (passo 1 do pré-cadastro). */
export type Who = 'child' | 'teen' | 'me' | 'family'

/** O que um botão passa ao formulário ao abrir. */
export interface BookingHint {
  program?: ProgramKey
  who?: Who
  /** De onde o clique veio (vai no payload como cta_origin). */
  origin: string
}
