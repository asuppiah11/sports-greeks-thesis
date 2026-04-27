import { useState, useEffect } from 'react'

function LiveClock() {
  const [time, setTime] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const hh = String(time.getHours()).padStart(2, '0')
  const mm = String(time.getMinutes()).padStart(2, '0')
  const ss = String(time.getSeconds()).padStart(2, '0')
  return (
    <span className="font-mono text-[10px] text-terminal-muted tabular-nums">
      {hh}:{mm}:{ss}
    </span>
  )
}

export default function StatusBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-7 flex items-center px-4 sm:px-6 bg-terminal-bg border-b border-terminal-border">
      {/* Left — GRKS<GO> */}
      <div className="flex items-center flex-shrink-0 mr-6">
        <span className="font-mono text-[11px] font-bold text-terminal-orange tracking-widest">GRKS</span>
        <span className="font-mono text-[11px] font-bold text-terminal-text">&lt;GO&gt;</span>
      </div>

      {/* Centre — dataset metadata (hidden on mobile) */}
      <div className="hidden md:flex flex-1 justify-center">
        <span className="font-mono text-[10px] text-terminal-dim tracking-wide">
          N=1465 EVENTS&nbsp;·&nbsp;791 MATCHES&nbsp;·&nbsp;2021/22–2024/25&nbsp;·&nbsp;EPL+LL+SA+BL+UCL
        </span>
      </div>

      {/* Right — live indicator + clock */}
      <div className="flex items-center gap-2 ml-auto flex-shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-terminal-green flex-shrink-0" />
        <span className="font-mono text-[10px] font-semibold text-terminal-green">LIVE</span>
        <LiveClock />
      </div>
    </div>
  )
}
