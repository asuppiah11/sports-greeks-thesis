import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { ReactionSpeedRow } from '../../types'
import { GRID_STROKE, AXIS_LINE, TICK_STYLE, LABEL_FILL, C_UNDERDOG, C_FAVORITE, C_DIM } from '../../lib/chartTheme'

const COMPETITION_ABBREV: Record<string, string> = {
  'English Premier League': 'EPL',
  'German Bundesliga':      'BUNDESLIGA',
  'Italian Serie A':        'SERIE A',
  'Spanish La Liga':        'LA LIGA',
  'UEFA Champions League':  'UCL',
}

interface ChartPoint {
  competition: string
  all: number; favorite: number; underdog: number
  allN: number; favN: number; undN: number
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
  { key: 'all',      label: 'All goals',       color: C_DIM      },
  { key: 'favorite', label: 'Favorite scores', color: C_FAVORITE },
  { key: 'underdog', label: 'Underdog scores', color: C_UNDERDOG },
]

interface Props { data: ReactionSpeedRow[] }

export default function ReactionSpeedChart({ data }: Props) {
  const leagues = Object.keys(COMPETITION_ABBREV)
  const [visible, setVisible] = useState({ all: true, favorite: true, underdog: true })
  const [hovered, setHovered] = useState<string | null>(null)

  const dim = (key: string) => (hovered && hovered !== key ? 0.22 : 1)
  const toggle = (k: string) => setVisible(p => ({ ...p, [k]: !p[k as keyof typeof p] }))

  const chartData: ChartPoint[] = leagues.map(league => {
    const all = data.find(d => d.competition === league && d.event_type === 'all')
    const fav = data.find(d => d.competition === league && d.event_type === 'favorite_scores')
    const und = data.find(d => d.competition === league && d.event_type === 'underdog_scores')
    return {
      competition: COMPETITION_ABBREV[league],
      all: all?.median_tte_s ?? 0, favorite: fav?.median_tte_s ?? 0, underdog: und?.median_tte_s ?? 0,
      allN: all?.n ?? 0, favN: fav?.n ?? 0, undN: und?.n ?? 0,
    }
  })

  const tooltipContent = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload?.length) return null
    const pt = chartData.find(d => d.competition === label)
    if (!pt) return null
    return (
      <div className="bg-[#161616] border border-[#2a2a2a] px-2.5 py-2 font-mono text-[11px] min-w-[195px]">
        <p className="text-terminal-muted mb-1.5">{label}</p>
        <div className="space-y-0.5">
          <div className="flex justify-between gap-4"><span className="text-terminal-dim">ALL (n={pt.allN})</span><span className="text-terminal-text">{pt.all}s</span></div>
          <div className="flex justify-between gap-4"><span style={{ color: C_FAVORITE }}>FAVORITE (n={pt.favN})</span><span className="text-terminal-text">{pt.favorite}s</span></div>
          <div className="flex justify-between gap-4"><span style={{ color: C_UNDERDOG }}>UNDERDOG (n={pt.undN})</span><span className="text-terminal-text font-semibold">{pt.underdog}s</span></div>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <div style={{ minWidth: 480 }}>
        <SeriesToggle series={SERIES} visible={visible} hovered={hovered} onToggle={toggle} onHover={setHovered} />
        <div className="h-[240px] sm:h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 20, bottom: 8, left: 8 }} barGap={2} barCategoryGap="28%">
              <CartesianGrid stroke={GRID_STROKE} strokeDasharray="0" vertical={false} />
              <XAxis dataKey="competition" tick={TICK_STYLE} tickLine={{ stroke: '#2a2a2a' }} axisLine={AXIS_LINE} />
              <YAxis domain={[0, 300]} ticks={[0, 60, 120, 180, 240, 300]} tickFormatter={(v: number) => `${v}s`}
                tick={TICK_STYLE} tickLine={{ stroke: '#2a2a2a' }} axisLine={false} width={36}
                label={{ value: 'MEDIAN TTE (SEC)', angle: -90, position: 'insideLeft', offset: 4, fontSize: 9, fill: LABEL_FILL, fontFamily: 'IBM Plex Mono' }} />
              <Tooltip content={tooltipContent} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <ReferenceLine y={102} stroke={C_UNDERDOG} strokeDasharray="4 3" strokeWidth={1}
                label={{ value: 'MEDIAN 102s', position: 'right', fill: '#8a8a8a', fontSize: 9, fontFamily: 'IBM Plex Mono' }} />
              <Bar dataKey="all" fill={C_DIM} radius={[0,0,0,0]} maxBarSize={20} hide={!visible.all} opacity={dim('all')}
                onMouseEnter={() => setHovered('all')} onMouseLeave={() => setHovered(null)} />
              <Bar dataKey="favorite" fill={C_FAVORITE} radius={[0,0,0,0]} maxBarSize={20} hide={!visible.favorite} opacity={dim('favorite')}
                onMouseEnter={() => setHovered('favorite')} onMouseLeave={() => setHovered(null)} />
              <Bar dataKey="underdog" fill={C_UNDERDOG} radius={[0,0,0,0]} maxBarSize={20} hide={!visible.underdog} opacity={dim('underdog')}
                onMouseEnter={() => setHovered('underdog')} onMouseLeave={() => setHovered(null)} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
