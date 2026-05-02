import { useState } from 'react'

const TL_Y = 178   // timeline y
const BADGE_W = 24 // badge rect width

const STAGES = [
  { label: 'PRE-MATCH',  sub: '',              x: 58,  active: false, peak: false },
  { label: 'KICKOFF',    sub: '',              x: 168, active: false, peak: false },
  { label: 'IN-PLAY',    sub: '(HIGH θ)',      x: 322, active: true,  peak: false },
  { label: 'GOAL EVENT', sub: '(Δ + Γ)',       x: 494, active: true,  peak: true  },
  { label: 'POST-GOAL',  sub: '(OVERSHOOT)',   x: 648, active: true,  peak: false },
  { label: 'SETTLE',     sub: '',              x: 778, active: false, peak: false },
]

interface NodeDef {
  id: string
  name: string
  anchor: string
  action: string
  href: string
  x: number
  y: number
  w: number
  h: number
  stageX: number
}

const NODES: NodeDef[] = [
  {
    id: 'O.B', name: 'AUTO THETA DECAY',
    anchor: 'Θ.A · rate accel 4.50×',
    action: 'exit when θ > E[goal]',
    href: '#theta',
    x: 210, y: 12, w: 162, h: 62, stageX: 322,
  },
  {
    id: 'O.C', name: 'QUOTE-WIDENING',
    anchor: 'Γ.A · peak 75–90 tied',
    action: 'widen 2.67× hot zone',
    href: '#gamma',
    x: 358, y: 90, w: 122, h: 58, stageX: 494,
  },
  {
    id: 'O.A', name: 'ASYM. HEDGING',
    anchor: 'Δ.B · 2.01× asymmetry',
    action: 'hedge underdogs 2×',
    href: '#delta',
    x: 485, y: 90, w: 122, h: 58, stageX: 494,
  },
  {
    id: 'O.D', name: 'MEAN-REVERSION',
    anchor: 'M.B · 97.75% overshoot',
    action: 'enter +30s, exit ~120s',
    href: '#market',
    x: 562, y: 12, w: 162, h: 62, stageX: 648,
  },
]

// Mobile data — same content in a flat list
const MOBILE_NODES = [
  { id: 'O.B', name: 'Automated Theta Decay',   anchor: 'Θ.A · rate accel 4.50×', action: 'exit when θ > E[goal]',   href: '#theta',  stage: 'IN-PLAY (HIGH θ)' },
  { id: 'O.C', name: 'Dynamic Quote-Widening',  anchor: 'Γ.A · peak 75–90 tied',  action: 'widen 2.67× hot zone',    href: '#gamma',  stage: 'GOAL EVENT' },
  { id: 'O.A', name: 'Asymmetric Hedging',       anchor: 'Δ.B · 2.01× asymmetry',  action: 'hedge underdogs 2×',       href: '#delta',  stage: 'GOAL EVENT' },
  { id: 'O.D', name: 'Post-Goal Mean-Reversion', anchor: 'M.B · 97.75% overshoot', action: 'enter +30s, exit ~120s',   href: '#market', stage: 'POST-GOAL (OVERSHOOT)' },
]

function NodeCard({ node, hovered, onEnter, onLeave }: {
  node: NodeDef
  hovered: boolean
  onEnter: () => void
  onLeave: () => void
}) {
  const cx = node.x + node.w / 2
  const dropY1 = node.y + node.h

  return (
    <a href={node.href} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <g style={{ cursor: 'pointer' }}>
        {/* Drop line */}
        <line
          x1={cx} y1={dropY1} x2={node.stageX} y2={TL_Y}
          stroke={hovered ? '#ff8a1a' : '#2a2a2a'}
          strokeWidth="1"
          strokeDasharray="3,2"
        />
        {/* Node background */}
        <rect
          x={node.x} y={node.y} width={node.w} height={node.h}
          fill="#111111"
          stroke={hovered ? '#ff8a1a' : '#1f1f1f'}
          strokeWidth="1"
        />
        {/* Badge rect */}
        <rect
          x={node.x + 4} y={node.y + 4} width={BADGE_W} height={13}
          fill="#1a1208" stroke="#ff8a1a" strokeWidth="0.5" strokeOpacity="0.7"
        />
        {/* Badge text */}
        <text
          x={node.x + 4 + BADGE_W / 2} y={node.y + 13.5}
          textAnchor="middle"
          fontFamily="IBM Plex Mono, monospace"
          fontSize="7" fontWeight="bold" fill="#ff8a1a"
        >
          {node.id}
        </text>
        {/* Name */}
        <text
          x={node.x + 4 + BADGE_W + 5} y={node.y + 13.5}
          fontFamily="IBM Plex Mono, monospace"
          fontSize="8.5" fontWeight="600"
          fill={hovered ? '#ffffff' : '#e5e5e5'}
        >
          {node.name}
        </text>
        {/* Separator */}
        <line
          x1={node.x + 4} y1={node.y + 21} x2={node.x + node.w - 4} y2={node.y + 21}
          stroke="#1f1f1f" strokeWidth="0.5"
        />
        {/* Anchor */}
        <text
          x={node.x + 6} y={node.y + 34}
          fontFamily="IBM Plex Mono, monospace" fontSize="8" fill="#a1a1aa"
        >
          {node.anchor}
        </text>
        {/* Action */}
        <text
          x={node.x + 6} y={node.y + 49}
          fontFamily="IBM Plex Mono, monospace" fontSize="8" fill="#b4b4bc"
        >
          ▶ {node.action}
        </text>
      </g>
    </a>
  )
}

