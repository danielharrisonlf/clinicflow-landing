import { useSyncExternalStore } from 'react'
import { useReducedMotion } from './useReducedMotion'

/*
 * Relógio compartilhado pelos timers da sala de espera: um único setInterval,
 * pausado com a aba oculta. Com reduced motion os timers ficam parados.
 */
let segundos = 0
let intervalo: number | undefined
const ouvintes = new Set<() => void>()

function tick() {
  if (document.visibilityState !== 'visible') return
  segundos += 1
  ouvintes.forEach((ouvir) => ouvir())
}

function subscribe(onChange: () => void) {
  ouvintes.add(onChange)
  if (intervalo === undefined) intervalo = window.setInterval(tick, 1000)
  return () => {
    ouvintes.delete(onChange)
    if (ouvintes.size === 0 && intervalo !== undefined) {
      window.clearInterval(intervalo)
      intervalo = undefined
    }
  }
}

const parado = () => () => {}

export function useElapsed(): number {
  const reduzir = useReducedMotion()
  return useSyncExternalStore(
    reduzir ? parado : subscribe,
    () => (reduzir ? 0 : segundos),
    () => 0,
  )
}

/** `mm:ss`, ou `h:mm:ss` a partir de uma hora. */
export function formatarDuracao(totalSegundos: number): string {
  const h = Math.floor(totalSegundos / 3600)
  const m = Math.floor((totalSegundos % 3600) / 60)
  const s = totalSegundos % 60
  const mm = String(m).padStart(2, '0')
  const ss = String(s).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}
