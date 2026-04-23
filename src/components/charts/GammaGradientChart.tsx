import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { GammaHeatmapRow } from '../../types'

const BIN_ORDER = ['0–15', '15–30', '30–45', '45–60', '60–75', '75–90', '90+']
const C_LINE = '#F76900'
const C_NAVY = '#000E54'

interface ChartPoint {
  min_bin: string
  med_delta: number
  n: number
}

interface Props {
  data: GammaHeatmapRow[]
}

export default function GammaGradientChart({ data }: Props) {
  const chartData: ChartPoint[] = BIN_ORDER.map(bin => {
    const row = data.find(d => d.min_bin === bin && d.score_diff_clamp === 0)
    return {
      min_bin: bin,
      med_delta: row?.med_delta ?? 0,
      n: row?.n ?? 0,
    }
  })

  const tooltipContent = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload?.length) return null
    const pt = chartData.find(d => d.min_bin === label)
    if (!pt) return null
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2.5 text-xs min-w-[155px]">
        <p className="font-semibold text-gray-800 mb-1">{label} min (Tied)</p>
        <p>
          Median Δ:{' '}
          <span className="font-mono font-semibold" style={{ color: C_NAVY }}>
            {pt.med_delta.toFixed(3)}
          </span>
        </p>
        <p className="text-gray-400 mt-0.5">n = {pt.n} events</p>
        {pt.n < 10 && (
          <p className="text-amber-600 mt-1 leading-snug">
            Small sample.
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <div style={{ minWidth: 420 }}>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 8, right: 28, bottom: 24, left: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey="min_bin"
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              label={{
                value: 'Match minute (bin)',
                position: 'insideBottom',
                offset: -14,
                fontSize: 11,
                fill: '#9CA3AF',
              }}
            />
            <YAxis
              domain={[0, 0.8]}
              tickFormatter={(v: number) => v.toFixed(2)}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              tickLine={false}
              axisLine={false}
              width={40}
              label={{
                value: 'Median Δ (tied matches)',
                angle: -90,
                position: 'insideLeft',
                offset: 4,
                fontSize: 11,
                fill: '#9CA3AF',
              }}
            />
            <Tooltip content={tooltipContent} cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }} />
            <ReferenceLine
              x="75–90"
              stroke={C_LINE}
              strokeDasharray="4 3"
              strokeWidth={1}
              label={{
                value: 'Peak: Δ=0.531',
                position: 'top',
                fill: C_NAVY,
                fontSize: 11,
                fontWeight: 600,
              }}
            />
            <Line
              type="monotone"
              dataKey="med_delta"
              name="Median Δ (tied)"
              stroke={C_LINE}
              strokeWidth={2.5}
              dot={({ cx, cy, payload }: { cx: number; cy: number; payload: ChartPoint }) => (
                <circle
                  key={`dot-${payload.min_bin}`}
                  cx={cx}
                  cy={cy}
                  r={payload.n < 10 ? 3 : 4}
                  fill={C_LINE}
                  opacity={payload.n < 10 ? 0.4 : 1}
                  stroke="white"
                  strokeWidth={1.5}
                />
              )}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
