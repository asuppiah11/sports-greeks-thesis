import type { ThetaParamsRow } from '../../types'

interface Props { data: ThetaParamsRow[] }

function fmt(v: number | null, decimals = 5): string {
  if (v === null) return '—'
  return v.toFixed(decimals)
}

const GROUP_META: Record<string, { shortName: string; description: string }> = {
  A_pure_00:        { shortName: 'A', description: 'Pure 0-0 (scoreless throughout)' },
  B_pre_first_goal: { shortName: 'B', description: 'Pre-first-goal segment' },
  C_level_score:    { shortName: 'C', description: 'Level score (≥1 goal each)' },
  Poisson:          { shortName: '—', description: 'Poisson baseline' },
}

export default function ThetaParamsTable({ data }: Props) {
  const rows = data.filter(d => d.group !== 'Poisson')
  const poisson = data.find(d => d.group === 'Poisson')

  return (
    <div className="overflow-x-auto">
      <table className="w-full font-mono text-[11px] border-collapse">
        <thead>
          <tr className="border-b border-terminal-border">
            <th className="text-left py-2 pr-3 text-[9px] uppercase tracking-wide text-terminal-dim w-6">GRP</th>
            <th className="text-left py-2 pr-4 text-[9px] uppercase tracking-wide text-terminal-dim">DESCRIPTION</th>
            <th className="text-right py-2 px-2 text-[9px] uppercase tracking-wide text-terminal-dim">N</th>
            <th className="text-right py-2 px-2 text-[9px] uppercase tracking-wide text-terminal-dim">a</th>
            <th className="text-right py-2 px-2 text-[9px] uppercase tracking-wide text-terminal-dim">SE(a)</th>
            <th className="text-right py-2 px-2 text-[9px] uppercase tracking-wide text-terminal-dim">b</th>
            <th className="text-right py-2 pl-2 text-[9px] uppercase tracking-wide text-terminal-dim">SE(b)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-terminal-border">
          {rows.map(row => {
            const meta = GROUP_META[row.group]
            return (
              <tr key={row.group} className="hover:bg-terminal-bg transition-colors">
                <td className="py-2.5 pr-3 font-semibold text-terminal-orange">{meta.shortName}</td>
                <td className="py-2.5 pr-4 text-terminal-muted text-[10px] leading-snug">{meta.description}</td>
                <td className="py-2.5 px-2 text-right text-terminal-text">{row.n_segments}</td>
                <td className="py-2.5 px-2 text-right text-terminal-text">{fmt(row.a_fit)}</td>
                <td className="py-2.5 px-2 text-right text-terminal-dim text-[10px]">{fmt(row.SE_a)}</td>
                <td className="py-2.5 px-2 text-right text-terminal-text">{fmt(row.b_fit)}</td>
                <td className="py-2.5 pl-2 text-right text-terminal-dim text-[10px]">{fmt(row.SE_b, 6)}</td>
              </tr>
            )
          })}
        </tbody>
        {poisson && (
          <tfoot>
            <tr className="border-t border-terminal-border">
              <td className="py-2 pr-3 text-terminal-dim text-[10px]">—</td>
              <td className="py-2 pr-4 text-terminal-dim text-[10px]">Poisson baseline</td>
              <td colSpan={5} className="py-2 px-2 text-right text-terminal-muted text-[10px]">
                λ = {poisson.lambda?.toFixed(3)}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
      <p className="mt-2 font-mono text-[9px] text-terminal-dim italic">
        MODEL: P(Δ in [t, t+dt]) = a · e<sup>bt</sup> · dt — exponential hazard fit to scoreless-interval goal-scoring rates.
      </p>
    </div>
  )
}
