/* ════════════════════════════════════════════════════════════════════
   Marquee — o letreiro em X (arquitetura da Collective): duas fitas a
   ±3°, a de cima vermelha andando para a esquerda, a de baixo marinho
   ao contrário. CSS puro. Itens curtos em Cn caixa alta, separados pelo
   ponto do meio. aria-hidden: é ritmo, não informação.

   Seis cópias por metade: a fita tem 160% da largura da janela e uma
   cópia mede ~1000px; com menos cópias o vazio passeava na tela.
   ════════════════════════════════════════════════════════════════════ */

import { marquee } from '@/data/site'

const COPIES = 6

function Track({ items, reverse }: { items: readonly string[]; reverse?: boolean }) {
  const half = Array.from({ length: COPIES }, () => items).flat()
  const line = [...half, ...half]
  return (
    <div className={['mq__track', reverse && 'mq__track--rev'].filter(Boolean).join(' ')}>
      {line.map((item, i) => (
        <span key={i} className="d mq__item">
          {item}
          <i aria-hidden="true">·</i>
        </span>
      ))}
    </div>
  )
}

export function Marquee() {
  return (
    <div className="mq" aria-hidden="true">
      <div className="mq__strip mq__strip--red">
        <Track items={marquee.red} />
      </div>
      <div className="mq__strip mq__strip--navy">
        <Track items={marquee.navy} reverse />
      </div>
    </div>
  )
}
