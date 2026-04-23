import { FileText } from 'lucide-react'

export default function Header() {
  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-2">
            Quantifying Market Greeks in Soccer Betting
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 font-normal mb-4">
            A Theoretical Framework for In-Play Price Sensitivity
          </p>
          <p className="text-base text-gray-700 font-semibold mb-0.5">Adhitya Suppiah</p>
          <p className="text-sm text-gray-400 mb-5">
            Sport Analytics ·{' '}
            <span className="text-syracuse-navy font-medium">Syracuse University</span>
            {' '}· May 2026
          </p>
          <p className="text-sm text-gray-500 mb-6">
            This dashboard presents empirical evidence that Betfair in-play soccer odds exhibit
            systematic sensitivity patterns — Delta, Theta, and Gamma — analogous to options
            pricing Greeks. Underdog goals move markets twice as much as favorite goals, draw
            probability accelerates non-linearly in scoreless periods, and late tied-match goals
            trigger the sharpest price responses in the dataset.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm font-medium text-syracuse-navy hover:text-syracuse-navy/70 border border-syracuse-navy/30 hover:border-syracuse-navy/60 rounded-md px-4 py-2 transition-colors"
          >
            <FileText size={15} />
            Full thesis PDF (coming soon)
          </a>
        </div>
      </div>
    </header>
  )
}
