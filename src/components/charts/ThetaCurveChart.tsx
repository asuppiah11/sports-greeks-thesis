import { useState, useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { ThetaParamsRow } from '../../types'
import { GRID_STROKE, AXIS_LINE, TICK_STYLE, LABEL_FILL, CURSOR_LINE, C_UNDERDOG, C_FAVORITE } from '../../lib/chartTheme'

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
  { key: 'groupA', label: 'Group A — Pure 0-0 (a=0.253, b=0.01053)', color: C_UNDERDOG },
  { key: 'groupB', label: 'Group B — Pre-first goal (a=0.301, b=0.00153)', color: C_FAVORITE },
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
      <div className="bg-[#161616] border border-[#2a2a2a] px-2.5 py-2 font-mono text-[11px] min-w-[160px]">
        <p className="text-terminal-muted mb-1.5">T = {label} MIN</p>
        {groupA?.value != null && (
          <div className="flex justify-between gap-4">
            <span style={{ color: C_UNDERDOG }}>GROUP A</span>
            <span className="text-terminal-text">{Number(groupA.value).toFixed(4)}</span>
          </div>
        )}
        {groupB?.value != null && (
          <div className="flex justify-between gap-4 mt-0.5">
            <span style={{ color: C_FAVORITE }}>GROUP B</span>
            <span className="text-terminal-text">{Number(groupB.value).toFixed(4)}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <div style={{ minWidth: 420 }}>
        <p className="sm:hidden font-mono text-[9px] text-terminal-dim mb-1 text-center tracking-wide">← SWIPE TO EXPLORE →</p>
        <SeriesToggle series={SERIES} visible={visible} hovered={hovered} onToggle={toggle} onHover={setHovered} />
        <div className="h-[240px] sm:h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={curveData} margin={{ top: 8, right: 20, bottom: 24, left: 8 }}>
              <CartesianGrid stroke={GRID_STROKE} strokeDasharray="0" />
              <XAxis dataKey="t" type="number" domain={[0, 90]} ticks={[0, 15, 30, 45, 60, 75, 90]}
                tick={TICK_STYLE} tickLine={{ stroke: '#2a2a2a' }} axisLine={AXIS_LINE}
                label={{ value: 'MINUTES IN SCORELESS INTERVAL', position: 'insideBottom', offset: -14, fontSize: 9, fill: LABEL_FILL, fontFamily: 'IBM Plex Mono' }} />
              <YAxis domain={[0.2, 0.75]} tickFormatter={(v: number) => v.toFixed(2)} tick={TICK_STYLE} tickLine={{ stroke: '#2a2a2a' }} axisLine={false} width={36}
                label={{ value: 'P(GOAL/MIN)', angle: -90, position: 'insideLeft', offset: 4, fontSize: 9, fill: LABEL_FILL, fontFamily: 'IBM Plex Mono' }} />
              <Tooltip content={tooltipContent} cursor={CURSOR_LINE} />
              <Line type="monotone" dataKey="groupA" stroke={C_UNDERDOG} strokeWidth={1.6} opacity={dim('groupA')} hide={!visible.groupA}
                dot={false} activeDot={{ r: 4, strokeWidth: 0 }} isAnimationActive={false}
                onMouseEnter={() => setHovered('groupA')} onMouseLeave={() => setHovered(null)} />
              <Line type="monotone" dataKey="groupB" stroke={C_FAVORITE} strokeWidth={1.6} strokeDasharray="6 3" opacity={dim('groupB')} hide={!visible.groupB}
                dot={false} activeDot={{ r: 4, strokeWidth: 0 }} isAnimationActive={false}
                onMouseEnter={() => setHovered('groupB')} onMouseLeave={() => setHovered(null)} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
