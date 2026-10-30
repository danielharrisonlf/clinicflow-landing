/**
 * Sem formulário nem backend nesta página: os CTAs abrem um e-mail pré-preenchido
 * para o endereço de contato do footer.
 */
export const EMAIL_CONTATO = 'contato@clinicflow.app'

export const LINK_DEMONSTRACAO = `mailto:${EMAIL_CONTATO}?subject=${encodeURIComponent(
  'Quero uma demonstração do ClinicFlow',
)}`

export const LINK_VENDAS = `mailto:${EMAIL_CONTATO}?subject=${encodeURIComponent('ClinicFlow para rede multiclínica')}`

export const NAV = [
  { href: '#funcionalidades', rotulo: 'Funcionalidades' },
  { href: '#calculadora', rotulo: 'Calculadora' },
  { href: '#planos', rotulo: 'Planos' },
  { href: '#perguntas', rotulo: 'Perguntas' },
] as const
