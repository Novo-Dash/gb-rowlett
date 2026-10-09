/**
 * Modo da página (PRD §5). Decidido no build por VITE_UX_MODE:
 *   prospect (padrão) — pendências visíveis, webhook não dispara, tracking desligado, noindex.
 *   client            — pendências ocultas, proxy real, tracking real, index/follow.
 */
const mode = import.meta.env.VITE_UX_MODE === 'client' ? 'client' : 'prospect'

export const UX = {
  mode,
  client: mode === 'client',
  prospect: mode !== 'client',
} as const
