import { Check, Minus, X } from 'lucide-react'
import { Logomark } from '../components/Logo'
import { SectionHeading } from '../components/SectionHeading'

type Valor = { tipo: 'sim' } | { tipo: 'nao' } | { tipo: 'na' } | { tipo: 'texto'; texto: string; forte?: boolean }

const COLUNAS = ['ClinicFlow', 'Planilhas e agenda de papel', 'Sistema legado'] as const

const LINHAS: { recurso: string; valores: [Valor, Valor, Valor] }[] = [
  { recurso: 'Confirmação automática por WhatsApp', valores: [{ tipo: 'sim' }, { tipo: 'nao' }, { tipo: 'nao' }] },
  { recurso: 'Encaixe de vaga cancelada', valores: [{ tipo: 'sim' }, { tipo: 'nao' }, { tipo: 'nao' }] },
  { recurso: 'Sala de espera em tempo real', valores: [{ tipo: 'sim' }, { tipo: 'nao' }, { tipo: 'nao' }] },
  { recurso: 'Histórico do paciente unificado', valores: [{ tipo: 'sim' }, { tipo: 'nao' }, { tipo: 'nao' }] },
  {
    recurso: 'Implantação',
    valores: [{ tipo: 'texto', texto: '1 dia', forte: true }, { tipo: 'na' }, { tipo: 'texto', texto: 'semanas' }],
  },
  {
    recurso: 'Treinamento da recepção',
    valores: [{ tipo: 'texto', texto: '1 hora', forte: true }, { tipo: 'na' }, { tipo: 'texto', texto: 'dias' }],
  },
]

function Celula({ valor }: { valor: Valor }) {
  switch (valor.tipo) {
    case 'sim':
      return (
        <>
          <Check aria-hidden="true" className="size-5 text-revenue" strokeWidth={2.25} />
          <span className="sr-only">Sim</span>
        </>
      )
    case 'nao':
      return (
        <>
          <X aria-hidden="true" className="size-5 text-ink-faint" strokeWidth={2} />
          <span className="sr-only">Não</span>
        </>
      )
    case 'na':
      return (
        <>
          <Minus aria-hidden="true" className="size-5 text-ink-faint" strokeWidth={2} />
          <span className="sr-only">Não se aplica</span>
        </>
      )
    case 'texto':
      return (
        <span className={`text-[0.9375rem] ${valor.forte ? 'num font-medium text-revenue' : 'text-ink-muted'}`}>
          {valor.texto}
        </span>
      )
  }
}

export function Comparison() {
  return (
    <section id="comparacao" aria-labelledby="comp-titulo" className="py-20 md:py-28">
      <div className="mx-auto max-w-[75rem] px-4 sm:px-6 lg:px-8">
        <SectionHeading id="comp-titulo" titulo="O que muda em relação à planilha e ao sistema antigo">
          <p>Os sistemas de gestão guardam a agenda. O ClinicFlow trabalha para que ela não fique vazia.</p>
        </SectionHeading>

        {/* Tabela a partir do tablet */}
        <div className="mt-12 hidden overflow-hidden rounded-2xl border border-subtle md:block">
          <table className="w-full table-fixed border-collapse text-left">
            <caption className="sr-only">Comparação entre ClinicFlow, planilhas e sistema legado</caption>
            <thead>
              <tr className="border-b border-subtle">
                <td className="w-[34%] p-5" />
                {COLUNAS.map((coluna, i) => (
                  <th
                    key={coluna}
                    scope="col"
                    className={`p-5 align-bottom text-[0.9375rem] font-semibold ${
                      i === 0 ? 'bg-surface text-ink' : 'font-medium text-ink-muted'
                    }`}
                  >
                    {i === 0 ? (
                      <span className="inline-flex items-center gap-2">
                        <Logomark className="size-5" />
                        {coluna}
                      </span>
                    ) : (
                      coluna
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LINHAS.map((linha) => (
                <tr key={linha.recurso} className="border-b border-subtle last:border-b-0">
                  <th scope="row" className="p-5 text-[0.9375rem] font-normal text-ink">
                    {linha.recurso}
                  </th>
                  {linha.valores.map((valor, i) => (
                    <td key={i} className={`p-5 ${i === 0 ? 'bg-surface' : ''}`}>
                      <Celula valor={valor} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards empilhados no celular */}
        <ul className="mt-10 flex flex-col gap-3 md:hidden">
          {LINHAS.map((linha) => (
            <li key={linha.recurso} className="rounded-2xl border border-subtle bg-surface p-5">
              <h3 className="font-medium text-ink">{linha.recurso}</h3>
              <dl className="mt-3 flex flex-col gap-2">
                {COLUNAS.map((coluna, i) => (
                  <div key={coluna} className="flex min-h-7 items-center justify-between gap-4">
                    <dt className={`text-sm ${i === 0 ? 'font-medium text-ink' : 'text-ink-muted'}`}>{coluna}</dt>
                    <dd className="flex flex-none items-center">
                      <Celula valor={linha.valores[i] as Valor} />
                    </dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
