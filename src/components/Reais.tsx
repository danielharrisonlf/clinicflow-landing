import { formatarInteiro } from '../lib/roi'

type ReaisProps = { valor: number; className?: string }

/**
 * Valor em reais para números grandes: o `R$` vai menor e o número leva o peso.
 * Em mono, o espaço entre símbolo e número ocuparia uma célula inteira.
 */
export function Reais({ valor, className = '' }: ReaisProps) {
  return (
    <span className={`num inline-flex items-baseline leading-none ${className}`}>
      <span className="mr-[0.18em] text-[0.5em] font-normal tracking-normal opacity-80">R$</span>
      {formatarInteiro(valor)}
    </span>
  )
}
