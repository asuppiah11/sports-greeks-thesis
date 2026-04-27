export interface StatRow {
  label: string
  value: string
  accent?: string
}

interface Props { stats: StatRow[] }

export default function StatsRail({ stats }: Props) {
  return (
    <div className="hidden md:flex flex-col w-36 flex-shrink-0 border-l border-terminal-border pl-3 ml-2 gap-3">
      {stats.map(s => (
        <div key={s.label}>
          <p className="font-mono text-[9px] text-terminal-dim uppercase tracking-wide leading-none mb-0.5">
            {s.label}
          </p>
          <p
            className="font-mono text-[13px] font-semibold tabular-nums leading-tight"
            style={{ color: s.accent ?? '#e5e5e5' }}
          >
            {s.value}
          </p>
        </div>
      ))}
    </div>
  )
}
