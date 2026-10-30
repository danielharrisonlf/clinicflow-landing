import { CockpitMockup } from '../components/CockpitMockup'
import { LINK_DEMONSTRACAO } from '../lib/links'

export function Hero() {
  return (
    <section id="topo" aria-labelledby="hero-titulo" className="overflow-x-clip pt-10 pb-20 md:pt-16 md:pb-28 lg:pt-20">
      <div className="mx-auto max-w-[75rem] px-4 sm:px-6 lg:px-8">
        <div className="hero-in-text">
          <p className="label-caps inline-flex items-center gap-2 rounded-full border border-subtle bg-surface py-1.5 pl-2.5 pr-3 text-ink-muted">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-revenue" />
            O primeiro cockpit clínico com prevenção ativa de no-shows
          </p>

          <h1
            id="hero-titulo"
            className="mt-6 max-w-[13em] text-[clamp(2.375rem,1.2rem+4.6vw,4.5rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-ink"
          >
            Zere os buracos na agenda da sua clínica e recupere até{' '}
            <span className="num whitespace-nowrap font-medium tracking-[-0.045em] text-revenue">R$ 25.000/mês</span> em
            consultas perdidas.
          </h1>

          <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
            <p className="max-w-[54ch] text-lg leading-relaxed text-ink-muted md:text-xl md:leading-relaxed">
              Automação inteligente de WhatsApp, recepção em tempo real e encaixe dinâmico de pacientes. A sua clínica
              operando com pontualidade cirúrgica.
            </p>

            <div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a href={LINK_DEMONSTRACAO} className="btn btn-primary h-12 px-5 text-[1rem]">
                  Começar demonstração gratuita
                </a>
                <a href="#funcionalidades" className="btn btn-ghost h-12 px-5 text-[1rem]">
                  Ver o cockpit em ação (90s)
                </a>
              </div>
              <p className="mt-3 text-sm text-ink-muted max-sm:text-center">1 minuto, sem cartão</p>
            </div>
          </div>
        </div>

        <div className="mt-14 md:mt-20">
          <CockpitMockup />
        </div>
      </div>
    </section>
  )
}
