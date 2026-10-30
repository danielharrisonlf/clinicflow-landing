import { Logo } from '../components/Logo'
import { EMAIL_CONTATO } from '../lib/links'

export function Footer() {
  return (
    <footer className="py-12">
      <div className="mx-auto flex max-w-[75rem] flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-start md:justify-between lg:px-8">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="text-sm text-ink-muted">© 2026 ClinicFlow</p>
        </div>
        <div className="flex flex-col gap-3 md:items-end md:text-right">
          <a
            href={`mailto:${EMAIL_CONTATO}`}
            className="inline-flex min-h-11 items-center text-[0.9375rem] text-ink underline decoration-strong hover:decoration-action md:min-h-0"
          >
            {EMAIL_CONTATO}
          </a>
          <p className="max-w-[46ch] text-sm text-ink-muted">
            Página de demonstração do produto. Depoimentos, números e preços são cenários ilustrativos.
          </p>
        </div>
      </div>
    </footer>
  )
}
