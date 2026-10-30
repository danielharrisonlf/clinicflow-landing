import type { ReactNode } from 'react'

type SectionHeadingProps = {
  id: string
  titulo: ReactNode
  children?: ReactNode
}

/** Título de seção sem eyebrow: o H2 carrega o próprio peso. */
export function SectionHeading({ id, titulo, children }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <h2
        id={id}
        className="text-[clamp(1.875rem,1.2rem+2.2vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.028em] text-ink"
      >
        {titulo}
      </h2>
      {children ? <div className="mt-4 max-w-[62ch] text-lg leading-relaxed text-ink-muted">{children}</div> : null}
    </div>
  )
}
