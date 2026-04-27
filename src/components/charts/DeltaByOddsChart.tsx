import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { DeltaOddsBinRow } from '../../types'
import { GRID_STROKE, AXIS_LINE, TICK_STYLE, LABEL_FILL, CURSOR_LINE, C_UNDERDOG } from '../../lib/chartTheme'

interface ChartPoint extends DeltaOddsBinRow { band_base: number; band_height: number }

interface Props { data: DeltaOddsBinRow[] }

export default function DeltaByOddsChart({ data }: Props) {
  const chartData: ChartPoint[] = data.map(d => ({
    ...d, band_base: d.p25, band_height: d.p75 - d.p25,
  }))

  const tooltipContent = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload?.length) return null
    const pt = chartData.find(d => d.odds_bin === label)
    if (!pt) return null
    return (
      <div className="bg-[#161616] border border-[#2a2a2a] px-2.5 py-2 font-mono text-[11px] min-w-[170px]">
        <p className="text-terminal-muted mb-1.5">ODDS {label}</p>
        <div className="space-y-0.5">
          <div className="flex justify-between gap-4"><span className="text-terminal-dim">N</span><span className="text-terminal-text">{pt.n}</span></div>
          <div className="flex justify-between gap-4"><span className="text-terminal-dim">P75</span><span className="text-terminal-text">{pt.p75.toFixed(3)}</span></div>
          <div className="flex justify-between gap-4"><span style={{ color: C_UNDERDOG }}>MEDIAN Δ</span><span className="text-terminal-text font-semibold">{pt.median_delta.toFixed(3)}</span></div>
          <div className="flex justify-between gap-4"><span className="text-terminal-dim">P25</span><span className="text-terminal-text">{pt.p25.toFixed(3)}</span></div>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <div style={{ minWidth: 420 }} className="h-[240px] sm:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 8, right: 20, bottom: 24, left: 8 }}>
            <CartesianGrid stroke={GRID_STROKE} strokeDasharray="0" vertical={false} />
            <XAxis dataKey="odds_bin" tick={TICK_STYLE} tickLine={{ stroke: '#2a2a2a' }} axisLine={AXIS_LINE}
              label={{ value: 'PRE-GOAL DECIMAL ODDS', position: 'insideBottom', offset: -14, fontSize: 9, fill: LABEL_FILL, fontFamily: 'IBM Plex Mono' }} />
            <YAxis domain={[0, 1.0]} tickFormatter={(v: number) => v.toFixed(2)} tick={TICK_STYLE} tickLine={{ stroke: '#2a2a2a' }} axisLine={false} width={36}
              label={{ value: 'MEDIAN Δ', angle: -90, position: 'insideLeft', offset: 4, fontSize: 9, fill: LABEL_FILL, fontFamily: 'IBM Plex Mono' }} />
            <Tooltip content={tooltipContent} cursor={CURSOR_LINE} />
            <Area type="monotone" dataKey="band_base" stackId="iqr" stroke="none" fill="transparent" fillOpacity={0} activeDot={false} legendType="none" isAnimationActive={false} />
            <Area type="monotone" dataKey="band_height" stackId="iqr" stroke="none" fill={C_UNDERDOG} fillOpacity={0.1} activeDot={false} legendType="none" isAnimationActive={false} />
            <Line type="monotone" dataKey="median_delta" name="Median Δ" stroke={C_UNDERDOG} strokeWidth={1.6}
              dot={{ r: 3.5, fill: C_UNDERDOG, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-4 mt-1 font-mono text-[10px] text-terminal-dim">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4" style={{ borderTop: `1.6px solid ${C_UNDERDOG}` }} />
          MEDIAN Δ
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-2.5" style={{ background: C_UNDERDOG, opacity: 0.12 }} />
          IQR (P25–P75)
        </span>
      </div>
    </div>
  )
}
