import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ErrorBar,
  ResponsiveContainer,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { OverreactionRow } from '../../types'

const COLORS = ['#9CA3AF', '#6B7280', '#0F766E']

interface ChartPoint {
  group: string
  median_overshoot: number
  error: [number, number]
  n: number
  pct_positive: number
  ci_lo: number
  ci_hi: number
}

interface Props {
  data: OverreactionRow[]
}

export default function OverreactionChart({ data }: Props) {
  const chartData: ChartPoint[] = data.map(d => ({
    group: d.group,
    median_overshoot: d.median_overshoot,
    error: [
      +(d.median_overshoot - d.ci_lo_95).toFixed(4),
      +(d.ci_hi_95 - d.median_overshoot).toFixed(4),
    ],
    n: d.n,
    pct_positive: d.pct_positive,
    ci_lo: d.ci_lo_95,
    ci_hi: d.ci_hi_95,
  }))

  const tooltipContent = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload?.length) return null
    const pt = chartData.find(d => d.group === label)
    if (!pt) return null
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2.5 text-xs min-w-[195px]">
        <p className="font-semibold text-gray-800 mb-1.5">{pt.group}</p>
        <p className="text-gray-500 mb-1">n = {pt.n}</p>
        <p>
          Median overshoot:{' '}
          <span className="font-mono font-semibold text-teal-700">
            {pt.median_overshoot.toFixed(3)}
          </span>
        </p>
        <p className="text-gray-500 mt-0.5">
          95% CI: [{pt.ci_lo.toFixed(3)}, {pt.ci_hi.toFixed(3)}]
        </p>
        <p className="text-gray-500 mt-0.5">
          % positive: {pt.pct_positive.toFixed(1)}%
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <div style={{ minWidth: 340 }}>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 8, right: 28, bottom: 8, left: 16 }} barCategoryGap="40%">
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey="group"
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis
              domain={[0, 0.4]}
              tickFormatter={(v: number) => v.toFixed(2)}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              tickLine={false}
              axisLine={false}
              width={40}
              label={{
                value: 'Median overshoot',
                angle: -90,
                position: 'insideLeft',
                offset: 4,
                fontSize: 11,
                fill: '#9CA3AF',
              }}
            />
            <Tooltip content={tooltipContent} cursor={{ fill: '#F9FAFB' }} />
            <Bar dataKey="median_overshoot" radius={[4, 4, 0, 0]} maxBarSize={80}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i] ?? '#9CA3AF'} />
              ))}
              <ErrorBar
                dataKey="error"
                width={8}
                strokeWidth={1.5}
                stroke="#374151"
                direction="y"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
