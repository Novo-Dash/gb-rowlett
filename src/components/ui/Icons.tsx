/* Ícones em SVG inline, desenhados no traço do triângulo (retas, 1.75 de
   espessura, juntas em bisel). Nenhum pacote de ícones. */

type P = { className?: string }
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'square' as const,
  strokeLinejoin: 'miter' as const,
  'aria-hidden': true,
  focusable: false,
}

export const Arrow = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
)

export const ArrowDown = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M12 4v15M6 13l6 6 6-6" />
  </svg>
)

/** ▲ cheio: o marcador de lista curta e do slot de horário. */
export const Tri = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
    <path d="M12 4 22 20H2Z" fill="currentColor" />
  </svg>
)

export const Phone = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M5 3h3.4l1.6 4.6-2.2 1.4a11 11 0 0 0 7.2 7.2l1.4-2.2L21 15.6V19a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" />
  </svg>
)

/** Rota: o pino é o triângulo. */
export const Route = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M12 21 4.5 8.5h15Z" />
    <path d="M12 14 9 9h6Z" />
  </svg>
)

export const Mail = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M3 5h18v14H3Z" />
    <path d="m3.5 6 8.5 7 8.5-7" />
  </svg>
)

/** Check desenhado: pathLength=1 para o traço "escrever" na entrada. */
export const Check = ({ className }: P) => (
  <svg {...base} className={className} strokeWidth={2.4}>
    <path d="M4.5 12.5 9.5 17.5 19.5 6.5" pathLength={1} />
  </svg>
)

/** Cadeado: corpo retangular e a alça em arco, no traço da casa. */
export const Lock = ({ className }: P) => (
  <svg {...base} className={className} strokeWidth={2}>
    <path d="M5 11h14v10H5Z" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    <path d="M12 15v2" />
  </svg>
)

export const Close = ({ className }: P) => (
  <svg {...base} className={className} strokeWidth={2}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

/** O selo GB em contorno (pattern, letreiro do footer). viewBox do logo-outline.svg. */
export const LogoOutline = ({ className }: P) => (
  <svg viewBox="0 0 1019 763" className={className} aria-hidden="true" focusable="false">
    <path
      d="M837.405 483.729H556.004L484.971 592.954H766.372L793.692 650.297H233.623L515.024 218.858L665.286 434.578H812.816L515.024 14.061L15.0596 754.061H1004.06L837.405 483.729Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="11"
    />
  </svg>
)
