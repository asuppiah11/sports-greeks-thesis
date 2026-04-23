import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { CalibrationRow } from '../../types'

const C_ORANGE = '#F76900'
const C_NAVY   = '#000E54'

interface ChartPoint extends CalibrationRow {
  error_lo: number
  error_hi: number
}

// Custom dot with error bars — receives yAxis scale via Recharts internal props
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CalibrationDot = (props: any) => {
  const { cx, cy, yAxis, payload } = props as {
    cx: number
    cy: number
    yAxis?: { scale: (v: number) => number }
    payload?: ChartPoint
  }
  if (!cx || !cy || !payload) return null

  const mainDot = (
    <circle cx={cx} cy={cy} r={5} fill={C_ORANGE} stroke="white" strokeWidth={2} />
  )

  if (!yAxis?.scale) return <g>{mainDot}</g>

  const yHi = yAxis.scale(payload.error_hi)
  const yLo = yAxis.scale(payload.error_lo)
  const capW = 5

  return (
    <g>
      <line x1={cx} y1={yLo} x2={cx} y2={yHi} stroke={C_ORANGE} strokeWidth={1.5} />
      <line x1={cx - capW} y1={yLo} x2={cx + capW} y2={yLo} stroke={C_ORANGE} strokeWidth={1.5} />
      <line x1={cx - capW} y1={yHi} x2={cx + capW} y2={yHi} stroke={C_ORANGE} strokeWidth={1.5} />
      {mainDot}
    </g>
  )
}

interface Props {
  data: CalibrationRow[]
}

export default function CalibrationChart({ data }: Props) {
  const chartData: ChartPoint[] = data.map(d => ({
    ...d,
    error_lo: Math.max(0, d.actual_rate - d.actual_se * 1.96),
    error_hi: Math.min(1, d.actual_rate + d.actual_se * 1.96),
  }))

  const tooltipContent = ({ active, payload }: TooltipProps<number, string>) => {
    if (!active || !payload?.length) return null
    const pt = payload[0]?.payload as ChartPoint | undefined
    if (!pt) return null
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2.5 text-xs min-w-[185px]">
        <p className="font-semibold text-gray-800 mb-1.5">{pt.bin}</p>
        <p className="text-gray-500 mb-1">n = {pt.n}</p>
        <p className="flex justify-between gap-3">
          <span className="text-gray-600">Implied prob</span>
          <span className="font-mono">{(pt.implied_prob * 100).toFixed(1)}%</span>
        </p>
        <p className="flex justify-between gap-3">
          <span className="font-medium" style={{ color: C_NAVY }}>Actual rate</span>
          <span className="font-mono font-semibold">{(pt.actual_rate * 100).toFixed(1)}%</span>
        </p>
        <p className="flex justify-between gap-3 text-gray-400">
          <span>±1.96·SE</span>
          <span className="font-mono">
            [{(pt.error_lo * 100).toFixed(1)}%, {(pt.error_hi * 100).toFixed(1)}%]
          </span>
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <div style={{ minWidth: 380 }}>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 16, right: 28, bottom: 24, left: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis
              type="number"
              dataKey="implied_prob"
              domain={[0, 1]}
              ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
              tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              label={{
                value: 'Implied probability (market)',
                position: 'insideBottom',
                offset: -14,
                fontSize: 11,
                fill: '#9CA3AF',
              }}
            />
            <YAxis
              type="number"
              dataKey="actual_rate"
              domain={[0, 1]}
              ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
              tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              tickLine={false}
              axisLine={false}
              width={44}
              label={{
                value: 'Actual win rate',
                angle: -90,
                position: 'insideLeft',
                offset: 4,
                fontSize: 11,
                fill: '#9CA3AF',
              }}
            />
            <Tooltip content={tooltipContent} cursor={{ strokeDasharray: '3 3' }} />
            {/* Perfect calibration 1:1 reference line */}
            <ReferenceLine
              segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]}
              stroke="#9CA3AF"
              strokeDasharray="5 4"
              strokeWidth={1.5}
              label={{
                value: 'Perfect calibration',
                position: 'insideTopLeft',
                fill: '#9CA3AF',
                fontSize: 10,
              }}
            />
            <Scatter
              data={chartData}
              shape={<CalibrationDot />}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
