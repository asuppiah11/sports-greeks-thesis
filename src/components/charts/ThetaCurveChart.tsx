import { useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { ThetaParamsRow } from '../../types'
import { GRID_STROKE, AXIS_LINE, TICK_STYLE, LABEL_FILL, CURSOR_LINE } from '../../lib/chartTheme'

const C_A = '#F76900'
const C_B = '#000E54'

interface CurvePoint { t: number; groupA: number; groupB: number }

function buildCurveData(params: ThetaParamsRow[]): CurvePoint[] {
  const A = params.find(p => p.group === 'A_pure_00')
  const B = params.find(p => p.group === 'B_pre_first_goal')
  if (!A?.a_fit || !A.b_fit || !B?.a_fit || !B.b_fit) return []
  return Array.from({ length: 91 }, (_, t) => ({
    t,
    groupA: +(A.a_fit! * Math.exp(A.b_fit! * t)).toFixed(5),
    groupB: +(B.a_fit! * Math.exp(B.b_fit! * t)).toFixed(5),
  }))
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
  { key: 'groupA', label: 'Group A — Pure 0-0 (a=0.253, b=0.01053)', color: C_A },
  { key: 'groupB', label: 'Group B — Pre-first goal (a=0.301, b=0.00153)', color: C_B },
]

interface Props { params: ThetaParamsRow[] }

export default function ThetaCurveChart({ params }: Props) {
  const curveData = useMemo(() => buildCurveData(params), [params])
  const [visible, setVisible] = useState({ groupA: true, groupB: true })
  const [hovered, setHovered] = useState<string | null>(null)

  const dim = (key: string) => (hovered && hovered !== key ? 0.22 : 1)
  const toggle = (k: string) => setVisible(p => ({ ...p, [k]: !p[k as keyof typeof p] }))

  const tooltipContent = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload?.length) return null
    const groupA = payload.find(p => p.dataKey === 'groupA')
    const groupB = payload.find(p => p.dataKey === 'groupB')
    return (
      <div className="bg-white border border-[rgba(0,14,84,0.3)] rounded-lg shadow-md px-3 py-2.5 text-xs min-w-[185px]">
        <p className="font-semibold text-gray-800 mb-1.5">t = {label} min</p>
        {groupA?.value != null && (
          <p className="flex justify-between gap-4">
            <span className="flex items-center gap-1.5" style={{ color: C_A }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: C_A }} />
              Group A
            </span>
            <span className="font-mono">{Number(groupA.value).toFixed(4)}</span>
          </p>
        )}
        {groupB?.value != null && (
          <p className="flex justify-between gap-4 mt-0.5">
            <span className="flex items-center gap-1.5 text-gray-500">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: C_B }} />
              Group B
            </span>
            <span className="font-mono">{Number(groupB.value).toFixed(4)}</span>
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <div style={{ minWidth: 420 }}>
        <SeriesToggle series={SERIES} visible={visible} hovered={hovered} onToggle={toggle} onHover={setHovered} />
        <div className="h-[240px] sm:h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={curveData} margin={{ top: 8, right: 28, bottom: 24, left: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
              <XAxis
                dataKey="t"
                type="number"
                domain={[0, 90]}
                ticks={[0, 15, 30, 45, 60, 75, 90]}
                tick={TICK_STYLE}
                tickLine={false}
                axisLine={AXIS_LINE}
                label={{ value: 'Minutes elapsed in scoreless interval', position: 'insideBottom', offset: -14, fontSize: 11, fill: LABEL_FILL }}
              />
              <YAxis
                domain={[0.2, 0.75]}
                tickFormatter={(v: number) => v.toFixed(2)}
                tick={TICK_STYLE}
                tickLine={false}
                axisLine={false}
                width={40}
                label={{ value: 'P(goal in next minute)', angle: -90, position: 'insideLeft', offset: 4, fontSize: 11, fill: LABEL_FILL }}
              />
              <Tooltip content={tooltipContent} cursor={CURSOR_LINE} />
              <Line
                type="monotone"
                dataKey="groupA"
                name="groupA"
                stroke={C_A}
                strokeWidth={2.5}
                opacity={dim('groupA')}
                hide={!visible.groupA}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                onMouseEnter={() => setHovered('groupA')}
                onMouseLeave={() => setHovered(null)}
              />
              <Line
                type="monotone"
                dataKey="groupB"
                name="groupB"
                stroke={C_B}
                strokeWidth={2}
                strokeDasharray="6 3"
                opacity={dim('groupB')}
                hide={!visible.groupB}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                onMouseEnter={() => setHovered('groupB')}
                onMouseLeave={() => setHovered(null)}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
