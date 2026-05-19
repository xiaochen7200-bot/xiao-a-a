import type { ReactNode } from 'react'

interface TechPanelProps {
  children: ReactNode
  className?: string
}

export function TechPanel({ children, className = '' }: TechPanelProps) {
  return (
    <section className={`tech-panel relative p-5 ${className}`}>
      <span className="tech-corner tech-corner-tl" aria-hidden />
      <span className="tech-corner tech-corner-tr" aria-hidden />
      <span className="tech-corner tech-corner-bl" aria-hidden />
      <span className="tech-corner tech-corner-br" aria-hidden />
      {children}
    </section>
  )
}

interface TechSectionTitleProps {
  children: ReactNode
  suffix?: ReactNode
}

export function TechSectionTitle({ children, suffix }: TechSectionTitleProps) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <h2 className="tech-section-title mb-0 flex-1">{children}</h2>
      {suffix && <span className="shrink-0 font-mono text-xs text-cyan-500/70">{suffix}</span>}
    </div>
  )
}
