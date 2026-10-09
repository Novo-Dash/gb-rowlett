/* ════════════════════════════════════════════════════════════════════
   Pic — <picture> AVIF + WebP a partir do manifesto gerado por
   scripts/build-images.py. width/height reais sempre declarados, e o
   aspect-ratio vem do mesmo manifesto: a foto pode trocar, o layout não.
   Toda foto da página passa por aqui (nenhum <img> cru).
   ════════════════════════════════════════════════════════════════════ */

import media from '@/data/media.json'

export type MediaName = keyof typeof media

interface PicProps {
  name: MediaName
  /** Descreve a FOTO, não a seção. */
  alt: string
  /** sizes do srcset (CSS px que a imagem ocupa). */
  sizes: string
  className?: string
  priority?: boolean
  /** Fonte alternativa por media query (direção de arte, ex.: hero no desktop). */
  art?: { name: MediaName; media: string; sizes: string }
}

const dir = '/img'
const srcset = (name: MediaName, ext: 'avif' | 'webp') =>
  media[name].widths.map((w) => `${dir}/${name}-${w}.${ext} ${w}w`).join(', ')

export function Pic({ name, alt, sizes, className, priority, art }: PicProps) {
  const m = media[name]
  const w = m.widths[m.widths.length - 1]
  const h = Math.round((w * m.ratio[1]) / m.ratio[0])
  return (
    <picture className={className}>
      {art && <source type="image/avif" media={art.media} srcSet={srcset(art.name, 'avif')} sizes={art.sizes} />}
      {art && <source type="image/webp" media={art.media} srcSet={srcset(art.name, 'webp')} sizes={art.sizes} />}
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
