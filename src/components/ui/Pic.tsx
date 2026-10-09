/* ════════════════════════════════════════════════════════════════════
   Pic — <picture> AVIF + WebP a partir do manifesto gerado por
   scripts/build-images.py. width/height reais sempre declarados, e o
   aspect-ratio vem do mesmo manifesto: a foto pode trocar, o layout não.
   Toda foto da página passa por aqui (nenhum <img> cru).
   ════════════════════════════════════════════════════════════════════ */

import media from '@/data/media.json'

export type MediaName = keyof typeof media

interface Art {
  name: MediaName
  media: string
  sizes: string
}

interface PicProps {
  name: MediaName
  /** Descreve a FOTO, não a seção. */
  alt: string
  /** sizes do srcset (CSS px que a imagem ocupa). */
  sizes: string
  className?: string
  priority?: boolean
  /** Fontes alternativas por media query (direção de arte, ex.: hero no desktop e
      no ultrawide). Na ordem: a primeira que casar vence. */
  art?: Art | Art[]
}

const dir = '/img'
const srcset = (name: MediaName, ext: 'avif' | 'webp') => media[name].widths.map((w) => `${dir}/${name}-${w}.${ext} ${w}w`).join(', ')

export function Pic({ name, alt, sizes, className, priority, art }: PicProps) {
  const m = media[name]
  const arts = art ? (Array.isArray(art) ? art : [art]) : []
  const w = m.widths[m.widths.length - 1]
  const h = Math.round((w * m.ratio[1]) / m.ratio[0])
  return (
    <picture className={className}>
      {arts.map((a) => [
        <source key={`${a.name}-avif`} type="image/avif" media={a.media} srcSet={srcset(a.name, 'avif')} sizes={a.sizes} />,
        <source key={`${a.name}-webp`} type="image/webp" media={a.media} srcSet={srcset(a.name, 'webp')} sizes={a.sizes} />,
      ])}
      <source type="image/avif" srcSet={srcset(name, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcset(name, 'webp')} sizes={sizes} />
      <img
        src={`${dir}/${name}-${m.widths[0]}.webp`}
        alt={alt}
        width={w}
        height={h}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : undefined}
        draggable={false}
      />
    </picture>
  )
}
