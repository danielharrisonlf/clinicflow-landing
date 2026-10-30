import type { ReactNode } from 'react'
import {
  ArrowRight,
  CalendarClock,
  Check,
  CheckCheck,
  FileLock2,
  Send,
  Stethoscope,
} from 'lucide-react'
import { Logomark } from '../components/Logo'
import { PulseDot } from '../components/PulseDot'
import { SectionHeading } from '../components/SectionHeading'
import { formatarDuracao, useElapsed } from '../hooks/useElapsed'

type CardProps = {
  titulo: string
  children: ReactNode
  visual: ReactNode
  rotuloVisual: string
  className?: string
}

/** Card do bento: o micro-visual é o conteúdo; o texto fecha embaixo. */
function Card({ titulo, children, visual, rotuloVisual, className = '' }: CardProps) {
  return (
    <article className={`flex flex-col rounded-2xl border border-subtle bg-surface p-5 sm:p-7 ${className}`}>
      <div role="img" aria-label={rotuloVisual} className="flex flex-1 items-center">
        <div className="w-full">{visual}</div>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-semibold tracking-[-0.015em] text-ink">{titulo}</h3>
        <p className="mt-2 max-w-[52ch] text-[1rem] leading-relaxed text-ink-muted">{children}</p>
      </div>
    </article>
  )
}

function VisualWhatsApp() {
  return (
    <div className="flex max-w-md flex-col gap-3">
      <div className="flex items-center gap-2">
        <Logomark className="size-6" />
        <span className="text-sm font-medium text-ink">Clínica Vida</span>
        <span className="text-xs text-ink-muted">via WhatsApp</span>
      </div>
      <div className="max-w-[88%] rounded-2xl rounded-tl-md border border-subtle bg-surface-raised px-4 py-3">
        <p className="text-sm leading-relaxed text-ink">
          Olá, Marina! Sua consulta com a Dra. Ana Lima é amanhã, às 14h30. Você confirma?
        </p>
        <p className="num mt-1 text-right text-[0.6875rem] text-ink-muted">09:12</p>
        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-subtle pt-3">
          <span className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-revenue/15 py-2 text-sm font-medium text-revenue">
            Confirmo
            <Check className="size-4" strokeWidth={2.25} />
          </span>
          <span className="inline-flex items-center justify-center rounded-lg border border-subtle py-2 text-sm text-ink-muted">
            Preciso remarcar
          </span>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-revenue/30 px-2 py-0.5 text-xs font-medium text-revenue">
          <CheckCheck className="size-3.5" strokeWidth={2} />
          Respondida
        </span>
        <span className="rounded-2xl rounded-tr-md bg-action-strong px-4 py-2 text-sm text-white">Confirmo</span>
      </div>
      <div className="flex items-center justify-between gap-3 rounded-xl border border-subtle px-4 py-2.5">
        <span className="text-sm text-ink-muted">Risco de falta</span>
        <span className="num inline-flex items-center gap-2 text-sm">
          <span className="text-risk line-through decoration-risk/60">38%</span>
          <ArrowRight className="size-3.5 text-ink-muted" strokeWidth={2} />
          <span className="font-medium text-revenue">6%</span>
        </span>
      </div>
    </div>
  )
}

function VisualSalaEspera() {
  const decorrido = useElapsed()
  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-xl border border-strong bg-surface-raised p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-10 flex-none place-items-center rounded-full bg-base text-sm font-medium text-ink-muted">
              CM
            </span>
            <span className="min-w-0">
              <span className="block truncate font-medium text-ink">Carlos M.</span>
              <span className="block text-xs text-ink-muted">
                Chegou às <span className="num">14:02</span>
              </span>
            </span>
          </div>
          <span className="flex flex-none items-center gap-2">
            <PulseDot tom="warn" />
            <span className="num text-xl font-medium text-ink">{formatarDuracao(8 * 60 + 15 + decorrido)}</span>
          </span>
        </div>
        <p className="mt-3 border-t border-subtle pt-3 text-sm text-ink-muted">
          Atende <span className="text-ink">Dr. Paulo Reis</span> na sala 2
        </p>
      </div>
      <div className="flex items-center justify-between gap-3 rounded-xl border border-subtle px-4 py-3">
        <span className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-full bg-base text-xs text-ink-muted">AR</span>
          <span className="text-sm text-ink">Ana R.</span>
        </span>
        <span className="flex items-center gap-2">
          <PulseDot tom="revenue" parado />
          <span className="num text-sm text-ink-muted">{formatarDuracao(3 * 60 + 40 + decorrido)}</span>
        </span>
      </div>
    </div>
  )
}

