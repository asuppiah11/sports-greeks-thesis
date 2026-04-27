import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { CalibrationRow } from '../../types'
import { GRID_STROKE, AXIS_LINE, TICK_STYLE, LABEL_FILL, C_UNDERDOG, C_FAVORITE } from '../../lib/chartTheme'

interface ChartPoint extends CalibrationRow { error_lo: number; error_hi: number }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CalibrationDot = (props: any) => {
  const { cx, cy, yAxis, payload } = props as {
    cx: number; cy: number
    yAxis?: { scale: (v: number) => number }; payload?: ChartPoint
  }
  if (!cx || !cy || !payload) return null
  const mainDot = <circle cx={cx} cy={cy} r={4.5} fill={C_UNDERDOG} stroke="none" />
  if (!yAxis?.scale) return <g>{mainDot}</g>
  const yHi = yAxis.scale(payload.error_hi)
  const yLo = yAxis.scale(payload.error_lo)
  const capW = 4
  return (
    <g>
      <line x1={cx} y1={yLo} x2={cx} y2={yHi} stroke={C_UNDERDOG} strokeWidth={1.2} />
      <line x1={cx - capW} y1={yLo} x2={cx + capW} y2={yLo} stroke={C_UNDERDOG} strokeWidth={1.2} />
      <line x1={cx - capW} y1={yHi} x2={cx + capW} y2={yHi} stroke={C_UNDERDOG} strokeWidth={1.2} />
      {mainDot}
    </g>
  )
}

interface Props { data: CalibrationRow[] }

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
      <div className="bg-[#161616] border border-[#2a2a2a] px-2.5 py-2 font-mono text-[11px] min-w-[185px]">
        <p className="text-terminal-muted mb-1.5">{pt.bin}</p>
        <div className="space-y-0.5">
          <div className="flex justify-between gap-4"><span className="text-terminal-dim">N</span><span className="text-terminal-text">{pt.n}</span></div>
          <div className="flex justify-between gap-4"><span className="text-terminal-dim">IMPLIED PROB</span><span className="text-terminal-text">{(pt.implied_prob * 100).toFixed(1)}%</span></div>
          <div className="flex justify-between gap-4"><span style={{ color: C_UNDERDOG }}>ACTUAL RATE</span><span className="text-terminal-text font-semibold">{(pt.actual_rate * 100).toFixed(1)}%</span></div>
          <div className="flex justify-between gap-4"><span className="text-terminal-dim">±1.96·SE</span><span className="text-terminal-text">[{(pt.error_lo * 100).toFixed(1)}%, {(pt.error_hi * 100).toFixed(1)}%]</span></div>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <div style={{ minWidth: 380 }} className="h-[240px] sm:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 12, right: 20, bottom: 24, left: 8 }}>
            <CartesianGrid stroke={GRID_STROKE} strokeDasharray="0" />
            <XAxis type="number" dataKey="implied_prob" domain={[0, 1]} ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
              tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`} tick={TICK_STYLE} tickLine={{ stroke: '#2a2a2a' }} axisLine={AXIS_LINE}
              label={{ value: 'IMPLIED PROBABILITY', position: 'insideBottom', offset: -14, fontSize: 9, fill: LABEL_FILL, fontFamily: 'IBM Plex Mono' }} />
            <YAxis type="number" dataKey="actual_rate" domain={[0, 1]} ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
              tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`} tick={TICK_STYLE} tickLine={{ stroke: '#2a2a2a' }} axisLine={false} width={36}
              label={{ value: 'ACTUAL RATE', angle: -90, position: 'insideLeft', offset: 4, fontSize: 9, fill: LABEL_FILL, fontFamily: 'IBM Plex Mono' }} />
            <Tooltip content={tooltipContent} cursor={{ strokeDasharray: '3 3', stroke: '#3a3a3a' }} />
            <ReferenceLine segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]} stroke={C_FAVORITE} strokeDasharray="5 4" strokeWidth={1}
              label={{ value: 'PERFECT CALIBRATION', position: 'insideTopLeft', fill: '#666666', fontSize: 9, fontFamily: 'IBM Plex Mono' }} />
            <Scatter data={chartData} shape={<CalibrationDot />} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
