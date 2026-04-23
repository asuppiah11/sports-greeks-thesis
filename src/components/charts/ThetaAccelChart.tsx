import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { ThetaAccelRow } from '../../types'
import { GRID_STROKE, AXIS_LINE, TICK_STYLE, LABEL_FILL } from '../../lib/chartTheme'

const C_EARLY = '#D1D5DB'
const C_LATE  = '#F76900'

interface ChartPoint {
  label: string
  early: number; late: number
  accel_ratio: number; n: number
}

interface SeriesMeta { key: string; label: string; color: string }

function SeriesToggle({
  series, visible, hovered, onToggle, onHover,
}: {
  series: SeriesMeta[]
  visible: Record<string, boolean>
  hovered: string | null
  onToggle: (k: string) => void
  onHover: (k: string | null) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5 mb-2">
      {series.map(s => {
        const on = visible[s.key]
        return (
          <button
            key={s.key}
            onClick={() => onToggle(s.key)}
            onMouseEnter={() => onHover(s.key)}
            onMouseLeave={() => onHover(null)}
            className={[
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs select-none',
              'border transition-all duration-150 cursor-pointer',
              on ? 'border-gray-200 bg-white text-gray-700' : 'border-gray-100 bg-gray-50 text-gray-400',
            ].join(' ')}
            style={{ opacity: hovered && hovered !== s.key ? 0.45 : 1 }}
          >
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: on ? s.color : '#D1D5DB' }} />
            {s.label}
          </button>
        )
      })}
    </div>
  )
}

const SERIES: SeriesMeta[] = [
  { key: 'early', label: 'Early period (first two-thirds)', color: C_EARLY },
  { key: 'late',  label: 'Final third',                     color: C_LATE  },
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
    accel_ratio: d.accel_ratio,
    n: d.n,
  }))

  const tooltipContent = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload?.length) return null
    const pt = chartData.find(d => d.label === label)
    if (!pt) return null
    return (
      <div className="bg-white border border-[rgba(0,14,84,0.3)] rounded-lg shadow-md px-3 py-2.5 text-xs min-w-[180px]">
        <p className="font-semibold text-gray-800 mb-1.5">{label.replace('\n', ' ')}</p>
        <p className="text-gray-500 mb-1.5">n = {pt.n} segments</p>
        <div className="space-y-0.5">
          <p className="flex justify-between gap-4">
            <span className="flex items-center gap-1.5 text-gray-500">
              <span className="w-2 h-2 rounded-sm inline-block" style={{ background: C_EARLY }} />
              Early period
            </span>
            <span className="font-mono">{pt.early.toFixed(3)} ×10⁻³</span>
          </p>
          <p className="flex justify-between gap-4">
            <span className="flex items-center gap-1.5 font-medium" style={{ color: C_LATE }}>
              <span className="w-2 h-2 rounded-sm inline-block" style={{ background: C_LATE }} />
              Final third
            </span>
            <span className="font-mono font-semibold">{pt.late.toFixed(3)} ×10⁻³</span>
          </p>
        </div>
        <p className="mt-1.5 pt-1.5 border-t border-gray-100 font-semibold" style={{ color: '#000E54' }}>
          Acceleration: {pt.accel_ratio.toFixed(2)}×
        </p>
      </div>
    )
  }

  const CustomTick = ({ x, y, payload }: { x?: number; y?: number; payload?: { value: string } }) => {
    if (!x || !y || !payload) return null
    const lines = payload.value.split('\n')
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={12} textAnchor="middle" fill="rgba(0,14,84,0.5)" fontSize={11}>{lines[0]}</text>
        {lines[1] && (
          <text x={0} y={0} dy={26} textAnchor="middle" fill="rgba(0,14,84,0.5)" fontSize={10}>{lines[1]}</text>
        )}
      </g>
    )
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <div style={{ minWidth: 340 }}>
        <SeriesToggle series={SERIES} visible={visible} hovered={hovered} onToggle={toggle} onHover={setHovered} />
        <div className="h-[240px] sm:h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 28, bottom: 36, left: 16 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
              <XAxis
                dataKey="label"
                tick={<CustomTick />}
                tickLine={false}
                axisLine={AXIS_LINE}
                interval={0}
              />
              <YAxis
                tickFormatter={(v: number) => v.toFixed(2)}
                tick={TICK_STYLE}
                tickLine={false}
                axisLine={false}
                width={44}
                label={{ value: 'Rate (×10⁻³ / min)', angle: -90, position: 'insideLeft', offset: 4, fontSize: 11, fill: LABEL_FILL }}
              />
              <Tooltip content={tooltipContent} cursor={{ fill: 'rgba(0,14,84,0.04)' }} />
              <Bar
                dataKey="early" name="early" fill={C_EARLY} radius={[3, 3, 0, 0]} maxBarSize={52}
                hide={!visible.early} opacity={dim('early')}
                onMouseEnter={() => setHovered('early')} onMouseLeave={() => setHovered(null)}
              />
              <Bar
                dataKey="late" name="late" fill={C_LATE} radius={[3, 3, 0, 0]} maxBarSize={52}
                hide={!visible.late} opacity={dim('late')}
                onMouseEnter={() => setHovered('late')} onMouseLeave={() => setHovered(null)}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
