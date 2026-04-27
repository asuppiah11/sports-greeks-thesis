import { FileText } from 'lucide-react'

const GLANCE_ROWS = [
  {
    sym: 'Δ',
    name: 'DELTA ASYMMETRY',
    val: '2.01×',
    p: '10⁻²¹',
    desc: 'Underdog goals produce 2× the market impact of equivalent favorite goals',
  },
  {
    sym: 'Θ',
    name: 'THETA ACCELERATION',
    val: '4.50×',
    p: '10⁻¹⁰',
    desc: 'Draw probability rises 4.5× faster in final-third scoreless intervals',
  },
  {
    sym: 'Γ',
    name: 'GAMMA CONVEXITY',
    val: '2.67×',
    p: '10⁻³⁴',
    desc: 'Late tied-match goals trigger the peak price response in the dataset',
  },
]

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
            <p className="font-sans text-sm text-terminal-muted mb-4 leading-relaxed">
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

          {/* Right — AT A GLANCE panel (lg+ only) */}
          <div className="hidden lg:flex lg:col-span-7 lg:pl-8 border-l border-terminal-border flex-col">
            {/* Panel header row */}
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[9px] uppercase tracking-widest text-terminal-dim">
                At a Glance
              </span>
              <span className="font-mono text-[9px] text-terminal-dim">
                N=1,465 EVENTS · 791 MATCHES · 2021/22–2024/25
              </span>
            </div>

            {/* Greek result rows */}
            <div className="border border-terminal-border divide-y divide-terminal-border flex-1">
              {GLANCE_ROWS.map(row => (
                <div key={row.sym} className="flex items-center gap-5 px-4 py-2">
                  <span className="font-mono text-[22px] font-bold text-terminal-orange w-7 flex-shrink-0 leading-none">
                    {row.sym}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[10px] text-terminal-dim uppercase tracking-wide mb-0.5">
                      {row.name}
                    </p>
                    <p className="font-sans text-[11px] text-terminal-muted leading-snug">{row.desc}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="font-mono text-[22px] font-bold text-terminal-orange tabular-nums leading-none">
                      {row.val}
                    </p>
                    <p className="font-mono text-[10px] text-terminal-dim mt-0.5">p ≈ {row.p}</p>
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
