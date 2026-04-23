import { useMemo } from 'react'
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
import type { ThetaParamsRow } from '../../types'

const C_A = '#0F766E'
const C_B = '#6B7280'

interface CurvePoint {
  t: number
  groupA: number
  groupB: number
}

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

interface Props {
  params: ThetaParamsRow[]
}

export default function ThetaCurveChart({ params }: Props) {
  const curveData = useMemo(() => buildCurveData(params), [params])

  const tooltipContent = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload?.length) return null
    const groupA = payload.find(p => p.dataKey === 'groupA')
    const groupB = payload.find(p => p.dataKey === 'groupB')
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2.5 text-xs min-w-[185px]">
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
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={curveData} margin={{ top: 8, right: 28, bottom: 24, left: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey="t"
              type="number"
              domain={[0, 90]}
              ticks={[0, 15, 30, 45, 60, 75, 90]}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              label={{
                value: 'Minutes elapsed in scoreless interval',
                position: 'insideBottom',
                offset: -14,
                fontSize: 11,
                fill: '#9CA3AF',
              }}
            />
            <YAxis
              domain={[0.2, 0.75]}
              tickFormatter={(v: number) => v.toFixed(2)}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              tickLine={false}
              axisLine={false}
              width={40}
              label={{
                value: 'P(goal in next minute)',
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
              formatter={(value: string) =>
                value === 'groupA'
                  ? 'Group A — Pure 0-0 (a=0.253, b=0.01053)'
                  : 'Group B — Pre-first goal (a=0.301, b=0.00153)'
              }
            />
            <Line
              type="monotone"
              dataKey="groupA"
              name="groupA"
              stroke={C_A}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="groupB"
              name="groupB"
              stroke={C_B}
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
