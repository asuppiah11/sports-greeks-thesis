import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ErrorBar, ResponsiveContainer,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { OverreactionRow } from '../../types'
import { GRID_STROKE, AXIS_LINE, TICK_STYLE, LABEL_FILL, C_UNDERDOG, C_FAVORITE, C_DIM } from '../../lib/chartTheme'

const COLORS = [C_DIM, C_FAVORITE, C_UNDERDOG]

interface ChartPoint {
  group: string; median_overshoot: number; error: [number, number]
  n: number; pct_positive: number; ci_lo: number; ci_hi: number
}

interface Props { data: OverreactionRow[] }

export default function OverreactionChart({ data }: Props) {
  const chartData: ChartPoint[] = data.map(d => ({
    group: d.group, median_overshoot: d.median_overshoot,
    error: [+(d.median_overshoot - d.ci_lo_95).toFixed(4), +(d.ci_hi_95 - d.median_overshoot).toFixed(4)],
    n: d.n, pct_positive: d.pct_positive, ci_lo: d.ci_lo_95, ci_hi: d.ci_hi_95,
  }))

  const tooltipContent = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload?.length) return null
    const pt = chartData.find(d => d.group === label)
    if (!pt) return null
    return (
      <div className="bg-[#161616] border border-[#2a2a2a] px-2.5 py-2 font-mono text-[11px] min-w-[195px]">
        <p className="text-terminal-muted mb-1.5">{pt.group.toUpperCase()}</p>
        <div className="space-y-0.5">
          <div className="flex justify-between gap-4"><span className="text-terminal-dim">N</span><span className="text-terminal-text">{pt.n}</span></div>
          <div className="flex justify-between gap-4"><span className="text-terminal-dim">MEDIAN OVERSHOOT</span><span className="text-terminal-text font-semibold">{pt.median_overshoot.toFixed(3)}</span></div>
          <div className="flex justify-between gap-4"><span className="text-terminal-dim">95% CI</span><span className="text-terminal-text">[{pt.ci_lo.toFixed(3)}, {pt.ci_hi.toFixed(3)}]</span></div>
          <div className="flex justify-between gap-4"><span className="text-terminal-dim">% POSITIVE</span><span className="text-terminal-text">{pt.pct_positive.toFixed(1)}%</span></div>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <div style={{ minWidth: 340 }} className="h-[240px] sm:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 20, bottom: 8, left: 8 }} barCategoryGap="40%">
            <CartesianGrid stroke={GRID_STROKE} strokeDasharray="0" vertical={false} />
            <XAxis dataKey="group" tick={TICK_STYLE} tickLine={{ stroke: '#2a2a2a' }} axisLine={AXIS_LINE} />
            <YAxis domain={[0, 0.4]} tickFormatter={(v: number) => v.toFixed(2)} tick={TICK_STYLE} tickLine={{ stroke: '#2a2a2a' }} axisLine={false} width={36}
              label={{ value: 'MEDIAN OVERSHOOT', angle: -90, position: 'insideLeft', offset: 4, fontSize: 9, fill: LABEL_FILL, fontFamily: 'IBM Plex Mono' }} />
            <Tooltip content={tooltipContent} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="median_overshoot" radius={[0,0,0,0]} maxBarSize={80}>
              {chartData.map((_, i) => <Cell key={i} fill={COLORS[i] ?? C_DIM} />)}
              <ErrorBar dataKey="error" width={6} strokeWidth={1.2} stroke="#8a8a8a" direction="y" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
