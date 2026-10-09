import raw from './client'
import type { Client } from './types'

export const client = raw as Client

export const copy = {
  eyebrow: 'Free trial class',
  panelTitle: 'Your first class is on us',
  panelText: 'Pick your class, choose a day and time, and your spot on the mats is set.',
  bullets: ['Your first class is 100% free', 'No experience needed', 'All levels welcome'],
  proof: '',
  formTitle: 'Book your free class',
  formText: 'No commitment. No experience required.',
  confirm: 'Confirm my free class',
  /** Consent line under the step 1 button, when the LP had one ("By submitting, you agree to be contacted..."). */
  consent: '',
  submit: '',
  doneTitle: 'We have your request',
  doneText: 'Our team will reach out shortly.',
  /** "Before you come in" on the confirmation; the academy's own when it differs (uniform provided...). */
  tips: ['Wear a t-shirt and shorts', 'Bring water', 'Arrive a few minutes early so someone can show you around'],
  ...client.copy,
}
export type Copy = typeof copy

// GB Rowlett (pré-abertura): só o Webhook 1 (lead). Não há calendário nem Webhook 2
// enquanto a academia não abre; os módulos programs.ts / webhook.ts do kit não embarcam.

/** Webhook 1: the [ND] Primary Workflow inbound trigger of the academy's sub-account. */
export const LEAD_WEBHOOK =
  client.ghl.locationId && client.ghl.leadWebhookUuid
    ? `https://services.leadconnectorhq.com/hooks/${client.ghl.locationId}/webhook-trigger/${client.ghl.leadWebhookUuid}`
    : ''
