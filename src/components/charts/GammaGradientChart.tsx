import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { GammaHeatmapRow } from '../../types'
import { GRID_STROKE, AXIS_LINE, TICK_STYLE, LABEL_FILL, CURSOR_LINE, C_UNDERDOG, C_FAVORITE } from '../../lib/chartTheme'

const BIN_ORDER = ['0–15', '15–30', '30–45', '45–60', '60–75', '75–90', '90+']

interface ChartPoint { min_bin: string; med_delta: number; n: number }
interface AugPoint extends ChartPoint {
  delta_main: number | null
  delta_stoppage: number | null
}

interface Props { data: GammaHeatmapRow[] }

function PeakLabel({ viewBox }: { viewBox?: { x?: number; y?: number } }) {
  const x = viewBox?.x ?? 0
  const y = viewBox?.y ?? 0
  return (
    <g>
      <text
        x={x} y={y - 22}
        textAnchor="middle"
        fontFamily="IBM Plex Mono, monospace"
        fontSize={8.5} fontWeight={600} fill={C_FAVORITE}
      >
        ANALYTICAL PEAK
      </text>
      <text
        x={x} y={y - 10}
        textAnchor="middle"
        fontFamily="IBM Plex Mono, monospace"
        fontSize={7} fill="#a1a1aa"
      >
        (75–90, EXCL. STOPPAGE) · n=46, high variance
      </text>
    </g>
  )
}

export default function GammaGradientChart({ data }: Props) {
  const chartData: ChartPoint[] = BIN_ORDER.map(bin => {
    const row = data.find(d => d.min_bin === bin && d.score_diff_clamp === 0)
    return { min_bin: bin, med_delta: row?.med_delta ?? 0, n: row?.n ?? 0 }
  })

  // Split into main series (0–15 → 75–90) and stoppage segment (75–90 → 90+)
  const augmented: AugPoint[] = chartData.map((d, i) => ({
    ...d,
    delta_main: i < 6 ? d.med_delta : null,
    delta_stoppage: i >= 5 ? d.med_delta : null,
  }))

  const tooltipContent = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload?.length) return null
    const pt = chartData.find(d => d.min_bin === label)
    if (!pt) return null
    return (
      <div className="bg-[#161616] border border-[#2a2a2a] px-2.5 py-2 font-mono text-[11px] min-w-[155px]">
        <p className="text-terminal-muted mb-1.5">{label} MIN (TIED)</p>
        <div className="flex justify-between gap-4">
          <span style={{ color: C_UNDERDOG }}>MEDIAN Δ</span>
          <span className="text-terminal-text font-semibold">{pt.med_delta.toFixed(3)}</span>
        </div>
        <div className="flex justify-between gap-4 mt-0.5">
          <span className="text-terminal-dim">N</span>
          <span className="text-terminal-text">{pt.n}</span>
        </div>
        {pt.min_bin === '90+' && (
          <p className="text-terminal-muted mt-1 text-[10px]">STOPPAGE TIME — HIGH VARIANCE</p>
        )}
        {pt.n < 10 && pt.min_bin !== '90+' && (
          <p className="text-yellow-500 mt-1 text-[10px]">SMALL SAMPLE (n &lt; 10)</p>
        )}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <div style={{ minWidth: 420 }} className="h-[240px] sm:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={augmented} margin={{ top: 36, right: 20, bottom: 24, left: 8 }}>
            <CartesianGrid stroke={GRID_STROKE} strokeDasharray="0" />
            <XAxis
              dataKey="min_bin"
              tick={TICK_STYLE}
              tickLine={{ stroke: '#2a2a2a' }}
              axisLine={AXIS_LINE}
              label={{ value: 'MATCH MINUTE', position: 'insideBottom', offset: -14, fontSize: 9, fill: LABEL_FILL, fontFamily: 'IBM Plex Mono' }}
            />
            <YAxis
              domain={[0, 0.8]}
              tickFormatter={(v: number) => v.toFixed(2)}
              tick={TICK_STYLE}
              tickLine={{ stroke: '#2a2a2a' }}
              axisLine={false}
              width={36}
              label={{ value: 'MEDIAN Δ (TIED)', angle: -90, position: 'insideLeft', offset: 4, fontSize: 9, fill: LABEL_FILL, fontFamily: 'IBM Plex Mono' }}
            />
            <Tooltip content={tooltipContent} cursor={CURSOR_LINE} />
            <ReferenceLine
              x="75–90"
              stroke={C_UNDERDOG}
              strokeDasharray="4 3"
              strokeWidth={1}
              label={<PeakLabel />}
            />
            {/* Solid line: 0–15 through 75–90 */}
            <Line
              type="monotone"
              dataKey="delta_main"
              stroke={C_UNDERDOG}
              strokeWidth={1.6}
              connectNulls={false}
              dot={({ cx, cy, payload }: { cx: number; cy: number; payload: AugPoint }) => (
                <circle
                  key={`dot-main-${payload.min_bin}`}
                  cx={cx} cy={cy}
                  r={3.5} fill={C_UNDERDOG} stroke="none"
                />
              )}
              activeDot={{ r: 4, strokeWidth: 0 }}
              isAnimationActive={false}
            />
            {/* Dashed faded segment: 75–90 → 90+ (stoppage time) */}
            <Line
              type="monotone"
              dataKey="delta_stoppage"
              stroke={C_UNDERDOG}
              strokeWidth={1.2}
              strokeDasharray="4 3"
              strokeOpacity={0.4}
              connectNulls={false}
              dot={({ cx, cy, payload }: { cx: number; cy: number; payload: AugPoint }) => {
                if (payload.min_bin !== '90+') return <g key={`skip-${payload.min_bin}`} />
                return (
                  <circle
                    key="dot-90plus"
                    cx={cx} cy={cy}
                    r={3.5}
                    fill="none"
                    stroke={C_UNDERDOG}
                    strokeWidth={1.5}
                    strokeOpacity={0.45}
                  />
                )
              }}
              activeDot={{ r: 4, fill: 'none', stroke: C_UNDERDOG, strokeWidth: 1.5 } as object}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center gap-4 font-mono text-[10px] text-terminal-dim flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4" style={{ borderTop: `1.6px solid ${C_UNDERDOG}` }} />
          MEDIAN Δ (SCORE DIFF = 0)
        </span>
        <span className="text-terminal-border">|</span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-3 h-3 rounded-full border"
            style={{ borderColor: C_UNDERDOG, opacity: 0.45 }}
          />
          FADED = STOPPAGE-TIME, HIGH VARIANCE (90+)
        </span>
      </div>
    </div>
  )
}
