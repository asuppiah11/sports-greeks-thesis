interface StatCardProps {
  value: string
  label: string
  description: string
  pValue: string
  href: string
  badge?: string
  sectionLabel?: string
}

export default function StatCard({ value, label, description, pValue, href, badge, sectionLabel }: StatCardProps) {
  return (
    <a href={href} className="group relative block bg-terminal-panel hover:bg-terminal-bg transition-colors p-3 sm:p-4 h-full">
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-terminal-orange opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[9px] uppercase tracking-widest text-terminal-dim">
          {sectionLabel ?? label}
        </span>
        {badge && (
          <span className="font-mono text-[9px] text-terminal-orange border border-terminal-orange/40 bg-[#1a1208] px-1 py-0.5 leading-none">
            {badge}
          </span>
        )}
      </div>

      {/* Primary value */}
      <div className="font-mono text-[32px] sm:text-[42px] leading-none font-bold text-terminal-orange tabular-nums tracking-tight mb-3">
        {value}
      </div>

      {/* Divider */}
      <div className="border-t border-terminal-border mb-3" />

      {/* Description */}
      <p className="font-sans text-[11px] text-terminal-muted leading-snug mb-4">{description}</p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto">
        <span className="font-mono text-[10px] text-terminal-dim">{pValue}</span>
        <span className="font-mono text-[10px] text-terminal-dim opacity-0 group-hover:opacity-100 transition-opacity">
          {label}&nbsp;→
        </span>
      </div>
    </a>
  )
}
