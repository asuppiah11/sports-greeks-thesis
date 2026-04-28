import { useEffect } from 'react'
import { X } from 'lucide-react'

interface GlossaryTerm {
  term: string
  definition: JSX.Element | string
}

const GLOSSARY: GlossaryTerm[] = [
  {
    term: 'IMPLIED PROBABILITY',
    definition:
      '1 ÷ decimal odds. If a team is priced at 4.0, the market is implying a 25% chance they win. This is the unit used everywhere on this dashboard.',
  },
  {
    term: 'DECIMAL ODDS',
    definition:
      'Total payout per $1 staked, including the stake itself. 4.0 odds means $4 back for every $1 bet — a 3:1 payout in fractional terms.',
  },
  {
    term: 'BACK / LAY',
    definition: (
      <>
        On a betting exchange, "back" means betting <em>for</em> an outcome, "lay" means
        betting <em>against</em> it. Equivalent to buying and selling on a stock exchange.
      </>
    ),
  },
  {
    term: 'EXCHANGE vs BOOKMAKER',
    definition:
      'A bookmaker sets prices and takes the other side of every bet. An exchange (like Betfair) just matches users against each other — prices are pure supply and demand, with no built-in margin for the house.',
  },
  {
    term: 'POISSON DISTRIBUTION',
    definition:
      'A probability distribution for counting rare events in a fixed window of time. Soccer goals fit it well: most matches have 0–3 goals, the average is ~2.7, and very high-scoring matches are rare. Used here as the theoretical baseline for "what should price moves look like if scoring were memoryless?"',
  },
  {
    term: 'GREEKS',
    definition:
      'Borrowed from financial options pricing. Each Greek measures how an asset\'s price reacts to a different force — direction (Delta), time (Theta), or rate-of-change-of-direction (Gamma). This thesis adapts that language to soccer betting.',
  },
  {
    term: 'TIME-TO-EQUILIBRIUM',
    definition:
      'How long after a goal it takes for prices to stabilize within a 5% band of their final post-goal level. A measure of how fast the market processes new information.',
  },
  {
    term: 'OVERSHOOT',
    definition: (
      <>
        When the market moves <em>past</em> its eventual settled price before correcting back.
        A 0.30 overshoot means prices moved 30% further than they "should have" before bouncing back.
      </>
    ),
  },
  {
    term: 'FAVORITE-LONGSHOT BIAS',
    definition:
      "A well-documented tendency in fixed-odds markets: bookmakers systematically underprice favorites and overprice longshots. This dashboard tests whether the Betfair exchange exhibits the same bias (it doesn't).",
  },
]

interface Props {
  onClose: () => void
}

export default function AboutOverlay({ onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[720px] max-h-[80vh] overflow-y-auto bg-terminal-bg border border-terminal-orange"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="sticky top-0 bg-terminal-bg border-b border-terminal-border flex items-center justify-between px-5 py-3 z-10">
          <span className="font-mono text-[12px] uppercase tracking-widest text-terminal-orange">
            About This Dashboard
          </span>
          <button
            onClick={onClose}
            className="text-terminal-dim hover:text-terminal-text transition-colors"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-6">
          {/* About paragraph */}
          <p className="font-sans text-[14px] text-terminal-muted leading-[1.55]">
            This dashboard presents the empirical findings of an undergraduate honors thesis
            examining price dynamics in Betfair's in-play soccer markets. Using a dataset of
            1,465 goal events across 791 matches from five competitions (2021/22–2024/25), it
            tests whether in-play odds exhibit systematic sensitivity patterns analogous to
            options pricing Greeks: Delta (price change per goal), Theta (time decay in scoreless
            intervals), and Gamma (convexity of that sensitivity). All prices are expressed as
            implied probabilities (1 ÷ decimal odds). Statistical tests use Wilcoxon rank-sum
            and signed-rank throughout; p-values are two-tailed.
          </p>

          {/* Glossary */}
          <div>
            <p className="font-mono text-[12px] uppercase tracking-widest text-terminal-dim mb-3 pb-2 border-b border-terminal-border">
              Glossary
            </p>
            <dl className="divide-y divide-terminal-border">
              {GLOSSARY.map(({ term, definition }) => (
                <div key={term} className="grid py-2.5" style={{ gridTemplateColumns: '200px 1fr', gap: '1rem' }}>
                  <dt className="font-mono text-[12px] text-terminal-orange uppercase tracking-wide leading-[1.55] pt-px">
                    {term}
                  </dt>
                  <dd className="font-sans text-[14px] text-terminal-muted leading-[1.55] m-0">
                    {definition}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
