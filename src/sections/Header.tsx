import { useEffect, useId, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Logo } from '../components/Logo'
import { LINK_DEMONSTRACAO, NAV } from '../lib/links'

export function Header() {
  const [rolou, setRolou] = useState(false)
  const [aberto, setAberto] = useState(false)
  const menuId = useId()
  const botaoRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 8)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  useEffect(() => {
    if (!aberto) return
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAberto(false)
        botaoRef.current?.focus()
      }
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [aberto])

  const translucido = rolou || aberto

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-[background-color,border-color] duration-150 ${
        translucido ? 'border-subtle bg-base/75 backdrop-blur-md' : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[75rem] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#topo" className="-ml-1 inline-flex min-h-11 items-center rounded-lg p-1" aria-label="ClinicFlow, voltar ao topo">
          <Logo nomeClassName="max-sm:sr-only" />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex min-h-11 items-center rounded-lg px-3 text-[0.9375rem] text-ink-muted no-underline transition-colors duration-150 hover:text-ink"
                >
                  {item.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href={LINK_DEMONSTRACAO} className="btn btn-primary max-xs:px-3.5 max-xs:text-sm">
            Começar demonstração
          </a>
          <button
            ref={botaoRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-lg text-ink-muted transition-colors duration-150 hover:bg-surface-raised hover:text-ink lg:hidden"
            aria-expanded={aberto}
            aria-controls={menuId}
            aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setAberto((v) => !v)}
          >
            {aberto ? <X className="size-5" strokeWidth={1.75} /> : <Menu className="size-5" strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      <nav id={menuId} aria-label="Principal (menu)" hidden={!aberto} className="border-t border-subtle lg:hidden">
        <ul className="mx-auto max-w-[75rem] px-4 py-2 sm:px-6">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setAberto(false)}
                className="flex min-h-12 items-center rounded-lg px-2 text-[1rem] text-ink no-underline hover:bg-surface-raised"
              >
                {item.rotulo}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