const EVENTOS = [
  { data: '12 ago', titulo: 'Consulta de rotina', detalhe: 'Dra. Ana Lima', Icone: Stethoscope, cor: 'text-ink-muted' },
  { data: '14 ago', titulo: 'Exame anexado', detalhe: 'hemograma.pdf, criptografado', Icone: FileLock2, cor: 'text-ink-muted' },
  { data: '12 set', titulo: 'Retorno agendado', detalhe: 'às 14h30', Icone: CalendarClock, cor: 'text-revenue' },
] as const

function VisualPaciente360() {
  return (
    <ol className="relative flex flex-col gap-5">
      <span aria-hidden="true" className="absolute bottom-4 left-[1.125rem] top-4 w-px bg-strong" />
      {EVENTOS.map(({ data, titulo, detalhe, Icone, cor }) => (
        <li key={titulo} className="relative flex items-start gap-4">
          <span className={`relative grid size-9 flex-none place-items-center rounded-full border border-strong bg-surface-raised ${cor}`}>
            <Icone className="size-4" strokeWidth={1.75} />
          </span>
          <span className="min-w-0 pt-1">
            <span className="num block text-xs text-ink-muted">{data}</span>
            <span className="block font-medium text-ink">{titulo}</span>
            <span className="block truncate text-sm text-ink-muted">{detalhe}</span>
          </span>
        </li>
      ))}
    </ol>
  )
}

function VisualEncaixe() {
  return (
    <div className="flex max-w-lg flex-col">
      <div className="flex items-center gap-4 rounded-xl border border-dashed border-risk/50 px-4 py-3.5">
        <span className="num text-sm text-ink-muted">14h30</span>
        <span className="min-w-0 flex-1 truncate text-risk line-through decoration-risk/60">Pedro A.</span>
        <span className="flex-none text-xs text-risk">Cancelou às 09:40</span>
      </div>
      <div className="flex items-center gap-3 py-3 pl-[3.25rem] text-xs text-ink-muted">
        <Send className="size-3.5" strokeWidth={1.75} />
        Convite enviado a 3 pacientes da fila
      </div>
      <div className="flex items-center gap-4 rounded-xl border border-revenue/40 bg-revenue/10 px-4 py-3.5">
        <span className="num text-sm text-ink-muted">14h30</span>
        <span className="min-w-0 flex-1 truncate font-medium text-revenue">Marina S.</span>
        <span className="flex-none text-xs text-revenue">Aceitou em 4 min</span>
      </div>
      <p className="mt-4 text-right text-sm text-ink-muted">
        <span className="num text-revenue">+ R$ 280</span> de volta à agenda
      </p>
    </div>
  )
}

export function Features() {
  return (
    <section id="funcionalidades" aria-labelledby="func-titulo" className="py-20 md:py-28">
      <div className="mx-auto max-w-[75rem] px-4 sm:px-6 lg:px-8">
        <SectionHeading id="func-titulo" titulo="Da confirmação ao retorno, a operação inteira num painel">
          <p>
            Cada peça ataca um momento em que a consulta escapa: o paciente que esquece, a recepção que não vê a fila e a
            vaga que fica vazia.
          </p>
        </SectionHeading>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          <Card
            className="lg:col-span-7"
            titulo="Anti-no-show por WhatsApp"
            rotuloVisual="Conversa de WhatsApp: a clínica pede confirmação, a paciente responde Confirmo e o risco de falta cai de 38% para 6%."
            visual={<VisualWhatsApp />}
          >
            Confirmação em 1 clique. A cada resposta, o risco de falta do paciente é recalculado em tempo real.
          </Card>
          <Card
            className="lg:col-span-5"
            titulo="Sala de espera ao vivo"
            rotuloVisual="Carlos M. chegou às 14:02, aguarda há cerca de 8 minutos e será atendido pelo Dr. Paulo Reis na sala 2."
            visual={<VisualSalaEspera />}
          >
            Quem chegou, há quanto tempo espera e quem vai atender, no mesmo painel para recepção e médicos.
          </Card>
          <Card
            className="lg:col-span-5"
            titulo="Patient 360"
            rotuloVisual="Linha do tempo do paciente: consulta de rotina em 12 de agosto, exame anexado em 14 de agosto e retorno agendado para 12 de setembro."
            visual={<VisualPaciente360 />}
          >
            Histórico unificado do paciente, com consultas, exames e anexos guardados com segurança.
          </Card>
          <Card
            className="lg:col-span-7"
            titulo="Encaixe dinâmico"
            rotuloVisual="Pedro A. cancelou o horário das 14h30, o convite foi para a fila e Marina S. aceitou em 4 minutos."
            visual={<VisualEncaixe />}
          >
            A vaga cancelada vira convite automático para a fila de espera. Quem aceitar primeiro fica com o horário.
          </Card>
        </div>
      </div>
    </section>
  )
}
