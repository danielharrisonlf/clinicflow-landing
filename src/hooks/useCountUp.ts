import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

const DURACAO_MS = 480

/**
 * Anima do valor exibido até o novo alvo (ease-out exponencial).
 * Com reduced motion, devolve o alvo direto.
 */
export function useCountUp(alvo: number): number {
  const reduzir = useReducedMotion()
  const [exibido, setExibido] = useState(alvo)
  const atual = useRef(alvo)

  useEffect(() => {
    if (reduzir) {
      atual.current = alvo
      setExibido(alvo)
      return
    }
    const de = atual.current
    if (de === alvo) return
    const inicio = performance.now()
    let frame = 0
    const passo = (agora: number) => {
      const t = Math.min(1, (agora - inicio) / DURACAO_MS)
      const ease = t === 1 ? 1 : 1 - 2 ** (-10 * t)
      const valor = de + (alvo - de) * ease
      atual.current = valor
      setExibido(valor)
      if (t < 1) frame = requestAnimationFrame(passo)
    }
    frame = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(frame)
  }, [alvo, reduzir])

  return reduzir ? alvo : exibido
}
