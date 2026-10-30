import { describe, expect, it } from 'vitest'
import { precoMensal, totalAnual } from './pricing'

describe('precoMensal', () => {
  it('mantém o preço no mensal', () => {
    expect(precoMensal(149, 'mensal')).toBe(149)
    expect(precoMensal(349, 'mensal')).toBe(349)
  })

  it('aplica -20% no anual e arredonda ao real', () => {
    expect(precoMensal(149, 'anual')).toBe(119)
    expect(precoMensal(349, 'anual')).toBe(279)
  })
})

describe('totalAnual', () => {
  it('soma 12 meses com desconto', () => {
    expect(totalAnual(149)).toBe(1430)
    expect(totalAnual(349)).toBe(3350)
  })
})
