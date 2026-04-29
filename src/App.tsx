import { useState } from 'react'
import Header from './components/layout/Header'
import Nav from './components/layout/Nav'
import StatusBar from './components/layout/StatusBar'
import CommandBar from './components/layout/CommandBar'
import AboutOverlay from './components/layout/AboutOverlay'
import ModelSection from './components/layout/ModelSection'
import DeltaSection from './components/sections/DeltaSection'
import ThetaSection from './components/sections/ThetaSection'
import GammaSection from './components/sections/GammaSection'
import MarketSection from './components/sections/MarketSection'
import OutlookSection from './components/sections/OutlookSection'

const NAV_SECTIONS = [
  { id: 'calculator', label: 'MODEL',    fKey: 'F1' },
  { id: 'delta',      label: 'DELTA',    fKey: 'F2' },
  { id: 'theta',      label: 'THETA',    fKey: 'F3' },
  { id: 'gamma',      label: 'GAMMA',    fKey: 'F4' },
  { id: 'market',     label: 'BEHAVIOR', fKey: 'F5' },
  { id: 'outlook',    label: 'OUTLOOK',  fKey: 'F6' },
]

export default function App() {
  const [showAbout, setShowAbout] = useState(false)

  return (
    <div className="min-h-screen bg-terminal-bg pt-7 pb-6">
      <StatusBar />
      <Header />
      <Nav sections={NAV_SECTIONS} />
      <main className="w-full px-6 lg:px-8 pb-8">
        <ModelSection />
        <DeltaSection />
        <ThetaSection />
        <GammaSection />
        <MarketSection />
        <OutlookSection />
      </main>
      <CommandBar onAboutOpen={() => setShowAbout(true)} />
      {showAbout && <AboutOverlay onClose={() => setShowAbout(false)} />}
    </div>
  )
}
