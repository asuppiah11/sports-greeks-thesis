import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { DeltaOddsBinRow } from '../../types'

const C_ORANGE = '#F76900'
const C_NAVY   = '#000E54'

interface ChartPoint extends DeltaOddsBinRow {
  band_base: number
  band_height: number
}

interface Props {
  data: DeltaOddsBinRow[]
}

export default function DeltaByOddsChart({ data }: Props) {
  const chartData: ChartPoint[] = data.map(d => ({
    ...d,
    band_base: d.p25,
    band_height: d.p75 - d.p25,
  }))

  const tooltipContent = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload?.length) return null
    const pt = chartData.find(d => d.odds_bin === label)
    if (!pt) return null
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2.5 text-xs min-w-[170px]">
        <p className="font-semibold text-gray-800 mb-1">Odds {label}</p>
        <p className="text-gray-400 mb-2">n = {pt.n} events</p>
        <div className="space-y-0.5">
          <p className="text-gray-500">
            75th pct:{' '}
            <span className="font-mono">{pt.p75.toFixed(3)}</span>
          </p>
          <p className="font-semibold" style={{ color: C_NAVY }}>
            Median Δ:{' '}
            <span className="font-mono">{pt.median_delta.toFixed(3)}</span>
          </p>
          <p className="text-gray-500">
            25th pct:{' '}
            <span className="font-mono">{pt.p25.toFixed(3)}</span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <div style={{ minWidth: 420 }}>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={chartData} margin={{ top: 8, right: 28, bottom: 24, left: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey="odds_bin"
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              label={{
                value: 'Pre-goal decimal odds',
                position: 'insideBottom',
                offset: -14,
                fontSize: 11,
                fill: '#9CA3AF',
              }}
            />
            <YAxis
              domain={[0, 1.0]}
              tickFormatter={(v: number) => v.toFixed(2)}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              tickLine={false}
              axisLine={false}
              width={40}
              label={{
                value: 'Median Δ',
                angle: -90,
                position: 'insideLeft',
                offset: 4,
                fontSize: 11,
                fill: '#9CA3AF',
              }}
            />
            <Tooltip content={tooltipContent} cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }} />
            {/* IQR band: transparent base stacked under the colored band */}
            <Area
              type="monotone"
              dataKey="band_base"
              stackId="iqr"
              stroke="none"
              fill="transparent"
              fillOpacity={0}
              activeDot={false}
              legendType="none"
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="band_height"
              stackId="iqr"
              stroke="none"
              fill={C_ORANGE}
              fillOpacity={0.13}
              activeDot={false}
              legendType="none"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="median_delta"
              name="Median Δ"
              stroke={C_ORANGE}
              strokeWidth={2.5}
              dot={{ r: 4, fill: C_ORANGE, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
        {/* Manual IQR legend */}
        <div className="flex items-center justify-center gap-5 mt-1 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-5" style={{ borderTop: `2.5px solid ${C_ORANGE}` }} />
            Median Δ
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-5 h-3 rounded-sm"
              style={{ background: C_ORANGE, opacity: 0.18 }}
            />
            IQR (25th–75th pct)
          </span>
        </div>
      </div>
    </div>
  )
}
