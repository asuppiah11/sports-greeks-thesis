export interface StatRow {
  label: string
  value: string
  accent?: string
}

interface Props { stats: StatRow[] }

export default function StatsRail({ stats }: Props) {
  return (
    <div className="hidden lg:block w-72 flex-shrink-0 border-l border-terminal-border pl-4">
      <p className="font-mono text-[12px] text-terminal-dim uppercase tracking-widest pb-1.5 mb-0.5 border-b border-terminal-border">
        PANEL STATS
      </p>
      {stats.map(s => (
        <div
          key={s.label}
          className="flex items-baseline justify-between py-1 border-b border-terminal-border/40"
        >
          <span className="font-mono text-[12px] text-terminal-dim uppercase tracking-wide leading-none flex-shrink-0 mr-2">
            {s.label}
          </span>
          <span
            className="font-mono text-[13px] font-semibold tabular-nums leading-none text-right"
            style={{ color: s.accent ?? '#e5e5e5' }}
          >
            {s.value}
          </span>
        </div>
      ))}
    </div>
  )
}
