import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { GammaHeatmapRow } from '../../types'
import { GRID_STROKE, AXIS_LINE, TICK_STYLE, LABEL_FILL, CURSOR_LINE, C_UNDERDOG, C_FAVORITE } from '../../lib/chartTheme'

const BIN_ORDER = ['0–15', '15–30', '30–45', '45–60', '60–75', '75–90', '90+']

interface ChartPoint { min_bin: string; med_delta: number; n: number }

interface Props { data: GammaHeatmapRow[] }

export default function GammaGradientChart({ data }: Props) {
  const chartData: ChartPoint[] = BIN_ORDER.map(bin => {
    const row = data.find(d => d.min_bin === bin && d.score_diff_clamp === 0)
    return { min_bin: bin, med_delta: row?.med_delta ?? 0, n: row?.n ?? 0 }
  })

  const tooltipContent = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload?.length) return null
    const pt = chartData.find(d => d.min_bin === label)
    if (!pt) return null
    return (
      <div className="bg-[#161616] border border-[#2a2a2a] px-2.5 py-2 font-mono text-[11px] min-w-[155px]">
        <p className="text-terminal-muted mb-1.5">{label} MIN (TIED)</p>
        <div className="flex justify-between gap-4"><span style={{ color: C_UNDERDOG }}>MEDIAN Δ</span><span className="text-terminal-text font-semibold">{pt.med_delta.toFixed(3)}</span></div>
        <div className="flex justify-between gap-4 mt-0.5"><span className="text-terminal-dim">N</span><span className="text-terminal-text">{pt.n}</span></div>
        {pt.n < 10 && <p className="text-yellow-500 mt-1 text-[10px]">SMALL SAMPLE</p>}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <div style={{ minWidth: 420 }} className="h-[240px] sm:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 20, bottom: 24, left: 8 }}>
            <CartesianGrid stroke={GRID_STROKE} strokeDasharray="0" />
            <XAxis dataKey="min_bin" tick={TICK_STYLE} tickLine={{ stroke: '#2a2a2a' }} axisLine={AXIS_LINE}
              label={{ value: 'MATCH MINUTE', position: 'insideBottom', offset: -14, fontSize: 9, fill: LABEL_FILL, fontFamily: 'IBM Plex Mono' }} />
            <YAxis domain={[0, 0.8]} tickFormatter={(v: number) => v.toFixed(2)} tick={TICK_STYLE} tickLine={{ stroke: '#2a2a2a' }} axisLine={false} width={36}
              label={{ value: 'MEDIAN Δ (TIED)', angle: -90, position: 'insideLeft', offset: 4, fontSize: 9, fill: LABEL_FILL, fontFamily: 'IBM Plex Mono' }} />
            <Tooltip content={tooltipContent} cursor={CURSOR_LINE} />
            <ReferenceLine x="75–90" stroke={C_UNDERDOG} strokeDasharray="4 3" strokeWidth={1}
              label={{ value: 'PEAK Δ=0.531', position: 'top', fill: C_FAVORITE, fontSize: 9, fontFamily: 'IBM Plex Mono', fontWeight: 600 }} />
            <Line type="monotone" dataKey="med_delta" stroke={C_UNDERDOG} strokeWidth={1.6}
              dot={({ cx, cy, payload }: { cx: number; cy: number; payload: ChartPoint }) => (
                <circle key={`dot-${payload.min_bin}`} cx={cx} cy={cy}
                  r={payload.n < 10 ? 2.5 : 3.5} fill={C_UNDERDOG} opacity={payload.n < 10 ? 0.4 : 1} stroke="none" />
              )}
              activeDot={{ r: 4, strokeWidth: 0 }} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center gap-4 font-mono text-[10px] text-terminal-dim">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4" style={{ borderTop: `1.6px solid ${C_UNDERDOG}` }} />
          MEDIAN Δ (SCORE DIFF = 0)
        </span>
        <span className="text-terminal-border">|</span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: C_UNDERDOG, opacity: 0.4 }} />
          FADED DOT = N &lt; 10
        </span>
      </div>
    </div>
  )
}
