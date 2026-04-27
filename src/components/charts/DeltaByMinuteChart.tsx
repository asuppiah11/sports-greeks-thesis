import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { DeltaMinuteRow } from '../../types'
import { GRID_STROKE, AXIS_LINE, TICK_STYLE, LABEL_FILL, CURSOR_LINE, C_UNDERDOG, C_FAVORITE } from '../../lib/chartTheme'

const BIN_ORDER = ['0–15', '15–30', '30–45', '45–60', '60–75', '75–90', '90+']

interface Point {
  min_bin: string
  favorite: number | null; favN: number | null
  underdog: number | null; undN: number | null
}

function pivot(rows: DeltaMinuteRow[]): Point[] {
  const map = new Map<string, Point>(
    BIN_ORDER.map(b => [b, { min_bin: b, favorite: null, favN: null, underdog: null, undN: null }])
  )
  rows.forEach(r => {
    const p = map.get(r.min_bin)
    if (!p) return
    if (r.fav_label === 'Favorite') { p.favorite = r.median; p.favN = r.n }
    else { p.underdog = r.median; p.undN = r.n }
  })
  return BIN_ORDER.map(b => map.get(b)!)
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
          <button
            key={s.key}
            onClick={() => onToggle(s.key)}
            onMouseEnter={() => onHover(s.key)}
            onMouseLeave={() => onHover(null)}
            style={{ opacity: hovered && hovered !== s.key ? 0.45 : 1 }}
            className={[
              'inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[10px] select-none',
              'border transition-all duration-150 cursor-pointer',
              on ? 'border-terminal-border bg-terminal-panel text-terminal-text' : 'border-terminal-border bg-terminal-bg text-terminal-dim',
            ].join(' ')}
          >
            <span className="w-2 h-2 flex-shrink-0" style={{ background: on ? s.color : '#3a3a3a' }} />
            {s.label.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}

const SERIES: SeriesMeta[] = [
  { key: 'favorite', label: 'Favorite', color: C_FAVORITE },
  { key: 'underdog', label: 'Underdog', color: C_UNDERDOG },
]

interface Props { data: DeltaMinuteRow[] }

export default function DeltaByMinuteChart({ data }: Props) {
  const chartData = pivot(data)
  const [visible, setVisible] = useState({ favorite: true, underdog: true })
  const [hovered, setHovered] = useState<string | null>(null)

  const dim = (key: string) => (hovered && hovered !== key ? 0.22 : 1)
  const toggle = (k: string) => setVisible(p => ({ ...p, [k]: !p[k as keyof typeof p] }))

  const tooltipContent = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload?.length) return null
    const pt = chartData.find(d => d.min_bin === label)
    if (!pt) return null
    return (
      <div className="bg-[#161616] border border-[#2a2a2a] px-2.5 py-2 font-mono text-[11px] min-w-[160px]">
        <p className="text-terminal-muted mb-1.5">{label} MIN</p>
        {pt.favorite != null && (
          <div className="flex justify-between gap-4">
            <span style={{ color: C_FAVORITE }}>FAVORITE</span>
            <span className="text-terminal-text">{pt.favorite.toFixed(3)} <span className="text-terminal-dim">n={pt.favN}</span></span>
          </div>
        )}
        {pt.underdog != null ? (
          <div className="flex justify-between gap-4 mt-0.5">
            <span style={{ color: C_UNDERDOG }}>UNDERDOG</span>
            <span className="text-terminal-text">{pt.underdog.toFixed(3)} <span className="text-terminal-dim">n={pt.undN}</span></span>
          </div>
        ) : (
          <div className="text-terminal-dim mt-0.5">UNDERDOG  NO DATA</div>
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
            <LineChart data={chartData} margin={{ top: 8, right: 20, bottom: 24, left: 8 }}>
              <CartesianGrid stroke={GRID_STROKE} strokeDasharray="0" />
              <XAxis dataKey="min_bin" tick={TICK_STYLE} tickLine={{ stroke: '#2a2a2a' }} axisLine={AXIS_LINE}
                label={{ value: 'MATCH MINUTE', position: 'insideBottom', offset: -14, fontSize: 9, fill: LABEL_FILL, fontFamily: 'IBM Plex Mono' }} />
              <YAxis domain={[0, 0.85]} tickFormatter={(v: number) => v.toFixed(2)} tick={TICK_STYLE} tickLine={{ stroke: '#2a2a2a' }} axisLine={false} width={36}
                label={{ value: 'MEDIAN Δ', angle: -90, position: 'insideLeft', offset: 4, fontSize: 9, fill: LABEL_FILL, fontFamily: 'IBM Plex Mono' }} />
              <Tooltip content={tooltipContent} cursor={CURSOR_LINE} />
              <Line type="monotone" dataKey="favorite" stroke={C_FAVORITE} strokeWidth={1.6} opacity={dim('favorite')} hide={!visible.favorite}
                dot={{ r: 3, fill: C_FAVORITE, strokeWidth: 0 }} activeDot={{ r: 4, strokeWidth: 0 }} connectNulls={false}
                isAnimationActive={false}
                onMouseEnter={() => setHovered('favorite')} onMouseLeave={() => setHovered(null)} />
              <Line type="monotone" dataKey="underdog" stroke={C_UNDERDOG} strokeWidth={1.6} opacity={dim('underdog')} hide={!visible.underdog}
                dot={{ r: 3, fill: C_UNDERDOG, strokeWidth: 0 }} activeDot={{ r: 4, strokeWidth: 0 }} connectNulls={false}
                isAnimationActive={false}
                onMouseEnter={() => setHovered('underdog')} onMouseLeave={() => setHovered(null)} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
