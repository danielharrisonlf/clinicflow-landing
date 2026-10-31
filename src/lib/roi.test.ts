import { describe, expect, it } from 'vitest'
import {
  MEDICOS,
  VALOR_CONSULTA,
  ajustarAoLimite,
  calcularRoi,
  formatarInteiro,
  formatarReais,
  lerNumero,
} from './roi'

const NBSP = ' '

describe('calcularRoi', () => {
  it('aplica a fórmula do brief com os valores padrão (2 médicos, R$ 280)', () => {
    const r = calcularRoi(MEDICOS.padrao, VALOR_CONSULTA.padrao)
    expect(r.consultasMes).toBe(2 * 12 * 22)
    expect(r.perdidoMes).toBeCloseTo(528 * 0.2 * 280)
    expect(r.recuperadoMes).toBeCloseTo(29568 * 0.8)
  })

  it('o recuperado com os padrões fica abaixo do teto prometido no H1 (R$ 25.000)', () => {
    const r = calcularRoi(MEDICOS.padrao, VALOR_CONSULTA.padrao)
    expect(r.recuperadoMes).toBeLessThanOrEqual(25_000)
  })

  it('recuperado é sempre 80% do perdido', () => {
    for (const [m, v] of [[1, 100], [7, 450], [20, 1000]] as const) {
      const r = calcularRoi(m, v)
      expect(r.recuperadoMes).toBeCloseTo(r.perdidoMes * 0.8)
    }
  })

  it('nos extremos dos sliders', () => {
    expect(calcularRoi(1, 100)).toEqual({ consultasMes: 264, perdidoMes: 5280, recuperadoMes: 4224 })
    const max = calcularRoi(20, 1000)
    expect(max.consultasMes).toBe(5280)
    expect(max.perdidoMes).toBe(1_056_000)
    expect(max.recuperadoMes).toBe(844_800)
  })

  it('prende entradas fora do intervalo antes de calcular', () => {
    expect(calcularRoi(0, 50)).toEqual(calcularRoi(1, 100))
    expect(calcularRoi(99, 5000)).toEqual(calcularRoi(20, 1000))
  })
})

describe('ajustarAoLimite', () => {
  it('respeita mínimo e máximo dos médicos', () => {
    expect(ajustarAoLimite(-3, MEDICOS)).toBe(1)
    expect(ajustarAoLimite(21, MEDICOS)).toBe(20)
    expect(ajustarAoLimite(4.4, MEDICOS)).toBe(4)
  })

  it('arredonda o valor da consulta ao passo de R$ 10', () => {
    expect(ajustarAoLimite(284, VALOR_CONSULTA)).toBe(280)
    expect(ajustarAoLimite(285, VALOR_CONSULTA)).toBe(290)
    expect(ajustarAoLimite(99, VALOR_CONSULTA)).toBe(100)
    expect(ajustarAoLimite(1004, VALOR_CONSULTA)).toBe(1000)
  })

  it('entrada não numérica cai no mínimo', () => {
    expect(ajustarAoLimite(Number.NaN, VALOR_CONSULTA)).toBe(100)
    expect(ajustarAoLimite(Number.POSITIVE_INFINITY, MEDICOS)).toBe(1)
  })
})

describe('formatação pt-BR', () => {
  it('formata reais sem centavos e com separador de milhar', () => {
    expect(formatarReais(12340)).toBe(`R$${NBSP}12.340`)
    expect(formatarReais(47308.8)).toBe(`R$${NBSP}47.309`)
    expect(formatarReais(1_056_000)).toBe(`R$${NBSP}1.056.000`)
    expect(formatarReais(100)).toBe(`R$${NBSP}100`)
  })

  it('formata inteiros com ponto de milhar', () => {
    expect(formatarInteiro(5280)).toBe('5.280')
    expect(formatarInteiro(264)).toBe('264')
  })

  it('lê o texto digitado no campo editável', () => {
    expect(lerNumero('R$ 1.250')).toBe(1250)
    expect(lerNumero('280')).toBe(280)
    expect(Number.isNaN(lerNumero('abc'))).toBe(true)
  })
})
