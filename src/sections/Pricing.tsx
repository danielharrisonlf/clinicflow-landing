import { useId, useState } from 'react'
import { Check } from 'lucide-react'
import { SectionHeading } from '../components/SectionHeading'
import { LINK_DEMONSTRACAO, LINK_VENDAS } from '../lib/links'
import { formatarReais } from '../lib/roi'
import { Reais } from '../components/Reais'
import { precoMensal, totalAnual, type Ciclo } from '../lib/pricing'

type Plano = {
  nome: string
  base: number | null
  resumo: string
  itens: string[]
  cta: string
  href: string
  destaque?: boolean
}

const PLANOS: Plano[] = [
  {
    nome: 'Consultório Solo',
    base: 149,
    resumo: 'Para quem atende sozinho e quer parar de perder horário.',
    itens: ['1 profissional', 'Agenda online', 'Confirmação por WhatsApp'],
    cta: 'Começar demonstração',
    href: LINK_DEMONSTRACAO,
  },
  {
    nome: 'Clínica em Crescimento',
    base: 349,
    resumo: 'Para a clínica com recepção e vários consultórios.',
    itens: ['Até 10 profissionais', 'Cockpit completo', 'Encaixe dinâmico', 'Sala de espera ao vivo'],
    cta: 'Começar demonstração',
    href: LINK_DEMONSTRACAO,
    destaque: true,
  },
  {
    nome: 'Rede Multiclínica',
    base: null,
    resumo: 'Para grupos com várias unidades e integrações próprias.',
    itens: ['Unidades ilimitadas', 'API de integração', 'Login único (SSO)'],
    cta: 'Falar com vendas',
    href: LINK_VENDAS,
  },
]

const CICLOS: { valor: Ciclo; rotulo: string }[] = [
  { valor: 'mensal', rotulo: 'Mensal' },
  { valor: 'anual', rotulo: 'Anual (-20%)' },
]

function Preco({ base, ciclo }: { base: number | null; ciclo: Ciclo }) {
  if (base === null) {
    return (
      <div className="mt-6">
        <p className="text-[2.5rem] font-semibold leading-none tracking-[-0.03em] text-ink">Sob consulta</p>
        <p className="mt-3 text-sm text-ink-muted">Proposta conforme o número de unidades</p>
      </div>
    )
  }
  return (
    <div className="mt-6">
      <p className="flex items-baseline gap-1.5">
        <Reais valor={precoMensal(base, ciclo)} className="text-[2.75rem] font-medium tracking-[-0.04em] text-ink" />
        <span className="text-ink-muted">/mês</span>
      </p>
      <p className="mt-3 text-sm text-ink-muted">
        {ciclo === 'anual' ? (
          <>
            <span className="num">{formatarReais(totalAnual(base))}</span> cobrados por ano
          </>
        ) : (
          'Cobrado mês a mês, sem fidelidade'
        )}
      </p>
    </div>
  )
}

export function Pricing() {
  const [ciclo, setCiclo] = useState<Ciclo>('mensal')
  const nome = useId()

  return (
    <section id="planos" aria-labelledby="planos-titulo" className="py-20 md:py-28">
      <div className="mx-auto max-w-[75rem] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="planos-titulo" titulo="Planos que se pagam com a primeira vaga recuperada" />

          <fieldset className="flex-none">
            <legend className="sr-only">Ciclo de cobrança</legend>
            <div className="inline-flex rounded-xl border border-strong bg-surface p-1">
              {CICLOS.map((c) => (
                <label
                  key={c.valor}
                  className="relative inline-flex min-h-11 cursor-pointer items-center rounded-lg px-4 text-[0.9375rem] text-ink-muted transition-colors duration-150 hover:text-ink has-[:checked]:bg-surface-raised has-[:checked]:text-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-action"
                >
                  <input
                    type="radio"
                    name={nome}
                    value={c.valor}
                    checked={ciclo === c.valor}
                    onChange={() => setCiclo(c.valor)}
                    className="sr-only"
                  />
                  {c.rotulo}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <ul className="mt-12 grid gap-4 lg:grid-cols-3">
          {PLANOS.map((plano) => (
            <li
              key={plano.nome}
              className={`relative flex flex-col rounded-2xl border p-6 sm:p-8 ${
                plano.destaque ? 'border-strong bg-surface-raised/60' : 'border-subtle bg-surface'
              }`}
            >
              {plano.destaque ? (
                <span className="absolute -top-3 left-6 rounded-full border border-revenue/40 bg-base px-2.5 py-0.5 text-xs font-medium text-revenue sm:left-8">
                  Mais escolhido
                </span>
              ) : null}
              <h3 className="text-lg font-semibold text-ink">{plano.nome}</h3>
              <p className="mt-2 text-[0.9375rem] text-ink-muted">{plano.resumo}</p>

              <Preco base={plano.base} ciclo={ciclo} />

              <ul className="mt-8 flex flex-1 flex-col gap-3 border-t border-subtle pt-6">
                {plano.itens.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[0.9375rem] text-ink">
                    <Check aria-hidden="true" className="mt-0.5 size-4 flex-none text-revenue" strokeWidth={2.25} />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href={plano.href}
                className={`btn mt-8 w-full ${plano.destaque ? 'btn-primary' : 'btn-ghost'}`}
              >
                {plano.cta}
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm text-ink-muted">Preços de lançamento</p>
      </div>
    </section>
  )
}
