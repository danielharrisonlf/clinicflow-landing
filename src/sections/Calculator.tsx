import { useId, useState, type CSSProperties } from 'react'
import { Reais } from '../components/Reais'
import { SectionHeading } from '../components/SectionHeading'
import { useCountUp } from '../hooks/useCountUp'
import {
  MEDICOS,
  VALOR_CONSULTA,
  ajustarAoLimite,
  calcularRoi,
  formatarInteiro,
  formatarReais,
  lerNumero,
} from '../lib/roi'

type Limites = { min: number; max: number; step: number }

type CampoProps = {
  rotulo: string
  valor: number
  limites: Limites
  prefixo?: string
  formatarLimite: (n: number) => string
  onChange: (n: number) => void
}

/** Slider nativo + valor editável em mono. O texto só é validado ao sair do campo ou no Enter. */
function Campo({ rotulo, valor, limites, prefixo, formatarLimite, onChange }: CampoProps) {
  const id = useId()
  const [rascunho, setRascunho] = useState<string | null>(null)
  const preenchido = ((valor - limites.min) / (limites.max - limites.min)) * 100

  const confirmar = () => {
    if (rascunho === null) return
    onChange(ajustarAoLimite(lerNumero(rascunho), limites))
    setRascunho(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={`${id}-range`} className="text-[1rem] font-medium text-ink">
          {rotulo}
        </label>
        <div className="flex h-11 items-center gap-1.5 rounded-lg border border-strong bg-base px-3 transition-colors duration-150 focus-within:border-action focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-action hover:bg-surface-raised">
          {prefixo ? <span className="num text-sm text-ink-muted">{prefixo}</span> : null}
          <input
            type="text"
            inputMode="numeric"
            aria-label={`${rotulo}, digitar valor`}
            className="num h-full w-[5.5ch] bg-transparent text-right text-lg font-medium text-ink outline-none"
            value={rascunho ?? formatarInteiro(valor)}
            onChange={(e) => setRascunho(e.target.value)}
            onBlur={confirmar}
            onKeyDown={(e) => {
              if (e.key === 'Enter') confirmar()
              if (e.key === 'Escape') setRascunho(null)
            }}
          />
        </div>
      </div>
      <input
        id={`${id}-range`}
        type="range"
        className="range mt-2"
        min={limites.min}
        max={limites.max}
        step={limites.step}
        value={valor}
        aria-valuetext={prefixo ? formatarReais(valor) : `${valor}`}
        style={{ '--fill': `${preenchido}%` } as CSSProperties}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="num -mt-1 flex justify-between text-xs text-ink-muted" aria-hidden="true">
        <span>{formatarLimite(limites.min)}</span>
        <span>{formatarLimite(limites.max)}</span>
      </div>
    </div>
  )
}

function Resultado({
  rotulo,
  valor,
  formatar,
  className,
  wrapperClassName = '',
  destaque = false,
}: {
  rotulo: string
  valor: number
  formatar: (n: number) => string
  className: string
  wrapperClassName?: string
  /** Número-tese: `R$` reduzido via <Reais>. */
  destaque?: boolean
}) {
  const exibido = useCountUp(valor)
  return (
    <div className={wrapperClassName}>
      <dt className="label-caps text-ink-muted">{rotulo}</dt>
      <dd className={`num mt-2 leading-none tracking-[-0.03em] ${className}`}>
        <span aria-hidden="true">{destaque ? <Reais valor={exibido} /> : formatar(exibido)}</span>
        <span className="sr-only">{formatar(valor)}</span>
      </dd>
    </div>
  )
}

export function Calculator() {
  const [medicos, setMedicos] = useState<number>(MEDICOS.padrao)
  const [valor, setValor] = useState<number>(VALOR_CONSULTA.padrao)
  const r = calcularRoi(medicos, valor)

  return (
    <section id="calculadora" aria-labelledby="calc-titulo" className="py-20 md:py-28">
      <div className="mx-auto max-w-[75rem] px-4 sm:px-6 lg:px-8">
        <SectionHeading id="calc-titulo" titulo="Quanto as faltas custam à sua clínica por mês">
          <p>Mova os controles com os números da sua clínica. A conta é a mesma que fazemos na demonstração.</p>
        </SectionHeading>

        <div className="mt-12 overflow-hidden rounded-2xl border border-subtle bg-surface">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <div className="flex flex-col gap-8 p-5 sm:p-8 lg:p-10">
              <Campo
                rotulo="Médicos na clínica"
                valor={medicos}
                limites={MEDICOS}
                formatarLimite={(n) => `${n}`}
                onChange={setMedicos}
              />
              <Campo
                rotulo="Valor médio da consulta"
                valor={valor}
                limites={VALOR_CONSULTA}
                prefixo="R$"
                formatarLimite={formatarReais}
                onChange={setValor}
              />
            </div>

            <dl
              aria-live="polite"
              className="grid gap-8 border-t border-subtle p-5 sm:grid-cols-2 sm:p-8 lg:border-l lg:border-t-0 lg:p-10"
            >
              <Resultado
                rotulo="Consultas por mês"
                valor={r.consultasMes}
                formatar={formatarInteiro}
                className="text-[1.75rem] text-ink"
              />
              <Resultado
                rotulo="Perdido por mês com faltas"
                valor={r.perdidoMes}
                formatar={formatarReais}
                className="text-[1.75rem] text-risk"
              />
              <Resultado
                rotulo="Recuperado por mês com ClinicFlow"
                valor={r.recuperadoMes}
                formatar={formatarReais}
                wrapperClassName="border-t border-subtle pt-8 sm:col-span-2"
                destaque
                className="text-[clamp(2.75rem,1.6rem+4vw,4.25rem)] font-medium text-revenue"
              />
            </dl>
          </div>

          <p className="border-t border-subtle px-5 py-4 text-sm text-ink-muted sm:px-8 lg:px-10">
            Estimativa com média nacional de 20% de faltas, 12 consultas/dia por profissional e 22 dias úteis.
          </p>
        </div>
      </div>
    </section>
  )
}
