import {
  ArrowRight,
  CalendarCheck2,
  CalendarDays,
  LayoutDashboard,
  MessageCircle,
  Settings,
  Users,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Logomark } from './Logo'
import { PulseDot } from './PulseDot'
import { formatarDuracao, useElapsed } from '../hooks/useElapsed'

/*
 * Réplica codificada, em miniatura, do Cockpit do Dia. Tudo aqui é dado de
 * demonstração. Adapta-se pela largura do próprio contêiner (@container), não
 * da viewport, para continuar legível do celular ao desktop largo.
 */

const INICIO_AGENDA = 13 * 60 // 13h
const JANELA_MIN = 240 // 13h às 17h
const AGORA_MIN = 14 * 60 + 12
const MAIOR_ESPERA_INICIAL = 12 * 60 + 47

type Estado = 'confirmada' | 'risco' | 'pendente'

type Bloco =
  | { inicio: string; duracao: number; paciente: string; estado: Estado }
  | { inicio: string; duracao: number; encaixe: { cancelado: string; novo: string } }

type Linha = { medico: string; iniciais: string; blocos: Bloco[]; soDesktop?: boolean }

const AGENDA: Linha[] = [
  {
    medico: 'Dra. Ana Lima',
    iniciais: 'AL',
    blocos: [
      { inicio: '13:00', duracao: 30, paciente: 'João P.', estado: 'confirmada' },
      { inicio: '13:30', duracao: 30, paciente: 'Rita C.', estado: 'confirmada' },
      { inicio: '14:00', duracao: 30, paciente: 'Carla M.', estado: 'risco' },
      { inicio: '14:30', duracao: 30, encaixe: { cancelado: 'Pedro A.', novo: 'Marina S.' } },
      { inicio: '15:00', duracao: 30, paciente: 'Sérgio L.', estado: 'confirmada' },
      { inicio: '16:00', duracao: 30, paciente: 'Beatriz N.', estado: 'pendente' },
    ],
  },
  {
    medico: 'Dr. Paulo Reis',
    iniciais: 'PR',
    blocos: [
      { inicio: '13:00', duracao: 30, paciente: 'Laura V.', estado: 'confirmada' },
      { inicio: '13:30', duracao: 60, paciente: 'Hélio D.', estado: 'confirmada' },
      { inicio: '15:00', duracao: 30, paciente: 'Nina A.', estado: 'risco' },
      { inicio: '15:30', duracao: 30, paciente: 'Otávio S.', estado: 'confirmada' },
      { inicio: '16:30', duracao: 30, paciente: 'Clara B.', estado: 'confirmada' },
    ],
  },
  {
    medico: 'Dra. Júlia Prado',
    iniciais: 'JP',
    soDesktop: true,
    blocos: [
      { inicio: '13:00', duracao: 60, paciente: 'Renato F.', estado: 'confirmada' },
      { inicio: '14:00', duracao: 30, paciente: 'Sofia G.', estado: 'confirmada' },
      { inicio: '15:00', duracao: 30, paciente: 'Igor T.', estado: 'risco' },
      { inicio: '15:30', duracao: 60, paciente: 'Vera M.', estado: 'confirmada' },
    ],
  },
]

const FILA = [
  { paciente: 'Marina S.', preferencia: 'Prefere tarde', status: 'Convidada', destaque: true },
  { paciente: 'Bruno T.', preferencia: 'Qualquer horário', status: 'há 2 dias', destaque: false },
  { paciente: 'Lúcia F.', preferencia: 'Só Dra. Ana', status: 'há 5 dias', destaque: false },
]

function minutos(hhmm: string) {
  const [h = 0, m = 0] = hhmm.split(':').map(Number)
  return h * 60 + m
}

function posicao(inicio: string, duracao: number) {
  const left = ((minutos(inicio) - INICIO_AGENDA) / JANELA_MIN) * 100
  const width = (duracao / JANELA_MIN) * 100
  return { left: `calc(${left}% + 1px)`, width: `calc(${width}% - 3px)` }
}

const ESTILO_ESTADO: Record<Estado, { caixa: string; ponto: string }> = {
  confirmada: { caixa: 'border-subtle bg-surface-raised', ponto: 'bg-revenue' },
  risco: { caixa: 'border-risk/40 bg-risk/10', ponto: 'bg-risk' },
  pendente: { caixa: 'border-subtle bg-surface-raised', ponto: 'bg-warn' },
}

