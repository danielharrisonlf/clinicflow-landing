const TONS = {
  revenue: 'text-revenue',
  risk: 'text-risk',
  warn: 'text-warn',
} as const

type PulseDotProps = {
  tom: keyof typeof TONS
  /** Estático: só o ponto, sem o anel pulsando. */
  parado?: boolean
  atraso?: 0 | 1 | 2
}

export function PulseDot({ tom, parado = false, atraso = 0 }: PulseDotProps) {
  if (parado) {
    return <span aria-hidden="true" className={`inline-block size-2 flex-none rounded-full bg-current ${TONS[tom]}`} />
  }
  return <span aria-hidden="true" className={`pulse-dot ${TONS[tom]}`} data-delay={atraso || undefined} />
}
