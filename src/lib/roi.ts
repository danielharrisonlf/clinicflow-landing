/**
 * Calculadora de faturamento perdido com faltas.
 *
 * consultas/mês = médicos × 12 consultas/dia × 22 dias úteis
 * perdido/mês   = consultas/mês × 20% × valor da consulta
 * recuperado    = 80% do perdido
 */

export const CONSULTAS_POR_DIA = 12
export const DIAS_UTEIS = 22
export const TAXA_FALTAS = 0.2
export const TAXA_RECUPERACAO = 0.8

// padrao 2: com R$ 280, o recuperado (~R$ 23.650) fica coerente com o teto
// prometido no H1 ("até R$ 25.000/mês").
export const MEDICOS = { min: 1, max: 20, step: 1, padrao: 2 } as const
export const VALOR_CONSULTA = { min: 100, max: 1000, step: 10, padrao: 280 } as const

type Limites = { min: number; max: number; step: number }

/** Prende o valor ao intervalo e ao passo do slider. Entrada inválida cai no mínimo. */
export function ajustarAoLimite(valor: number, { min, max, step }: Limites): number {
  if (!Number.isFinite(valor)) return min
  const noPasso = Math.round((valor - min) / step) * step + min
  return Math.min(max, Math.max(min, noPasso))
}

export type ResultadoRoi = {
  consultasMes: number
  perdidoMes: number
  recuperadoMes: number
}

export function calcularRoi(medicos: number, valorConsulta: number): ResultadoRoi {
  const m = ajustarAoLimite(medicos, MEDICOS)
  const v = ajustarAoLimite(valorConsulta, VALOR_CONSULTA)
  const consultasMes = m * CONSULTAS_POR_DIA * DIAS_UTEIS
  const perdidoMes = consultasMes * TAXA_FALTAS * v
  const recuperadoMes = perdidoMes * TAXA_RECUPERACAO
  return { consultasMes, perdidoMes, recuperadoMes }
}

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const inteiro = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 })

/** `R$ 12.340` — sem centavos. O espaço após `R$` é o NBSP do Intl (não quebra linha). */
export function formatarReais(valor: number): string {
  return brl.format(Math.round(valor))
}

export function formatarInteiro(valor: number): string {
  return inteiro.format(Math.round(valor))
}

/** Converte o texto digitado ("R$ 1.250", "280") em número; `NaN` se não houver dígito. */
export function lerNumero(texto: string): number {
  const digitos = texto.replace(/\D/g, '')
  return digitos === '' ? Number.NaN : Number(digitos)
}