function BlocoAgenda({ bloco }: { bloco: Bloco }) {
  const estilo = posicao(bloco.inicio, bloco.duracao)

  if ('encaixe' in bloco) {
    return (
      <div className="absolute inset-y-0" style={estilo}>
        <div className="slot-cancelled absolute inset-0 flex items-center justify-center gap-1.5 overflow-hidden rounded-md border border-dashed border-risk/60 px-1 @5xl:justify-start @5xl:px-1.5">
          <span className="truncate text-[0.625rem] font-medium text-risk line-through @5xl:hidden">PA</span>
          <span className="hidden truncate text-[0.6875rem] font-medium text-risk line-through @5xl:inline">
            {bloco.encaixe.cancelado}
          </span>
        </div>
        <div className="slot-filled absolute inset-0 flex items-center justify-center gap-1.5 overflow-hidden rounded-md border border-revenue/50 bg-revenue/15 px-1 @5xl:justify-start @5xl:px-1.5">
          <span className="hidden size-1.5 flex-none rounded-full bg-revenue @5xl:block" />
          <span className="truncate text-[0.625rem] font-semibold text-revenue @5xl:text-[0.6875rem]">
            <span className="@5xl:hidden">MS</span>
            <span className="hidden @5xl:inline">{bloco.encaixe.novo}</span>
          </span>
        </div>
      </div>
    )
  }

  const { caixa, ponto } = ESTILO_ESTADO[bloco.estado]
  const iniciais = bloco.paciente
    .split(' ')
    .map((p) => p[0])
    .join('')
  return (
    <div
      className={`absolute inset-y-0 flex items-center justify-center gap-1.5 overflow-hidden rounded-md border px-1 @5xl:justify-start @5xl:px-1.5 ${caixa}`}
      style={estilo}
    >
      <span className={`hidden size-1.5 flex-none rounded-full @5xl:block ${ponto}`} />
      <span className="truncate text-[0.625rem] text-ink @5xl:text-[0.6875rem]">
        <span className="@5xl:hidden">{iniciais}</span>
        <span className="hidden @5xl:inline">{bloco.paciente}</span>
      </span>
    </div>
  )
}

function Stat({
  rotulo,
  valor,
  sufixo,
  ponto,
  rodape,
  atraso,
}: {
  rotulo: string
  valor: string
  sufixo?: ReactNode
  ponto: 'revenue' | 'risk' | 'warn'
  rodape: string
  atraso?: 0 | 1 | 2
}) {
  return (
    <div className="flex min-w-0 flex-col justify-between gap-2 rounded-lg border border-subtle bg-base/50 p-2.5 @xl:p-3.5">
      <div className="flex items-start gap-1.5">
        <span className="mt-[0.2rem] flex">
          <PulseDot tom={ponto} atraso={atraso} />
        </span>
        <span className="label-caps text-[0.625rem] text-ink-muted @xl:text-[0.6875rem]">{rotulo}</span>
      </div>
      <div>
        <div className="flex flex-wrap items-baseline gap-x-1.5">
          <span className="num text-2xl font-medium leading-none tracking-[-0.02em] text-ink @xl:text-[2rem]">
            {valor}
          </span>
          {sufixo}
        </div>
        <p className="mt-1.5 hidden text-xs text-ink-muted @2xl:block">{rodape}</p>
      </div>
    </div>
  )
}

