import Header from './components/layout/Header'
import Nav from './components/layout/Nav'
import FindingsGlance from './components/layout/FindingsGlance'
import PoissonCalculator from './components/layout/PoissonCalculator'
import DeltaSection from './components/sections/DeltaSection'
import ThetaSection from './components/sections/ThetaSection'
import GammaSection from './components/sections/GammaSection'
import MarketSection from './components/sections/MarketSection'

const NAV_SECTIONS = [
  { id: 'calculator', label: 'Try the Model'   },
  { id: 'delta',      label: 'Delta'           },
  { id: 'theta',      label: 'Theta'           },
  { id: 'gamma',      label: 'Gamma'           },
  { id: 'market',     label: 'Market Behavior' },
]

export default function App() {
  return (
    <div className="min-h-screen bg-terminal-bg">
      <Header />
      <Nav sections={NAV_SECTIONS} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <FindingsGlance />
        <PoissonCalculator />
        <DeltaSection />
        <ThetaSection />
        <GammaSection />
        <MarketSection />
      </main>
    </div>
  )
}