export default function ApplicationsWorkflow() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div>
      {/* Desktop: SVG diagram */}
      <div className="hidden lg:block">
        <svg
          viewBox="0 0 840 228"
          style={{ width: '100%', height: 'auto' }}
          aria-label="Match lifecycle workflow diagram"
        >
          {/* Timeline line */}
          <line x1="58" y1={TL_Y} x2="788" y2={TL_Y} stroke="#ff8a1a" strokeWidth="1.5" />
          {/* Arrow tip */}
          <polygon points="792,178 785,174 785,182" fill="#ff8a1a" />

          {/* Stage markers and labels */}
          {STAGES.map(stage => (
            <g key={stage.label}>
              <circle
                cx={stage.x} cy={TL_Y}
                r={stage.peak ? 6 : stage.active ? 4.5 : 3}
                fill={stage.active ? '#ff8a1a' : '#0a0a0a'}
                stroke={stage.active ? 'none' : '#555555'}
                strokeWidth="1"
              />
              <text
                x={stage.x} y={TL_Y + 16}
                textAnchor="middle"
                fontFamily="IBM Plex Mono, monospace"
                fontSize="8" fill="#a1a1aa"
              >
                {stage.label}
              </text>
              {stage.sub && (
                <text
                  x={stage.x} y={TL_Y + 27}
                  textAnchor="middle"
                  fontFamily="IBM Plex Mono, monospace"
                  fontSize="7.5" fill="#a1a1aa"
                >
                  {stage.sub}
                </text>
              )}
            </g>
          ))}

          {/* Application nodes */}
          {NODES.map(node => (
            <NodeCard
              key={node.id}
              node={node}
              hovered={hovered === node.id}
              onEnter={() => setHovered(node.id)}
              onLeave={() => setHovered(null)}
            />
          ))}
        </svg>
      </div>

      {/* Mobile: vertical stack */}
      <div className="lg:hidden space-y-1.5 border-l-2 border-terminal-orange pl-4">
        {MOBILE_NODES.map(node => (
          <a key={node.id} href={node.href} className="block">
            <div className="border border-terminal-border bg-terminal-panel p-3 hover:border-terminal-orange/60 transition-colors">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-[10px] text-terminal-orange border border-terminal-orange/40 bg-[#1a1208] px-1 py-0.5 leading-none">
                  {node.id}
                </span>
                <span className="font-mono text-[11px] font-semibold text-terminal-text uppercase tracking-wide">
                  {node.name}
                </span>
              </div>
              <p className="font-mono text-[10px] text-terminal-dim mb-0.5">
                ACTIVATES AT: <span className="text-terminal-orange">{node.stage}</span>
              </p>
              <p className="font-mono text-[10px] text-terminal-dim">{node.anchor}</p>
              <p className="font-mono text-[10px] text-terminal-muted mt-1">▶ {node.action}</p>
            </div>
          </a>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-6 border-t border-terminal-border pt-2">
        <span className="font-mono text-[10px] text-terminal-dim">
          <span className="text-terminal-orange">■</span> ANCHOR PANEL — links to source chart
        </span>
        <span className="font-mono text-[10px] text-terminal-dim">
          <span className="text-terminal-orange">▶</span> ACTION — the operational verb
        </span>
        <span className="font-mono text-[10px] text-terminal-dim hidden lg:inline">
          hover or click any card to jump to its anchor
        </span>
      </div>
    </div>
  )
}
