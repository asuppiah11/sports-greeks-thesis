import { FileText } from 'lucide-react'

const GREEK_ROWS = [
  {
    sym: 'Δ',
    inFinance: 'Price change per unit move in the underlying',
    inThesis: 'Win-probability change per goal scored',
    whyMatters: 'Tells you how big a price jump to expect when something happens',
  },
  {
    sym: 'Θ',
    inFinance: 'Option value decay per unit of time',
    inThesis: 'Draw-probability change per minute of scoreless play',
    whyMatters: 'Tells you how fast time alone is eroding your position',
  },
  {
    sym: 'Γ',
    inFinance: 'Rate of change of Delta itself',
    inThesis: 'How much Delta shifts based on match state (time + score)',
    whyMatters: 'Tells you when the market is most explosive — not just sensitive, but increasingly sensitive',
  },
]

const COL_HEADERS = ['IN FINANCE', 'IN THIS THESIS', 'WHY IT MATTERS']

export default function Header() {
  return (
    <header className="border-b border-terminal-border bg-terminal-bg">
      <div className="w-full px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-0">

          {/* Left — title block */}
          <div className="lg:col-span-5 lg:pr-8">
            <h1 className="font-sans text-xl sm:text-2xl font-bold text-terminal-text leading-tight mb-1">
              Quantifying Market Greeks in Soccer Betting
            </h1>
            <p className="font-sans text-base text-terminal-muted font-normal mb-2">
              A Theoretical Framework for In-Play Price Sensitivity
            </p>
            <p className="font-sans text-sm text-terminal-text font-semibold mb-0.5">Adhitya Suppiah</p>
            <p className="font-mono text-xs text-terminal-dim mb-3">
              SPORT ANALYTICS ·{' '}
              <span className="text-terminal-cyan">SYRACUSE UNIVERSITY</span>
              {' '}· MAY 2026
            </p>
            <p className="font-sans text-base text-terminal-muted mb-4 leading-relaxed">
              This dashboard presents empirical evidence that Betfair in-play soccer odds exhibit
              systematic sensitivity patterns — Delta, Theta, and Gamma — analogous to options
              pricing Greeks. Underdog goals move markets twice as much as favorite goals, draw
              probability accelerates non-linearly in scoreless periods, and late tied-match goals
              trigger the sharpest price responses in the dataset.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 font-mono text-xs text-terminal-muted hover:text-terminal-text border border-terminal-border hover:border-terminal-muted px-3 py-1.5 transition-colors"
            >
              <FileText size={13} />
              FULL THESIS PDF (COMING SOON)
            </a>
          </div>

          {/* Right — WHAT EACH GREEK MEANS panel (lg+ only) */}
          <div className="hidden lg:flex lg:col-span-7 lg:pl-8 border-l border-terminal-border flex-col">
            {/* Panel header */}
            <div className="mb-3">
              <span className="font-mono text-[12px] uppercase tracking-widest text-terminal-dim" style={{ fontVariant: 'small-caps' }}>
                What Each Greek Means
              </span>
            </div>

            {/* Table */}
            <div className="border border-terminal-border flex-1 flex flex-col">
              {/* Column headers */}
              <div className="grid border-b border-terminal-border" style={{ gridTemplateColumns: '60px 1fr 1fr 1fr' }}>
                <div className="px-3 py-1.5 border-r border-terminal-border" />
                {COL_HEADERS.map(h => (
                  <div key={h} className="px-3 py-1.5 border-r border-terminal-border last:border-r-0">
                    <span className="font-mono text-[12px] text-terminal-dim uppercase tracking-widest">{h}</span>
                  </div>
                ))}
              </div>

              {/* Data rows */}
              {GREEK_ROWS.map(row => (
                <div
                  key={row.sym}
                  className="grid flex-1 border-b border-terminal-border last:border-b-0"
                  style={{ gridTemplateColumns: '60px 1fr 1fr 1fr' }}
                >
                  <div className="flex items-center justify-center border-r border-terminal-border py-2">
                    <span className="font-mono text-[22px] font-bold text-terminal-orange leading-none">
                      {row.sym}
                    </span>
                  </div>
                  <div className="px-3 py-2 border-r border-terminal-border flex items-center">
                    <span className="font-mono text-[10px] text-terminal-muted leading-snug">{row.inFinance}</span>
                  </div>
                  <div className="px-3 py-2 border-r border-terminal-border flex items-center">
                    <span className="font-mono text-[10px] text-terminal-cyan leading-snug">{row.inThesis}</span>
                  </div>
                  <div className="px-3 py-2 flex items-center">
                    <span className="font-sans text-[10px] text-terminal-muted leading-snug">{row.whyMatters}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* League footer */}
            <div className="mt-3">
              <span className="font-mono text-[9px] text-terminal-dim tracking-wide">
                EPL · LA LIGA · SERIE A · BUNDESLIGA · UEFA CHAMPIONS LEAGUE
              </span>
            </div>
          </div>

        </div>
      </div>
    </header>
  )
}
