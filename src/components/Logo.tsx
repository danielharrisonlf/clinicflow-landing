type LogomarkProps = { className?: string }

/** Traço de pulso dentro de quadrado arredondado — mesma forma do favicon. */
export function Logomark({ className = 'size-7' }: LogomarkProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <rect width="32" height="32" rx="8" className="fill-action-strong" />
      <path
        d="M6 16.5h4.5l2.5-6 5 12 2.75-6H26"
        className="stroke-white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type LogoProps = { nomeClassName?: string }

export function Logo({ nomeClassName = '' }: LogoProps) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Logomark />
      <span className={`text-[1.0625rem] font-semibold tracking-[-0.02em] text-ink ${nomeClassName}`}>ClinicFlow</span>
    </span>
  )
}
