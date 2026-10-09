/* ════════════════════════════════════════════════════════════════════
   VideoSlot — vídeo de ambiente (autoplay mudo em laço) ou, enquanto o
   arquivo não existe, um slot honesto com o briefing do que precisa ser
   gravado — nunca placeholder plausível. Sem player de terceiros.

   `muted` do JSX não basta (facebook/react#10389): o ref liga `muted` e
   `defaultMuted` na própria tag, senão o autoplay é bloqueado ou toca
   com som. preload="metadata": nada no caminho crítico.
   ════════════════════════════════════════════════════════════════════ */

import { trackVideoPlay } from '@/track'
import { Play } from './Icons'

interface VideoSlotProps {
  id: string
  src: string | null
  poster?: string | null
  /** O que precisa estar neste vídeo. Vira o rótulo do slot vazio. */
  brief: string
  ratio?: string
  className?: string
  /** Rótulo do slot vazio ("Video pending"). */
  pendingLabel: string
}

export function VideoSlot({ id, src, poster, brief, ratio = '9 / 16', className, pendingLabel }: VideoSlotProps) {
  if (!src) {
    return (
      <div className={['vslot vslot--empty', className].filter(Boolean).join(' ')} style={{ aspectRatio: ratio }} role="img" aria-label={brief}>
        <span className="vslot__play" aria-hidden="true">
          <Play />
        </span>
        <span className="vslot__label label">{pendingLabel}</span>
        <span className="vslot__brief">{brief}</span>
      </div>
    )
  }
  return (
    <div className={['vslot', className].filter(Boolean).join(' ')} style={{ aspectRatio: ratio }}>
      <video
        ref={(el) => {
          if (!el) return
          el.muted = true
          el.defaultMuted = true
          el.volume = 0
        }}
        src={src}
        poster={poster ?? undefined}
        controls
        playsInline
        muted
        autoPlay
        loop
        preload="metadata"
        disablePictureInPicture
        onPlay={() => trackVideoPlay(id)}
      />
    </div>
  )
}
