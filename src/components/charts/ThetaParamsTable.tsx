import type { ThetaParamsRow } from '../../types'

interface Props {
  data: ThetaParamsRow[]
}

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
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2.5 pr-4 font-semibold text-gray-700 text-xs uppercase tracking-wide w-8">
              Grp
            </th>
            <th className="text-left py-2.5 pr-6 font-semibold text-gray-700 text-xs uppercase tracking-wide">
              Description
            </th>
            <th className="text-right py-2.5 px-3 font-semibold text-gray-700 text-xs uppercase tracking-wide">
              n
            </th>
            <th className="text-right py-2.5 px-3 font-semibold text-gray-700 text-xs uppercase tracking-wide">
              a
            </th>
            <th className="text-right py-2.5 px-3 font-semibold text-gray-700 text-xs uppercase tracking-wide">
              SE(a)
            </th>
            <th className="text-right py-2.5 px-3 font-semibold text-gray-700 text-xs uppercase tracking-wide">
              b
            </th>
            <th className="text-right py-2.5 pl-3 font-semibold text-gray-700 text-xs uppercase tracking-wide">
              SE(b)
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {rows.map(row => {
            const meta = GROUP_META[row.group]
            return (
              <tr key={row.group} className="hover:bg-gray-50">
                <td className="py-3 pr-4 font-semibold text-teal-700 font-mono text-sm">
                  {meta.shortName}
                </td>
                <td className="py-3 pr-6 text-gray-600 text-xs leading-snug">{meta.description}</td>
                <td className="py-3 px-3 text-right font-mono text-gray-700">
                  {row.n_segments}
                </td>
                <td className="py-3 px-3 text-right font-mono text-gray-700">
                  {fmt(row.a_fit)}
                </td>
                <td className="py-3 px-3 text-right font-mono text-gray-400 text-xs">
                  {fmt(row.SE_a)}
                </td>
                <td className="py-3 px-3 text-right font-mono text-gray-700">
                  {fmt(row.b_fit)}
                </td>
                <td className="py-3 pl-3 text-right font-mono text-gray-400 text-xs">
                  {fmt(row.SE_b, 6)}
                </td>
              </tr>
            )
          })}
        </tbody>
        {poisson && (
          <tfoot>
            <tr className="border-t border-gray-200">
              <td className="py-3 pr-4 font-mono text-gray-400 text-xs">—</td>
              <td className="py-3 pr-6 text-gray-400 text-xs">Poisson baseline</td>
              <td colSpan={5} className="py-3 px-3 text-right font-mono text-gray-500 text-xs">
                λ = {poisson.lambda?.toFixed(3)}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
      <p className="mt-2 text-xs text-gray-400 italic">
        Model: P(Δ in [t, t+dt]) = a · e<sup>bt</sup> · dt — exponential hazard fit to scoreless-interval goal-scoring rates.
      </p>
    </div>
  )
}
