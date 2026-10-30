import { ShieldCheck } from 'lucide-react'
import { LINK_DEMONSTRACAO } from '../lib/links'

export function FinalCta() {
  return (
    <section aria-labelledby="cta-titulo" className="border-y border-subtle bg-surface">
      <div className="mx-auto grid max-w-[75rem] gap-10 px-4 py-20 sm:px-6 md:py-24 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:px-8">
        <div>
          <h2
            id="cta-titulo"
            className="max-w-[16em] text-[clamp(2rem,1.2rem+3vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-ink"
          >
            Sua agenda cheia é matemática, não sorte.
          </h2>
          <p className="mt-6 flex max-w-[52ch] items-start gap-3 text-[1rem] leading-relaxed text-ink-muted">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 flex-none text-revenue" strokeWidth={1.75} />
            <span>
              <span className="font-medium text-ink">30 dias de garantia</span> — não reduziu suas faltas, devolvemos o
              valor.
            </span>
          </p>
        </div>
        <div>
          <a href={LINK_DEMONSTRACAO} className="btn btn-primary h-12 w-full px-6 text-[1rem] sm:w-auto">
            Começar demonstração gratuita
          </a>
          <p className="mt-3 text-sm text-ink-muted max-sm:text-center">1 minuto, sem cartão</p>
        </div>
      </div>
    </section>
  )
}
