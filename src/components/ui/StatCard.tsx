interface StatCardProps {
  value: string
  label: string
  description: string
  pValue: string
  href: string
}

export default function StatCard({ value, label, description, pValue, href }: StatCardProps) {
  return (
    <a
      href={href}
      className="group block border border-terminal-border bg-terminal-panel hover:border-terminal-orange/40 hover:bg-terminal-bg p-5 transition-colors"
    >
      <div className="font-mono tabular text-4xl font-bold text-terminal-orange mb-2 tracking-tight">{value}</div>
      <div className="font-sans text-xs font-semibold text-terminal-text mb-1">{label}</div>
      <div className="font-sans text-xs text-terminal-muted leading-snug mb-3">{description}</div>
      <div className="font-mono text-[10px] text-terminal-dim">{pValue}</div>
    </a>
  )
}
