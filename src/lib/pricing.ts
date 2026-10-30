export type Ciclo = 'mensal' | 'anual'

export const DESCONTO_ANUAL = 0.2

/** Mensal equivalente no ciclo escolhido; no anual, arredonda para o real inteiro. */
export function precoMensal(precoBase: number, ciclo: Ciclo): number {
  return ciclo === 'anual' ? Math.round(precoBase * (1 - DESCONTO_ANUAL)) : precoBase
}

/** Total cobrado por ano no plano anual (base com desconto × 12, arredondado). */
export function totalAnual(precoBase: number): number {
  return Math.round(precoBase * (1 - DESCONTO_ANUAL) * 12)
}
