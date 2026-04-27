import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { ThetaAccelRow } from '../../types'
import { GRID_STROKE, AXIS_LINE, TICK_STYLE, LABEL_FILL, C_UNDERDOG, C_DIM } from '../../lib/chartTheme'

interface ChartPoint { label: string; early: number; late: number; accel_ratio: number; n: number }

interface SeriesMeta { key: string; label: string; color: string }

function SeriesToggle({ series, visible, hovered, onToggle, onHover }: {
  series: SeriesMeta[]; visible: Record<string, boolean>; hovered: string | null
  onToggle: (k: string) => void; onHover: (k: string | null) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5 mb-2">
      {series.map(s => {
        const on = visible[s.key]
        return (
          <button key={s.key} onClick={() => onToggle(s.key)}
            onMouseEnter={() => onHover(s.key)} onMouseLeave={() => onHover(null)}
            style={{ opacity: hovered && hovered !== s.key ? 0.45 : 1 }}
            className={['inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[10px] select-none border transition-all cursor-pointer',
              on ? 'border-terminal-border bg-terminal-panel text-terminal-text' : 'border-terminal-border bg-terminal-bg text-terminal-dim'].join(' ')}>
            <span className="w-2 h-2 flex-shrink-0" style={{ background: on ? s.color : '#3a3a3a' }} />
            {s.label.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}

const SERIES: SeriesMeta[] = [
  { key: 'early', label: 'Early (first two-thirds)', color: C_DIM },
  { key: 'late',  label: 'Final third',              color: C_UNDERDOG },
]

interface Props { data: ThetaAccelRow[] }

export default function ThetaAccelChart({ data }: Props) {
  const [visible, setVisible] = useState({ early: true, late: true })
  const [hovered, setHovered] = useState<string | null>(null)

  const dim = (key: string) => (hovered && hovered !== key ? 0.22 : 1)
  const toggle = (k: string) => setVisible(p => ({ ...p, [k]: !p[k as keyof typeof p] }))

  const chartData: ChartPoint[] = data.map(d => ({
    label: d.group === 'A_pure_00' ? 'Group A\n(Pure 0-0)' : 'Group B\n(Pre-1st Goal)',
    early: +(d.early_theta * 1000).toFixed(4),
    late:  +(d.late_theta  * 1000).toFixed(4),
    accel_ratio: d.accel_ratio, n: d.n,
  }))

  const tooltipContent = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload?.length) return null
    const pt = chartData.find(d => d.label === label)
    if (!pt) return null
    return (
      <div className="bg-[#161616] border border-[#2a2a2a] px-2.5 py-2 font-mono text-[11px] min-w-[180px]">
        <p className="text-terminal-muted mb-1.5">{label.replace('\n', ' ')}</p>
        <div className="text-terminal-dim mb-1">N = {pt.n} SEGMENTS</div>
        <div className="flex justify-between gap-4"><span className="text-terminal-dim">EARLY</span><span className="text-terminal-text">{pt.early.toFixed(3)} ×10⁻³</span></div>
        <div className="flex justify-between gap-4 mt-0.5"><span style={{ color: C_UNDERDOG }}>FINAL THIRD</span><span className="text-terminal-text font-semibold">{pt.late.toFixed(3)} ×10⁻³</span></div>
        <div className="flex justify-between gap-4 mt-1.5 pt-1.5 border-t border-[#2a2a2a]">
          <span className="text-terminal-dim">ACCEL RATIO</span>
          <span style={{ color: C_UNDERDOG }} className="font-semibold">{pt.accel_ratio.toFixed(2)}×</span>
        </div>
      </div>
    )
  }

  const CustomTick = ({ x, y, payload }: { x?: number; y?: number; payload?: { value: string } }) => {
    if (!x || !y || !payload) return null
    const lines = payload.value.split('\n')
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={12} textAnchor="middle" fill="#666666" fontSize={10} fontFamily="IBM Plex Mono">{lines[0]}</text>
        {lines[1] && <text x={0} y={0} dy={24} textAnchor="middle" fill="#666666" fontSize={9} fontFamily="IBM Plex Mono">{lines[1]}</text>}
      </g>
    )
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <div style={{ minWidth: 340 }}>
        <SeriesToggle series={SERIES} visible={visible} hovered={hovered} onToggle={toggle} onHover={setHovered} />
        <div className="h-[240px] sm:h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 20, bottom: 36, left: 8 }} barGap={3}>
              <CartesianGrid stroke={GRID_STROKE} strokeDasharray="0" vertical={false} />
              <XAxis dataKey="label" tick={<CustomTick />} tickLine={{ stroke: '#2a2a2a' }} axisLine={AXIS_LINE} interval={0} />
              <YAxis tickFormatter={(v: number) => v.toFixed(2)} tick={TICK_STYLE} tickLine={{ stroke: '#2a2a2a' }} axisLine={false} width={40}
                label={{ value: 'RATE (×10⁻³/MIN)', angle: -90, position: 'insideLeft', offset: 4, fontSize: 9, fill: LABEL_FILL, fontFamily: 'IBM Plex Mono' }} />
              <Tooltip content={tooltipContent} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="early" name="early" fill={C_DIM} radius={[0, 0, 0, 0]} maxBarSize={44}
                hide={!visible.early} opacity={dim('early')} isAnimationActive={false}
                onMouseEnter={() => setHovered('early')} onMouseLeave={() => setHovered(null)} />
              <Bar dataKey="late" name="late" fill={C_UNDERDOG} radius={[0, 0, 0, 0]} maxBarSize={44}
                hide={!visible.late} opacity={dim('late')} isAnimationActive={false}
                onMouseEnter={() => setHovered('late')} onMouseLeave={() => setHovered(null)} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
