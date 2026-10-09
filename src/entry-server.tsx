// Pré-render da "/" no build (scripts/prerender.mjs). Nada de window aqui.
import { renderToString } from 'react-dom/server'
import { Root } from './Root'
import { publishWarnings as warnings, site } from './data/site'
import { UX } from './lib/ux'
import client from './nd/client'

export function render(): string {
  return renderToString(<Root />)
}

/** Data de abertura: vai para um <meta> lido no <head>; passada a data, a oferta some antes da pintura. */
export const openingISO = site.openingISO
/** 'client' liga index,follow e o bloco de tracking do kit. */
export const uxMode = UX.mode
/** IDs do kit (vazios em prospect): o pré-render só injeta o bloco quando há ID. */
export const tracking = client.tracking
/** Pendências fora da página: o build de publicação (client) imprime. */
export const publishWarnings = warnings
/** O que o build client confere antes de publicar (webhook do lead e IDs de tracking). */
export const ghl = client.ghl
