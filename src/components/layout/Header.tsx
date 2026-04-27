import { FileText } from 'lucide-react'

export default function Header() {
  return (
    <header className="border-b border-terminal-border bg-terminal-bg">
      <div className="w-full px-6 lg:px-8 py-5 sm:py-6">
        <div className="max-w-3xl">
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
          <p className="font-sans text-sm text-terminal-muted mb-4 max-w-2xl leading-relaxed">
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
      </div>
    </header>
  )
}