export function CockpitMockup() {
  const decorrido = useElapsed()
  const maiorEspera = formatarDuracao(MAIOR_ESPERA_INICIAL + decorrido)
  const agoraPct = ((AGORA_MIN - INICIO_AGENDA) / JANELA_MIN) * 100

  return (
    <figure className="hero-in-mock relative isolate">
      <div aria-hidden="true" className="hero-glow pointer-events-none absolute -inset-x-6 -inset-y-10 -z-10 sm:-inset-x-16" />

      <div className="relative">
        <div
          role="img"
          aria-label="Prévia do Cockpit do Dia: 18 de 24 consultas confirmadas, 3 pacientes em risco de falta, 4 pacientes na sala de espera e a agenda da tarde com um encaixe sugerido para Marina S. às 14h30."
          className="@container overflow-hidden rounded-2xl border border-strong bg-surface"
        >
          <div className="flex">
            <div className="hidden w-14 flex-none flex-col items-center gap-1.5 border-r border-subtle py-4 @4xl:flex">
              <Logomark className="mb-3 size-7" />
              {[LayoutDashboard, CalendarDays, Users, MessageCircle].map((Icone, i) => (
                <span
                  key={i}
                  className={`grid size-9 place-items-center rounded-lg ${
                    i === 0 ? 'bg-surface-raised text-ink' : 'text-ink-faint'
                  }`}
                >
                  <Icone className="size-[1.125rem]" strokeWidth={1.75} />
                </span>
              ))}
              <span className="mt-auto grid size-9 place-items-center rounded-lg text-ink-faint">
                <Settings className="size-[1.125rem]" strokeWidth={1.75} />
              </span>
            </div>

            <div className="min-w-0 flex-1 p-3 pb-12 @md:p-4 @md:pb-12 @3xl:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink @xl:text-[1rem]">Cockpit do Dia</p>
                  <p className="text-xs text-ink-muted">Quinta, 30 de outubro</p>
                </div>
                <span className="inline-flex flex-none items-center gap-2 rounded-full border border-subtle px-2.5 py-1 text-xs text-ink-muted">
                  <PulseDot tom="revenue" />
                  Ao vivo
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 @xl:gap-3">
                <Stat
                  rotulo="Confirmadas"
                  valor="18"
                  sufixo={<span className="num text-sm text-ink-muted @xl:text-[1rem]">/24</span>}
                  ponto="revenue"
                  rodape="75% da agenda de hoje"
                />
                <Stat rotulo="Em risco" valor="3" ponto="risk" atraso={1} rodape="Sem resposta há mais de 2h" />
                <Stat
                  rotulo="Na sala de espera"
                  valor="4"
                  sufixo={
                    <span className="num rounded bg-warn/10 px-1 text-xs text-ink @xl:text-sm">{maiorEspera}</span>
                  }
                  ponto="warn"
                  atraso={2}
                  rodape="Maior espera, Carlos M."
                />
              </div>

              <div className="mt-3 grid gap-3 @4xl:grid-cols-[minmax(0,1fr)_15.5rem]">
                <div className="rounded-xl border border-subtle p-3 @xl:p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-xs font-semibold text-ink @xl:text-sm">Agenda da tarde</p>
                    <p className="num text-[0.6875rem] text-ink-muted">3 de 3 salas</p>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <div className="flex w-7 flex-none flex-col gap-2 pt-5 @2xl:w-24">
                      {AGENDA.map((linha) => (
                        <div
                          key={linha.medico}
                          className={`h-8 items-center text-[0.6875rem] text-ink-muted ${linha.soDesktop ? 'hidden @2xl:flex' : 'flex'}`}
                        >
                          <span className="@2xl:hidden">{linha.iniciais}</span>
                          <span className="hidden truncate @2xl:inline">{linha.medico}</span>
                        </div>
                      ))}
                    </div>

                    <div className="relative min-w-0 flex-1">
                      <div className="num relative h-5 text-[0.625rem] text-ink-muted">
                        {['13h', '14h', '15h', '16h'].map((h, i) => (
                          <span key={h} className="absolute top-0" style={{ left: `${i * 25}%` }}>
                            {h}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-col gap-2">
                        {AGENDA.map((linha) => (
                          <div
                            key={linha.medico}
                            className={`relative h-8 rounded-md bg-base/40 ${linha.soDesktop ? 'hidden @2xl:block' : ''}`}
                          >
                            {[25, 50, 75].map((p) => (
                              <span key={p} className="absolute inset-y-0 w-px bg-subtle" style={{ left: `${p}%` }} />
                            ))}
                            {linha.blocos.map((b) => (
                              <BlocoAgenda key={b.inicio} bloco={b} />
                            ))}
                          </div>
                        ))}
                      </div>
                      <div
                        className="pointer-events-none absolute bottom-0 top-4 w-px bg-action"
                        style={{ left: `${agoraPct}%` }}
                      >
                        <span className="absolute -left-[3px] -top-[3px] size-[7px] rounded-full bg-action" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-subtle p-3 @xl:p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-xs font-semibold text-ink @xl:text-sm">Fila de espera</p>
                    <p className="num text-[0.6875rem] text-ink-muted">3 pacientes</p>
                  </div>
                  <ul className="mt-2.5 flex flex-col gap-1.5">
                    {FILA.map((item) => (
                      <li
                        key={item.paciente}
                        className={`flex items-center justify-between gap-3 rounded-lg px-2.5 py-2 ${
                          item.destaque ? 'bg-revenue/10' : 'hidden bg-base/40 @4xl:flex'
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-medium text-ink">{item.paciente}</span>
                          <span className="block truncate text-[0.6875rem] text-ink-muted">{item.preferencia}</span>
                        </span>
                        <span
                          className={`flex-none text-[0.6875rem] ${
                            item.destaque ? 'font-medium text-revenue' : 'num text-ink-muted'
                          }`}
                        >
                          {item.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="hero-toast absolute inset-x-3 -bottom-5 flex items-center gap-3 rounded-xl border border-strong bg-surface-raised py-2.5 pl-2.5 pr-3.5 shadow-[0_16px_40px_-12px_rgb(0_0_0/0.85)] sm:inset-x-auto sm:right-6 sm:-bottom-6 lg:right-8"
        >
          <span className="grid size-9 flex-none place-items-center rounded-lg bg-revenue/15 text-revenue">
            <CalendarCheck2 className="size-[1.125rem]" strokeWidth={1.75} />
          </span>
          <p className="min-w-0 text-[0.8125rem] leading-snug text-ink-muted">
            <span className="font-medium text-ink">Encaixe sugerido:</span>{' '}
            <span className="whitespace-nowrap">
              Marina S.{' '}
              <ArrowRight className="inline size-3.5 align-[-0.15em] text-ink-muted" strokeWidth={2} />{' '}
              <span className="num text-revenue">hoje 14h30</span>
            </span>
          </p>
        </div>
      </div>

      <figcaption className="mt-10 text-sm text-ink-muted sm:mt-12 lg:mt-4">Dados de demonstração</figcaption>
    </figure>
  )
}
