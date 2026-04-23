import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { DeltaMinuteRow } from '../../types'

const BIN_ORDER = ['0–15', '15–30', '30–45', '45–60', '60–75', '75–90', '90+']
const C_FAV = '#000E54'
const C_UND = '#F76900'

interface Point {
  min_bin: string
  favorite: number | null
  favN: number | null
  underdog: number | null
  undN: number | null
}

function pivot(rows: DeltaMinuteRow[]): Point[] {
  const map = new Map<string, Point>(
    BIN_ORDER.map(b => [b, { min_bin: b, favorite: null, favN: null, underdog: null, undN: null }])
  )
  rows.forEach(r => {
    const p = map.get(r.min_bin)
    if (!p) return
    if (r.fav_label === 'Favorite') {
      p.favorite = r.median
      p.favN = r.n
    } else {
      p.underdog = r.median
      p.undN = r.n
    }
  })
  return BIN_ORDER.map(b => map.get(b)!)
}

interface Props {
  data: DeltaMinuteRow[]
}

export default function DeltaByMinuteChart({ data }: Props) {
  const chartData = pivot(data)

  const tooltipContent = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload?.length) return null
    const pt = chartData.find(d => d.min_bin === label)
    if (!pt) return null
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2.5 text-xs min-w-[160px]">
        <p className="font-semibold text-gray-800 mb-1.5">{label} min</p>
        {pt.favorite != null && (
          <div className="flex items-center gap-1.5 text-gray-600">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: C_FAV }} />
            Favorite:{' '}
            <span className="font-mono font-medium">{pt.favorite.toFixed(3)}</span>
            <span className="text-gray-400 ml-auto">(n={pt.favN})</span>
          </div>
        )}
        {pt.underdog != null ? (
          <div className="flex items-center gap-1.5 text-gray-600 mt-0.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: C_UND }} />
            Underdog:{' '}
            <span className="font-mono font-medium">{pt.underdog.toFixed(3)}</span>
            <span className="text-gray-400 ml-auto">(n={pt.undN})</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-gray-400 mt-0.5 italic">
            <span className="w-2 h-2 rounded-full flex-shrink-0 bg-gray-200" />
            Underdog: no data
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <div style={{ minWidth: 420 }}>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData} margin={{ top: 8, right: 28, bottom: 24, left: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey="min_bin"
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              label={{
                value: 'Match minute (bin)',
                position: 'insideBottom',
                offset: -14,
                fontSize: 11,
                fill: '#9CA3AF',
              }}
            />
            <YAxis
              domain={[0, 0.85]}
              tickFormatter={(v: number) => v.toFixed(2)}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              tickLine={false}
              axisLine={false}
              width={40}
              label={{
                value: 'Median Δ',
                angle: -90,
                position: 'insideLeft',
                offset: 4,
                fontSize: 11,
                fill: '#9CA3AF',
              }}
            />
            <Tooltip content={tooltipContent} cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }} />
            <Legend
              iconType="plainline"
              iconSize={18}
              wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
            />
            <Line
              type="monotone"
              dataKey="favorite"
              name="Favorite"
              stroke={C_FAV}
              strokeWidth={2}
              dot={{ r: 3.5, fill: C_FAV, strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="underdog"
              name="Underdog"
              stroke={C_UND}
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: C_UND, strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
